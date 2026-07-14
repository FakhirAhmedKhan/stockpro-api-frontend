"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { LoadingState } from "@/components/feedback/loading-state";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { CustomerTable } from "@/features/customers/components/customer-table";
import { useCustomers } from "@/features/customers/hooks/use-customers";
import { useDebounce } from "@/hooks/use-debounce";
import { ROUTES } from "@/constants/routes";
import type { ApiError } from "@/types/api.types";

const PAGE_SIZE = 20;

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, error, refetch } = useCustomers({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Customers"
        description="Manage your customer directory."
        actions={
          <Link href={ROUTES.customerNew} className="btn-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New customer
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
        aria-label="Search customers"
        className="max-w-sm"
      />

      {isLoading ? (
        <LoadingState label="Loading customers…" />
      ) : isError ? (
        <ErrorState
          description={(error as unknown as ApiError).message}
          onRetry={() => refetch()}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title="No customers found"
          description={
            debouncedSearch
              ? "Try a different search term."
              : "Create your first customer to get started."
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          <CustomerTable customers={data.items} />
          <Pagination pagination={data.pagination} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
