"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Truck,
  Boxes,
  ShoppingCart,
  Undo2,
  Wrench,
  Receipt,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Customers", href: ROUTES.customers, icon: Users },
  { label: "Suppliers", href: ROUTES.suppliers, icon: Truck },
  { label: "Stock", href: ROUTES.stock, icon: Boxes },
  { label: "Orders", href: ROUTES.orders, icon: ShoppingCart },
  { label: "Returns", href: ROUTES.returns, icon: Undo2 },
  { label: "Repairs", href: ROUTES.repairs, icon: Wrench },
  { label: "Invoices", href: ROUTES.customerInvoices, icon: Receipt },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="hidden w-60 shrink-0 flex-col gap-1 border-r border-zinc-200 bg-white p-4 md:flex dark:border-zinc-800 dark:bg-zinc-950"
    >
      <span className="mb-4 px-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        StockPro
      </span>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
