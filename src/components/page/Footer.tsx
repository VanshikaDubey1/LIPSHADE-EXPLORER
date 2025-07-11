export default function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container flex flex-col items-center justify-center gap-4 py-8 md:h-20 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          © {new Date().getFullYear()} ShadeMatch. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
