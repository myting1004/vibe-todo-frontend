import type { Todo, UpdateTodoInput } from "../types";
import { TodoItem } from "./TodoItem";

interface Props {
  todos: Todo[];
  onUpdate: (id: string, input: UpdateTodoInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoList({ todos, onUpdate, onDelete }: Props) {
  if (todos.length === 0) {
    return (
      <div className="empty">
        <p>표시할 할일이 없어요.</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
