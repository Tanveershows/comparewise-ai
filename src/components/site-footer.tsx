import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            Compare<span className="text-gradient-brand">X</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            Compare Anything. Instantly. AI-powered comparisons across every category — phones,
            laptops, cars, software, AI tools and more.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            A product by <span className="font-semibold text-foreground">Tanveershows</span>.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Product</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/#features" className="hover:text-foreground">Features</a></li>
            <li><a href="/#how" className="hover:text-foreground">How it works</a></li>
            <li><a href="/#trending" className="hover:text-foreground">Trending</a></li>
            <li><a href="/#reviews" className="hover:text-foreground">Reviews</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About Tanveershows</Link></li>
            <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Tanveershows · CompareX. Compare Anything. Instantly.
      </div>
    </footer>
  );
}
