"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTodoInput, UpdateTodoInput } from "@/lib/validation/todo";

export function useTodos(params: URLSearchParams | Record<string, string | undefined> = {}) {
  const search = new URLSearchParams(params as any).toString();
  return useQuery({
    queryKey: ["todos", search],
    queryFn: async () => {
      const res = await fetch(`/api/todos?${search}`);
      if (!res.ok) throw new Error("Failed to load");
      return (await res.json()) as { items: any[]; nextCursor: string | null };
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


