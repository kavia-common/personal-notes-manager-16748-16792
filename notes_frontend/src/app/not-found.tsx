import React from "react";

export default function NotFound() {
  return (
    <main style={{ padding: "2rem" }}>
      <div className="container">
        <section className="panel" role="alert" aria-live="assertive">
          <div className="panel-header">
            <h1>404 — Page Not Found</h1>
          </div>
          <div className="panel-body">
            <p className="small">The page you’re looking for doesn’t exist.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
