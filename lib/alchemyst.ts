export type NewsletterInput = {
  audience: string
  topic: string
  tone: string
}

export type Newsletter = {
  subject: string
  body: string
  cta: string
}

/**
 * Calls an external Alchemyst-like API if ALCHEMYST_API_KEY is set.
 * Falls back to a deterministic generator for local/dev without keys.
 */
export async function generateNewsletter(input: NewsletterInput): Promise<Newsletter> {
  const { audience, topic, tone } = input

  // Prefer server-side env; Next.js exposes env only on the server.
  const apiKey = process.env.ALCHEMYST_API_KEY

  // Example external call: adjust endpoint/schema to your provider if needed.
  if (apiKey) {
    try {
      const res = await fetch("https://api.alchemyst.ai/v1/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ audience, topic, tone }),
      })

      if (!res.ok) {
        const body = await res.text().catch(() => "")
        throw new Error(`Alchemyst API error: ${res.status} ${body}`)
      }

      const data = (await res.json()) as Partial<Newsletter>
      // Simple normalization/guard
      return {
        subject: data.subject ?? `A ${tone} update on ${topic}`,
        body:
          data.body ??
          `Hello ${audience},\n\nHere are fresh insights on ${topic}. This ${tone.toLowerCase()} edition highlights what matters right now.\n\n- Key takeaway #1\n- Key takeaway #2\n- Key takeaway #3\n\nThanks for reading!`,
        cta: data.cta ?? `Discover more about ${topic}`,
      }
    } catch (err) {
      // Graceful fallback if external call fails
      console.error("[alchemyst] Falling back due to error:", (err as Error).message)
    }
  }

  // Fallback generator (no external dependency)
  return {
    subject: `Your ${tone} update on ${topic}`,
    body: `Hi ${audience},

In this ${tone.toLowerCase()} newsletter, we’re covering the most important updates on ${topic}:

1. What changed this week
2. Why it matters to ${audience}
3. How to take action next

Stay tuned for more insights!`,
    cta: `Learn more about ${topic}`,
  }
}
