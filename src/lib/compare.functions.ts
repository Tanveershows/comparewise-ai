import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  products: z.array(z.string().trim().min(1).max(120)).min(2).max(5),
  category: z.string().trim().max(60).optional(),
});

const SpecRow = z.object({
  label: z.string(),
  values: z.array(z.string()),
  winnerIndex: z.number().int().nullable().optional(),
});

const ProductBlock = z.object({
  name: z.string(),
  tagline: z.string(),
  estimatedPrice: z.string(),
  overallScore: z.number().min(0).max(100),
  pros: z.array(z.string()).max(6),
  cons: z.array(z.string()).max(6),
});

const CategoryWinner = z.object({
  category: z.string(),
  winner: z.string(),
  reason: z.string(),
});

const OutputSchema = z.object({
  category: z.string(),
  products: z.array(ProductBlock),
  specs: z.array(SpecRow),
  categoryWinners: z.array(CategoryWinner),
  overallWinner: z.string(),
  summary: z.string(),
  recommendation: z.string(),
});

export type ComparisonResult = z.infer<typeof OutputSchema>;

export const compareProducts = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => InputSchema.parse(raw))
  .handler(async ({ data }): Promise<ComparisonResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const jsonSchema = {
      type: "object",
      additionalProperties: false,
      required: [
        "category", "products", "specs", "categoryWinners", "overallWinner", "summary", "recommendation",
      ],
      properties: {
        category: { type: "string" },
        products: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["name", "tagline", "estimatedPrice", "overallScore", "pros", "cons"],
            properties: {
              name: { type: "string" },
              tagline: { type: "string" },
              estimatedPrice: { type: "string" },
              overallScore: { type: "number" },
              pros: { type: "array", items: { type: "string" } },
              cons: { type: "array", items: { type: "string" } },
            },
          },
        },
        specs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["label", "values"],
            properties: {
              label: { type: "string" },
              values: { type: "array", items: { type: "string" } },
              winnerIndex: { type: ["integer", "null"] },
            },
          },
        },
        categoryWinners: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["category", "winner", "reason"],
            properties: {
              category: { type: "string" },
              winner: { type: "string" },
              reason: { type: "string" },
            },
          },
        },
        overallWinner: { type: "string" },
        summary: { type: "string" },
        recommendation: { type: "string" },
      },
    };

    const system = `You are CompareX, an expert product-comparison AI. Given a list of products, produce a structured, factual, side-by-side comparison. Use realistic current knowledge of specs, pricing (as ranges/estimates), and reputation. For unreleased or ambiguous names, make clearly-labeled reasonable estimates. Keep pros/cons concise (max ~8 words each). Provide 8-14 spec rows relevant to the category. For each spec row, set winnerIndex to the product index that wins that spec, or null if tied/not applicable. The values array MUST have the same length and order as the input products. Category winners should be 4-8 meaningful categories (e.g., Performance, Camera, Battery, Value, Display, Design). Summary: 2-3 sentences. Recommendation: 2-3 sentences on who should pick what.`;

    const user = `Compare these ${data.products.length} items in the same order provided:\n${data.products.map((p, i) => `${i + 1}. ${p}`).join("\n")}${data.category ? `\n\nCategory hint: ${data.category}` : ""}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "comparison", strict: true, schema: jsonSchema },
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached — please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
      throw new Error(`AI gateway error (${res.status}): ${text.slice(0, 300)}`);
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty AI response");
    const parsed = JSON.parse(content);
    return OutputSchema.parse(parsed);
  });
