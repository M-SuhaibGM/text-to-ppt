import Link from 'next/link'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import type { PresentationModel as Presentation } from '@/prisma/generated/models/Presentation'
import { presentationThumbnailUrl } from '@/features/presentation_types'

type PresentationCardProps = {
  presentation: Presentation
}

export function PresentationCard({ presentation: p }: PresentationCardProps) {
  const updated = new Date(p.updatedAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const thumb = presentationThumbnailUrl(p.id)

  return (
    <Link
      href={`/presentations/${p.id}`}
      className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
    >
      <Card className="h-full bg-slate-900 border-slate-800 py-0 overflow-hidden transition-colors hover:border-indigo-500/40 shadow-md">
        <div className="flex gap-4 p-4">
          <img
            src={thumb}
            alt=""
            width={72}
            height={72}
            className="rounded-xl border border-slate-800 shrink-0 bg-slate-950"
          />
          <CardHeader className="p-0 gap-1 flex-1 min-w-0">
            <CardTitle className="text-base text-slate-100 line-clamp-2">{p.title}</CardTitle>
            <CardDescription className="line-clamp-2 text-slate-400">
              {p.slideCount} slides · {p.style} · {p.tone}
            </CardDescription>
            <p className="text-xs text-slate-500 pt-1 font-mono">
              Updated {updated}
            </p>
          </CardHeader>
        </div>
      </Card>
    </Link>
  )
}