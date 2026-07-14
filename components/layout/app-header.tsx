"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";

export function AppHeader() {
  const { user, logout } = useAuth();
  const initial = (user?.userName ?? "?").charAt(0).toUpperCase();

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 backdrop-blur-sm md:px-6"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "color-mix(in srgb, var(--bg) 85%, transparent)",
      }}
    >
      <div className="flex items-center gap-2 md:hidden">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold text-white"
          style={{ background: "var(--accent)" }}
        >
          S
        </span>
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          StockPro
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link
          href={ROUTES.profile}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            {initial}
          </span>
          <span
            className="hidden sm:inline"
            style={{ color: "var(--text-primary)" }}
          >
            {user?.userName ?? "Profile"}
          </span>
        </Link>
        <button
          type="button"
          onClick={logout}
          aria-label="Log out"
          className="btn-ghost btn-sm"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
