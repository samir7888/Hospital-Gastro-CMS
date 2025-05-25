"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import useAxiosAuth from "@/hooks/useAuth";
import type { ImageResponse } from "@/schema/global.schema";

interface FileUploadProps {
  maxSize?: number;
  className?: string;
  name: string;
  maxCount?: number;
  currentImage?: TImagePreview;
}

type TImagePreview = ImageResponse | ImageResponse[] | null;
export function FileUpload({
  name,
  currentImage,
  maxSize = 5242880, // 5MB
  className,
  maxCount = 1,
}: FileUploadProps) {
  const form = useFormContext();
  const axios = useAxiosAuth();

  const [preview, setPreview] = useState<TImagePreview>(currentImage || null);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      const formData = new FormData();

      for (const file of acceptedFiles) {
        formData.append("images", file);
      }
      const res = await axios.post("/upload/images", formData);

      if (res.status === 201) {
        const images = res.data.files;
        if (maxCount > 1) {
          form.setValue(
            name,
            images?.map((file: any) => file.id)
          );
          setPreview((prev) => {
            return Array.isArray(prev) ? [...prev, ...images] : images;
          });
        } else {
          form.setValue(name, images[0]?.id);
          setPreview(images[0]);
        }
      }

      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles[0].errors;
        if (errors.some((e: any) => e.code === "file-too-large")) {
          form.setError(name, {
            message: `File is too large. Max size is ${maxSize / 1048576}MB`,
          });
        } else if (errors.some((e: any) => e.code === "file-invalid-type")) {
          form.setError(name, {
            message: "Invalid file type. Only images are allowed.",
          });
        } else {
          form.setError(name, {
            message: "File upload failed. Please try again.",
          });
        }
        return;
      }
    },
    [maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxSize,
    maxFiles: maxCount,
    multiple: maxCount > 1,
  });

  return (
    <div className={className}>
      {(maxCount > 1 || !preview) && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              {isDragActive
                ? "Drop the image here"
                : "Drag & drop an image, or click to select"}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF up to {maxSize / 1048576}MB
            </p>
          </div>
        </div>
      )}

      <ImagePreview preview={preview} name={name} setPreview={setPreview} />
    </div>
  );
}

function ImagePreview({
  preview,
  setPreview,
  name,
}: {
  preview: TImagePreview;
  setPreview: React.Dispatch<React.SetStateAction<TImagePreview>>;
  name: string;
}) {
  const form = useFormContext();

  const removeImage = () => {
    form.setValue(name, null);
    setPreview(null);
  };

  const filterImage = (image: ImageResponse) => {
    if (!Array.isArray(preview)) return;

    const filtered = preview.filter((p) => p?.url !== image?.url);
    setPreview(filtered);

    form.setValue(name, filtered.map((p) => p?.id).filter(Boolean));
  };

  if (!preview) return null;

  if ("url" in preview) {
    return (
      <div className="relative flex items-center justify-center rounded-lg overflow-hidden border min-h-[300px]">
        <img src={preview.url + "?w=300"} alt="Preview" />
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2"
          onClick={removeImage}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (Array.isArray(preview)) {
    return (
      <div className="grid grid-cols-3 gap-2 mt-2">
        {preview.map((image) => (
          <div
            key={image.id}
            className="relative flex items-center justify-center rounded-lg overflow-hidden border p-1"
          >
            <img src={image.url + "?w=300"} alt="Preview" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => filterImage(image)}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  }
}
