"use client";

import { useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { ROUTES } from "@/constants/routes";
import type { StockResponseDto } from "@/types/stock.types";

interface StockTableProps {
  stocks: StockResponseDto[];
}

export function StockTable({ stocks }: StockTableProps) {
  const router = useRouter();

  return (
    <div className="table-wrap">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="table-head-row">
            <th scope="col" className="px-4 py-3 font-medium">
              Title
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Available / Total
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Unit price
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Stock price
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Created
            </th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr
              key={stock.id}
              tabIndex={0}
              onClick={() => router.push(ROUTES.stockDetail(stock.id))}
              onKeyDown={(event) => {
                if (event.key === "Enter")
                  router.push(ROUTES.stockDetail(stock.id));
              }}
              className="table-row-interactive"
            >
              <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                {stock.title}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {stock.quantityAvailable} / {stock.totalQuantity}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {formatCurrency(stock.unitPrice)}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {formatCurrency(stock.stockPrice)}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {formatDate(stock.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
