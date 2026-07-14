"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { StockTable } from "@/features/stock/components/stock-table";
import { useStocks } from "@/features/stock/hooks/use-stock";
import { ROUTES } from "@/constants/routes";

export default function StockPage() {
  const { data: stocks = [] } = useStocks();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Stock"
        description="Stock batches created in this session. Each batch generates Product units automatically."
        actions={
          <Link href={ROUTES.stockNew} className="btn-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New stock batch
          </Link>
        }
      />

      {stocks.length === 0 ? (
        <EmptyState
          title="No stock batches yet"
          description="Create a stock batch to generate Product units, a Supplier invoice, and a Ledger entry."
          action={
            <Link href={ROUTES.stockNew} className="inline-btn-primary">
              <Plus className="h-4 w-4" aria-hidden="true" />
              New stock batch
            </Link>
          }
        />
      ) : (
        <StockTable stocks={stocks} />
      )}
    </div>
  );
}
