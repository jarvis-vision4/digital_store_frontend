"use client";

import { useState, useRef } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { resolveImageUrl, errorMessage } from "@/lib/utils";

interface ImageUploadProps {
  value: string | File | null;
  onChange: (file: File | null) => void;
  /** If provided, uploads immediately on file select instead of returning File */
  onUpload?: (file: File) => Promise<string>;
  /** URL to display as preview (for edit mode) */
  previewUrl?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, onUpload, previewUrl, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayPreview = value instanceof File
    ? URL.createObjectURL(value)
    : previewUrl
      ? resolveImageUrl(previewUrl)
      : typeof value === "string"
        ? resolveImageUrl(value)
        : "";

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (onUpload) {
      setIsUploading(true);
      try {
        const url = await onUpload(file);
        onChange(url as unknown as File);
        toast.success("Image uploaded");
      } catch (err) {
        toast.error(errorMessage(err));
      } finally {
        setIsUploading(false);
      }
    } else {
      onChange(file);
    }
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
        >
          {isUploading ? <ImageIcon className="h-4 w-4 animate-pulse" /> : <Upload className="h-4 w-4" />}
          {isUploading ? "Uploading..." : "Upload Image"}
        </button>
        {displayPreview && (
          <img src={displayPreview} alt="" className="h-10 w-10 rounded-md object-cover" />
        )}
      </div>
    </div>
  );
}
