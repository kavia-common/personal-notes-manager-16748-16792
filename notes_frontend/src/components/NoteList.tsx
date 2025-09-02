"use client";

import type { Note } from "@/lib/types";

type Props = {
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

// PUBLIC_INTERFACE
export default function NoteList({ notes, selectedId, onSelect }: Props) {
  if (notes.length === 0) {
    return <div className="panel"><div className="panel-body empty">No notes match your filters.</div></div>;
  }
  return (
    <div className="panel" aria-label="Notes list">
      <div role="list" aria-label="notes">
        {notes.map((n) => (
          <button
            key={n.id}
            role="listitem"
            onClick={() => onSelect(n.id)}
            className="note-row"
            style={{
              width: "100%",
              textAlign: "left",
              borderLeft: selectedId === n.id ? "3px solid var(--color-primary)" : "3px solid transparent",
              background: selectedId === n.id ? "rgba(37,99,235,0.06)" : "transparent",
            }}
          >
            <div>
              <div className="note-title">{n.title || "Untitled"}</div>
              <div className="note-snippet">{n.content?.slice(0, 120) || "No content"}</div>
              <div className="row" style={{ marginTop: ".25rem", flexWrap: "wrap" }}>
                {(n.tags ?? []).map((t) => (
                  <span key={t.id} className="tag">{t.name}</span>
                ))}
              </div>
            </div>
            <div className="small" style={{ textAlign: "right" }}>
              <div>{new Date(n.updatedAt || n.createdAt).toLocaleDateString()}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
