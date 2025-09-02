"use client";
import { useState } from "react";
import { FiltersBar } from "@/components/todos/FiltersBar";
import { TodoItem } from "@/components/todos/TodoItem";
import { TodoForm } from "@/components/todos/TodoForm";
import { Button } from "@/components/ui/button";
import { useTodos } from "@/lib/hooks/use-todos";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useTodos();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your To-Dos</h1>
        <Button onClick={() => setOpen(true)} aria-label="Add task">Add task</Button>
      </div>
      <FiltersBar />
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-6 w-full bg-muted animate-pulse rounded" />
          <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
        </div>
      ) : data && data.items.length > 0 ? (
        <div>
          {data.items.map((t) => (
            <TodoItem key={t.id} todo={t} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No tasks yet. Add your first one.</p>
      )}
      <TodoForm open={open} onOpenChange={setOpen} />
    </div>
  );
}


