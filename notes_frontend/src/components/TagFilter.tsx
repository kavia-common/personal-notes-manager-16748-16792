"use client";

import type { Tag } from "@/lib/types";

type Props = {
  allTags: Tag[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

// PUBLIC_INTERFACE
export default function TagFilter({ allTags, selectedIds, onChange }: Props) {
  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }
  return (
    <div style={{ display: "grid", gap: ".375rem" }}>
      <button
        className={`button ${selectedIds.length === 0 ? "primary" : ""}`}
        onClick={() => onChange([])}
      >
        All notes
      </button>
      <hr className="hr" />
      {allTags.length === 0 && (
        <div className="small" style={{ color: "var(--color-secondary)" }}>
          No tags. Tags are created when saving a note.
        </div>
      )}
      <div style={{ display: "grid", gap: ".375rem" }}>
        {allTags.map((t) => (
          <button
            key={t.id}
            className={`tag ${selectedIds.includes(t.id) ? "active" : ""}`}
            onClick={() => toggle(t.id)}
            style={{ justifyContent: "space-between" }}
            aria-pressed={selectedIds.includes(t.id)}
          >
            <span>#{t.name}</span>
            {t.count !== undefined && <span className="badge">{t.count}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
