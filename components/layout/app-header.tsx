"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";

export function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <span className="text-sm font-semibold text-zinc-900 md:hidden dark:text-zinc-50">
        StockPro
      </span>
      <div className="ml-auto flex items-center gap-3">
        <Link
          href={ROUTES.profile}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          <User className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{user?.userName ?? "Profile"}</span>
        </Link>
        <button
          type="button"
          onClick={logout}
          aria-label="Log out"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
