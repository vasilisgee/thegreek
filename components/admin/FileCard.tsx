"use client";

import { X, FileText, Image as ImageIcon } from "lucide-react";
import { TbFileUpload } from "react-icons/tb";
import { Button } from "@/components/ui/button";

type FileCardProps = {
  title: string;
  description?: string;

  /** DB value (public URL) */
  value: string | null;

  /** Local file (not uploaded yet) */
  file: File | null;

  /** Hook callback */
  onFileChange: (file: File | null) => void;

  /** Display */
  hideHeader?: boolean;

  /** Optional input config */
  accept?: string;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  uploadLabel?: string;
  invalidMessage?: string;
};

export default function FileCard({
  title,
  description,
  value,
  file,
  onFileChange,
  hideHeader = false,
  accept = "application/pdf",
  allowedMimeTypes = ["application/pdf"],
  allowedExtensions = [".pdf"],
  uploadLabel = "Upload PDF",
  invalidMessage = "Only PDF files are allowed.",
}: FileCardProps) {
  const fileName = file?.name ?? value?.split("/").pop() ?? null;
  const isImageFile = !!file && (
    file.type.startsWith("image/") ||
    /\.(png|jpe?g|svg|webp|gif|avif)$/i.test(file.name)
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;

    if (selected) {
      const isAllowedByMime =
        allowedMimeTypes.length === 0 ||
        (selected.type && allowedMimeTypes.includes(selected.type));
      const lowerName = selected.name.toLowerCase();
      const isAllowedByExt =
        allowedExtensions.length === 0 ||
        allowedExtensions.some((ext) => lowerName.endsWith(ext));

      if (!isAllowedByMime && !isAllowedByExt) {
        alert(invalidMessage);
        return;
      }
    }

    onFileChange(selected);
  }

  function clearFile() {
    onFileChange(null);
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      {!hideHeader && (
        <div>
          <h4 className="text-sm font-medium">{title}</h4>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Upload / Preview */}
      <div className="relative rounded-lg border border-dashed border-border min-h-[85px] bg-muted/40 p-4 flex items-center justify-center">
        {fileName ? (
          <div className="flex items-center gap-3 w-full">
            {isImageFile ? (
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            ) : (
              <FileText className="h-6 w-6 text-muted-foreground" />
            )}

            <span className="text-sm truncate flex-1">
              {fileName}
            </span>

            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label className="flex items-center gap-1 cursor-pointer text-muted-foreground text-xs">
            <TbFileUpload className="h-7 w-7" />
            {uploadLabel}
            <input
              type="file"
              accept={accept}
              onChange={handleChange}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
}
