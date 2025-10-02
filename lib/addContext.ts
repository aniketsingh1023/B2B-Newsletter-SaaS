import fs from "fs/promises";
import AlchemystAI from "@alchemystai/sdk";
import dotenv from "dotenv";
dotenv.config();

const pdf = require('pdf-parse');

console.log(process.env.ALCHEMYST_AI_API_KEY);

const alchemystClient = new AlchemystAI({
  apiKey: process.env.ALCHEMYST_AI_API_KEY,
});

async function parseFileContent(
  filePath: string,
  mimeType: string
): Promise<string> {
  if (mimeType === "application/pdf") {
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
  } else if (mimeType === "application/json" || mimeType === "text/json") {
    const raw = await fs.readFile(filePath, "utf-8");
    return raw;
  } else {
    return await fs.readFile(filePath, "utf-8");
  }
}

export async function addContext(
  filePath: string,
  fileName: string,
  mimeType: string
) {
  const content = await parseFileContent(filePath, mimeType);

  await alchemystClient.v1.context.add({
    documents: [{ content }],
    context_type: "resource",
    source: "web-upload",
    scope: "internal",
    metadata : {
        fileName,                
      fileType: mimeType,     
      lastModified: new Date().toISOString(), 
      fileSize: (await fs.stat(filePath)).size,
    }
  });
  console.log(`Context added successfully for file: ${fileName}`);
}
