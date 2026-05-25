"use server";

import { prisma } from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { revalidatePath } from "next/cache";

import { deriveTitle, requirePresentationUserId } from "./server-helper";
import {
    createPresentationInputSchema,
    presentationIdInputSchema,
    updatePresentationInputSchema,
} from "@/schema/validations";

/**
 * Creates a new AI presentation workspace and schedules the Inngest background worker.
 */

export async function createPresentation(rawInput: unknown) {
    // 1. Unnest payload to prevent Zod errors if wrapped in a 'data' key
    const inputToValidate =
        rawInput && typeof rawInput === 'object' && 'data' in rawInput
            ? (rawInput as { data: unknown }).data
            : rawInput;

    // 2. Validate input schema using Zod
    const data = createPresentationInputSchema.parse(inputToValidate);

    const userId = await requirePresentationUserId();

    // 💡 FIX: Trigger the cache pipeline wipe BEFORE returning the object 
    // to prevent Next.js from hijacking the server action's return value.
    revalidatePath("/dashboard");

    const presentation = await prisma.presentation.create({
        data: {
            userId,
            title: deriveTitle(data.prompt),
            prompt: data.prompt,
            slideCount: data.slideCount,
            style: data.style,
            tone: data.tone,
            layout: data.layout,
            status: "GENERATING",
        },
    });

    // Dispatch background job to cloud executor queue
    await inngest.send({
        name: "presentation/generate",
        data: { presentationId: presentation.id },
    });

    return presentation;
}

/**
 * Updates individual properties of an existing active slide presentation instance.
 */
export async function updatePresentation(rawInput: unknown) {
    const data = updatePresentationInputSchema.parse(rawInput);

    const userId = await requirePresentationUserId();
    const { id, ...patch } = data;

    const existing = await prisma.presentation.findFirst({
        where: { id, userId },
    });

    if (!existing) throw new Error("Presentation workspace instance not found");

    const updated = await prisma.presentation.update({
        where: { id },
        data: patch,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/presentations/${id}`);

    return updated;
}

/**
 * Deletes a selected deck entry record safely from database records.
 */
export async function deletePresentation(rawInput: unknown) {
    const data = presentationIdInputSchema.parse(rawInput);

    const userId = await requirePresentationUserId();

    const existing = await prisma.presentation.findFirst({
        where: { id: data.id, userId },
    });

    if (!existing) throw new Error("Presentation workspace instance not found");

    await prisma.presentation.delete({
        where: { id: data.id }
    });

    revalidatePath("/dashboard");

    return { ok: true as const };
}

/**
 * Flags generation statuses back to processing states and retriggers background processing.
 */
export async function regeneratePresentation(rawInput: unknown) {
    const data = presentationIdInputSchema.parse(rawInput);

    const userId = await requirePresentationUserId();

    const existing = await prisma.presentation.findFirst({
        where: { id: data.id, userId },
    });

    if (!existing) throw new Error("Presentation workspace instance not found");

    const updated = await prisma.presentation.update({
        where: { id: data.id },
        data: { status: "GENERATING" },
    });

    await inngest.send({
        name: "presentation/generate",
        data: { presentationId: data.id },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/presentations/${data.id}`);

    return updated;
}