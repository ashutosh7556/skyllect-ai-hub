"use client";

import { useState, type FormEvent } from "react";

const SERVICES = [
  "AI Agents",
  "AI Workflow Automation",
  "AI Integrations",
  "AI SaaS Development",
  "Legacy Software Modernization",
  "Not sure yet",
];

const CONTACT_EMAIL = "info@skyllect.com";

const FIELD =
  "w-full rounded-xl border border-line bg-background px-4 py-3 text-[15px] text-heading placeholder:text-muted/70 transition-colors duration-200 focus:border-brand-blue focus:bg-surface focus:outline-none motion-reduce:transition-none";

function Label({ htmlFor, children, required }: { htmlFor: string; children: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-heading">
      {children}
      {required ? <span className="ml-0.5 text-brand-orange">*</span> : null}
    </label>
  );
}

/**
 * Consultation request form. There is no form backend yet, so submitting
 * opens the visitor's email app with the details filled in, addressed to
 * info@skyllect.com.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    const subject = `AI Workflow Consultation — ${get("name")}`;
    const body = [
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      get("phone") && `Phone: ${get("phone")}`,
      get("company") && `Company: ${get("company")}`,
      `Interested in: ${get("service")}`,
      "",
      get("message"),
    ]
      .filter((line) => line !== "")
      .join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div>
        <Label htmlFor="name" required>
          Full name
        </Label>
        <input id="name" name="name" required autoComplete="name" placeholder="Jane Smith" className={FIELD} />
      </div>
      <div>
        <Label htmlFor="email" required>
          Work email
        </Label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="jane@company.com"
          className={FIELD}
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 555 000 0000" className={FIELD} />
      </div>
      <div>
        <Label htmlFor="company">Company</Label>
        <input id="company" name="company" autoComplete="organization" placeholder="Company name" className={FIELD} />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="service" required>
          What would you like to automate?
        </Label>
        <select id="service" name="service" required defaultValue="" className={FIELD}>
          <option value="" disabled>
            Choose a service
          </option>
          {SERVICES.map((service) => (
            <option key={service}>{service}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="message" required>
          Tell us about your workflow
        </Label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Which process takes up your team's time today?"
          className={`${FIELD} resize-y`}
        />
      </div>

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">We usually reply within one business day.</p>
        <button type="submit" className="btn-primary inline-flex w-fit items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold">
          Request Consultation
          <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor">
            <path d="M6.5 1.5 11 6l-4.5 4.5V7.4H1V4.6h5.5z" />
          </svg>
        </button>
      </div>

      {sent ? (
        <p role="status" className="rounded-xl border border-brand-blue/20 bg-mist px-4 py-3 text-sm text-heading sm:col-span-2">
          Your email app should now be open with your details filled in — just press send. If it
          didn&apos;t open, email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-brand-blue underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
