"use client";

import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/feedback/loading-state";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Profile" description="Your account details." />

      {isLoading || !user ? (
        <LoadingState label="Loading profile…" />
      ) : (
        <dl className="grid max-w-md grid-cols-1 gap-4 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Username</dt>
            <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">{user.userName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Email</dt>
            <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Role</dt>
            <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">{user.authority.join(", ")}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Phone</dt>
            <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">{user.phone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Currency</dt>
            <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">{user.curency ?? "—"}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
