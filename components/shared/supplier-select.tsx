"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supplierApi } from "@/services/supplier.api";
import { queryKeys } from "@/constants/query-keys";
import { useDebounce } from "@/hooks/use-debounce";

interface SupplierSelectProps {
  value: string | null;
  onChange: (supplierId: string, supplierLabel: string) => void;
  disabled?: boolean;
}

export function SupplierSelect({ value, onChange, disabled }: SupplierSelectProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.suppliers({ search: debouncedSearch, pageSize: 20 }),
    queryFn: () => supplierApi.list({ search: debouncedSearch || undefined, pageSize: 20 }),
  });

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="supplier-search" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Supplier
      </label>
      <input
        id="supplier-search"
        type="text"
        placeholder="Search suppliers…"
        value={search}
        disabled={disabled}
        onChange={(event) => setSearch(event.target.value)}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
      />

      {isLoading && <p className="text-xs text-zinc-500">Loading suppliers…</p>}
      {isError && <p className="text-xs text-red-600">Unable to load suppliers.</p>}

      {data && data.items.length > 0 && (
        <ul className="max-h-48 overflow-y-auto rounded-md border border-zinc-200 dark:border-zinc-800">
          {data.items.map((supplier) => (
            <li key={supplier.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(supplier.id, supplier.name)}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                  value === supplier.id ? "bg-zinc-100 dark:bg-zinc-800" : ""
                }`}
              >
                <span>{supplier.name}</span>
                {supplier.email && <span className="text-xs text-zinc-400">{supplier.email}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      {data && data.items.length === 0 && (
        <p className="text-xs text-zinc-500">No suppliers match &quot;{search}&quot;.</p>
      )}
    </div>
  );
}
