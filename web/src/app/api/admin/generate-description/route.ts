import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, category, ageGroup, sizes } = body ?? {};
  if (!name || !category || !ageGroup) {
    return NextResponse.json({ error: "Name, category, and age group are required" }, { status: 400 });
  }

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 500,
      system:
        "You write short, warm product descriptions for StyleRoute, a premium comfort-first kidswear brand. " +
        "Write 2-3 sentences, no markdown, no headings, no quotes around the output. " +
        "Emphasize comfort, everyday wearability, and the specific product — never generic filler.",
      messages: [
        {
          role: "user",
          content: `Write a product description for:\nName: ${name}\nCategory: ${category}\nAge group: ${ageGroup}${sizes ? `\nSizes: ${sizes}` : ""}`,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock) {
      return NextResponse.json({ error: "AI returned no text" }, { status: 502 });
    }

    return NextResponse.json({ description: textBlock.text.trim() });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: "AI service is not configured correctly" }, { status: 502 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "AI service is busy, try again in a moment" }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }
    throw error;
  }
}
