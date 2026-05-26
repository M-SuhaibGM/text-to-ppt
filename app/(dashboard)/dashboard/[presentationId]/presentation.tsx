
"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    LAYOUT_OPTIONS,
    PresentationWithSlides,
    SLIDE_STYLES,
    TONE_OPTIONS,
    presentationThumbnailUrl,
} from "@/features/presentation_types";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { usePresentationDetail } from "@/hooks/use-presentation-detail";
import { GenerationStatus } from "@/components/generation-status";
import { SlideCard } from "@/components/slide-card";
import { SlidePreview } from "@/components/slide-preview";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Download,
    Maximize,
    Play,
    RefreshCw,
    Save,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { SlideshowModal } from "@/components/slideshow-modal";
import { exportToPptx } from "@/components/export-pptx";

interface PresentationDetailClientProps {
    presentationId: string;
    initialData: PresentationWithSlides;
}

export default function PresentationDetailClient({ presentationId, initialData }: PresentationDetailClientProps) {
    const router = useRouter();

    const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [showSlideshow, setShowSlideshow] = useState<boolean>(false);
    const [isExporting, setIsExporting] = useState<boolean>(false);

    const {
        query,
        slides,
        isGenerating,
        updatedLabel,
        form,
        setForm,
        updateMut,
        regenerateMut,
        deleteMut,
    } = usePresentationDetail(presentationId, initialData, {
        onDeleted: () => router.push("/dashboard"),
    });

    const { isFullscreen, toggleFullscreen } = useFullscreen(
        "slide-preview-container"
    );

    const handleExportPptx = useCallback(async () => {
        const data = query.data;
        if (!data || slides.length === 0) return;

        setIsExporting(true);
        try {
            const filename = await exportToPptx({
                title: data.title,
                slides: slides,
            });
            toast.success(`Exported as ${filename}`);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Export failed");
        } finally {
            setIsExporting(false);
        }
    }, [query.data, slides]);

    if (query.isPending) {
        return (
            <main className="min-h-screen pt-24 pb-12 px-4 bg-slate-950 text-slate-400">
                <div className="max-w-6xl mx-auto flex items-center gap-2">
                    <RefreshCw className="size-4 animate-spin text-indigo-500" />
                    <span>Loading presentation workspace…</span>
                </div>
            </main>
        );
    }

    if (query.isError) {
        const error = query.error;
        return (
            <main className="min-h-screen pt-24 pb-12 px-4 bg-slate-950">
                <div className="max-w-6xl mx-auto space-y-4">
                    <p className="text-rose-400 font-mono text-sm">
                        {error instanceof Error ? error.message : "Something went wrong"}
                    </p>
                    <Button asChild variant="outline" className="rounded-xl border-slate-800 text-slate-300 hover:bg-slate-900">
                        <Link href="/dashboard">Back to Workspace</Link>
                    </Button>
                </div>
            </main>
        );
    }

    const data = query.data;
    const thumb = presentationThumbnailUrl(data.id);
    const activeSlide = slides.at(activeSlideIndex);

    // Explicitly determine if data collection is ready or processing
    const isCompleted = data.status === "COMPLETED";

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 bg-slate-950 text-slate-100">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="rounded-xl gap-1 text-slate-400 hover:text-white hover:bg-slate-900"
                        >
                            <Link href="/dashboard">
                                <ArrowLeft className="size-4" />
                                Workspace
                            </Link>
                        </Button>
                        <GenerationStatus status={data.status} />
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                        Updated {updatedLabel}
                    </span>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
                            <div className="relative size-14 shrink-0">
                                <Image
                                    src={thumb}
                                    alt="Presentation thumbnail"
                                    fill
                                    sizes="56px"
                                    className="rounded-xl border border-slate-800 bg-slate-950 object-cover"
                                    unoptimized
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="font-semibold text-white truncate">{data.title}</h1>
                                <p className="text-xs font-mono text-slate-500">
                                    {slides.length} slides compiled
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {slides.length > 0 && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl gap-1 border-slate-800 bg-blue-400 text-slate-300 hover:bg-slate-800"
                                            onClick={() => setShowSlideshow(true)}
                                        >
                                            <Play className="size-4" />
                                            <span className="hidden sm:inline">Slideshow</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl gap-1 border-slate-800 bg-blue-400 text-slate-300 hover:bg-slate-800"
                                            onClick={handleExportPptx}
                                            disabled={isExporting}
                                        >
                                            <Download className="size-4" />
                                            <span className="hidden sm:inline">
                                                {isExporting ? "Exporting…" : "Export"}
                                            </span>
                                        </Button>
                                    </>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl gap-1 bg-blue-400 border-slate-800 text-slate-300 hover:bg-slate-800"
                                    disabled={regenerateMut.isPending || isGenerating}
                                    onClick={() => regenerateMut.mutate()}
                                >
                                    <RefreshCw
                                        className={`size-4 ${isGenerating ? "animate-spin text-indigo-400" : ""}`}
                                    />
                                    <span className="hidden sm:inline">
                                        {isGenerating ? "Generating…" : "Regenerate"}
                                    </span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-xl text-white bg-indigo-700 hover:text-white hover:bg-slate-800"
                                    onClick={() => setShowSettings(!showSettings)}
                                >
                                    {showSettings ? "Hide settings" : "Edit settings"}
                                </Button>
                            </div>
                        </div>

                        {showSettings && (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                                <div className="space-y-2">
                                    <Label htmlFor="pres-title" className="text-xs font-mono uppercase tracking-wider text-slate-400">
                                        Title
                                    </Label>
                                    <input
                                        id="pres-title"
                                        value={form.title}
                                        onChange={(e) =>
                                            setForm((s) => ({
                                                ...s,
                                                title: e.target.value,
                                            }))
                                        }
                                        className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-mono uppercase tracking-wider text-slate-400">Prompt</Label>
                                    <Textarea
                                        value={form.prompt}
                                        onChange={(e) =>
                                            setForm((s) => ({
                                                ...s,
                                                prompt: e.target.value,
                                            }))
                                        }
                                        className="min-h-30 text-sm bg-slate-950 border-slate-800 text-slate-200 rounded-xl resize-y focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2.5 bg-slate-950/50 p-3 border border-slate-800/60 rounded-xl" dir="ltr">
                                        <Label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                                            Slides: <span className="text-indigo-400 font-bold">{form.slideCount}</span>
                                        </Label>
                                        <Slider
                                            value={[form.slideCount]}
                                            onValueChange={(values) => {
                                                if (values.length > 0) {
                                                    setForm((s) => ({
                                                        ...s,
                                                        slideCount: values[0],
                                                    }));
                                                }
                                            }}
                                            min={3}
                                            max={20}
                                            step={1}
                                            className="py-2 cursor-pointer"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-mono uppercase tracking-wider text-slate-400">Style</Label>
                                        <Select
                                            value={form.style}
                                            onValueChange={(value) =>
                                                setForm((s) => ({
                                                    ...s,
                                                    style: value as (typeof SLIDE_STYLES)[number]["value"],
                                                }))
                                            }
                                        >
                                            <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-300 rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                                {SLIDE_STYLES.map((s) => (
                                                    <SelectItem key={s.value} value={s.value} className="focus:bg-slate-800 focus:text-white">
                                                        {s.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-mono uppercase tracking-wider text-slate-400">Tone</Label>
                                        <Select
                                            value={form.tone}
                                            onValueChange={(value) =>
                                                setForm((s) => ({
                                                    ...s,
                                                    tone: value as (typeof TONE_OPTIONS)[number]["value"],
                                                }))
                                            }
                                        >
                                            <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-300 rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                                {TONE_OPTIONS.map((t) => (
                                                    <SelectItem key={t.value} value={t.value} className="focus:bg-slate-800 focus:text-white">
                                                        {t.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-mono uppercase tracking-wider text-slate-400">Layout</Label>
                                        <Select
                                            value={form.layout}
                                            onValueChange={(value) =>
                                                setForm((s) => ({
                                                    ...s,
                                                    layout: value as (typeof LAYOUT_OPTIONS)[number]["value"],
                                                }))
                                            }
                                        >
                                            <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-300 rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                                {LAYOUT_OPTIONS.map((l) => (
                                                    <SelectItem key={l.value} value={l.value} className="focus:bg-slate-800 focus:text-white">
                                                        {l.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-between gap-3 pt-2 border-t border-slate-800/60">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="rounded-xl gap-2 bg-rose-950/40 text-rose-400 border border-rose-900/50 hover:bg-rose-900/40"
                                                disabled={deleteMut.isPending}
                                            >
                                                <Trash2 className="size-4" />
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-slate-900 border border-slate-800 text-slate-100">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="text-white">Delete presentation?</AlertDialogTitle>
                                                <AlertDialogDescription className="text-slate-400">
                                                    This action cannot be undone. This will permanently
                                                    delete your presentation and all its slides.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="rounded-xl border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900">
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white"
                                                    onClick={() => deleteMut.mutate()}
                                                >
                                                    {deleteMut.isPending ? "Deleting…" : "Delete"}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <Button
                                        type="button"
                                        size="sm"
                                        className="rounded-xl gap-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                                        disabled={
                                            updateMut.isPending ||
                                            !form.title.trim() ||
                                            !form.prompt.trim()
                                        }
                                        onClick={() => updateMut.mutate()}
                                    >
                                        <Save className="size-4" />
                                        {updateMut.isPending ? "Saving…" : "Save changes"}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* RENDER LOGIC BASED ON COMPLETED STATUS VS FALLBACK STATES */}
                        {isCompleted && activeSlide ? (
                            <div className="space-y-3">
                                <div id="slide-preview-container" className="relative group overflow-hidden rounded-2xl border border-slate-800 shadow-2xl">
                                    <SlidePreview slide={activeSlide} isFullscreen={isFullscreen} />
                                    <Button
                                        variant="secondary"
                                        size="icon"
    
                                        className={`absolute top-3 right-3 z-50 rounded-lg bg-slate-950/80 hover:bg-slate-900 border cursor-pointer border-slate-800 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity ${isFullscreen ? "opacity-100" : ""}`}
                                        onClick={toggleFullscreen}
                                    >
                                        <Maximize className="size-4" />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl gap-1 border-slate-800 text-slate-300 hover:bg-slate-800"
                                        disabled={activeSlideIndex === 0}
                                        onClick={() =>
                                            setActiveSlideIndex((i) => Math.max(0, i - 1))
                                        }
                                    >
                                        <ChevronLeft className="size-4" />
                                        Previous
                                    </Button>
                                    <span className="text-xs font-mono text-slate-400">
                                        {activeSlideIndex + 1} / {slides.length}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl gap-1 border-slate-800 text-slate-300 hover:bg-slate-800"
                                        disabled={activeSlideIndex >= slides.length - 1}
                                        onClick={() =>
                                            setActiveSlideIndex((i) =>
                                                Math.min(slides.length - 1, i + 1)
                                            )
                                        }
                                    >
                                        Next
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : !isCompleted && isGenerating ? (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
                                <RefreshCw className="size-8 animate-spin mx-auto mb-4 text-indigo-500" />
                                <p className="text-slate-300 text-sm font-medium">
                                    Generating your presentation…
                                </p>
                                <p className="text-xs text-slate-500 font-mono mt-1">
                                    This may take a minute
                                </p>
                            </div>
                        ) : (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
                                <p className="text-slate-400 mb-4 text-sm">
                                    No slides yet or generation was halted. Click "Regenerate" to build slides from your prompt.
                                </p>
                                <Button
                                    className="rounded-xl gap-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                                    onClick={() => regenerateMut.mutate()}
                                    disabled={regenerateMut.isPending}
                                >
                                    <RefreshCw className="size-4" />
                                    Generate slides
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* ONLY SHOW STACK SIDEBAR IF STATUS IS READY AND SLIDES EXIST */}
                    {isCompleted && slides.length > 0 && (
                        <aside className="lg:w-80 xl:w-96 flex flex-col">
                            <h2 className="font-mono text-xs uppercase tracking-widest px-2 pb-3 text-slate-500">
                                Slides Stack
                            </h2>
                            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4 max-h-[calc(100vh-14rem)] custom-scrollbar">
                                {slides.map((slide, i) => (
                                    <SlideCard
                                        key={slide.id}
                                        slide={slide}
                                        isActive={i === activeSlideIndex}
                                        onClick={() => setActiveSlideIndex(i)}
                                    />
                                ))}
                            </div>
                        </aside>
                    )}
                </div>
            </div>

            {showSlideshow && (
                <SlideshowModal
                    slides={slides}
                    initialIndex={activeSlideIndex}
                    onClose={() => setShowSlideshow(false)}
                />
            )}
        </main>
    );
}