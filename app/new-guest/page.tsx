"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

type GuestFormData = {
  fullName: string;
  email: string;
  cellNumber: string;
  remarks: string;
};

type FormErrors = Partial<Record<keyof GuestFormData, string>>;

// Matches 09XXXXXXXXX (11 digits) or +639XXXXXXXXX (12 digits after the +)
const PH_MOBILE_REGEX = /^(09\d{9}|\+639\d{9})$/;

function validate(data: GuestFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.fullName.trim()) {
    errors.fullName = "Please enter the guest's full name.";
  }

  if (!data.email.trim()) {
    errors.email = "Please enter an email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "That email address doesn't look right.";
  }

  const cell = data.cellNumber.trim();
  if (!cell) {
    errors.cellNumber = "Please enter a cell number.";
  } else if (!PH_MOBILE_REGEX.test(cell)) {
    errors.cellNumber =
      "Please enter a valid PH mobile number, like 09171234567 or +639171234567.";
  }

  return errors;
}

export default function NewGuestPage() {
  const [formData, setFormData] = useState<GuestFormData>({
    fullName: "",
    email: "",
    cellNumber: "",
    remarks: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from("guests").insert({
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      cell: formData.cellNumber.trim(),
      remarks: formData.remarks.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      console.error("Failed to save guest:", error);
      setSubmitError(
        "Something went wrong saving your information. Please try again or let an usher know."
      );
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="card">
        <div className="status success">
          Thanks, {formData.fullName.split(" ")[0] || "friend"}! Your
          information has been saved.
        </div>
        <div className="actions" style={{ marginTop: "1.5rem" }}>
          <Link href="/new-guest" className="button-secondary">
            Add another guest
          </Link>
          <Link href="/" className="button-secondary">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <Link href="/" className="back-link">
        ← Back to home
      </Link>
      <h1>New Guest</h1>
      <p className="subtitle">
        Please fill out the guest's basic information.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
          {errors.fullName && (
            <p className="field-error" id="fullName-error">
              {errors.fullName}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p className="field-error" id="email-error">
              {errors.email}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="cellNumber">
            Cell number <span className="hint">(e.g. 09171234567)</span>
          </label>
          <input
            id="cellNumber"
            name="cellNumber"
            type="tel"
            placeholder="09171234567 or +639171234567"
            value={formData.cellNumber}
            onChange={handleChange}
            aria-invalid={Boolean(errors.cellNumber)}
            aria-describedby={
              errors.cellNumber ? "cellNumber-error" : undefined
            }
          />
          {errors.cellNumber && (
            <p className="field-error" id="cellNumber-error">
              {errors.cellNumber}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="remarks">
            Remarks <span className="hint">(optional)</span>
          </label>
          <textarea
            id="remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Prayer requests, how they heard about us, anything worth noting..."
          />
        </div>

        {submitError && <p className="field-error">{submitError}</p>}

        <div className="form-footer">
          <button type="submit" className="button" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
