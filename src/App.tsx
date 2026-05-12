import { useCallback, useEffect, useMemo, useState } from "react";
import { todosApi } from "./api/todos";
import { TodoFilters } from "./components/TodoFilters";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import type { Todo, TodoFilter, UpdateTodoInput } from "./types";
import "./App.css";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>({ sort: "newest" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await todosApi.list(filter);
      setTodos(res.items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "할일 목록을 불러오지 못했어요.",
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleCreate = async (input: Parameters<typeof todosApi.create>[0]) => {
    const created = await todosApi.create(input);
    setTodos((prev) => [created, ...prev]);
  };

  const handleUpdate = async (id: string, input: UpdateTodoInput) => {
    const updated = await todosApi.update(id, input);
    setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
  };

  const handleDelete = async (id: string) => {
    await todosApi.remove(id);
    setTodos((prev) => prev.filter((t) => t._id !== id));
  };

  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((t) => t.completed).length;
    return { total, done, remaining: total - done };
  }, [todos]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>할일 관리</h1>
        <p className="subtitle">
          오늘 해야 할 일을 정리하고, 빠뜨리지 않도록 관리해 보세요.
        </p>
      </header>

      <main className="app-main">
        <section className="card">
          <h2 className="section-title">새 할일 추가</h2>
          <TodoForm onSubmit={handleCreate} />
        </section>

        <section className="card">
          <div className="section-head">
            <h2 className="section-title">할일 목록</h2>
            <div className="stats">
              <span>전체 {stats.total}</span>
              <span className="dot" />
              <span>진행중 {stats.remaining}</span>
              <span className="dot" />
              <span>완료 {stats.done}</span>
            </div>
          </div>

          <TodoFilters filter={filter} onChange={setFilter} />

          {error && (
            <div className="banner error">
              <span>{error}</span>
              <button
                type="button"
                className="btn-text"
                onClick={loadTodos}
              >
                다시 시도
              </button>
            </div>
          )}

          {loading ? (
            <div className="empty">
              <p>불러오는 중…</p>
            </div>
          ) : (
            <TodoList
              todos={todos}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
