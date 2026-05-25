"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setEmailLoading(true);

    const { error } = await signUp.email({ name, email, password });

    if (error) {
      toast.error(error.message || "Registration failed. Please try again.");
      setEmailLoading(false);
    } else {
      toast.success("Account created successfully! Redirecting...");
      router.push("/dashboard");
    }
  };



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500/30 px-4 py-12">
      
      {/* Brand Logo Anchor */}
      <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-white mb-8 group">
        <Sparkles className="w-6 h-6 text-indigo-500 fill-indigo-500/20 group-hover:rotate-12 transition-transform" />
        <span>Slide<span className="text-indigo-400">Gen</span></span>
      </Link>

      <Card className="w-full max-w-md bg-slate-900 border-slate-800 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center sm:text-left">
          <CardTitle className="text-2xl font-black tracking-tight text-white">
            Create Account
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            Sign up to get started building premium presentation decks for free
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleEmailSubmit}>
          <CardContent className="space-y-4">
  

            {/* Name Field */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-slate-300 text-xs font-medium font-mono uppercase tracking-wider">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={emailLoading || googleLoading}
                required
                className="bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-300 text-xs font-medium font-mono uppercase tracking-wider">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={emailLoading || googleLoading}
                required
                className="bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-300 text-xs font-medium font-mono uppercase tracking-wider">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={emailLoading || googleLoading}
                required
                className="bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-slate-300 text-xs font-medium font-mono uppercase tracking-wider">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={emailLoading || googleLoading}
                required
                className="bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl"
              />
            </div>
          </CardContent>

          {/* Integrated Premium Card Footer matching Login View */}
          <CardFooter className="flex flex-col gap-4 mt-2 bg-slate-900 border-t border-slate-800/40 pt-6 rounded-b-2xl">
            {/* Action CTA Button */}
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl py-5 shadow-xl shadow-indigo-600/20 transition active:scale-[0.98]"
              disabled={emailLoading || googleLoading}
            >
              {emailLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                  Creating account infrastructure...
                </>
              ) : (
                "Get Started Free"
              )}
            </Button>

            {/* Navigation Alternate */}
            <p className="text-sm text-slate-400 text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-400 hover:text-indigo-300 transition font-semibold underline-offset-4 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}