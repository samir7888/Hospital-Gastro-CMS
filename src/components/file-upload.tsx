"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'


interface FileUploadProps {
  onFileChange: (file: File | null) => void
  currentImage?: string
  maxSize?: number
  className?: string
}

export function FileUpload({ 
  onFileChange, 
  currentImage, 
  maxSize = 5242880, // 5MB
  className 
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null)
    
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles[0].errors
      if (errors.some((e: any) => e.code === 'file-too-large')) {
        setError(`File is too large. Max size is ${maxSize / 1048576}MB`)
      } else if (errors.some((e: any) => e.code === 'file-invalid-type')) {
        setError('Invalid file type. Please upload an image.')
      } else {
        setError('Invalid file. Please try another.')
      }
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setPreview(URL.createObjectURL(file))
      onFileChange(file)
    }
  }, [maxSize, onFileChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxSize,
    maxFiles: 1
  })

  const removeImage = () => {
    setPreview(null)
    onFileChange(null)
  }

  return (
    <div className={className}>
      {!preview ? (
        <div 
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              {isDragActive ? "Drop the image here" : "Drag & drop an image, or click to select"}
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
      
      {error && (
        <p className="text-sm text-destructive mt-2">
          {error}
        </p>
      )}
    </div>
  )
}