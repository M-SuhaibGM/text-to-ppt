"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);

    const { error } = await signIn.email({ email, password });

    if (error) {
      toast.error(error.message || "Login failed. Please try again.");
      setEmailLoading(false);
    } else {
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn.social({ provider: "google" });

    } catch (err) {
      toast.error("Google login failed. Please try again.");
      setGoogleLoading(false);
    } finally {
      setGoogleLoading(false);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500/30 px-4">

      {/* Brand Logo Anchor */}
      <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-white mb-8 group">
        <Sparkles className="w-6 h-6 text-indigo-500 fill-indigo-500/20 group-hover:rotate-12 transition-transform" />
        <span>Slide<span className="text-indigo-400">Gen</span></span>
      </Link>

      <Card className="w-full max-w-md bg-slate-900 border-slate-800 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center sm:text-left">
          <CardTitle className="text-2xl font-black tracking-tight text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            Log in to access your presentation sandbox workspace
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleEmailSubmit}>
          <CardContent className="space-y-4">
            {/* Google Login Button Restyled */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-slate-950 border-slate-800 hover:bg-slate-900 text-slate-200 hover:text-white transition rounded-xl py-5"
              onClick={handleGoogleLogin}
              disabled={googleLoading || emailLoading}
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
              ) : (
                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              {googleLoading ? "Connecting to Google..." : "Continue with Google"}
            </Button>

            {/* Premium Divider Line */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-800/80" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-mono">
                <span className="bg-slate-900 px-3 text-slate-500">
                  Or continue with email
                </span>
              </div>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300 text-xs font-medium font-mono uppercase tracking-wider">
                  Password
                </Label>
              </div>
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
          </CardContent>
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
                  Authenticating profile...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Navigation Alternate */}
            <p className="text-sm text-slate-400 text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-indigo-400 hover:text-indigo-300 transition font-semibold underline-offset-4 hover:underline"
              >
                Register free
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}