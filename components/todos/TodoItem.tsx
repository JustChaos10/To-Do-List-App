"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useUpdateTodo } from "@/lib/hooks/use-todos";

export function TodoItem({ todo }: { todo: any }) {
  const update = useUpdateTodo();
  return (
    <div className="flex items-center gap-3 py-2">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={(v) => update.mutate({ id: todo.id, completed: !!v })}
        aria-label="Toggle complete"
      />
      <div className="flex-1">
        <div className="font-medium">{todo.title}</div>
        {todo.description && <div className="text-sm text-muted-foreground">{todo.description}</div>}
      </div>
      <Button size="sm" variant="ghost" aria-label="Edit">
        Edit
      </Button>
    </div>
  );
}


