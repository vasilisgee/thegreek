"use client";

import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiUploadCloud2Line } from "react-icons/ri";
import { Skeleton } from "@/components/ui/skeleton";

type ImageCardProps = {
  title: string;
  description?: string;
  value: string | null;           // public URL from DB
  file: File | null;              // local file (not uploaded yet)
  onFileChange: (file: File | null) => void;
  isLoading?: boolean;
  hideHeader?: boolean;
  size?: "default" | "compact";
  previewFit?: "contain" | "cover";
  heightClassName?: string;
  previewHeightClassName?: string;
};

export default function ImageCard({
  title,
  description,
  value,
  file,
  onFileChange,
  isLoading = false,
  hideHeader = false,
  size = "default",
  previewFit = "contain",
  heightClassName,
  previewHeightClassName,
}: ImageCardProps) {
  const inputId = useId();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);
  const imageHeightClassName = size === "compact" ? "h-32" : "h-60";
  const isCompact = size === "compact";
  const resolvedHeightClassName =
    previewHeightClassName ?? heightClassName ?? imageHeightClassName;

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    if (!value) {
      setPreviewUrl(null);
      return;
    }

    const baseUrl = value.startsWith("http")
      ? value
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-assets/${value}`;
    const separator = baseUrl.includes("?") ? "&" : "?";

    // Cache-buster to avoid stale CDN previews on reused filenames.
    setPreviewUrl(`${baseUrl}${separator}v=${Date.now()}`);
  }, [file, value]);

  useEffect(() => {
    if (previewUrl) {
      setIsPreviewLoaded(false);
    } else {
      setIsPreviewLoaded(true);
    }
  }, [previewUrl]);


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    onFileChange(selected);
  }

  function handleClear() {
    onFileChange(null);
  }

  return (
    <div className="space-y-1">
      {!hideHeader && (
        <>
          {isLoading ? (
            <>
              <Skeleton className="w-40 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
            </>
          ) : (
            <>
              <h4 className="text-sm font-medium inline-block mb-2">{title}</h4>
              {description && (
                <p className="text-xs text-muted-foreground pb-2">
                  {description}
                </p>
              )}
            </>
          )}
        </>
      )}

      <div
        className={`relative ${resolvedHeightClassName} rounded-lg flex items-center justify-center overflow-hidden`}
      >
        {previewUrl ? (
          <>
            {!isPreviewLoaded && (
              <div className="absolute inset-0 p-2">
                <Skeleton className="h-full w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
              </div>
            )}
            <img
              src={previewUrl}
              alt={title}
              className={
                isCompact
                  ? "absolute inset-0 h-full w-full object-cover"
                  : previewFit === "cover"
                    ? "absolute inset-0 h-full w-full object-cover"
                    : "absolute inset-0 h-full w-full object-contain p-2"
              }
              onLoad={() => setIsPreviewLoaded(true)}
              onError={() => setIsPreviewLoaded(true)}
              style={{ opacity: isPreviewLoaded ? 1 : 0 }}
            />

            {isCompact ? (
              <label
                htmlFor={inputId}
                className="absolute inset-0 cursor-pointer"
                aria-label="Replace image"
              />
            ) : (
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={handleClear}
                className="absolute top-2 w-7 h-7 right-2"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </>
        ) : (
          <label
            htmlFor={inputId}
            className={
              isCompact
                ? "flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-muted/40 text-xs font-semibold text-muted-foreground"
                : "flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-muted/40 text-xs font-semibold text-muted-foreground"
            }
          >
            <RiUploadCloud2Line className={isCompact ? "h-6 w-6" : "h-7 w-7"} />
            Upload image
          </label>
        )}
        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
