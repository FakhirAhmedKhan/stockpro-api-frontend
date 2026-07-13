"use client";

import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/formatters";
import { ROUTES } from "@/constants/routes";
import type { CustomerResponseDto } from "@/types/customer.types";

interface CustomerTableProps {
  customers: CustomerResponseDto[];
}

export function CustomerTable({ customers }: CustomerTableProps) {
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
          {customers.map((customer) => (
            <tr
              key={customer.id}
              tabIndex={0}
              onClick={() => router.push(ROUTES.customerDetail(customer.id))}
              onKeyDown={(event) => {
                if (event.key === "Enter") router.push(ROUTES.customerDetail(customer.id));
              }}
              className="cursor-pointer border-b border-zinc-100 last:border-0 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-400 dark:border-zinc-900 dark:hover:bg-zinc-900"
            >
              <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                {customer.fullName}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{customer.email ?? "—"}</td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {customer.phoneNumber ?? "—"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge
                  label={customer.activeStatus ? "Active" : "Inactive"}
                  tone={customer.activeStatus ? "success" : "neutral"}
                />
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {formatDate(customer.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
