"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import useAxiosAuth from "@/hooks/useAuth";

interface FileUploadProps {
  maxSize?: number;
  className?: string;
  name: string;
  maxCount?: number;
  currentImage?: string | null;
}

export function FileUpload({
  name,
  currentImage,
  maxSize = 5242880, // 5MB
  className,
  maxCount = 1,
}: FileUploadProps) {
  const form = useFormContext();
  const axios = useAxiosAuth();

  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      const formData = new FormData();

      for (const file of acceptedFiles) {
        formData.append("images", file);
      }
      console.log(formData);
      const res = await axios.post("/upload/images", formData);

      if (res.status === 201) {
        const fileIds = res.data.files?.map((file: any) => file.id);
        if (maxCount > 1) {
          form.setValue(name, fileIds);
        } else {
          form.setValue(name, fileIds[0]);
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

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setPreview(URL.createObjectURL(file));
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
  });

  const removeImage = () => {
    setPreview(null);
  };

  return (
    <div className={className}>
      {!preview ? (
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
      ) : (
        <div className="relative rounded-lg overflow-hidden border">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto object-cover max-h-[300px]"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
