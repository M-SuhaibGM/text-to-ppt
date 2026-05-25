import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // Updated path alias to match your standard Next.js config

/**
 * Generates a clean, short title based on the user's initial prompt line.
 */
export function deriveTitle(prompt: string) {
  const line =
    prompt
      .split("\n")
      .map((l) => l.trim())
      .find(Boolean) ?? "";
  const shortened = line.slice(0, 80).trim();
  return shortened || "Untitled presentation";
}

/**
 * Asserts that a valid session exists on the incoming request,
 * returning the authenticated user's ID or throwing an error.
 */
export async function requirePresentationUserId() {
  // Next.js native way to securely pull headers from the current async execution context
  const reqHeaders = await headers();
  
  // Pass the resolved headers directly into your auth engine API
  const session = await auth.api.getSession({ headers: reqHeaders });
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  
  return session.user.id;
}