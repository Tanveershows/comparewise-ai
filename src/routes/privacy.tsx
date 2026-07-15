import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — CompareX by Tanveershows" },
      { name: "description", content: "How CompareX by Tanveershows collects, uses, and protects your information." },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: July 15, 2026 · Maintained by Tanveershows for CompareX.
        </p>

        <div className="prose prose-sm mt-8 space-y-6 text-sm text-foreground/90 leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold">1. Who we are</h2>
            <p className="mt-2 text-muted-foreground">
              CompareX is operated by Tanveershows ("we", "us"). This Privacy Policy explains
              what information we collect when you use CompareX and how we handle it.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">2. Information we collect</h2>
            <ul className="mt-2 list-disc pl-6 text-muted-foreground space-y-1">
              <li><span className="text-foreground">Comparison queries</span> — the product names you type so the AI can compare them.</li>
              <li><span className="text-foreground">Reviews & ratings</span> — the name, rating, and text you voluntarily submit.</li>
              <li><span className="text-foreground">Technical data</span> — basic device, browser, and usage information for reliability and improvements.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">3. How we use information</h2>
            <p className="mt-2 text-muted-foreground">
              To generate AI comparisons, display community reviews, maintain the service,
              prevent abuse, and improve the product experience. We do not sell your personal data.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">4. AI processing</h2>
            <p className="mt-2 text-muted-foreground">
              Comparison queries are sent to third-party AI providers to generate responses.
              We only send the product names required to answer the request.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">5. Local storage</h2>
            <p className="mt-2 text-muted-foreground">
              Reviews you post are stored in your browser's local storage on this device.
              Clearing your browser data will remove them locally.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">6. Your rights</h2>
            <p className="mt-2 text-muted-foreground">
              You may request access, correction, or deletion of information we hold about you
              by contacting us at the address below.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">7. Contact</h2>
            <p className="mt-2 text-muted-foreground">
              Questions about this policy? Reach Tanveershows at <span className="text-foreground">support@tanveershows.com</span>.
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
