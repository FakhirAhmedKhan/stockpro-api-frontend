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
    <div className="table-wrap">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="table-head-row">
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
                if (event.key === "Enter")
                  router.push(ROUTES.customerDetail(customer.id));
              }}
              className="table-row-interactive"
            >
              <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                {customer.fullName}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {customer.email ?? "—"}
              </td>
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
