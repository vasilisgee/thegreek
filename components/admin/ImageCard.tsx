"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TbPhotoPlus } from "react-icons/tb";
import { Skeleton } from "@/components/ui/skeleton";

type ImageCardProps = {
  title: string;
  description?: string;
  value: string | null;           // public URL from DB
  file: File | null;              // local file (not uploaded yet)
  onFileChange: (file: File | null) => void;
  isLoading?: boolean;
};

export default function ImageCard({
  title,
  description,
  value,
  file,
  onFileChange,
  isLoading = false,
}: ImageCardProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);

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
      {isLoading ? (
        <>
          <Skeleton className="w-40 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
        </>
      ) : (
        <>
          <h4 className="text-sm font-medium">{title}</h4>
          {description && (
            <p className="text-xs text-muted-foreground pb-2">
              {description}
            </p>
          )}
        </>
      )}

      <div className="relative h-60 rounded-lg border border-dashed border-border bg-muted/40 flex items-center justify-center overflow-hidden">
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
              className="absolute inset-0 w-full h-full object-contain p-2"
              onLoad={() => setIsPreviewLoaded(true)}
              onError={() => setIsPreviewLoaded(true)}
              style={{ opacity: isPreviewLoaded ? 1 : 0 }}
            />

            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={handleClear}
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <label className="flex flex-col items-center gap-2 cursor-pointer text-muted-foreground text-xs">
            <TbPhotoPlus className="h-7 w-7" />
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
}
