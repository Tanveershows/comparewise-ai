import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand text-white shadow-elegant">
            <Sparkles className="h-4 w-4" />
          </span>
          <span>Compare<span className="text-gradient-brand">X</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#trending" className="hover:text-foreground transition">Trending</a>
          <a href="#faq" className="hover:text-foreground transition">FAQ</a>
        </nav>
        <Link
          to="/compare"
          className="inline-flex h-9 items-center rounded-lg bg-gradient-brand px-4 text-sm font-medium text-white shadow-elegant hover:opacity-95 transition"
        >
          Try it free
        </Link>
      </div>
    </header>
  );
}
