"use client";

import { useState } from "react";

const CONTACT_EMAIL = "info@skyllect.com";

// The existing Skyllect backend (skyllect-backend, POST /api/contact). It saves
// the enquiry and sends two Mailjet emails: one to the team, one thanking the
// visitor. Override with NEXT_PUBLIC_CONTACT_API_URL, e.g. for a staging API.
const CONTACT_API_URL =
  process.env.NEXT_PUBLIC_CONTACT_API_URL ?? "https://skyllect.com/api/contact";

// The backend stores the message in a 255-character column.
const MESSAGE_MAX = 255;

type Status = "idle" | "sending" | "sent" | "error";

type Field = "name" | "email" | "phone" | "message";
type Values = Record<Field, string>;

const EMPTY: Values = { name: "", email: "", phone: "", message: "" };

function validate(values: Values): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (!values.name.trim()) errors.name = "Please provide name";
  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Please enter a valid email.";
  if (!values.phone.trim()) errors.phone = "Mobile Number is required.";
  else if (values.phone.replace(/\D/g, "").length < 7) errors.phone = "Please enter a valid mobile number.";
  return errors;
}

const INPUT =
  "w-full rounded-lg border border-white/70 bg-white px-4 py-2.5 text-[15px] text-heading shadow-[inset_0_1px_2px_rgba(15,27,51,0.08)] transition-colors duration-200 focus:border-brand-blue focus:outline-none motion-reduce:transition-none";

/**
 * Contact form with inline validation messages under each field. A valid
 * submission is posted to the Skyllect backend, which emails the team and
 * sends the visitor a thank-you email.
 */
export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const errors = validate(values);

  const set = (field: Field) => (event: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [field]: event.target.value }));
  const blur = (field: Field) => () => setTouched((t) => ({ ...t, [field]: true }));
  const showError = (field: Field) => (touched[field] ? errors[field] : undefined);

  async function onSubmit(event: { preventDefault(): void }) {
    event.preventDefault();
    setTouched({ name: true, email: true, phone: true, message: true });
    if (Object.keys(errors).length > 0 || status === "sending") return;

    setStatus("sending");
    setServerError("");
    try {
      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: values.name.trim(),
          email: values.email.trim(),
          // The backend stores the phone as a number, so send digits only
          // ("+91 90997 81144" becomes 919099781144).
          phone_number: values.phone.replace(/\D/g, ""),
          message: values.message.trim(),
        }),
      });
      const result = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;

      if (response.ok && result?.success !== false) {
        setStatus("sent");
        setValues(EMPTY);
        setTouched({});
      } else {
        setStatus("error");
        setServerError(result?.message ?? "");
      }
    } catch {
      setStatus("error");
    }
  }

  const row = (field: Field, label: string, required: boolean, input: React.ReactNode) => (
    <div>
      <label htmlFor={field} className="mb-1.5 block text-[15px] font-semibold text-white">
        {label}
        {required ? <span className="ml-0.5 text-[#ff4d4f]">*</span> : null}
      </label>
      {input}
      <p id={`${field}-error`} role="alert" className="mt-1 min-h-[1.1rem] text-[13px] text-[#ff3b30]">
        {showError(field) ?? ""}
      </p>
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-1.5">
      {row(
        "name",
        "Name",
        true,
        <input
          id="name"
          autoComplete="name"
          value={values.name}
          onChange={set("name")}
          onBlur={blur("name")}
          aria-invalid={Boolean(showError("name"))}
          aria-describedby="name-error"
          className={INPUT}
        />,
      )}
      {row(
        "email",
        "Email",
        true,
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={set("email")}
          onBlur={blur("email")}
          aria-invalid={Boolean(showError("email"))}
          aria-describedby="email-error"
          className={INPUT}
        />,
      )}
      {row(
        "phone",
        "Phone",
        true,
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={set("phone")}
          onBlur={blur("phone")}
          aria-invalid={Boolean(showError("phone"))}
          aria-describedby="phone-error"
          className={INPUT}
        />,
      )}
      {row(
        "message",
        "Message",
        false,
        <textarea
          id="message"
          rows={5}
          maxLength={MESSAGE_MAX}
          value={values.message}
          onChange={set("message")}
          className={`${INPUT} resize-y`}
        />,
      )}

      <div className="mt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-lg bg-brand-blue/80 px-9 py-3 text-[15px] font-semibold text-white shadow-[0_6px_16px_-8px_rgba(15,27,51,0.5)] transition-colors duration-300 hover:bg-brand-blue disabled:opacity-70 motion-reduce:transition-none"
        >
          {status === "sending" ? "Sending…" : "Submit"}
        </button>
      </div>

      {status === "sent" ? (
        <p role="status" className="mt-3 rounded-lg bg-white/90 px-4 py-3 text-sm text-heading">
          Thank you — your message has been sent. We&apos;ve emailed you a confirmation and will get
          back to you shortly.
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="mt-3 rounded-lg bg-white/90 px-4 py-3 text-sm text-[#c0271c]">
          Sorry, your message couldn&apos;t be sent{serverError ? ` (${serverError})` : ""}. Please try
          again, or email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-brand-blue underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
