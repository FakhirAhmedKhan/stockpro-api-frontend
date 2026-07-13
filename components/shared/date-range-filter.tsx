"use client";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onChange: (range: { startDate: string; endDate: string }) => void;
}

export function DateRangeFilter({ startDate, endDate, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="startDate" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          From
        </label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          max={endDate || undefined}
          onChange={(event) => onChange({ startDate: event.target.value, endDate })}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="endDate" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          To
        </label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          min={startDate || undefined}
          onChange={(event) => onChange({ startDate, endDate: event.target.value })}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
    </div>
  );
}
