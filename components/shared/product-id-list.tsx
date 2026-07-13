"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface ProductIdListProps {
  value: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

/**
 * There is no `GET /api/Product` list endpoint on the backend
 * (frontend_specification.md §3.1), so this cannot be a searchable picker —
 * product UUIDs (from a barcode scanner feeding a UUID, or manual entry)
 * are added one at a time and validated by the backend on submit.
 */
export function ProductIdList({ value, onChange, disabled }: ProductIdListProps) {
  const [draft, setDraft] = useState("");

  function addId() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) {
      setDraft("");
      return;
    }
    onChange([...value, trimmed]);
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="product-id-input" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Product IDs
      </label>
      <p className="text-xs text-zinc-500">
        Add each product&apos;s ID (scanned or entered) one at a time. There is currently no product
        lookup endpoint, so IDs must be known in advance.
      </p>
      <div className="flex gap-2">
        <input
          id="product-id-input"
          type="text"
          value={draft}
          disabled={disabled}
          placeholder="Product UUID"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addId();
            }
          }}
          className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <button
          type="button"
          onClick={addId}
          disabled={disabled}
          className="flex items-center gap-1 rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add
        </button>
      </div>

      {value.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {value.map((id) => (
            <li
              key={id}
              className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-800"
            >
              <span className="truncate font-mono text-xs">{id}</span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(value.filter((existing) => existing !== id))}
                aria-label={`Remove product ${id}`}
                className="text-zinc-400 hover:text-red-600 disabled:opacity-50"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
