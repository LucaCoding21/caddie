"use server";

// Contact form handler. Validates server-side, then delivers the submission to
// the support inbox via Resend (transactional email).

import { Resend } from "resend";

import type { ContactState } from "./contact-state";

const TOPICS = ["General", "My order", "Wholesale", "Press"] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Delivery addresses. The from-address lives on the Resend-verified
// cloverfield.studio domain; submissions go to both the owner's inbox and the
// studio, and replyTo is set to the visitor so a reply goes straight to them.
const FROM = "Caddie Companion <caddie@cloverfield.studio>";
const TO = ["info@caddiecompanion.com", "william@cloverfield.studio"];

// Inbox we point people at when delivery itself fails, so a submission is never
// a dead end.
const FALLBACK_CONTACT = "info@caddiecompanion.com";

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]!
  );

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot - bots fill hidden fields, humans never see them. Pretend success
  // and drop it silently.
  if ((formData.get("company") as string)?.trim()) {
    return { ok: true, message: "Thanks, we'll be in touch shortly." };
  }

  const name = (formData.get("name") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim() ?? "";
  const topic = (formData.get("topic") as string)?.trim() ?? "";
  const message = (formData.get("message") as string)?.trim() ?? "";

  const errors: ContactState["errors"] = {};
  if (name.length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  if (!TOPICS.includes(topic as (typeof TOPICS)[number]))
    errors.topic = "Pick what this is about.";
  if (message.length < 10) errors.message = "A few more words, please.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }

  // Deliver to the support inbox via Resend.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set; cannot send email.");
    return {
      ok: false,
      message: `Something went wrong on our end. Please email us directly at ${FALLBACK_CONTACT}.`,
    };
  }

  const text = `New contact form submission

Name:   ${name}
Email:  ${email}
Topic:  ${topic}

${message}
`;

  const html = `<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
  <p style="margin:0 0 16px;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;color:#888">New contact form submission</p>
  <table style="border-collapse:collapse">
    <tr><td style="padding:2px 16px 2px 0;color:#888">Name</td><td style="padding:2px 0"><strong>${escapeHtml(name)}</strong></td></tr>
    <tr><td style="padding:2px 16px 2px 0;color:#888">Email</td><td style="padding:2px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
    <tr><td style="padding:2px 16px 2px 0;color:#888">Topic</td><td style="padding:2px 0">${escapeHtml(topic)}</td></tr>
  </table>
  <p style="margin:16px 0 0;white-space:pre-wrap">${escapeHtml(message)}</p>
</div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `New contact — ${topic} — ${name}`,
      text,
      html,
    });

    if (error) {
      console.error("[contact] Resend returned an error:", error);
      return {
        ok: false,
        message: `We couldn't send that just now. Please try again, or email us at ${FALLBACK_CONTACT}.`,
      };
    }
  } catch (err) {
    console.error("[contact] Resend threw:", err);
    return {
      ok: false,
      message: `We couldn't send that just now. Please try again, or email us at ${FALLBACK_CONTACT}.`,
    };
  }

  return {
    ok: true,
    message: `Thanks, ${name.split(" ")[0]}. Your message is in. We reply within one business day.`,
  };
}
