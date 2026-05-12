export type Priority = "low" | "medium" | "high";

export type SortOption = "newest" | "oldest" | "due";

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface TodoListResponse {
  count: number;
  items: Todo[];
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
}

export type UpdateTodoInput = Partial<CreateTodoInput> & {
  completed?: boolean;
};

export interface TodoFilter {
  completed?: "true" | "false";
  priority?: Priority;
  sort?: SortOption;
}
