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

export function CustomerSelect({
  value,
  onChange,
  disabled,
}: CustomerSelectProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.customers({ search: debouncedSearch, pageSize: 20 }),
    queryFn: () =>
      customerApi.list({ search: debouncedSearch || undefined, pageSize: 20 }),
  });

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="customer-search" className="field-label">
        Customer
      </label>
      <input
        id="customer-search"
        type="text"
        placeholder="Search customers…"
        value={search}
        disabled={disabled}
        onChange={(event) => setSearch(event.target.value)}
        className="input-field"
      />

      {isLoading && <p className="field-hint">Loading customers…</p>}
      {isError && <p className="field-error">Unable to load customers.</p>}

      {data && data.items.length > 0 && (
        <ul className="surface-card max-h-48 overflow-y-auto">
          {data.items.map((customer) => (
            <li key={customer.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(customer.id, customer.fullName)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors"
                style={{
                  color: "var(--text-primary)",
                  background:
                    value === customer.id
                      ? "var(--accent-soft)"
                      : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (value !== customer.id)
                    e.currentTarget.style.background = "var(--surface-2)";
                }}
                onMouseLeave={(e) => {
                  if (value !== customer.id)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <span>{customer.fullName}</span>
                {customer.email && (
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {customer.email}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {data && data.items.length === 0 && (
        <p className="field-hint">No customers match &quot;{search}&quot;.</p>
      )}
    </div>
  );
}
