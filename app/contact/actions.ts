"use server";

// Contact form handler. No mailbox/CRM is wired up yet, so this validates the
// submission server-side and logs it; swap the `// TODO: deliver` block for a
// real transport (Resend, a Shopify webhook, a ticket queue) when one exists.

export type ContactState = {
  ok: boolean;
  message: string;
  // Field-level errors, keyed by input name, so the form can mark each field.
  errors?: Partial<Record<"name" | "email" | "topic" | "message", string>>;
};

export const initialContactState: ContactState = { ok: false, message: "" };

const TOPICS = ["General", "My order", "Wholesale", "Press"] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot - bots fill hidden fields, humans never see them.
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

  // TODO: deliver - send to support inbox / ticket queue.
  console.log("[contact]", { name, email, topic, message });

  return {
    ok: true,
    message: `Thanks, ${name.split(" ")[0]}. Your message is in. We reply within one business day.`,
  };
}
