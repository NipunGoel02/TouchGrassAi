import { NextResponse } from "next/server";
import { z } from "zod";
import { AdventureSchema, PreferencesSchema } from "@/lib/adventures";
import { adventureSystem, askGemini } from "@/lib/gemini";

const resultSchema = JSON.stringify({ type: "OBJECT", properties: { adventures: { type: "ARRAY", items: { type: "OBJECT", properties: {
  title: { type: "STRING" }, summary: { type: "STRING" }, category: { type: "STRING" }, durationMinutes: { type: "INTEGER" },
  difficulty: { type: "STRING", enum: ["easy", "moderate", "challenging"] }, energyLevel: { type: "STRING", enum: ["relaxed", "moderate", "energetic"] }, environment: { type: "STRING" },
  equipment: { type: "ARRAY", items: { type: "STRING" } }, preparation: { type: "ARRAY", items: { type: "STRING" } }, steps: { type: "ARRAY", items: { type: "OBJECT", properties: { instruction: { type: "STRING" }, estimatedMinutes: { type: "INTEGER" }, tip: { type: "STRING" } }, required: ["instruction", "estimatedMinutes"] } },
  observationPrompts: { type: "ARRAY", items: { type: "STRING" } }, safetyNotes: { type: "ARRAY", items: { type: "STRING" } }, accessibilityNotes: { type: "ARRAY", items: { type: "STRING" } }, weatherConsiderations: { type: "ARRAY", items: { type: "STRING" } },
}, required: ["title", "summary", "category", "durationMinutes", "difficulty", "energyLevel", "environment", "equipment", "preparation", "steps", "observationPrompts", "safetyNotes", "accessibilityNotes", "weatherConsiderations"] } } }, required: ["adventures"] });
const modelOutputSchema = z.object({ adventures: z.array(z.record(z.string(), z.unknown())) });

export async function POST(req: Request) {
  try {
    if (Number(req.headers.get("content-length") || 0) > 12_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    const input = PreferencesSchema.safeParse(await req.json());
    if (!input.success) return NextResponse.json({ error: "Please check your adventure preferences and try again." }, { status: 400 });
    const raw = await askGemini(adventureSystem, { preferences: input.data, request: "Return exactly three different activities: one discovery, one movement, and one observation activity." }, resultSchema);
    const parsed = modelOutputSchema.safeParse(raw);
    if (!parsed.success || parsed.data.adventures.length !== 3) throw new Error("Gemini returned an unexpected number or format of adventures.");
    const adventures = parsed.data.adventures.map((adventure) => AdventureSchema.parse({ ...adventure, id: crypto.randomUUID(), createdAt: new Date().toISOString(), source: "gemini" }));
    if (adventures.some((adventure) => adventure.durationMinutes > input.data.durationMinutes)) throw new Error("Generated activities exceeded your available time. Please retry.");
    return NextResponse.json({ adventures });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not generate adventures. Please retry." }, { status: 503 });
  }
}
