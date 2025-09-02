"use client";

import { useEffect, useState } from "react";
import { getMe, signIn, signOut, signUp } from "@/lib/api";
import type { User } from "@/lib/types";

// PUBLIC_INTERFACE
export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    getMe().then(setUser).catch(() => setUser(null));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signin") {
        await signIn({ email, password });
        const me = await getMe();
        setUser(me);
        setMsg("Signed in.");
      } else {
        await signUp({ email, password });
        const me = await getMe();
        setUser(me);
        setMsg("Account created.");
      }
    } catch (err: Error | unknown) {
      const error = err as Error;
      setMsg(error?.message || "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    try {
      await signOut();
      setUser(null);
      setMsg("Signed out.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container" style={{ paddingBlock: "1rem" }}>
      <section className="panel" style={{ maxWidth: 560, marginInline: "auto" }}>
        <div className="panel-header space-between">
          <h2>Authentication</h2>
          <div className="row">
            <button
              className={`button ${mode === "signin" ? "primary" : "ghost"}`}
              onClick={() => setMode("signin")}
            >
              Sign in
            </button>
            <button
              className={`button ${mode === "signup" ? "primary" : "ghost"}`}
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </div>
        </div>
        <div className="panel-body">
          {user ? (
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div>
                <div><strong>Signed in as</strong></div>
                <div className="small">{user.email}</div>
              </div>
              <button className="button" onClick={handleSignOut} disabled={busy}>
                Sign out
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem" }}>
              <div>
                <label className="small">Email</label>
                <input
                  className="input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="small">Password</label>
                <input
                  className="input"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </div>
              <div className="space-between">
                <span className="small" style={{ color: "var(--color-secondary)" }}>
                  {mode === "signup" ? "Create a new account." : "Welcome back."}
                </span>
                <button className="button primary" disabled={busy}>
                  {busy ? "Please wait..." : mode === "signup" ? "Sign up" : "Sign in"}
                </button>
              </div>
            </form>
          )}
          {msg && <div style={{ marginTop: ".75rem" }} className="badge">{msg}</div>}
        </div>
      </section>
    </main>
  );
}
