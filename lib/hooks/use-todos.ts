"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTodoInput, UpdateTodoInput } from "@/lib/validation/todo";

type TodosResponse = { items: Array<{ id: string; title: string; description?: string | null; completed: boolean }>; nextCursor: string | null };

export function useTodos(params: URLSearchParams | Record<string, string | undefined> = {}) {
  let search = "";
  if (params instanceof URLSearchParams) {
    search = params.toString();
  } else {
    const entries = Object.entries(params)
      .filter(([, v]) => typeof v === "string")
      .map(([k, v]) => [k, v as string]);
    search = new URLSearchParams(entries as [string, string][]).toString();
  }
  return useQuery({
    queryKey: ["todos", search],
    queryFn: async () => {
      const res = await fetch(`/api/todos?${search}`);
      if (!res.ok) throw new Error("Failed to load");
      return (await res.json()) as TodosResponse;
    },
  });
}

export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTodoInput) => {
      const res = await fetch("/api/todos", { method: "POST", body: JSON.stringify(input) });
      if (!res.ok) throw new Error("Create failed");
      return (await res.json()).item;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
  });
}

export function useUpdateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateTodoInput) => {
      const res = await fetch("/api/todos", { method: "PATCH", body: JSON.stringify(input) });
      if (!res.ok) throw new Error("Update failed");
      return (await res.json()).item;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
  });
}

export function useDeleteMany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await fetch("/api/todos", { method: "DELETE", body: JSON.stringify({ ids }) });
      if (!res.ok) throw new Error("Delete failed");
      return (await res.json()).deleted as string[];
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
  });
}


