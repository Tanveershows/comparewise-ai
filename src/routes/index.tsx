import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles, Search, Zap, Trophy, LineChart, ShieldCheck,
  Smartphone, Laptop, Car, Headphones, Tv, Watch, Gamepad2, Bot,
  ArrowRight, Check, Star,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const TRENDING = [
  { items: ["iPhone 17 Pro", "Samsung Galaxy S26 Ultra", "Google Pixel 10 Pro"], tag: "Flagship phones" },
  { items: ["MacBook Pro M5", "Dell XPS 15", "ASUS ROG Zephyrus"], tag: "Creator laptops" },
  { items: ["ChatGPT", "Claude", "Gemini", "Perplexity"], tag: "AI assistants" },
  { items: ["Tesla Model 3", "BMW i4", "Hyundai Ioniq 6"], tag: "Electric sedans" },
  { items: ["Sony WH-1000XM6", "Bose QC Ultra", "Apple AirPods Max"], tag: "ANC headphones" },
  { items: ["PS5 Pro", "Xbox Series X", "Nintendo Switch 2"], tag: "Consoles" },
];

const CATEGORIES = [
  { icon: Smartphone, label: "Phones" },
  { icon: Laptop, label: "Laptops" },
  { icon: Car, label: "Cars" },
  { icon: Headphones, label: "Audio" },
  { icon: Tv, label: "TVs" },
  { icon: Watch, label: "Wearables" },
  { icon: Gamepad2, label: "Gaming" },
  { icon: Bot, label: "AI Tools" },
];

function HomePage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<string[]>(["", ""]);

  const update = (i: number, v: string) => setRows((r) => r.map((x, idx) => (idx === i ? v : x)));
  const addRow = () => rows.length < 5 && setRows((r) => [...r, ""]);
  const removeRow = (i: number) => rows.length > 2 && setRows((r) => r.filter((_, idx) => idx !== i));

  const submit = (list?: string[]) => {
    const products = (list ?? rows).map((s) => s.trim()).filter(Boolean);
    if (products.length < 2) return;
    navigate({ to: "/compare", search: { p: products } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              AI-powered • Live insights • One click
            </div>
            <h1 className="mt-6 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
              Compare Anything.
              <br />
              <span className="text-gradient-brand">Instantly.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Type any 2–5 products. Get side-by-side specs, pros & cons, category winners,
              and a buying recommendation — powered by AI.
            </p>
          </div>

          {/* Search */}
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 sm:p-5 shadow-elegant backdrop-blur-xl">
              <div className="space-y-2">
                {rows.map((v, i) => (
                  <div key={i} className="relative flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-white text-sm font-semibold shrink-0">
                      {i + 1}
                    </span>
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        value={v}
                        onChange={(e) => update(i, e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submit()}
                        placeholder={i === 0 ? "e.g. iPhone 17 Pro" : i === 1 ? "e.g. Samsung Galaxy S26 Ultra" : "Add another product"}
                        className="w-full h-11 rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                      />
                    </div>
                    {rows.length > 2 && (
                      <button
                        onClick={() => removeRow(i)}
                        className="text-xs text-muted-foreground hover:text-destructive px-2"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={addRow}
                  disabled={rows.length >= 5}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-input px-4 h-11 text-sm font-medium hover:bg-muted disabled:opacity-50"
                >
                  + Add product {rows.length >= 5 && "(max 5)"}
                </button>
                <button
                  onClick={() => submit()}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-brand px-5 h-11 text-sm font-semibold text-white shadow-elegant hover:opacity-95 transition"
                >
                  Compare with AI <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
              <span className="text-muted-foreground">Try:</span>
              {[
                ["iPhone 17 Pro", "Galaxy S26 Ultra"],
                ["MacBook Pro M5", "Dell XPS 15"],
                ["ChatGPT", "Claude", "Gemini"],
              ].map((t, i) => (
                <button
                  key={i}
                  onClick={() => submit(t)}
                  className="rounded-full border border-border/60 bg-background/70 px-3 py-1 hover:border-primary/40 hover:text-primary transition"
                >
                  {t.join(" vs ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Compare across every category</h2>
          <p className="mt-3 text-muted-foreground">From gadgets to cars to SaaS — one intelligence engine.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card p-6 hover:shadow-elegant hover:-translate-y-0.5 transition"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-white shadow-elegant group-hover:scale-110 transition">
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-muted/40 border-y border-border/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Why CompareX</h2>
            <p className="mt-3 text-muted-foreground">Everything you need to decide — nothing you don't.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "One-Click AI Compare", desc: "Type names, hit compare. Structured side-by-side in seconds." },
              { icon: Trophy, title: "Category Winners", desc: "Best performance, camera, battery, value — automatically judged." },
              { icon: LineChart, title: "Deep Specs", desc: "Normalized specs across brands, unified into one clear table." },
              { icon: ShieldCheck, title: "Pros & Cons", desc: "Balanced strengths and weaknesses for every product." },
              { icon: Sparkles, title: "Buying Advice", desc: "AI recommendation for your use case, budget, and priorities." },
              { icon: Search, title: "Any Category", desc: "Phones, laptops, cars, AI tools, software — anything." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border/60 bg-card p-6 hover:shadow-elegant transition">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-brand text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-lg">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "01", t: "Type products", d: "Enter 2–5 product names — any brand, any category." },
            { n: "02", t: "AI does the work", d: "Fetches, normalizes, and compares specs and reputations." },
            { n: "03", t: "Decide with confidence", d: "See winners, pros/cons and a buying recommendation." },
          ].map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-border/60 bg-card p-6">
              <div className="text-5xl font-extrabold text-gradient-brand leading-none">{s.n}</div>
              <h3 className="mt-3 font-semibold text-lg">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section id="trending" className="bg-muted/40 border-y border-border/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Trending comparisons</h2>
              <p className="mt-2 text-muted-foreground">Popular right now — one click to explore.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRENDING.map((t, i) => (
              <button
                key={i}
                onClick={() => submit(t.items)}
                className="text-left rounded-2xl border border-border/60 bg-card p-5 hover:shadow-elegant hover:-translate-y-0.5 transition group"
              >
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.tag}</div>
                <div className="mt-2 text-lg font-semibold">
                  {t.items.join(" vs ")}
                </div>
                <div className="mt-4 inline-flex items-center text-sm text-primary group-hover:gap-2 transition-all gap-1">
                  Compare <ArrowRight className="h-4 w-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Loved by decisive buyers</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { q: "Cut my research time from hours to seconds. This is what comparison sites should feel like.", n: "Priya S.", r: "Product Manager" },
            { q: "The category winners are what sold me. I finally stopped opening 12 tabs.", n: "Marcus L.", r: "Engineer" },
            { q: "Compared 4 AI tools for our stack in one shot. Recommendation nailed it.", n: "Aisha K.", r: "Founder" },
          ].map((t, i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-3 text-sm">"{t.q}"</p>
              <div className="mt-4 text-sm">
                <div className="font-semibold">{t.n}</div>
                <div className="text-muted-foreground">{t.r}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-muted/40 border-y border-border/60 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Frequently asked</h2>
          <div className="space-y-3">
            {[
              { q: "How many products can I compare?", a: "Up to five at once — the sweet spot for real decisions." },
              { q: "Which categories are supported?", a: "Anything. Phones, laptops, cars, AI tools, SaaS, appliances — if it exists, we can compare it." },
              { q: "Is CompareX free?", a: "Yes, comparisons are free while in beta." },
              { q: "Where does the data come from?", a: "AI reasoning over public specs and reputation signals, with clearly labeled estimates when needed." },
            ].map((f, i) => (
              <details key={i} className="group rounded-xl border border-border/60 bg-card p-5">
                <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                  {f.q}
                  <span className="text-muted-foreground group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-brand p-10 md:p-16 text-center text-white shadow-elegant relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 60%, white 0, transparent 40%)",
          }} />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-extrabold">Ready to decide faster?</h2>
            <p className="mt-3 text-white/90 max-w-xl mx-auto">Compare your next purchase in one click.</p>
            <Link
              to="/compare"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white text-primary px-6 h-12 font-semibold hover:opacity-95 transition"
            >
              <Check className="h-5 w-5" /> Start comparing
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
