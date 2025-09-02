"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createNote,
  deleteNote,
  getMe,
  listNotes,
  listTags,
  updateNote,
} from "@/lib/api";
import type { Note, Tag, User } from "@/lib/types";
import NoteModal from "@/components/NoteModal";
import TagFilter from "@/components/TagFilter";
import NoteList from "@/components/NoteList";
import NoteDetail from "@/components/NoteDetail";
import HeaderActions from "@/components/HeaderActions";

// PUBLIC_INTERFACE
export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function bootstrap() {
      try {
        const [me, tagList, noteList] = await Promise.all([
          getMe().catch(() => null),
          listTags().catch(() => []),
          listNotes().catch(() => []),
        ]);
        setUser(me);
        setTags(tagList);
        setNotes(noteList);
        if (noteList.length > 0) setSelectedNoteId(noteList[0].id);
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes.filter((n) => {
      const matchesQuery =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.tags?.some((t) => t.name.toLowerCase().includes(q)) ?? false);
      const matchesTags =
        selectedTagIds.length === 0 ||
        (n.tags?.some((t) => selectedTagIds.includes(t.id)) ?? false);
      return matchesQuery && matchesTags;
    });
  }, [notes, query, selectedTagIds]);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(note: Note) {
    setEditing(note);
    setModalOpen(true);
  }

  async function handleSave(data: {
    title: string;
    content: string;
    tagIds: string[];
  }) {
    if (!user) {
      alert("Please sign in to save notes.");
      return;
    }
    if (editing) {
      const updated = await updateNote(editing.id, data);
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setSelectedNoteId(updated.id);
    } else {
      const created = await createNote(data);
      setNotes((prev) => [created, ...prev]);
      setSelectedNoteId(created.id);
    }
    setModalOpen(false);
  }

  async function handleDelete(noteId: string) {
    if (!confirm("Delete this note?")) return;
    await deleteNote(noteId);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    setSelectedNoteId((prev) => {
      if (prev === noteId) {
        const remaining = notes.filter((n) => n.id !== noteId);
        return remaining[0]?.id ?? null;
      }
      return prev;
    });
  }

  return (
    <main>
      <div className="container">
        {/* top actions line below header */}
        <div className="row" style={{ padding: "0.75rem 0.25rem" }}>
          <HeaderActions
            user={user}
            onUserChange={setUser}
            onCreate={openCreate}
            query={query}
            onQueryChange={setQuery}
          />
        </div>

        <div className="main-grid">
          {/* Sidebar for tags */}
          <aside className="sidebar" aria-label="Tags sidebar">
            <div className="space-between" style={{ marginBottom: ".25rem" }}>
              <strong style={{ color: "var(--color-secondary)" }}>Tags</strong>
              <span className="badge">{tags.length}</span>
            </div>
            <TagFilter
              allTags={tags}
              selectedIds={selectedTagIds}
              onChange={setSelectedTagIds}
            />
          </aside>

          {/* Main panel with list and detail */}
          <section className="panel" aria-label="Notes panel">
            <div className="panel-header space-between">
              <div className="row">
                <h2 style={{ fontSize: "1rem" }}>Notes</h2>
                <span className="badge">{filteredNotes.length}</span>
              </div>
              <div className="row">
                <button className="button accent" onClick={openCreate}>
                  New note
                </button>
              </div>
            </div>
            <div
              className="panel-body"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(260px, 380px) 1fr",
                gap: "0.75rem",
              }}
            >
              {/* List */}
              <NoteList
                notes={filteredNotes}
                selectedId={selectedNoteId}
                onSelect={setSelectedNoteId}
              />

              {/* Detail */}
              <NoteDetail
                note={selectedNote}
                onEdit={() => selectedNote && openEdit(selectedNote)}
                onDelete={() => selectedNote && handleDelete(selectedNote.id)}
                loading={loading}
              />
            </div>
          </section>
        </div>
      </div>

      {modalOpen && (
        <NoteModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          allTags={tags}
          initial={editing ?? undefined}
        />
      )}
    </main>
  );
}
