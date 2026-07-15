import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

type Review = { id: string; name: string; rating: number; text: string; date: string };

const STORAGE_KEY = "comparex.reviews.v1";

const SEED: Review[] = [
  { id: "s1", name: "Rahul M.", rating: 5, text: "Tanveershows nailed it — CompareX saved me hours picking a laptop.", date: "2026-06-12" },
  { id: "s2", name: "Sofia D.", rating: 5, text: "The AI winners per category are chef's kiss. Bought with confidence.", date: "2026-06-28" },
];

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setReviews(raw ? JSON.parse(raw) : SEED);
    } catch {
      setReviews(SEED);
    }
  }, []);

  const persist = (next: Review[]) => {
    setReviews(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim().slice(0, 60);
    const t = text.trim().slice(0, 500);
    if (!n || !t || rating < 1) {
      toast.error("Please add your name, a rating, and a short review.");
      return;
    }
    const r: Review = {
      id: crypto.randomUUID(),
      name: n,
      rating,
      text: t,
      date: new Date().toISOString().slice(0, 10),
    };
    persist([r, ...reviews]);
    setName(""); setText(""); setRating(0);
    toast.success("Thanks for your review!");
  };

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <section id="reviews" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">Rate & review CompareX</h2>
        <p className="mt-3 text-muted-foreground">
          Average rating <span className="font-semibold text-foreground">{avg}</span> from {reviews.length} review{reviews.length === 1 ? "" : "s"}.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <form
          onSubmit={submit}
          className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6 shadow-elegant h-fit"
        >
          <h3 className="font-semibold text-lg">Share your experience</h3>
          <div className="mt-4 space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="Your name"
              className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
            <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  className="p-1"
                >
                  <Star
                    className={`h-7 w-7 transition ${
                      (hover || rating) >= n ? "text-warning fill-current" : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              placeholder="What did you think?"
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-brand h-11 text-sm font-semibold text-white shadow-elegant hover:opacity-95 transition"
            >
              Post review
            </button>
          </div>
        </form>

        <div className="lg:col-span-3 space-y-4 max-h-[560px] overflow-y-auto pr-1">
          {reviews.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center text-muted-foreground">
              Be the first to review CompareX.
            </div>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.date}</div>
              </div>
              <div className="mt-1 flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-current" : "text-muted-foreground/30"}`} />
                ))}
              </div>
              <p className="mt-3 text-sm text-foreground/90 whitespace-pre-wrap break-words">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
