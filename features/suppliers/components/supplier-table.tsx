"use client";

import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/formatters";
import { ROUTES } from "@/constants/routes";
import type { SupplierResponseDto } from "@/types/supplier.types";

interface SupplierTableProps {
  suppliers: SupplierResponseDto[];
}

export function SupplierTable({ suppliers }: SupplierTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
            <th scope="col" className="px-4 py-3 font-medium">
              Name
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Email
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Phone
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Created
            </th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr
              key={supplier.id}
              tabIndex={0}
              onClick={() => router.push(ROUTES.supplierDetail(supplier.id))}
              onKeyDown={(event) => {
                if (event.key === "Enter") router.push(ROUTES.supplierDetail(supplier.id));
              }}
              className="cursor-pointer border-b border-zinc-100 last:border-0 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-400 dark:border-zinc-900 dark:hover:bg-zinc-900"
            >
              <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{supplier.name}</td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{supplier.email ?? "—"}</td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {supplier.phoneNumber ?? "—"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge
                  label={supplier.activeStatus ? "Active" : "Inactive"}
                  tone={supplier.activeStatus ? "success" : "neutral"}
                />
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {formatDate(supplier.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
