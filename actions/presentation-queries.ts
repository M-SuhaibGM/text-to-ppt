"use server";

import { prisma } from "@/lib/prisma"; // Updated alias path to your latest database client
import { requirePresentationUserId } from "./server-helper";
import { presentationIdInputSchema } from "@/schema/validations";

/**
 * Fetches all presentations belonging to the currently authenticated user.
 */
export async function listPresentations() {
  const userId = await requirePresentationUserId();

  return prisma.presentation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

/**
 * Fetches a single presentation master row by its unique ID.
 */
export async function getPresentation(rawInput: unknown) {
  // Manual Zod schema parsing inside the runtime function body
  const data = presentationIdInputSchema.parse(rawInput);

  const userId = await requirePresentationUserId();

  const row = await prisma.presentation.findFirst({
    where: { id: data.id, userId },
  });

  if (!row) {
    throw new Error("Presentation workspace instance not found");
  }

  return row;
}

/**
 * Fetches a presentation row alongside its fully ordered child slides array.
 */
export async function getPresentationWithSlides(rawInput: any) {
  // 1. Check if rawInput is an object and contains a 'data' key. 
  // If it does, parse the nested object. Otherwise, parse rawInput directly.
  const targetPayload = (rawInput && typeof rawInput === 'object' && 'data' in rawInput)
    ? rawInput.data
    : rawInput;

  // 2. Fallback to an empty object if targetPayload is nullish to prevent Zod's 'received undefined' crash
  const data = presentationIdInputSchema.parse(targetPayload ?? {});

  const userId = await requirePresentationUserId();

  const row = await prisma.presentation.findFirst({
    where: { id: data.id, userId },
    include: {
      slides: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!row) {
    throw new Error("Presentation workspace instance not found");
  }

  return row;
}