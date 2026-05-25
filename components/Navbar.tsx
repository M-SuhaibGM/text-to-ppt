"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, LogOut, LayoutDashboard, Loader2, User } from "lucide-react";

export default function Navbar() {
  const { data: session, isPending } = useSession();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-900 bg-slate-950/70 backdrop-blur-md px-6 py-3.5 flex items-center justify-between text-slate-100">
      
      {/* Brand Logo Anchor */}
      <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white group">
        <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-500/20 group-hover:rotate-12 transition-transform" />
        <span>Slide<span className="text-indigo-400">Gen</span></span>
      </Link>

      {/* Auth Conditional Action Segment */}
      <div className="flex items-center gap-4">
        {isPending ? (
          <div className="flex items-center justify-center w-9 h-9 bg-slate-900 border border-slate-800 rounded-full animate-pulse">
            <Loader2 className="w-4 h-4 text-slate-600 animate-spin" />
          </div>
        ) : session ? (
          <div className="flex items-center gap-4">
            {/* Dashboard Redirect Action Link */}
            <Link href="/dashboard" className="hidden sm:inline-block">
              <Button 
                variant="default" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl px-4 py-2 transition flex items-center gap-2 text-sm shadow-lg shadow-indigo-600/10"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
            </Link>

            {/* Profile Dropdown Menu Trigger */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative flex items-center justify-center w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition outline-none ring-offset-slate-950 focus-visible:ring-2 focus-visible:ring-indigo-500">
                  {session.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || "User avatar"} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-slate-900 border-slate-800 text-slate-200 rounded-xl p-1.5 shadow-xl animate-in fade-in-50 slide-in-from-top-1"
              >
                {/* User Context Metadata */}
                <DropdownMenuLabel className="px-2.5 py-2 flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-white tracking-tight truncate">
                    {session.user?.name || "Account Profile"}
                  </span>
                  <span className="text-xs font-normal text-slate-400 font-mono truncate">
                    {session.user?.email}
                  </span>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator className="bg-slate-800/60 my-1" />

                {/* Mobile-only Dashboard Link */}
                <DropdownMenuItem asChild className="sm:hidden">
                  <Link 
                    href="/dashboard"
                    className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                
                {/* Session Expulsion Trigger */}
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-lg text-rose-400 focus:text-rose-300 hover:bg-rose-500/10 focus:bg-rose-500/10 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          /* Unauthenticated User Entry Gate */
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button 
                variant="outline" 
                className="bg-transparent border-slate-800 hover:bg-slate-900 text-slate-200 hover:text-white transition rounded-xl px-4 py-2 text-sm"
              >
                Sign In
              </Button>
            </Link>
            
            <Link href="/register" className="hidden sm:inline-block">
              <Button 
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl px-4 py-2 text-sm transition shadow-lg shadow-indigo-600/10"
              >
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}