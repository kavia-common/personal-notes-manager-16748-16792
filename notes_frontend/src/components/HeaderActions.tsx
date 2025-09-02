"use client";

import { signOut } from "@/lib/api";
import type { User } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";

type Props = {
  user: User | null;
  onUserChange: (u: User | null) => void;
  onCreate: () => void;
  query: string;
  onQueryChange: (q: string) => void;
};

// PUBLIC_INTERFACE
export default function HeaderActions({
  user,
  onUserChange,
  onCreate,
  query,
  onQueryChange,
}: Props) {
  const [busy, setBusy] = useState(false);

  async function handleSignOut() {
    setBusy(true);
    try {
      await signOut();
      onUserChange(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel" style={{ width: "100%" }}>
      <div className="panel-body space-between" style={{ gap: ".75rem", flexWrap: "wrap" }}>
        <div className="row" style={{ flex: 1, minWidth: 220 }}>
          <input
            className="input"
            placeholder="Search notes by title, content, or tag..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>
        <div className="row">
          <button className="button accent" onClick={onCreate}>
            + Create
          </button>
          {user ? (
            <>
              <span className="badge">{user.email}</span>
              <button className="button" onClick={handleSignOut} disabled={busy}>
                Sign out
              </button>
            </>
          ) : (
            <Link href="/auth" className="button primary">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
