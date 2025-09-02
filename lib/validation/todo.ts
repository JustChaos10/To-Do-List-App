import { z } from "zod";

export const priorityEnum = z.enum(["low", "medium", "high"]);

export const todoBase = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional().nullable(),
  due_date: z.string().datetime().optional().nullable(),
  priority: priorityEnum.default("medium"),
  tags: z.array(z.string().min(1)).max(10).default([]),
  completed: z.boolean().default(false),
});

export const createTodoSchema = todoBase;

export const updateTodoSchema = todoBase.partial().extend({ id: z.string().uuid() });

export const deleteManySchema = z.object({ ids: z.array(z.string().uuid()).min(1) });

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;


