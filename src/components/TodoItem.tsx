import { useState } from "react";
import type { Todo, UpdateTodoInput } from "../types";
import { TodoForm } from "./TodoForm";

interface Props {
  todo: Todo;
  onUpdate: (id: string, input: UpdateTodoInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const PRIORITY_LABEL: Record<string, string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
};

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isOverdue(todo: Todo) {
  if (!todo.dueDate || todo.completed) return false;
  const due = new Date(todo.dueDate);
  if (Number.isNaN(due.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

export function TodoItem({ todo, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleToggle = async () => {
    setBusy(true);
    try {
      await onUpdate(todo._id, { completed: !todo.completed });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("이 할일을 삭제할까요?")) return;
    setBusy(true);
    try {
      await onDelete(todo._id);
    } finally {
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <li className="todo-item editing">
        <TodoForm
          initial={todo}
          submitLabel="저장"
          onSubmit={async (input) => {
            const patch: UpdateTodoInput = {
              title: input.title,
              description: input.description ?? "",
              priority: input.priority,
              dueDate: input.dueDate,
            };
            await onUpdate(todo._id, patch);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  const overdue = isOverdue(todo);

  return (
    <li className={`todo-item${todo.completed ? " completed" : ""}`}>
      <label className="check">
        <input
          type="checkbox"
          checked={todo.completed}
          disabled={busy}
          onChange={handleToggle}
        />
        <span className="checkmark" aria-hidden />
      </label>

      <div className="content">
        <div className="title-row">
          <h3 className="title">{todo.title}</h3>
          {todo.priority && (
            <span className={`badge priority-${todo.priority}`}>
              {PRIORITY_LABEL[todo.priority] ?? todo.priority}
            </span>
          )}
          {todo.dueDate && (
            <span className={`badge due${overdue ? " overdue" : ""}`}>
              마감 {formatDate(todo.dueDate)}
            </span>
          )}
        </div>
        {todo.description && (
          <p className="description">{todo.description}</p>
        )}
      </div>

      <div className="actions">
        <button
          type="button"
          className="btn-text"
          onClick={() => setEditing(true)}
          disabled={busy}
        >
          수정
        </button>
        <button
          type="button"
          className="btn-text danger"
          onClick={handleDelete}
          disabled={busy}
        >
          삭제
        </button>
      </div>
    </li>
  );
}
