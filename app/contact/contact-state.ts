// Shared contact-form types and constants. These live outside actions.ts
// because a "use server" file may only export async functions, not values or
// types — see https://nextjs.org/docs/messages/invalid-use-server-value.

export type ContactState = {
  ok: boolean;
  message: string;
  // Field-level errors, keyed by input name, so the form can mark each field.
  errors?: Partial<Record<"name" | "email" | "topic" | "message", string>>;
};

export const initialContactState: ContactState = { ok: false, message: "" };
