"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type { ApiError } from "@/types/api.types";

interface PdfDownloadButtonProps {
  /** API path relative to the base URL, e.g. `/Invoice/customer/{id}`. */
  path: string;
  fallbackFilename: string;
  label?: string;
}

function extractFilename(
  contentDisposition: string | undefined,
  fallback: string,
): string {
  if (!contentDisposition) return fallback;
  const match = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(
    contentDisposition,
  );
  return match?.[1] ? decodeURIComponent(match[1]) : fallback;
}

export function PdfDownloadButton({
  path,
  fallbackFilename,
  label = "Download PDF",
}: PdfDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    if (isDownloading) return;
    setIsDownloading(true);
    let objectUrl: string | null = null;
    try {
      const response = await apiClient.get(path, { responseType: "blob" });
      const filename = extractFilename(
        response.headers["content-disposition"],
        fallbackFilename,
      );
      objectUrl = URL.createObjectURL(response.data as Blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 401) {
        toast.error("Your session has expired. Please sign in again.");
      } else if (apiError.status === 403) {
        toast.error("You don't have permission to download this invoice.");
      } else if (apiError.status === 404) {
        toast.error("This invoice PDF was not found.");
      } else {
        toast.error("Unable to generate the PDF. Please try again.");
      }
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setIsDownloading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDownloading}
      className="btn-secondary"
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="h-4 w-4" aria-hidden="true" />
      )}
      {isDownloading ? "Downloading…" : label}
    </button>
  );
}
