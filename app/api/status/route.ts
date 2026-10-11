import {NextResponse} from "next/server";import {modelName} from "@/lib/gemini";
export async function GET(){return NextResponse.json({configured:Boolean(process.env.GEMINIAPIKEY),model:modelName()},{headers:{"cache-control":"no-store"}})}
