import { describe, expect, it } from "vitest";
import { AdventureSchema, PreferencesSchema, selectTemplates, templates } from "@/lib/adventures";
import { parseGeminiJson, readGeminiKey } from "@/lib/gemini";
import { allowRequest } from "@/lib/rate-limit";

describe("adventure contracts",()=>{
  it("keeps a library of at least 24 validated static missions",()=>{expect(templates.length).toBeGreaterThanOrEqual(24);for(const mission of templates)expect(AdventureSchema.safeParse(mission).success).toBe(true)});
  it("rejects unreasonable durations and oversized collections",()=>{expect(PreferencesSchema.safeParse({durationMinutes:999,interests:["walk"],energyLevel:"relaxed",environment:"Garden",experience:"beginner"}).success).toBe(false);expect(AdventureSchema.safeParse({...templates[0],steps:Array(13).fill(templates[0].steps[0])}).success).toBe(false)});
  it("filters fallback missions by duration, interest, and environment",()=>{const results=selectTemplates({durationMinutes:30,interests:["Birdwatching"],environment:"Garden",energyLevel:"relaxed"});expect(results.length).toBeGreaterThan(0);expect(results.every(x=>x.durationMinutes<=30&&x.environment==="Garden")).toBe(true)});
  it("respects deterministic time bounds when no category matches",()=>{const results=selectTemplates({durationMinutes:10,interests:["unlisted"],environment:"Forest",energyLevel:"energetic"});expect(results.every(x=>x.durationMinutes<=10)).toBe(true)});
  it("parses valid Gemini JSON and rejects malformed or empty output",()=>{expect(parseGeminiJson('{"ok":true}')).toEqual({ok:true});expect(()=>parseGeminiJson("not json")).toThrow();expect(()=>parseGeminiJson(" ")).toThrow(/empty response/)});
  it("reports a missing server API key without revealing any value",()=>{const old=process.env.GEMINIAPIKEY;delete process.env.GEMINIAPIKEY;expect(()=>readGeminiKey()).toThrow(/not configured/);if(old!==undefined)process.env.GEMINIAPIKEY=old});
  it("bounds bursts of Gemini requests",()=>{expect(allowRequest("unit-test",2,60_000)).toBe(true);expect(allowRequest("unit-test",2,60_000)).toBe(true);expect(allowRequest("unit-test",2,60_000)).toBe(false)});
});
