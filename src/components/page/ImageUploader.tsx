'use client';

import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type ImageUploaderProps = {
  onUpload: (file: File) => void;
};

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
    e.target.value = ''; // Reset for same file upload
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Upload your photo"
        className="pl-10 pr-24 h-12 rounded-full text-base"
        readOnly
        onClick={handleButtonClick}
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
      <Button 
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full h-9"
        onClick={handleButtonClick}
      >
        Visualize
      </Button>
    </div>
  );
}
