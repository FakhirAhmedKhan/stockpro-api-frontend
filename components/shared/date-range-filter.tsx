"use client";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onChange: (range: { startDate: string; endDate: string }) => void;
}

export function DateRangeFilter({
  startDate,
  endDate,
  onChange,
}: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="startDate" className="field-label">
          From
        </label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          max={endDate || undefined}
          onChange={(event) =>
            onChange({ startDate: event.target.value, endDate })
          }
          className="input-field"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="endDate" className="field-label">
          To
        </label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          min={startDate || undefined}
          onChange={(event) =>
            onChange({ startDate, endDate: event.target.value })
          }
          className="input-field"
        />
      </div>
    </div>
  );
}
