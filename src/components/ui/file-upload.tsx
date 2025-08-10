import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Upload, File, X } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  onFileSelect: (file: File) => void;
  placeholder: string;
  icon?: React.ReactNode;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  onFileSelect,
  placeholder,
  icon,
  className
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
          dragActive 
            ? "border-primary bg-primary/5 scale-105" 
            : "border-border hover:border-primary/50 hover:bg-muted/50",
          "cursor-pointer group"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        
        {selectedFile ? (
          <div className="flex items-center justify-center space-x-3">
            <File className="h-8 w-8 text-primary" />
            <div className="flex-1 text-right">
              <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} ميجابايت
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary group-hover:animate-pulse-soft">
              {icon || <Upload className="h-8 w-8 text-white" />}
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">{placeholder}</p>
              <p className="text-sm text-muted-foreground mt-2">
                اسحب الملف هنا أو انقر للتصفح
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};