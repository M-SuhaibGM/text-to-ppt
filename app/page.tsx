'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, FileText, Layout, Download, Presentation } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
}

export default function LandingPage() {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  // Auto-animate slide previews to make the page feel alive and functional
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev === 2 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features: Feature[] = [
    {
      icon: <FileText className="w-6 h-6 text-indigo-500" />,
      title: "Smart Text Distillation",
      description: "Our AI breaks down heavy walls of text into punchy, high-impact bullet points perfect for presentation layouts."
    },
    {
      icon: <Layout className="w-6 h-6 text-indigo-500" />,
      title: "Native PPTX Exports",
      description: "No locked formats. Download a 100% editable PowerPoint file compatible with MS Office and Google Slides."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
      title: "Contextual Styling",
      description: "AI reads your topic tone and instantly matches color palettes, typography, and iconography seamlessly."
    }
  ];

  const steps: Step[] = [
    { number: "01", title: "Paste Content", description: "Drop in your raw notes, articles, or brief scripts inside the app dashboard." },
    { number: "02", title: "Choose Vibe", description: "Select from corporate, startup pitch, or modern minimal styling presets." },
    { number: "03", title: "Download PPTX", description: "Grab your fully editable presentation file in seconds." }
  ];

  // Dummy data representing how your dashboard renders slides dynamically
  const demoSlides = [
    {
      title: "01. Executive Summary",
      bullets: ["AI Automation reduces standard presentation iteration time by up to 80%.", "Seamless native integrations maintain absolute design fluidity."]
    },
    {
      title: "02. Core Architecture",
      bullets: ["Robust data parsing built natively on Next.js, Prisma, and safe MySQL protocols.", "Decoupled AI engine processes text structural trees rapidly."]
    },
    {
      title: "03. Market Traction",
      bullets: ["Scaling modern design workflows across fast-moving product teams.", "Zero presentation design learning curve required."]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500/30">
      
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center lg:text-left lg:grid lg:grid-cols-12 lg:gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-950/50 border border-indigo-800/50 px-3 py-1 rounded-full text-xs font-medium text-indigo-300 mx-auto lg:mx-0">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Integrated with Better Auth & Prisma Core
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
            Paste Your Text.<br />
            <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Get Beautiful Slides.
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0">
            Stop fighting with layout tools and text wrapping. Drop your raw notes into our generator and export pristine, editable PowerPoint decks instantly.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <a href="/register" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition shadow-xl shadow-indigo-600/30 group">
              Start Generating Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Dynamic Visual App Preview (Replaced the Interactive Textarea) */}
        <div className="lg:col-span-7 mt-12 lg:mt-0">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl relative overflow-hidden backdrop-blur-sm">
            
            {/* Mock Window Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-800"></span>
                <span className="w-3 h-3 rounded-full bg-slate-800"></span>
                <span className="w-3 h-3 rounded-full bg-slate-800"></span>
                <span className="text-xs font-mono text-slate-500 ml-2">app.slidegen.ai/dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-900/50">AI Engine: Active</span>
              </div>
            </div>

            {/* Split Screen Application Mock View */}
            <div className="grid grid-cols-12 gap-4 h-64">
              
              {/* Left Side: Mock Text Stream Component */}
              <div className="col-span-4 bg-slate-950 rounded-xl p-3 border border-slate-800/60 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500 mb-2 font-bold flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Input Source
                  </div>
                  <div className="space-y-2 opacity-60">
                    <div className="h-2 w-full bg-slate-800 rounded"></div>
                    <div className="h-2 w-5/6 bg-slate-800 rounded"></div>
                    <div className="h-2 w-4/5 bg-slate-800 rounded"></div>
                    <div className="h-2 w-full bg-slate-800 rounded"></div>
                  </div>
                </div>
                <div className="text-[11px] font-mono p-2 bg-slate-900 text-slate-400 rounded-lg text-center border border-slate-800">
                  Parsing markdown...
                </div>
              </div>

              {/* Right Side: Active Presentation Slide Render Output */}
              <div className="col-span-8 bg-linear-to-br from-indigo-950/40 via-slate-950 to-slate-950 rounded-xl p-4 border border-indigo-500/20 flex flex-col justify-between transition-all duration-500">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <div className="flex items-center gap-1 text-indigo-400"><Presentation className="w-3 h-3" /> Canvas Render</div>
                  <div>Slide {activeSlideIndex + 1} of 3</div>
                </div>

                {/* Animated Slide Content Switcher */}
                <div className="my-auto space-y-3 transition-all duration-300">
                  <h4 className="text-base font-bold text-white tracking-tight">
                    {demoSlides[activeSlideIndex].title}
                  </h4>
                  <ul className="space-y-2">
                    {demoSlides[activeSlideIndex].bullets.map((bullet, idx) => (
                      <li key={idx} className="text-xs text-slate-400 flex items-start gap-2 leading-relaxed">
                        <span className="text-indigo-400 mt-1 block">▪</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Micro Quick Slide Switcher dots */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <div className="flex gap-1.5">
                    {demoSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlideIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${activeSlideIndex === idx ? 'w-4 bg-indigo-500' : 'w-1.5 bg-slate-800'}`}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                    Editable PPTX <Download className="w-2.5 h-2.5" />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Process Sequence Area */}
      <section className="bg-slate-900/40 border-y border-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white">Zero design hassle. Done in seconds.</h2>
            <p className="text-slate-400 mt-2">Sign in, paste your thoughts, and walk away with production-ready presentation decks.</p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="bg-slate-900/60 border border-slate-800/60 p-6 rounded-2xl relative">
                <span className="absolute top-4 right-4 text-3xl font-mono font-black text-slate-800">{step.number}</span>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Core Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-slate-900 bg-linear-to-b from-slate-900 to-slate-950 hover:border-slate-800 transition">
              <div className="mb-4 p-2 w-fit bg-slate-950 rounded-xl border border-slate-800">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer / Final CTA */}
      <footer className="border-t border-slate-900 bg-slate-950 text-center py-12">
        <div className="max-w-xl mx-auto px-4 space-y-4">
          <h3 className="text-2xl font-bold text-white">Ready to automate your presentation building?</h3>
          <p className="text-sm text-slate-500">Sign up securely with Better Auth. Save hours of manual layout iterations instantly.</p>
          <div className="pt-2">
            <a href="/register" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition">
              Create Your Account
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}