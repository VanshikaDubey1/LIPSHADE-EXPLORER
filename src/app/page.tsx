'use client';

import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { MatchLipstickShadeOutput } from '@/ai/flows/match-lipstick-shade';
import { getShadeMatch } from '@/app/actions';

import Header from '@/components/page/Header';
import Footer from '@/components/page/Footer';
import HeroSection from '@/components/page/HeroSection';
import ImageUploader from '@/components/page/ImageUploader';
import LoadingSpinner from '@/components/page/LoadingSpinner';
import ResultCard from '@/components/page/ResultCard';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { CheckCircle, Palette, Camera, Share2 } from 'lucide-react';


type ResultState = {
  detectedColor: string;
  match: MatchLipstickShadeOutput;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultState | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const resultRef = useRef<HTMLDivElement>(null);


  const handleUpload = async (file: File) => {
    if (file.size > 4 * 1024 * 1024) { // 4MB limit
       toast({
        variant: "destructive",
        title: "Image too large",
        description: "Please upload an image smaller than 4MB.",
      });
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    setIsLoading(true);
    setResult(null);

    // Scroll to results area
    setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await getShadeMatch(formData);
      if (res.error) {
        throw new Error(res.error);
      }
      setResult(res);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: error.message || "Failed to find a lipstick match. Please try another image.",
      });
      setResult(null);
      setImagePreview(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setImagePreview(null);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection onUpload={handleUpload} />

        <div ref={resultRef} className="py-16 md:py-24 transition-all duration-500 container mx-auto px-4">
            {isLoading && <LoadingSpinner preview={imagePreview} />}
            {result && (
              <ResultCard 
                result={result} 
                imagePreview={imagePreview} 
                onReset={handleReset} 
              />
            )}
        </div>

        <section className="py-16 md:py-24 bg-secondary/50">
          <div className="container mx-auto px-4">
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-2xl font-semibold">How it works</AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-3 gap-8 mt-8">
                    <Card className="bg-background border-border/50">
                      <CardHeader>
                        <Image src="https://placehold.co/600x400.png" alt="Step 1" width={600} height={400} className="rounded-md" data-ai-hint="woman applying lipstick" />
                        <CardTitle className="mt-4">Step 1</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Upload your photo to see shades for you.</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-background border-border/50">
                      <CardHeader>
                        <Image src="https://placehold.co/600x400.png" alt="Step 2" width={600} height={400} className="rounded-md" data-ai-hint="lipstick color wheel" />
                        <CardTitle className="mt-4">Step 2</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Choose from a variety of shades and styles.</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-background border-border/50">
                      <CardHeader>
                        <Image src="https://placehold.co/600x400.png" alt="Step 3" width={600} height={400} className="rounded-md" data-ai-hint="woman admiring makeup" />
                        <CardTitle className="mt-4">Step 3</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Finalize your selection and share your look!</p>
                      </CardContent>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-2xl font-semibold">Join LipShade Explorer</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-12 mt-8">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <Image src="https://placehold.co/600x600.png" alt="User" width={600} height={600} className="rounded-lg" data-ai-hint="lipstick swatches arm" />
                        <div>
                          <h3 className="text-2xl font-bold text-primary">As a user</h3>
                          <p className="mt-2 text-muted-foreground">Explore countless shades and find your match.</p>
                          <Button variant="outline" className="mt-4">Join us</Button>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="md:order-2">
                           <Image src="https://placehold.co/600x600.png" alt="Brand" width={600} height={600} className="rounded-lg" data-ai-hint="lipstick product photography" />
                        </div>
                        <div className="md:order-1 text-md-right">
                          <h3 className="text-2xl font-bold text-primary">As a brand</h3>
                          <p className="mt-2 text-muted-foreground">Showcase your products and reach new customers.</p>
                          <Button variant="outline" className="mt-4">Partner with us</Button>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <Image src="https://placehold.co/600x600.png" alt="Developer" width={600} height={600} className="rounded-lg" data-ai-hint="assorted lipsticks" />
                        <div>
                          <h3 className="text-2xl font-bold text-primary">As a developer</h3>
                          <p className="mt-2 text-muted-foreground">Help us enhance the user experience and features.</p>
                          <Button variant="outline" className="mt-4">Collaborate</Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
        </section>

         <section className="py-16 md:py-24 bg-secondary/50">
            <div className="container mx-auto px-4">
               <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-2xl font-semibold">Download our app</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid md:grid-cols-2 gap-8 items-center mt-8">
                        <div>
                            <h3 className="text-3xl font-bold text-primary">Find your shade effortlessly!</h3>
                            <p className="mt-4 text-muted-foreground">Experience the future of lipstick shopping with LipShade Explorer. Visualize shades in real-time and make confident choices.</p>
                            <Button variant="outline" className="mt-6">Get app</Button>
                        </div>
                        <Image src="https://placehold.co/600x400.png" alt="Download App" width={600} height={400} className="rounded-lg" data-ai-hint="woman's lips color swatches" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
        </section>


      </main>
      <Footer />
    </div>
  );
}
