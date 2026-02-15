"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ImageCard from "@/components/admin/ImageCard";
import { TbVideoPlus } from "react-icons/tb";

/* MUST match your bucket name */
const BUCKET = "site-assets";

/* Supabase public base */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

function toPublicUrl(path: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

type MediaCardProps = {
  title: string;
  description?: string;
  mode?: "all" | "video";
  imagePreviewFit?: "contain" | "cover";
  previewFit?: "contain" | "cover";
  previewHeightClassName?: string;

  /** DB values */
  imageValue: string | null;
  videoValue: string | null;

  /** Local files (not uploaded yet) */
  imageFile: File | null;
  videoFile: File | null;

  /** Callbacks to hook */
  onImageChange: (file: File | null) => void;
  onVideoChange: (file: File | null) => void;
};

export default function MediaCard({
  title,
  description,
  mode = "all",
  imagePreviewFit = "contain",
  previewFit = "contain",
  previewHeightClassName,
  imageValue,
  videoValue,
  imageFile,
  videoFile,
  onImageChange,
  onVideoChange,
}: MediaCardProps) {
  const isVideoOnly = mode === "video";
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const resolvedImageFit = imagePreviewFit ?? previewFit;
  const resolvedHeightClassName = previewHeightClassName ?? "h-60";

  /* ---------- sync preview ---------- */
  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoPreview(url);
      return () => URL.revokeObjectURL(url);
    }

    setVideoPreview(toPublicUrl(videoValue));
  }, [videoFile, videoValue]);

  function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    onVideoChange(file);
  }

  function clearVideo() {
    onVideoChange(null);
    setVideoPreview(null);
  }

  return (
    <div className="space-y-1">
      {/* Header */}
      <h4 className="text-sm font-medium inline-block mb-2">{title}</h4>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}

      {isVideoOnly ? (
        <div className={`relative ${resolvedHeightClassName} rounded-lg border border-dashed border-border bg-muted/40 flex items-center justify-center overflow-hidden`}>
          {videoPreview ? (
            <>
              <video
                src={videoPreview}
                controls
                className={`absolute inset-0 h-full w-full ${
                  previewFit === "cover" ? "object-cover" : "object-contain"
                }`}
              />

              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={clearVideo}
                className="absolute top-2 w-7 h-7 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <label className="flex flex-col items-center gap-1 cursor-pointer text-muted-foreground text-xs">
              <TbVideoPlus className="h-8 w-8" />
              Upload Video (MP4 / WEBM)
              <input
                type="file"
                accept="video/mp4,video/webm"
                onChange={handleVideoChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      ) : (
        <Tabs defaultValue="image">
          <TabsList>
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
          </TabsList>

          {/* IMAGE */}
          <TabsContent value="image">
            <ImageCard
              title=""
              value={toPublicUrl(imageValue)}
              file={imageFile}
              onFileChange={onImageChange}
              previewFit={resolvedImageFit}
              heightClassName={resolvedHeightClassName}
            />
          </TabsContent>

          {/* VIDEO */}
          <TabsContent value="video">
            <div className={`relative ${resolvedHeightClassName} rounded-lg border border-dashed border-border bg-muted/40 flex items-center justify-center overflow-hidden`}>
              {videoPreview ? (
                <>
                  <video
                    src={videoPreview}
                    controls
                    className={`absolute inset-0 h-full w-full ${
                      previewFit === "cover" ? "object-cover" : "object-contain"
                    }`}
                  />

                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={clearVideo}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <label className="flex flex-col items-center gap-1 cursor-pointer text-muted-foreground text-xs">
                  <TbVideoPlus className="h-8 w-8" />
                  Upload Video (MP4 / WEBM)
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
