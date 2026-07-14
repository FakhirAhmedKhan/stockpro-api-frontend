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

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
    ],
  },
  {
    label: "Inventory",
    items: [
      { label: "Stock", href: ROUTES.stock, icon: Boxes },
      { label: "Suppliers", href: ROUTES.suppliers, icon: Truck },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Customers", href: ROUTES.customers, icon: Users },
      { label: "Orders", href: ROUTES.orders, icon: ShoppingCart },
      { label: "Returns", href: ROUTES.returns, icon: Undo2 },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Repairs", href: ROUTES.repairs, icon: Wrench },
      { label: "Invoices", href: ROUTES.customerInvoices, icon: Receipt },
    ],
  },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="hidden w-64 shrink-0 flex-col border-r md:flex"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div
        className="flex h-14 items-center gap-2 px-5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <span
          className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold text-white"
          style={{ background: "var(--accent)" }}
        >
          S
        </span>
        <span
          className="text-sm font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          StockPro
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="flex flex-col gap-1">
            <span
              className="px-3 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-tertiary)" }}
            >
              {section.label}
            </span>
            {section.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  )}
                  style={
                    isActive ? { background: "var(--accent-soft)" } : undefined
                  }
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "var(--surface-2)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "";
                  }}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full"
                      style={{ background: "var(--accent)" }}
                      aria-hidden="true"
                    />
                  )}
                  <Icon
                    className="h-4 w-4"
                    aria-hidden="true"
                    style={{
                      color: isActive ? "var(--accent)" : "currentColor",
                    }}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
}
