'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getRecommendedShades } from '@/app/actions';
import type { FaceLandmarksDetector } from '@tensorflow-models/face-landmarks-detection';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, X, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LIP_LANDMARKS } from '@/lib/triangulation';
import { Card, CardContent } from '@/components/ui/card';

type RecommendedShade = {
  category: 'Red' | 'Pink' | 'Nude';
  hexColor: string;
  productName: string;
  brand: string;
};

type LipstickShade = {
  name: string;
  color: string;
  category: 'Reds' | 'Pinks' | 'Nudes' | 'Recommended';
};

type DetectionStatus = 'loading_camera' | 'running' | 'error';

const initialLipstickShades: LipstickShade[] = [
    // Reds
    { name: 'Classic Red', color: '#C01A29', category: 'Reds' },
    { name: 'Deep Berry', color: '#823751', category: 'Reds' },
    { name: 'Cherry Bomb', color: '#9B2C30', category: 'Reds' },
    { name: 'Vivid Coral', color: '#E86F68', category: 'Reds' },
    // Pinks
    { name: 'Hot Pink', color: '#D83E58', category: 'Pinks' },
    { name: 'Dusty Rose', color: '#C38989', category: 'Pinks' },
    { name: 'Soft Mauve', color: '#B87E81', category: 'Pinks' },
    { name: 'Baby Pink', color: '#E4B4B9', category: 'Pinks' },
    // Nudes
    { name: 'Pillow Talk', color: '#AB786E', category: 'Nudes' },
    { name: 'Warm Nude', color: '#C99A8E', category: 'Nudes' },
    { name: 'Cool Taupe', color: '#A06B62', category: 'Nudes' },
    { name: 'Peachy Nude', color: '#D7907C', category: 'Nudes' },
];

function hexToRgba(hex: string, alpha: number): string {
    if (!hex || !hex.startsWith('#')) return `rgba(0,0,0,${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type VirtualTryOnProps = {
  model: FaceLandmarksDetector;
  onCancel: () => void;
};

const LIPS_CONTOUR = [...LIP_LANDMARKS.UPPER_OUTER, ...LIP_LANDMARKS.LOWER_OUTER.reverse()];

const drawLipPath = (ctx: CanvasRenderingContext2D, keypoints: any[], indices: number[]) => {
    ctx.beginPath();
    if (indices.length === 0) return;
    const startPoint = keypoints[indices[0]];
    if (!startPoint) return;
    ctx.moveTo(startPoint.x, startPoint.y);
    for (let i = 1; i < indices.length; i++) {
        const pointIndex = indices[i];
        if (pointIndex !== undefined) {
          const point = keypoints[pointIndex];
          if(point) ctx.lineTo(point.x, point.y);
        }
    }
    ctx.closePath();
    ctx.fill();
};

export default function VirtualTryOn({ model, onCancel }: VirtualTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  const [status, setStatus] = useState<DetectionStatus>('loading_camera');
  const [isRecommending, setIsRecommending] = useState(false);
  
  const [lipstickShades, setLipstickShades] = useState<LipstickShade[]>(initialLipstickShades);
  const [selectedShade, setSelectedShade] = useState<LipstickShade>(initialLipstickShades[0]);
  const [activeCategory, setActiveCategory] = useState<LipstickShade['category']>('Reds');
  
  const { toast } = useToast();

  useEffect(() => {
    const startCamera = async () => {
      try {
        setStatus('loading_camera');
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setStatus('running');
          };
        }
      } catch (error) {
        console.error("Failed to start camera", error);
        toast({
            variant: "destructive",
            title: "Camera Access Denied",
            description: "Please check permissions and try again."
        });
        setStatus('error');
      }
    };
    startCamera();
    
    return () => {
       if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if(animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }
  }, [toast]);
  
  const drawLips = useCallback((keypoints: any[], ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = hexToRgba(selectedShade.color, 0.6);
    drawLipPath(ctx, keypoints, LIPS_CONTOUR);
  }, [selectedShade.color]);

  const detectFaces = useCallback(async () => {
    if (status !== 'running' || !model || !videoRef.current?.srcObject || !canvasRef.current || videoRef.current.readyState < 3) {
      if (status === 'running') animationFrameId.current = requestAnimationFrame(detectFaces);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const faces = await model.estimateFaces(video, { flipHorizontal: false });
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    
    if (faces && faces.length > 0) {
      faces.forEach(face => {
        if(face.keypoints) drawLips(face.keypoints, ctx);
      });
    }
    
    ctx.restore();
    animationFrameId.current = requestAnimationFrame(detectFaces);
  }, [model, drawLips, status]);

  useEffect(() => {
    if (status === 'running') {
      animationFrameId.current = requestAnimationFrame(detectFaces);
    } else {
      if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    }
    return () => {
      if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [status, detectFaces]);

  const handleRecommend = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsRecommending(true);
    
    const video = videoRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    const context = tempCanvas.getContext('2d');
    if (!context) return;
    
    context.translate(video.videoWidth, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    context.setTransform(1, 0, 0, 1, 0, 0);

    tempCanvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], 'snapshot.jpg', { type: 'image/jpeg' });
        const formData = new FormData();
        formData.append('image', file);
        
        try {
          const res = await getRecommendedShades(formData);
          if (res.error) throw new Error(res.error);
          
          if (res.recommendations.length > 0) {
              const newShades: LipstickShade[] = res.recommendations.map(r => ({
                name: `${r.brand} - ${r.productName}`,
                color: r.hexColor,
                category: 'Recommended',
              }));

              // Filter out old recommendations before adding new ones
              setLipstickShades(prev => [...newShades, ...prev.filter(s => s.category !== 'Recommended')]);
              setActiveCategory('Recommended');
              setSelectedShade(newShades[0]);
              toast({ title: "We found some shades for you!" });
          } else {
              toast({ variant: 'destructive', title: "Couldn't find recommendations", description: "Try a photo with different lighting." });
          }
        } catch (error: any) {
          toast({ variant: 'destructive', title: "Recommendation Failed", description: error.message });
        } finally {
          setIsRecommending(false);
        }
      }
    }, 'image/jpeg', 0.95);
  };

  const getStatusMessage = () => {
    switch(status) {
        case 'loading_camera': return 'Starting camera...';
        default: return '';
    }
  };


  return (
    <div className="bg-background rounded-lg p-4 md:p-6 w-full mx-auto grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col">
            <Card className="w-full aspect-[4/3] bg-secondary rounded-lg overflow-hidden group relative border-none shadow-lg">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover transform -scale-x-100"
                  autoPlay
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
                
                { status !== 'running' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                        { status !== 'error' && <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" /> }
                        
                        <p className="text-muted-foreground font-semibold">
                            {getStatusMessage()}
                        </p>
                        
                        { status === 'error' && (
                            <Alert variant="destructive" className="max-w-md">
                                <AlertTitle>Camera or Model Error</AlertTitle>
                                <AlertDescription>
                                    Could not start the camera. Please check permissions and try refreshing.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}
            </Card>
            <div className="mt-4 flex justify-between items-center gap-4">
                <Button variant="outline" onClick={onCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Close
                </Button>
                <Button onClick={handleRecommend} disabled={isRecommending || status !== 'running'} className="glow-on-hover bg-accent text-accent-foreground">
                    {isRecommending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                    Recommend For Me
                </Button>
            </div>
        </div>

        <div className="md:col-span-1 flex flex-col gap-4">
            <div className="text-center">
                <h3 className="font-headline text-2xl text-accent">Choose a Shade</h3>
                <p className="text-muted-foreground text-sm truncate h-5">{selectedShade.name}</p>
            </div>
             <div className="bg-muted p-1 rounded-lg flex flex-wrap gap-1">
                {(['Recommended', 'Reds', 'Pinks', 'Nudes'] as const).map(category => {
                    if (category === 'Recommended' && !lipstickShades.some(s => s.category === 'Recommended')) return null;
                    return (
                      <Button 
                          key={category} 
                          variant={activeCategory === category ? 'default' : 'ghost'}
                          size="sm"
                          className="flex-1 transition-all"
                          onClick={() => setActiveCategory(category)}
                      >
                          {category}
                      </Button>
                    )
                })}
            </div>
            <Card className="flex-1">
                <CardContent className="p-3">
                    <div className="grid grid-cols-4 gap-3">
                        {lipstickShades.filter(s => s.category === activeCategory).map(shade => (
                            <button
                                key={shade.name}
                                onClick={() => setSelectedShade(shade)}
                                className={cn(
                                    "aspect-square rounded-full w-full transition-all duration-200 border-2 shadow-inner",
                                    selectedShade.name === shade.name ? "border-primary scale-110 shadow-lg" : "border-transparent hover:scale-105 hover:shadow-md"
                                )}
                                style={{ backgroundColor: shade.color }}
                                aria-label={`Select shade ${shade.name}`}
                            />
                        ))}
                        {activeCategory === 'Recommended' && isRecommending && (
                            <>
                              <div className="aspect-square rounded-full w-full bg-muted animate-pulse" />
                              <div className="aspect-square rounded-full w-full bg-muted animate-pulse" />
                              <div className="aspect-square rounded-full w-full bg-muted animate-pulse" />
                            </>
                        )}
                         {lipstickShades.filter(s => s.category === activeCategory).length === 0 && !isRecommending && (
                           <div className="col-span-4 text-center text-muted-foreground text-sm py-8">
                             <p>Click "Recommend For Me" to get personalized shades!</p>
                           </div>
                         )}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
