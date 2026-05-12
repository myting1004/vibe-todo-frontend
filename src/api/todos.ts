import type {
  CreateTodoInput,
  Todo,
  TodoFilter,
  TodoListResponse,
  UpdateTodoInput,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/todos";

class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, message: string, payload: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  { parseJson = true }: { parseJson?: boolean } = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    ...init,
  });

  if (!res.ok) {
    let payload: unknown = null;
    let message = `HTTP ${res.status}`;
    try {
      payload = await res.json();
      if (
        payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof (payload as { message: unknown }).message === "string"
      ) {
        message = (payload as { message: string }).message;
      }
    } catch {
      // ignore JSON parse error
    }
    throw new ApiError(res.status, message, payload);
  }

  if (!parseJson || res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

function buildQuery(filter: TodoFilter): string {
  const params = new URLSearchParams();
  if (filter.completed) params.set("completed", filter.completed);
  if (filter.priority) params.set("priority", filter.priority);
  if (filter.sort) params.set("sort", filter.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const todosApi = {
  list: (filter: TodoFilter = {}) =>
    request<TodoListResponse>(`/${buildQuery(filter)}`),

  getById: (id: string) => request<Todo>(`/${id}`),

  create: (input: CreateTodoInput) =>
    request<Todo>("/", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  update: (id: string, input: UpdateTodoInput) =>
    request<Todo>(`/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  remove: (id: string) =>
    request<void>(
      `/${id}`,
      { method: "DELETE" },
      { parseJson: false },
    ),
};

export { ApiError };
