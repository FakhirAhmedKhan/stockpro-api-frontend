"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { customerApi } from "@/services/customer.api";
import { queryKeys } from "@/constants/query-keys";
import { useDebounce } from "@/hooks/use-debounce";

interface CustomerSelectProps {
  value: string | null;
  onChange: (customerId: string, customerLabel: string) => void;
  disabled?: boolean;
}

export function CustomerSelect({ value, onChange, disabled }: CustomerSelectProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.customers({ search: debouncedSearch, pageSize: 20 }),
    queryFn: () => customerApi.list({ search: debouncedSearch || undefined, pageSize: 20 }),
  });

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="customer-search" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Customer
      </label>
      <input
        id="customer-search"
        type="text"
        placeholder="Search customers…"
        value={search}
        disabled={disabled}
        onChange={(event) => setSearch(event.target.value)}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
      />

      {isLoading && <p className="text-xs text-zinc-500">Loading customers…</p>}
      {isError && <p className="text-xs text-red-600">Unable to load customers.</p>}

      {data && data.items.length > 0 && (
        <ul className="max-h-48 overflow-y-auto rounded-md border border-zinc-200 dark:border-zinc-800">
          {data.items.map((customer) => (
            <li key={customer.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(customer.id, customer.fullName)}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                  value === customer.id ? "bg-zinc-100 dark:bg-zinc-800" : ""
                }`}
              >
                <span>{customer.fullName}</span>
                {customer.email && <span className="text-xs text-zinc-400">{customer.email}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      {data && data.items.length === 0 && (
        <p className="text-xs text-zinc-500">No customers match &quot;{search}&quot;.</p>
      )}
    </div>
  );
}
