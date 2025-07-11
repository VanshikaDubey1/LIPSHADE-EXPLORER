'use client';

import { useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { UploadCloud, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import LipstickSmear from '@/components/page/LipstickSmear';


type ImageUploaderProps = {
  onUpload: (file: File) => void;
  onCameraClick: () => void;
  isLoading: boolean;
};

export default function ImageUploader({ onUpload, onCameraClick, isLoading }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an image file (PNG, JPG, etc.).",
        });
        return;
      }
      onUpload(file);
    }
     // Reset the input value to allow re-uploading the same file
    e.target.value = '';
  };
  
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
    // You can add styles for the drag-over state here if needed
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
       if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an image file (PNG, JPG, etc.).",
        });
        return;
      }
      onUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={cn(
            "group relative w-full rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center transition-all duration-300 ease-in-out",
            "hover:border-primary/60 hover:bg-primary/10",
            {'border-primary/80 bg-primary/20 scale-105': isDragging}
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <LipstickSmear className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 text-primary/10 opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:-translate-x-4 group-hover:-translate-y-4" />
            <LipstickSmear className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 text-primary/10 opacity-0 transition-all duration-500 ease-in-out transform scale-x-[-1] group-hover:opacity-100 group-hover:translate-x-4 group-hover:translate-y-4" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-4">
                <UploadCloud className="w-16 h-16 text-primary opacity-60 transition-all duration-300 group-hover:opacity-100" />
                <span className="absolute inset-0.5 animate-pulse-slow rounded-full border-2 border-primary/50"></span>
            </div>
            
            <h3 className="text-2xl font-bold text-foreground">Find Your Shade</h3>
            <p className="mt-2 text-muted-foreground">Upload a photo of lips wearing lipstick, or drag & drop an image.</p>
            
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
      
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button 
            size="lg" 
            className="w-full sm:w-auto rounded-full"
            onClick={handleButtonClick}
            disabled={isLoading}
        >
            Choose a file
        </Button>
        <span className="text-muted-foreground font-semibold">OR</span>
         <Button 
            size="lg" 
            variant="outline"
            className="w-full sm:w-auto rounded-full"
            onClick={onCameraClick}
            disabled={isLoading}
        >
            <Camera className="mr-2 h-5 w-5" />
            Use Your Camera
        </Button>
      </div>
    </div>
  );
}
