"use client";

import type { Note } from "@/lib/types";

type Props = {
  note: Note | null;
  loading?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

// PUBLIC_INTERFACE
export default function NoteDetail({ note, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="panel">
        <div className="panel-body">Loading...</div>
      </div>
    );
  }
  if (!note) {
    return (
      <div className="panel">
        <div className="panel-body empty">Select a note to see details.</div>
      </div>
    );
  }
  return (
    <div className="panel" aria-label="Note detail">
      <div className="panel-header space-between">
        <div className="row">
          <h3 style={{ fontSize: "1rem" }}>{note.title || "Untitled"}</h3>
          <div className="row" style={{ marginLeft: ".5rem", flexWrap: "wrap" }}>
            {(note.tags ?? []).map((t) => (
              <span key={t.id} className="tag">{t.name}</span>
            ))}
          </div>
        </div>
        <div className="row">
          <button className="button" onClick={onEdit}>Edit</button>
          <button className="button" onClick={onDelete}>Delete</button>
        </div>
      </div>
      <div className="panel-body">
        <article style={{ whiteSpace: "pre-wrap" }}>
          {note.content || "No content"}
        </article>
      </div>
    </div>
  );
}
