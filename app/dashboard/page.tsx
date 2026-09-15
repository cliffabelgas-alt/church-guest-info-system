"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Guest = {
  id: string;
  full_name: string;
  email: string;
  cell: string;
  phase: string | null;
  remarks: string | null;
};

type RowState = {
  remarks: string;
  status: "idle" | "saving" | "saved" | "error";
};

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null | undefined>(
    undefined
  ); // undefined = not checked yet
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rowState, setRowState] = useState<Record<string, RowState>>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingGuests, setLoadingGuests] = useState(false);

  const loadGuests = useCallback(async () => {
    setLoadingGuests(true);
    setLoadError(null);

    // RLS on `assignments` and `guests` restricts this to rows for the
    // logged-in coach, so no extra filtering is needed client-side.
    const { data, error } = await supabase
      .from("assignments")
      .select("guests(id, full_name, email, cell, phase, remarks)");

    setLoadingGuests(false);

    if (error) {
      setLoadError("Couldn't load your guests. Please try refreshing.");
      return;
    }

    const flattened: Guest[] = (data ?? [])
      .map((row) => row.guests as unknown as Guest | null)
      .filter((guest): guest is Guest => guest !== null);

    setGuests(flattened);
    setRowState(
      Object.fromEntries(
        flattened.map((guest) => [
          guest.id,
          { remarks: guest.remarks ?? "", status: "idle" as const },
        ])
      )
    );
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      loadGuests();
    }
  }, [session, loadGuests]);

  function handleRemarksChange(guestId: string, value: string) {
    setRowState((prev) => ({
      ...prev,
      [guestId]: { remarks: value, status: "idle" },
    }));
  }

  async function handleSaveRemarks(guestId: string) {
    const current = rowState[guestId];
    if (!current) return;

    setRowState((prev) => ({
      ...prev,
      [guestId]: { ...current, status: "saving" },
    }));

    const { error } = await supabase
      .from("guests")
      .update({ remarks: current.remarks })
      .eq("id", guestId);

    setRowState((prev) => ({
      ...prev,
      [guestId]: {
        ...current,
        status: error ? "error" : "saved",
      },
    }));
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  // Still checking whether a session exists.
  if (session === undefined) {
    return (
      <div className="card">
        <p>Loading…</p>
      </div>
    );
  }

  // No session: prompt to sign in.
  if (session === null) {
    return (
      <div className="card">
        <h1>Coach Dashboard</h1>
        <p className="subtitle">You need to sign in to view your guests.</p>
        <div className="actions">
          <Link href="/login" className="button">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="dashboard-header">
        <div>
          <h1>Your Guests</h1>
          <p className="subtitle">
            Guests assigned to you. Update remarks and save as needed.
          </p>
        </div>
        <button className="button-secondary" onClick={handleSignOut}>
          Sign out
        </button>
      </div>

      {loadingGuests && <p>Loading guests…</p>}
      {loadError && <p className="field-error">{loadError}</p>}

      {!loadingGuests && !loadError && guests.length === 0 && (
        <p className="subtitle">No guests are assigned to you yet.</p>
      )}

      <div className="guest-list">
        {guests.map((guest) => {
          const row = rowState[guest.id] ?? { remarks: "", status: "idle" };
          return (
            <div className="guest-row" key={guest.id}>
              <div className="guest-info">
                <p className="guest-name">{guest.full_name}</p>
                <p className="guest-meta">{guest.email}</p>
                <p className="guest-meta">{guest.cell}</p>
                {guest.phase && (
                  <span className="guest-phase">{guest.phase}</span>
                )}
              </div>

              <div className="field guest-remarks">
                <label htmlFor={`remarks-${guest.id}`}>Remarks</label>
                <textarea
                  id={`remarks-${guest.id}`}
                  value={row.remarks}
                  onChange={(event) =>
                    handleRemarksChange(guest.id, event.target.value)
                  }
                />
                <div className="form-footer">
                  <button
                    type="button"
                    className="button"
                    disabled={row.status === "saving"}
                    onClick={() => handleSaveRemarks(guest.id)}
                  >
                    {row.status === "saving" ? "Saving…" : "Save"}
                  </button>
                  {row.status === "saved" && (
                    <span className="save-indicator success">Saved</span>
                  )}
                  {row.status === "error" && (
                    <span className="save-indicator error">
                      Couldn't save
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
