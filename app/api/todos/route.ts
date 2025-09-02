import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import { createTodoSchema, updateTodoSchema, deleteManySchema } from "@/lib/validation/todo";
import { rateLimit } from "@/lib/rate-limit";

const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().uuid().optional(),
  q: z.string().max(200).optional(),
  status: z.enum(["all", "completed", "active"]).default("all"),
  priority: z.enum(["all", "low", "medium", "high"]).default("all"),
  tag: z.string().optional(),
  due: z.enum(["any", "overdue", "today", "week"]).default("any"),
  sort: z.enum(["created_at", "due_date", "priority"]).default("created_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  if (!rateLimit(`todos:get:${ip}`)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const supabase = createServerSupabase();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const params = paginationSchema.parse(Object.fromEntries(req.nextUrl.searchParams.entries()));
  let query = supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.id)
    .order(params.sort, { ascending: params.order === "asc" })
    .limit(params.limit + 1);

  if (params.cursor) query = query.gt("id", params.cursor);
  if (params.q) query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`);
  if (params.status !== "all") query = query.eq("completed", params.status === "completed");
  if (params.priority !== "all") query = query.eq("priority", params.priority);
  if (params.tag) query = query.contains("tags", [params.tag]);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const hasMore = data.length > params.limit;
  const items = hasMore ? data.slice(0, params.limit) : data;
  const nextCursor = hasMore ? items[items.length - 1].id : null;
  return NextResponse.json({ items, nextCursor });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  if (!rateLimit(`todos:post:${ip}`)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const supabase = createServerSupabase();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = createTodoSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const insert: { user_id: string } & typeof parsed.data = { ...parsed.data, user_id: auth.user.id };
  const { data, error } = await supabase.from("todos").insert(insert).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  if (!rateLimit(`todos:patch:${ip}`)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const supabase = createServerSupabase();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = updateTodoSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { id, ...updates } = parsed.data;
  const { data, error } = await supabase
    .from("todos")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

export async function DELETE(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  if (!rateLimit(`todos:delete:${ip}`)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const supabase = createServerSupabase();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = deleteManySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { data, error } = await supabase
    .from("todos")
    .delete()
    .in("id", parsed.data.ids)
    .eq("user_id", auth.user.id)
    .select("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: data.map((d) => d.id) });
}


