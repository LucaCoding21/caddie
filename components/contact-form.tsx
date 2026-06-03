"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  submitContact,
  initialContactState,
  type ContactState,
} from "@/app/contact/actions";

const TOPICS = ["General", "My order", "Wholesale", "Press"] as const;

// Shared field shell - eyebrow label over an underline input, matching the
// quiet, ruled editorial look used across the site's sections.
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </span>
      <div className="mt-2 border-b border-black/15 focus-within:border-black transition-colors">
        {children}
      </div>
      {error && (
        <span className="mt-2 block font-inter text-xs text-[#c23a2f]">
          {error}
        </span>
      )}
    </label>
  );
}

const inputCls =
  "w-full bg-transparent py-2.5 font-inter text-base text-black placeholder:text-zinc-400 outline-none";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-full bg-black px-8 py-3.5 font-inter text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState<ContactState, FormData>(
    submitContact,
    initialContactState
  );

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white px-8 py-12 text-center">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
          Message sent
        </p>
        <p className="mx-auto mt-5 max-w-sm font-inter text-lg leading-[1.5] text-black">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" error={state.errors?.name}>
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jordan Fairway"
            className={inputCls}
          />
        </Field>
        <Field label="Email" error={state.errors?.email}>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            className={inputCls}
          />
        </Field>
      </div>

      {/* Topic - pill radios, same selected-state idiom as the finish picker. */}
      <fieldset>
        <legend className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
          What&apos;s this about
        </legend>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {TOPICS.map((topic, i) => (
            <label key={topic} className="cursor-pointer">
              <input
                type="radio"
                name="topic"
                value={topic}
                defaultChecked={i === 0}
                className="peer sr-only"
              />
              <span className="inline-flex rounded-full border border-black/15 px-4 py-2 font-inter text-sm text-zinc-600 transition-colors hover:border-black/40 peer-checked:border-black peer-checked:bg-black peer-checked:text-white">
                {topic}
              </span>
            </label>
          ))}
        </div>
        {state.errors?.topic && (
          <span className="mt-2 block font-inter text-xs text-[#c23a2f]">
            {state.errors.topic}
          </span>
        )}
      </fieldset>

      <Field label="Message" error={state.errors?.message}>
        <textarea
          name="message"
          rows={3}
          placeholder="Tell us what you need a hand with…"
          className={`${inputCls} resize-none`}
        />
      </Field>

      {/* Honeypot - hidden from people, catches bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
        <SubmitButton />
        {!state.ok && state.message && (
          <span className="font-inter text-sm text-[#c23a2f]">
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
