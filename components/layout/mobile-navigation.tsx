"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Boxes, ShoppingCart, Menu } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Customers", href: ROUTES.customers, icon: Users },
  { label: "Stock", href: ROUTES.stock, icon: Boxes },
  { label: "Orders", href: ROUTES.orders, icon: ShoppingCart },
  { label: "More", href: ROUTES.customerInvoices, icon: Menu },
] as const;

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-zinc-200 bg-white md:hidden dark:border-zinc-800 dark:bg-zinc-950"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium",
              isActive ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-500",
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
