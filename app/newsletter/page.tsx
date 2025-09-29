"use client"

import { useState } from "react"
import Header from "@/components/Header"
import NewsletterForm from "@/components/NewsletterForm"
import NewsletterEditor, { type EditorValue } from "@/components/NewsletterEditor"
import ExportButtons from "@/components/ExportButtons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewsletterPage() {
  const [value, setValue] = useState<EditorValue>({
    subject: "",
    body: "",
    cta: "",
  })

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 grid gap-8">
        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-balance">Generate a Newsletter</CardTitle>
            </CardHeader>
            <CardContent>
              <NewsletterForm onGenerated={setValue} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-balance">Export</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <ExportButtons value={value} />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-balance">Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <NewsletterEditor value={value} onChange={setValue} />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
