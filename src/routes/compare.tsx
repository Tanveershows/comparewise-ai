import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  ArrowLeft, Sparkles, Trophy, Check, X, Loader2, Search, Plus,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { compareProducts, type ComparisonResult } from "@/lib/compare.functions";
import { toast } from "sonner";

const searchSchema = z.object({
  p: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => (Array.isArray(v) ? v : v ? [v] : [])),
});

export const Route = createFileRoute("/compare")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "AI Comparison — CompareX" },
      { name: "description", content: "AI-powered side-by-side comparison with winners, pros & cons, and buying advice." },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const { p } = Route.useSearch();
  const navigate = useNavigate();
  const initial = p.length >= 2 ? p.slice(0, 5) : ["", ""];
  const [rows, setRows] = useState<string[]>(initial);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const compareFn = useServerFn(compareProducts);
  const mutation = useMutation({
    mutationFn: (products: string[]) => compareFn({ data: { products } }),
    onSuccess: (data) => setResult(data),
    onError: (e: Error) => toast.error(e.message || "Comparison failed"),
  });

  useEffect(() => {
    if (p.length >= 2 && !result && !mutation.isPending) {
      mutation.mutate(p.slice(0, 5));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (i: number, v: string) => setRows((r) => r.map((x, idx) => (idx === i ? v : x)));
  const addRow = () => rows.length < 5 && setRows((r) => [...r, ""]);
  const removeRow = (i: number) => rows.length > 2 && setRows((r) => r.filter((_, idx) => idx !== i));

  const run = () => {
    const products = rows.map((s) => s.trim()).filter(Boolean);
    if (products.length < 2) {
      toast.error("Enter at least 2 products");
      return;
    }
    navigate({ to: "/compare", search: { p: products }, replace: true });
    setResult(null);
    mutation.mutate(products);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        {/* Input */}
        <div className="mt-6 rounded-2xl border border-border/60 bg-card p-5 shadow-elegant">
          <div className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" /> What are we comparing?
          </div>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
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
                    onKeyDown={(e) => e.key === "Enter" && run()}
                    placeholder={`Product ${i + 1}`}
                    className="w-full h-10 rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                  />
                </div>
                {rows.length > 2 && (
                  <button onClick={() => removeRow(i)} className="text-muted-foreground hover:text-destructive px-1" aria-label="Remove">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button
              onClick={addRow}
              disabled={rows.length >= 5}
              className="inline-flex items-center gap-1 rounded-lg border border-input px-4 h-10 text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Add product
            </button>
            <button
              onClick={run}
              disabled={mutation.isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-brand h-10 text-sm font-semibold text-white shadow-elegant disabled:opacity-70"
            >
              {mutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Comparing…</> : <>Compare with AI</>}
            </button>
          </div>
        </div>

        {/* Loading */}
        {mutation.isPending && <LoadingSkeleton count={rows.filter(Boolean).length || 2} />}

        {/* Empty state */}
        {!mutation.isPending && !result && (
          <div className="mt-16 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-brand text-white shadow-elegant">
              <Sparkles className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-2xl font-bold">Ready when you are</h2>
            <p className="mt-2 text-muted-foreground">Add at least two products and hit compare.</p>
          </div>
        )}

        {/* Results */}
        {result && !mutation.isPending && <ResultsView data={result} />}
      </div>
    </div>
  );
}

function LoadingSkeleton({ count }: { count: number }) {
  return (
    <div className="mt-8 space-y-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/60 bg-card p-6 animate-pulse">
            <div className="h-5 w-2/3 bg-muted rounded" />
            <div className="mt-2 h-3 w-1/2 bg-muted rounded" />
            <div className="mt-6 h-24 bg-muted rounded" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-6 animate-pulse space-y-3">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-8 bg-muted rounded" />)}
      </div>
    </div>
  );
}

function ResultsView({ data }: { data: ComparisonResult }) {
  const n = data.products.length;
  return (
    <div className="mt-8 space-y-8">
      {/* Overall winner */}
      <div className="rounded-2xl bg-gradient-brand p-6 md:p-8 text-white shadow-elegant">
        <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
          <Trophy className="h-4 w-4" /> Overall winner · {data.category}
        </div>
        <div className="mt-2 text-3xl md:text-4xl font-extrabold">{data.overallWinner}</div>
        <p className="mt-3 text-white/90 max-w-3xl">{data.summary}</p>
      </div>

      {/* Product cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(n, 3)}, minmax(0, 1fr))` }}>
        {data.products.map((p, i) => {
          const isWinner = p.name === data.overallWinner;
          return (
            <div
              key={i}
              className={`rounded-2xl border bg-card p-6 relative ${isWinner ? "border-transparent shadow-elegant ring-2 ring-primary/40" : "border-border/60"}`}
            >
              {isWinner && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-gradient-brand px-3 py-1 text-xs font-semibold text-white shadow-elegant">
                  <Trophy className="h-3 w-3" /> Winner
                </span>
              )}
              <div className="text-xs uppercase tracking-wider text-muted-foreground">#{i + 1}</div>
              <div className="mt-1 text-lg font-bold">{p.name}</div>
              <div className="text-sm text-muted-foreground">{p.tagline}</div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-2xl font-extrabold text-gradient-brand">{Math.round(p.overallScore)}</div>
                <div className="text-sm font-medium">{p.estimatedPrice}</div>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-gradient-brand" style={{ width: `${p.overallScore}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Category winners */}
      <div>
        <h3 className="text-xl font-bold mb-4">Category winners</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.categoryWinners.map((c, i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.category}</div>
              <div className="mt-1 font-semibold flex items-center gap-2">
                <Trophy className="h-4 w-4 text-accent" /> {c.winner}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{c.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Spec table */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
        <div className="p-5 border-b border-border/60">
          <h3 className="text-xl font-bold">Side-by-side specs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-5 py-3 font-semibold min-w-[140px]">Spec</th>
                {data.products.map((p, i) => (
                  <th key={i} className="text-left px-5 py-3 font-semibold min-w-[180px]">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.specs.map((row, ri) => (
                <tr key={ri} className="border-t border-border/60">
                  <td className="px-5 py-3 font-medium text-muted-foreground">{row.label}</td>
                  {row.values.map((val, vi) => (
                    <td key={vi} className={`px-5 py-3 ${row.winnerIndex === vi ? "font-semibold text-primary" : ""}`}>
                      <div className="flex items-center gap-1.5">
                        {row.winnerIndex === vi && <Trophy className="h-3.5 w-3.5 text-accent shrink-0" />}
                        <span>{val}</span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pros & Cons */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(n, 3)}, minmax(0, 1fr))` }}>
        {data.products.map((p, i) => (
          <div key={i} className="rounded-2xl border border-border/60 bg-card p-6">
            <div className="font-bold">{p.name}</div>
            <div className="mt-4">
              <div className="text-xs uppercase tracking-wider text-success font-semibold">Pros</div>
              <ul className="mt-2 space-y-1.5">
                {p.pros.map((x, k) => (
                  <li key={k} className="flex gap-2 text-sm"><Check className="h-4 w-4 text-success shrink-0 mt-0.5" />{x}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <div className="text-xs uppercase tracking-wider text-destructive font-semibold">Cons</div>
              <ul className="mt-2 space-y-1.5">
                {p.cons.map((x, k) => (
                  <li key={k} className="flex gap-2 text-sm"><X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />{x}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 md:p-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="h-4 w-4" /> AI recommendation
        </div>
        <p className="mt-3 text-base leading-relaxed">{data.recommendation}</p>
      </div>
    </div>
  );
}
