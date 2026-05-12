import type { Priority, SortOption, TodoFilter } from "../types";

interface Props {
  filter: TodoFilter;
  onChange: (filter: TodoFilter) => void;
}

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "low", label: "낮음" },
  { value: "medium", label: "보통" },
  { value: "high", label: "높음" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
  { value: "due", label: "마감일순" },
];

export function TodoFilters({ filter, onChange }: Props) {
  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="filter-status">상태</label>
        <select
          id="filter-status"
          value={filter.completed ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange({
              ...filter,
              completed: v === "" ? undefined : (v as "true" | "false"),
            });
          }}
        >
          <option value="">전체</option>
          <option value="false">진행중</option>
          <option value="true">완료</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-priority">우선순위</label>
        <select
          id="filter-priority"
          value={filter.priority ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange({
              ...filter,
              priority: v === "" ? undefined : (v as Priority),
            });
          }}
        >
          <option value="">전체</option>
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-sort">정렬</label>
        <select
          id="filter-sort"
          value={filter.sort ?? "newest"}
          onChange={(e) => {
            onChange({ ...filter, sort: e.target.value as SortOption });
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {(filter.completed || filter.priority || filter.sort) && (
        <button
          type="button"
          className="btn-text"
          onClick={() => onChange({})}
        >
          초기화
        </button>
      )}
    </div>
  );
}
