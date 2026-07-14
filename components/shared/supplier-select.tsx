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

export function SupplierSelect({
  value,
  onChange,
  disabled,
}: SupplierSelectProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.suppliers({ search: debouncedSearch, pageSize: 20 }),
    queryFn: () =>
      supplierApi.list({ search: debouncedSearch || undefined, pageSize: 20 }),
  });

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="supplier-search" className="field-label">
        Supplier
      </label>
      <input
        id="supplier-search"
        type="text"
        placeholder="Search suppliers…"
        value={search}
        disabled={disabled}
        onChange={(event) => setSearch(event.target.value)}
        className="input-field"
      />

      {isLoading && <p className="field-hint">Loading suppliers…</p>}
      {isError && <p className="field-error">Unable to load suppliers.</p>}

      {data && data.items.length > 0 && (
        <ul className="surface-card max-h-48 overflow-y-auto">
          {data.items.map((supplier) => (
            <li key={supplier.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(supplier.id, supplier.name)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors"
                style={{
                  color: "var(--text-primary)",
                  background:
                    value === supplier.id
                      ? "var(--accent-soft)"
                      : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (value !== supplier.id)
                    e.currentTarget.style.background = "var(--surface-2)";
                }}
                onMouseLeave={(e) => {
                  if (value !== supplier.id)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <span>{supplier.name}</span>
                {supplier.email && (
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {supplier.email}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {data && data.items.length === 0 && (
        <p className="field-hint">No suppliers match &quot;{search}&quot;.</p>
      )}
    </div>
  );
}
