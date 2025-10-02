// File: app/api/newsletter/route.ts
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { generateNewsletter } from "@/lib/newsletterAgent";
import { addContext } from "@/lib/addContext";
// No longer need 'pdfjs-dist' or 'path'

/**
 * Extracts and validates JSON content from a file buffer.
 * @param buffer The file content as a Buffer.
 * @returns A formatted JSON string.
 */
function extractJsonContentFromBuffer(buffer: Buffer): string {
  const content = buffer.toString("utf-8");
  try {
    // Parse and re-stringify to ensure it's valid and nicely formatted JSON
    const parsed = JSON.parse(content);
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    // If the content is not valid JSON, we'll log a warning.
    // The function will then throw an error, which will be caught by the main handler.
    console.error("The provided file content was not valid JSON.", error);
    throw new Error("File content must be valid JSON.");
  }
}


export async function POST(request: Request) {
  try {
    const data = await request.formData();

    const companyName = data.get("companyName") as string | null;
    const audience = data.get("audience") as string | null;
    const topic = data.get("topic") as string | null;
    const tone = data.get("tone") as string | null;
    const file = data.get("file") as File | null;

    if (!companyName || !audience || !topic || !tone || !file) {
      return NextResponse.json({ error: "Missing required fields or file" }, { status: 400 });
    }
    
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    if (fileBuffer.length === 0) {
        return NextResponse.json({ error: "Cannot process an empty file." }, { status: 400 });
    }

    // Use the new, simpler function
    const fileContent = extractJsonContentFromBuffer(fileBuffer);
    
    await addContext(fileContent, file.name, file.type);
    const newsletter = await generateNewsletter({ companyName, audience, topic, tone });

    return NextResponse.json({ newsletter });

  } catch (error) {
    console.error("API error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}