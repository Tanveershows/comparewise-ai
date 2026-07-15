import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Target, Users, Rocket } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Tanveershows — The team behind CompareX" },
      { name: "description", content: "CompareX is built by Tanveershows — an independent product studio crafting AI-powered tools that help people decide faster and buy smarter." },
      { property: "og:title", content: "About Tanveershows — The team behind CompareX" },
      { property: "og:description", content: "Learn about Tanveershows, the studio behind CompareX — AI-powered comparisons for anything." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> A Tanveershows product
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            We're <span className="text-gradient-brand">Tanveershows</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            An independent product studio building modern AI tools. CompareX is our flagship —
            an AI-powered comparison engine that turns hours of research into a single click.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-3 gap-6">
        {[
          { icon: Target, title: "Our mission", desc: "Help everyone make confident buying decisions — without opening 12 tabs." },
          { icon: Rocket, title: "What we do", desc: "Design and ship AI-native products that feel fast, honest, and beautifully simple." },
          { icon: Users, title: "Who we serve", desc: "Curious buyers, product teams, and anyone who wants clarity before they commit." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl border border-border/60 bg-card p-6">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-brand text-white">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-semibold text-lg">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-2xl border border-border/60 bg-card p-8">
          <h2 className="text-2xl font-bold">Our story</h2>
          <div className="mt-4 space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Tanveershows started with a simple frustration: every meaningful purchase
              turned into an evening of tabs, spreadsheets, and contradictory reviews.
              We knew AI could do better.
            </p>
            <p>
              CompareX is the result — a tool where you type any two-to-five products and
              instantly get a normalized side-by-side, category winners, pros and cons, and
              an honest buying recommendation. No fluff. No filler. Just the answer.
            </p>
            <p>
              We're a small team obsessed with speed, craft, and clarity. If that sounds like
              your kind of product, we'd love to hear from you.
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            <Link to="/compare" className="inline-flex items-center rounded-lg bg-gradient-brand text-white px-5 h-11 text-sm font-semibold shadow-elegant hover:opacity-95">
              Try CompareX
            </Link>
            <Link to="/" hash="reviews" className="inline-flex items-center rounded-lg border border-input px-5 h-11 text-sm font-medium hover:bg-muted">
              Leave a review
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
