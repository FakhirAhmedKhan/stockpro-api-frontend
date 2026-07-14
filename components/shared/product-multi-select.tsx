"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { productApi } from "@/services/product.api";
import { queryKeys } from "@/constants/query-keys";
import { useDebounce } from "@/hooks/use-debounce";
import { formatCurrency } from "@/lib/formatters";
import type { ProductResponseDto, ProductStatus } from "@/types/product.types";

interface ProductMultiSelectProps {
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  /** Restrict search/selection to one Stock batch (e.g. editing an existing order). */
  lockedStockId?: string;
  /** Fired once, when the first pick locks the picker to that product's Stock batch. */
  onStockLock?: (stockId: string) => void;
  /** Which Product statuses are eligible to appear/be picked. Defaults to `["Available"]`. */
  statuses?: ProductStatus[];
  disabled?: boolean;
}

/**
 * Searchable multi-select backed by `GET /api/Product`. An order can only
 * contain Products from a single Stock batch, so once the caller doesn't
 * pin `lockedStockId`, the first pick locks subsequent search results to
 * that product's stock automatically.
 */
export function ProductMultiSelect({
  selectedIds,
  onSelectedIdsChange,
  lockedStockId,
  onStockLock,
  statuses = ["Available"],
  disabled,
}: ProductMultiSelectProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [internalStockId, setInternalStockId] = useState<string | null>(null);
  const knownProducts = useRef(new Map<string, ProductResponseDto>());
  const [, forceRender] = useState(0);

  const effectiveStockId = lockedStockId ?? internalStockId ?? undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.products({
      search: debouncedSearch,
      stockId: effectiveStockId,
      statuses,
    }),
    queryFn: () =>
      productApi.list({
        search: debouncedSearch || undefined,
        stockId: effectiveStockId,
        statuses,
        pageSize: 20,
      }),
  });

  // Preload every product for a locked stock once, so pre-selected IDs
  // (e.g. an existing order being edited) can render a name/barcode chip
  // even before the user searches.
  const preloadQuery = useQuery({
    queryKey: queryKeys.products({ stockId: lockedStockId, preload: true }),
    queryFn: () => productApi.list({ stockId: lockedStockId, pageSize: 100 }),
    enabled: Boolean(lockedStockId),
  });

  useEffect(() => {
    for (const product of data?.items ?? [])
      knownProducts.current.set(product.id, product);
    for (const product of preloadQuery.data?.items ?? [])
      knownProducts.current.set(product.id, product);
    forceRender((n) => n + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, preloadQuery.data]);

  function selectProduct(product: ProductResponseDto) {
    if (selectedIds.includes(product.id)) return;
    knownProducts.current.set(product.id, product);
    onSelectedIdsChange([...selectedIds, product.id]);
    if (!lockedStockId && !internalStockId) {
      setInternalStockId(product.stockId);
      onStockLock?.(product.stockId);
    }
  }

  function removeProduct(id: string) {
    onSelectedIdsChange(selectedIds.filter((existing) => existing !== id));
  }

  const results = (data?.items ?? []).filter(
    (product) => !selectedIds.includes(product.id),
  );

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="product-search" className="field-label">
        Products
      </label>

      {selectedIds.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {selectedIds.map((id) => {
            const product = knownProducts.current.get(id);
            return (
              <li
                key={id}
                className="flex items-center justify-between rounded-lg border px-3 py-1.5 text-sm"
                style={{ borderColor: "var(--border)" }}
              >
                <span style={{ color: "var(--text-primary)" }}>
                  {product ? (
                    <>
                      {product.name}{" "}
                      <span
                        className="font-mono text-xs"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {product.barcode}
                      </span>{" "}
                      <span style={{ color: "var(--text-secondary)" }}>
                        · {formatCurrency(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="font-mono text-xs">{id}</span>
                  )}
                </span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeProduct(id)}
                  aria-label="Remove product"
                  className="disabled:opacity-50"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <input
        id="product-search"
        type="text"
        placeholder={
          effectiveStockId
            ? "Search this stock batch's products…"
            : "Search products by name or barcode…"
        }
        value={search}
        disabled={disabled}
        onChange={(event) => setSearch(event.target.value)}
        className="input-field"
      />

      {!effectiveStockId && (
        <p className="field-hint">
          Selecting a product locks the order to its stock batch.
        </p>
      )}
      {isLoading && <p className="field-hint">Searching…</p>}
      {isError && <p className="field-error">Unable to load products.</p>}

      {results.length > 0 && (
        <ul className="surface-card max-h-56 overflow-y-auto">
          {results.map((product) => (
            <li key={product.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => selectProduct(product)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors disabled:opacity-50"
                style={{ color: "var(--text-primary)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--surface-2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span>
                  {product.name}{" "}
                  <span
                    className="font-mono text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {product.barcode}
                  </span>
                </span>
                <span style={{ color: "var(--text-secondary)" }}>
                  {formatCurrency(product.price)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {data && results.length === 0 && !isLoading && (
        <p className="field-hint">
          {search
            ? `No available products match "${search}".`
            : "No available products found."}
        </p>
      )}
    </div>
  );
}
