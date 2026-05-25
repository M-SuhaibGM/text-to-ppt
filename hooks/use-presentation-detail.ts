"use client"
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { SlideLayout, SlideStyle, SlideTone } from '@/features/presentation_types'
import { presentationQueryKeys } from './query-keys'
import { getPresentationWithSlides } from '@/actions/presentation-queries'
import {
  deletePresentation,
  regeneratePresentation,
  updatePresentation,
} from '@/actions/presentation'
type SettingsForm = {
  title: string
  prompt: string
  slideCount: number
  style: SlideStyle
  tone: SlideTone
  layout: SlideLayout
}
import { PresentationWithSlides } from '@/features/presentation_types'
interface UsePresentationDetailOptions {
  onDeleted?: () => void;
}

export function usePresentationDetail(
  presentationId: string,
  initialData: PresentationWithSlides, // 1. Accept initialData here
  opts?: UsePresentationDetailOptions,
) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: presentationQueryKeys.detail(presentationId),
    // Change { data: { id: presentationId } } to { id: presentationId }
    queryFn: () => getPresentationWithSlides({ id: presentationId }),
    initialData: initialData,
    refetchInterval: (q) =>
      q.state.data?.status === 'GENERATING' ? 3000 : false,
  })

  // 3. Initialize state with initialData fields directly to avoid empty strings on mount
  const [form, setForm] = useState<SettingsForm>({
    title: initialData.title,
    prompt: initialData.prompt,
    slideCount: initialData.slideCount,
    style: initialData.style as SlideStyle,
    tone: initialData.tone as SlideTone,
    layout: initialData.layout as SlideLayout,
  })

  // 4. Keep this to update the form if background refetches or mutations change the server data
  useEffect(() => {
    if (!query.data) return
    setForm({
      title: query.data.title,
      prompt: query.data.prompt,
      slideCount: query.data.slideCount,
      style: query.data.style as SlideStyle,
      tone: query.data.tone as SlideTone,
      layout: query.data.layout as SlideLayout,
    })
  }, [query.data])

  const updateMut = useMutation({
    mutationFn: () =>
      updatePresentation({
        data: {
          id: presentationId,
          title: form.title,
          prompt: form.prompt,
          slideCount: form.slideCount,
          style: form.style,
          tone: form.tone,
          layout: form.layout,
        },
      }),
    onSuccess: () => {
      toast.success('Presentation saved')
      queryClient.invalidateQueries({ queryKey: presentationQueryKeys.list() })
      queryClient.invalidateQueries({
        queryKey: presentationQueryKeys.detail(presentationId),
      })
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'Could not save')
    },
  })

  const regenerateMut = useMutation({
    mutationFn: () => regeneratePresentation({ data: { id: presentationId } }),
    onSuccess: () => {
      toast.success('Regenerating slides…')
      queryClient.invalidateQueries({
        queryKey: presentationQueryKeys.detail(presentationId),
      })
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'Could not regenerate')
    },
  })

  const deleteMut = useMutation({
    mutationFn: () => deletePresentation({ data: { id: presentationId } }),
    onSuccess: () => {
      toast.success('Presentation deleted')
      queryClient.invalidateQueries({ queryKey: presentationQueryKeys.list() })
      queryClient.removeQueries({
        queryKey: presentationQueryKeys.detail(presentationId),
      })
      opts?.onDeleted?.()
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'Could not delete')
    },
  })

  // Since initialData is provided, query.data is never undefined
  const slides = query.data.slides
  const isGenerating = query.data.status === 'GENERATING'

  const updatedLabel = useMemo(() => {
    if (!query.data?.updatedAt) return ''
    return new Date(query.data.updatedAt).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }, [query.data?.updatedAt])

  return {
    query,
    slides,
    isGenerating,
    updatedLabel,
    form,
    setForm,
    updateMut,
    regenerateMut,
    deleteMut,
  }
}

