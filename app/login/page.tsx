"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/dashboard`
            : undefined,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("sent");
  }

  return (
    <div className="card">
      <Link href="/" className="back-link">
        ← Back to home
      </Link>
      <h1>Coach Sign In</h1>
      <p className="subtitle">
        Enter your email and we'll send you a sign-in link — no password
        needed.
      </p>

      {status === "sent" ? (
        <div className="status success">
          Check your email for a sign-in link.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {status === "error" && errorMessage && (
            <p className="field-error">{errorMessage}</p>
          )}

          <div className="form-footer">
            <button
              type="submit"
              className="button"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending…" : "Send sign-in link"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
