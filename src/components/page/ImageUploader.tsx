'use client';

import { useState, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ImageUploaderProps = {
  onUpload: (file: File) => void;
  isLoading: boolean;
  onUseCamera: () => void;
};

// SVG for the smear effect
const SmearSVG = () => (
    <svg className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-10 transition-opacity duration-500" viewBox="0 0 200 100" preserveAspectRatio="none">
        <defs>
            <radialGradient id="smearGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0.5}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0}} />
            </radialGradient>
        </defs>
        <path d="M 10,10 C 20,20 40,20 50,10 C 60,0 80,0 90,10 C 100,20 120,20 130,10 C 140,0 160,0 170,10 C 190,30 180,70 160,90 C 140,110 100,110 80,90 C 60,70 30,70 10,90 C -10,110 0,60 10,40 C 20,20 5,15 10,10 Z" fill="url(#smearGradient)" transform="rotate(-15 100 50)"/>
    </svg>
);


export default function ImageUploader({ onUpload, isLoading, onUseCamera }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = useCallback((file: File | null) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an image file.",
        });
        return;
      }
      onUpload(file);
    }
  }, [onUpload, toast]);
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = ''; // Reset for same file upload
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
        Find Your Shade
      </h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Upload a photo of lips wearing lipstick, or drag & drop an image.
      </p>
      
      <div 
        className={cn(
          "group relative mt-8 flex flex-col items-center justify-center w-full h-64 rounded-2xl border-2 border-dashed border-border transition-all duration-300",
          isDragging ? "border-primary bg-primary/10" : "bg-secondary/50"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <SmearSVG />
        <div className="relative z-10 flex flex-col items-center justify-center p-8">
            <UploadCloud className="w-16 h-16 text-primary/70 mb-4 transition-transform duration-300 group-hover:scale-110" />
            <p className="text-lg font-semibold text-foreground">
              Drag & drop your image here
            </p>
            <p className="text-muted-foreground mt-1">or</p>
            <Button
              onClick={handleButtonClick}
              disabled={isLoading}
              className="mt-4 glow-on-hover"
            >
              Choose a file
            </Button>
            <input 
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              disabled={isLoading}
            />
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-4">
          <div className="flex-1 border-t"></div>
          <span className="text-muted-foreground">OR</span>
          <div className="flex-1 border-t"></div>
      </div>

      <Button
          variant="outline"
          size="lg"
          className="mt-6 w-full max-w-sm mx-auto"
          onClick={onUseCamera}
          disabled={isLoading}
      >
          <Camera className="mr-2 h-5 w-5" />
          Use Your Camera
      </Button>
    </div>
  );
}
