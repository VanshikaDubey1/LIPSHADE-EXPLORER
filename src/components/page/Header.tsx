'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LipstickIcon from '@/components/page/LipstickIcon';


const NavLinks = () => (
  <>
    <Button variant="outline" size="sm">Log in</Button>
    <Button size="sm">Get started</Button>
  </>
);

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <LipstickIcon className="h-8 w-8 text-primary" />
            <span className="font-bold uppercase tracking-wider">ShadeMatch</span>
          </Link>
        </div>
        
        <nav className="hidden items-center space-x-2 text-sm md:flex">
          <NavLinks />
        </nav>
        
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
              <div className="flex flex-col p-6 pt-12">
                 <Link href="/" className="mr-6 mb-8 flex items-center space-x-2">
                    <LipstickIcon className="h-8 w-8 text-primary" />
                 </Link>
                <nav className="flex flex-col space-y-4">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>Log in</Button>
                  <Button onClick={() => setIsOpen(false)}>Get started</Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
