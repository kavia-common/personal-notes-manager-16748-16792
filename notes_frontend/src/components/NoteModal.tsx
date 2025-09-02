"use client";

import { useEffect, useMemo, useState } from "react";
import type { Note, Tag } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: { title: string; content: string; tagIds: string[] }) => void;
  allTags: Tag[];
  initial?: Note;
};

// PUBLIC_INTERFACE
export default function NoteModal({
  open,
  onClose,
  onSave,
  allTags,
  initial,
}: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [selected, setSelected] = useState<string[]>(
    initial?.tags?.map((t) => t.id) ?? []
  );
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    setTitle(initial?.title ?? "");
    setContent(initial?.content ?? "");
    setSelected(initial?.tags?.map((t) => t.id) ?? []);
    setNewTag("");
  }, [initial, open]);

  const available = useMemo(
    () => allTags.filter((t) => !selected.includes(t.id)),
    [allTags, selected]
  );

  function addNewTag() {
    const v = newTag.trim();
    if (!v) return;
    // Use virtual negative id to be interpreted by backend as name creation via API mapping.
    // In this UI, we will pass names via a special convention: tagIds may include strings like "name:work"
    // Backend adapter will handle converting names to IDs if supported.
    const synthetic = `name:${v}`;
    if (!selected.includes(synthetic)) {
      setSelected((s) => [...s, synthetic]);
    }
    setNewTag("");
  }

  function toggle(id: string) {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  }

  function submit() {
    onSave({
      title: title.trim() || "Untitled",
      content,
      tagIds: selected,
    });
  }

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <strong>{initial ? "Edit note" : "Create note"}</strong>
          <button className="button" onClick={onClose}>Close</button>
        </div>
        <div className="modal-body" style={{ display: "grid", gap: ".75rem" }}>
          <div>
            <label className="small">Title</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              autoFocus
            />
          </div>
          <div>
            <label className="small">Content</label>
            <textarea
              className="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
            />
          </div>

          <div>
            <label className="small">Tags</label>
            <div className="row" style={{ flexWrap: "wrap" }}>
              {selected.map((id) => {
                const real =
                  id.startsWith("name:")
                    ? { id, name: id.slice(5) }
                    : allTags.find((t) => t.id === id);
                if (!real) return null;
                return (
                  <button
                    key={id}
                    className="tag active"
                    onClick={() => toggle(id)}
                    title="Click to remove"
                  >
                    {real.name}
                    <span aria-hidden>×</span>
                  </button>
                );
              })}
            </div>
            <div className="row" style={{ marginTop: ".5rem", flexWrap: "wrap" }}>
              {available.slice(0, 12).map((t) => (
                <button key={t.id} className="tag" onClick={() => toggle(t.id)}>
                  {t.name}
                </button>
              ))}
            </div>
            <div className="row" style={{ marginTop: ".5rem" }}>
              <input
                className="input"
                placeholder="Add new tag (press Enter)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addNewTag();
                  }
                }}
              />
              <button className="button" onClick={addNewTag}>Add</button>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <span className="small" style={{ color: "var(--color-secondary)" }}>
            Use tags to organize your notes.
          </span>
          <div className="row">
            <button className="button" onClick={onClose}>Cancel</button>
            <button className="button primary" onClick={submit}>
              {initial ? "Save changes" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
