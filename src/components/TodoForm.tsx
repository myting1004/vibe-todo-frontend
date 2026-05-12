import { useEffect, useState } from "react";
import type { CreateTodoInput, Priority, Todo } from "../types";

interface Props {
  initial?: Todo;
  submitLabel?: string;
  onSubmit: (input: CreateTodoInput) => Promise<void> | void;
  onCancel?: () => void;
}

interface FormState {
  title: string;
  description: string;
  priority: Priority | "";
  dueDate: string;
}

const EMPTY: FormState = {
  title: "",
  description: "",
  priority: "",
  dueDate: "",
};

function toFormState(todo?: Todo): FormState {
  if (!todo) return EMPTY;
  return {
    title: todo.title,
    description: todo.description ?? "",
    priority: todo.priority ?? "",
    dueDate: todo.dueDate ? todo.dueDate.slice(0, 10) : "",
  };
}

export function TodoForm({
  initial,
  submitLabel = "추가",
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<FormState>(() => toFormState(initial));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(toFormState(initial));
    setError(null);
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.title.trim() === "") {
      setError("제목은 필수입니다.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: CreateTodoInput = {
        title: form.title.trim(),
      };
      if (form.description.trim() !== "") {
        payload.description = form.description.trim();
      }
      if (form.priority !== "") payload.priority = form.priority;
      if (form.dueDate !== "") payload.dueDate = form.dueDate;

      await onSubmit(payload);
      if (!initial) setForm(EMPTY);
    } catch (err) {
      setError(err instanceof Error ? err.message : "요청에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="row">
        <input
          type="text"
          className="title-input"
          placeholder="할 일을 입력하세요"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          maxLength={200}
          autoFocus={!!initial}
        />
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "처리 중…" : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn-text" onClick={onCancel}>
            취소
          </button>
        )}
      </div>

      <div className="row meta-row">
        <textarea
          className="description-input"
          placeholder="설명 (선택)"
          rows={2}
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
        />
      </div>

      <div className="row meta-row">
        <label className="meta-field">
          <span>우선순위</span>
          <select
            value={form.priority}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                priority: e.target.value as Priority | "",
              }))
            }
          >
            <option value="">없음</option>
            <option value="low">낮음</option>
            <option value="medium">보통</option>
            <option value="high">높음</option>
          </select>
        </label>

        <label className="meta-field">
          <span>마감일</span>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) =>
              setForm((p) => ({ ...p, dueDate: e.target.value }))
            }
          />
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
