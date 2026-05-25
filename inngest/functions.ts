import { Output, generateText } from 'ai'
import { groq } from '@ai-sdk/groq' // 👈 Swapped out google for groq
import { z } from 'zod'

import { prisma } from '../lib/prisma'
import { inngest } from './client'

// ---------------------------------------------------------------------------
// Image Generation
// ---------------------------------------------------------------------------

function buildImageKitUrl(prompt: string, filename: string): string {
  const baseUrl = process.env.IMAGEKIT_BASE_URL!
  const sanitizedPrompt = prompt
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100)

  return `${baseUrl}/ik-genimg-prompt-${encodeURIComponent(sanitizedPrompt)}/${filename}.jpg?tr=w-1280,h-720`
}

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const slideSchema = z.object({
  title: z.string().describe('Slide title'),
  content: z.string().describe('Main content / bullet points for the slide'),
  notes: z.string().optional().describe('Speaker notes'),
  imagePrompt: z
    .string()
    .describe(
      'A concise prompt to generate an illustration for this slide (professional, clean style, no text in image)',
    ),
})

const slidesResponseSchema = z.object({
  slides: z.array(slideSchema),
})

export const generatePresentation = inngest.createFunction(
  {
    id: 'generate-presentation',
    retries: 2,
    triggers: [{ event: 'presentation/generate' }],
  },
  async ({ event, step }) => {
    const { presentationId } = event.data as { presentationId: string }

    const presentation = await step.run('fetch-presentation', async () => {
      const p = await prisma.presentation.findUnique({
        where: { id: presentationId },
      })
      if (!p) throw new Error('Presentation not found')
      return p
    })

    await step.run('mark-generating', async () => {
      await prisma.presentation.update({
        where: { id: presentationId },
        data: { status: 'GENERATING' },
      })
    })

    const { slides } = await step.run('generate-slides-content', async () => {
      const systemPrompt = `You are an expert presentation designer. Given a user's content/prompt, create a compelling presentation.

Style: ${presentation.style}
Tone: ${presentation.tone}
Layout preference: ${presentation.layout}
Number of slides requested: ${presentation.slideCount}

Guidelines:
- Create exactly ${presentation.slideCount} slides
- First slide should be a title slide
- Last slide should be a summary or call-to-action
- Keep content concise and impactful
- For imagePrompt, describe a professional illustration that complements the slide (no text in images)
`

      const result = await generateText({
        model: groq('llama-3.3-70b-versatile'),
        providerOptions: {
          groq: {
            response_format: { type: "json_object" }
          }
        },
        system: `${systemPrompt}
  
  CRITICAL constraints for JSON property names:
  - Each slide object inside the "slides" array MUST use these exact keys:
    * "title": (string) The main heading of the slide
    * "content": (string) Detailed body content or bullet points formatted as a single string or markdown list text. Do NOT use "bulletPoints" or "subtitle".
    * "imagePrompt": (string) A highly descriptive prompt for image generation. Do NOT use "image".

  Example of the exact structure required:
  {
    "slides": [
      {
        "title": "Slide Title Here",
        "content": "- First point\\n- Second point\\n- Third point",
        "imagePrompt": "A detailed professional illustration of..."
      }
    ]
  }

  Do NOT use any other keys. Return a raw, valid JSON object ONLY.`,
        prompt: presentation.prompt,
      });
      let cleanText = result.text.trim();
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      }

      try {
        // 3. Parse and validate against your Zod schema layout
        const parsedData = slidesResponseSchema.parse(JSON.parse(cleanText));
        return parsedData;
      } catch (error) {
        console.error("Failed to parse model layout output. Raw string was:", result.text);
        throw error;
      }
    })

    await step.run('delete-old-slides', async () => {
      await prisma.slide.deleteMany({
        where: { presentationId },
      })
    })

    await step.run('create-slides', async () => {
      const data = slides.map((s, i) => ({
        presentationId,
        order: i,
        title: s.title,
        content: s.content,
        notes: s.notes ?? null,
        imagePrompt: s.imagePrompt,
        imageUrl: buildImageKitUrl(s.imagePrompt, `slide-${presentationId}-${i}`),
      }))

      await prisma.slide.createMany({ data })
    })

    await step.run('mark-completed', async () => {
      await prisma.presentation.update({
        where: { id: presentationId },
        data: { status: 'COMPLETED' },
      })
    })

    return { success: true, slideCount: slides.length }
  },
)

export const helloWorld = inngest.createFunction(
  {
    id: 'hello-world',
    triggers: [{ event: 'test/hello.world' }],
  },
  async ({ event, step }) => {
    await step.sleep('wait-a-moment', '1s')
    return { message: `Hello ${event.data.email}!` }
  },
)