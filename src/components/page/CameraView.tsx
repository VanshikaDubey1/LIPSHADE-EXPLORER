'use client';

import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Camera, RefreshCw, X } from 'lucide-react';

type CameraViewProps = {
  onCapture: (file: File) => void;
  onCancel: () => void;
};

export default function CameraView({ onCapture, onCancel }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    return () => {
      // Cleanup: stop camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const handleCaptureClick = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video to avoid distortion
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Flip the image horizontally for a mirror effect
    context.translate(video.videoWidth, 0);
    context.scale(-1, 1);

    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
    // Reset transform to normal
    context.setTransform(1, 0, 0, 1, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        onCapture(file);
      }
    }, 'image/jpeg', 0.95);
  };
  
  return (
    <div className="bg-background rounded-lg p-4 md:p-6 w-full max-w-3xl mx-auto">
        <div className="relative w-full aspect-video bg-secondary rounded-lg overflow-hidden group">
            <video
              ref={videoRef}
              className="w-full h-full object-cover transform -scale-x-100" // Mirror effect
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <Alert variant="destructive" className="max-w-md">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access in your browser to use this feature. You may need to refresh the page after granting permission.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
            {hasCameraPermission === null && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <p className="text-muted-foreground">Requesting camera permission...</p>
                </div>
            )}
        </div>
        <div className="mt-4 flex justify-center items-center gap-4">
          <Button variant="outline" size="icon" className="w-16 h-16 rounded-full" onClick={onCancel}>
            <X className="w-6 h-6" />
            <span className="sr-only">Cancel</span>
          </Button>
          <Button 
            size="lg" 
            className="w-20 h-20 rounded-full glow-on-hover" 
            onClick={handleCaptureClick} 
            disabled={!hasCameraPermission}
            aria-label="Capture Photo"
          >
            <Camera className="w-8 h-8" />
          </Button>
          <div className="w-16 h-16"></div>
        </div>
    </div>
  );
}