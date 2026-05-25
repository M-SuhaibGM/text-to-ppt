"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
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
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

import {
  LAYOUT_OPTIONS,
  PRESENTATION_TEMPLATES,
  SLIDE_STYLES,
  TONE_OPTIONS,
} from "@/features/presentation_types";
import { createPresentation } from "@/actions/presentation";
import { listPresentations } from "@/actions/presentation-queries";

type HomeFormState = {
  content: string;
  slideCount: number;
  style: (typeof SLIDE_STYLES)[number]["value"];
  tone: (typeof TONE_OPTIONS)[number]["value"];
  layout: (typeof LAYOUT_OPTIONS)[number]["value"];
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending: authPending } = useSession();

  const [form, setForm] = useState<HomeFormState>({
    content: "",
    slideCount: 8,
    style: "minimal",
    tone: "formal",
    layout: "balanced",
  });

  // Local state for tracking past presentations data and loading state
  const [presentations, setPresentations] = useState<any[]>([]);
  const [listPending, setListPending] = useState(false);
  const [createPending, setCreatePending] = useState(false);

  // Fetch past presentations when the component mounts or when the session changes
  useEffect(() => {
    if (!session) return;

    const fetchPresentations = async () => {
      setListPending(true);
      try {
        const data = await listPresentations();
        setPresentations(data || []);
      } catch (error) {
        console.error("Failed to fetch presentations:", error);
        toast.error("Could not load past presentations");
      } finally {
        setListPending(false);
      }
    };

    fetchPresentations();
  }, [session]);

  const handleGenerate = async () => {
    if (!form.content.trim()) {
      toast.error("Please enter your content first");
      return;
    }

    setCreatePending(true);
    try {
      const presentation = await createPresentation({
        data: {
          prompt: form.content.trim(),
          slideCount: form.slideCount,
          style: form.style,
          tone: form.tone,
          layout: form.layout,
        },
      });

      toast.success("Presentation created successfully!");
      router.push(`/dashboard/${presentation.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create presentation");
    } finally {
      setCreatePending(false);
    }
  };

  // Immediate loading state fallback during baseline auth initialization
  if (authPending) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-mono tracking-wider uppercase">Loading Workspace...</p>
      </div>
    );
  }

  // Client-side guard check fallback if not handled by a root Next.js middleware file
  if (!session) {
    router.replace("/login");
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500/30 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Dynamic AI Prompter Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            What do you want to{" "}
            <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              create?
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg font-normal">
            Enter your concept requirements and watch SlideGen compose a tailored presentation deck instantly.
          </p>
        </div>

        {/* Central Workspace Canvas Card Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">

          {/* Conceptual Input Field Container */}
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your presentation topic, paste raw markdown notes, or layout target deck goals..."
              value={form.content}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  content: e.target.value,
                }))
              }
              className="h-48 min-h-48 max-h-64 overflow-y-auto text-base bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600 rounded-2xl resize-none focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all p-4"
            />
            <div className="flex justify-between text-xs font-mono tracking-wide text-slate-500 px-1">
              <span>{form.content.length.toLocaleString()} Characters Written</span>
              <span>Markdown Parsable</span>
            </div>
          </div>

          {/* Configuration Parameters Selector Array Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Slide Track Slider Component */}
            <div className="space-y-2.5 bg-slate-950/40 p-3.5 border border-slate-800/60 rounded-xl" dir="ltr">
              {/* 👆 Added dir="ltr" here to explicitly force left-to-right direction */}
              <div className="flex justify-between items-center">
                <Label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
                  Target Slides:
                </Label>
                <span className="text-indigo-400 font-mono font-bold text-sm bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                  {form.slideCount}
                </span>
              </div>
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
                max={8}
                min={1}
                step={1}
                className="py-2 cursor-pointer"
              />
            </div>

            {/* Aesthetic Style Context Selection Component */}
            <div className="space-y-2.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
                Visual Style
              </Label>
              <Select
                value={form.style}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    style: value as HomeFormState["style"],
                  }))
                }
              >
                <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl py-5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 rounded-xl">
                  {SLIDE_STYLES.map((s) => (
                    <SelectItem key={s.value} value={s.value} className="focus:bg-slate-800 focus:text-white rounded-lg">
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dialect / Pitch Tone Selector Component */}
            <div className="space-y-2.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
                Copywriting Tone
              </Label>
              <Select
                value={form.tone}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    tone: value as HomeFormState["tone"],
                  }))
                }
              >
                <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl py-5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 rounded-xl">
                  {TONE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="focus:bg-slate-800 focus:text-white rounded-lg">
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Layout Geometry Strategy Selector Component */}
            <div className="space-y-2.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
                Layout Blueprint
              </Label>
              <Select
                value={form.layout}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    layout: value as HomeFormState["layout"],
                  }))
                }
              >
                <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl py-5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 rounded-xl">
                  {LAYOUT_OPTIONS.map((l) => (
                    <SelectItem key={l.value} value={l.value} className="focus:bg-slate-800 focus:text-white rounded-lg">
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Trigger Action Execution Drawer Block */}
          <div className="flex justify-end pt-2 border-t border-slate-800/50">
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={createPending || !form.content.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-8 py-5 gap-2 shadow-xl shadow-indigo-600/10 transition active:scale-[0.98]"
            >
              {createPending ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin text-indigo-200" />
                  <span>Assembling Deck Modules...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate PPT</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Modular Prompt Layout Sandbox Presets Grid */}
        <div className="mt-4 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">
            Accelerate execution with sandbox templates
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {PRESENTATION_TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  setForm({
                    content: template.content,
                    slideCount: template.slides,
                    style: template.style,
                    tone: template.tone,
                    layout: template.layout,
                  });
                  toast.info(`Loaded template: ${template.label}`);
                }}
                className="px-4 py-1.5 text-xs rounded-full border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}