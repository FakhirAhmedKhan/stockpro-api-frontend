"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { TableSkeleton } from "@/components/feedback/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { SupplierTable } from "@/features/suppliers/components/supplier-table";
import { useSuppliers } from "@/features/suppliers/hooks/use-suppliers";
import { useDebounce } from "@/hooks/use-debounce";
import { ROUTES } from "@/constants/routes";
import type { ApiError } from "@/types/api.types";

const PAGE_SIZE = 20;

export default function SuppliersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, error, refetch } = useSuppliers({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Suppliers"
        description="Manage your supplier directory."
        actions={
          <Link href={ROUTES.supplierNew} className="btn-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New supplier
          </Link>
        }
      />

      <SearchInput
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Search by name, email, or phone…"
        aria-label="Search suppliers"
        className="max-w-sm"
      />

      {isLoading ? (
        <TableSkeleton columns={5} />
      ) : isError ? (
        <ErrorState
          description={(error as unknown as ApiError).message}
          onRetry={() => refetch()}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title="No suppliers found"
          description={
            debouncedSearch
              ? "Try a different search term."
              : "Create your first supplier to get started."
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          <SupplierTable suppliers={data.items} />
          <Pagination pagination={data.pagination} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
