'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NavLinks = () => (
  <>
    <Link href="#" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">About</Link>
    <Link href="#" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">Contact</Link>
  </>
);

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold font-headline text-lg text-primary">ShadeMatch</span>
          </Link>
        </div>
        
        <nav className="hidden items-center space-x-8 text-sm md:flex">
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
                <Link href="/" className="mb-8 flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <span className="font-bold font-headline text-lg text-primary">ShadeMatch</span>
                </Link>
                <nav className="flex flex-col space-y-4">
                  <Link href="#" className="text-lg" onClick={() => setIsOpen(false)}>About</Link>
                  <Link href="#" className="text-lg" onClick={() => setIsOpen(false)}>Contact</Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
