// app/(dashboard)/dashboard/[presentationId]/page.tsx

import { getPresentationWithSlides } from "@/actions/presentation-queries";
import PresentationDetailClient from "./presentation";

interface PageProps {
  params: Promise<{ presentationId: string }>;
}

export default async function PresentationDetailPage({ params }: PageProps) {
  // 1. Resolve dynamic route params securely on the server
  const resolvedParams = await params;
  const presentationId = resolvedParams.presentationId;
  // 2. Safely parse and fetch data, avoiding Zod validation issues
  // ✅ CORRECT: Wrap it in an object matching your server action expectations
  const initialData = await getPresentationWithSlides({
    data: { id: presentationId }
  });

  return (
    <PresentationDetailClient
      presentationId={presentationId}
      initialData={initialData}
    />
  );
}