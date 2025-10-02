"use client"

import type React from "react"

import { useState } from "react"
import useSWRMutation from "swr/mutation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
  onGenerated: (data: { subject: string; shortBody: string;longBody:string; cta: string }) => void
}

async function postJSON(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as { subject: string; shortBody: string;longBody:string; cta: string }
}

export default function NewsletterForm({ onGenerated }: Props) {
  const [companyName, setCompanyName] = useState("")
  const [audience, setAudience] = useState("")
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("Friendly")

  const { trigger, isMutating, error } = useSWRMutation("/api/newsletter", postJSON)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { audience: audience.trim(), topic: topic.trim(), tone: tone.trim() }
    if (!payload.audience || !payload.topic || !payload.tone) return
    const data = await trigger(payload)
    onGenerated(data)
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="audience">Audience</Label>
        <Input
          id="audience"
          placeholder="e.g., Startup founders"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="audience">Company Name</Label>
        <Input
          id="companyName"
          placeholder="e.g., TechCorp"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="topic">Topic</Label>
        <Input
          id="topic"
          placeholder="e.g., AI product launches"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label>Tone</Label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger aria-label="Choose tone">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Friendly">Friendly</SelectItem>
            <SelectItem value="Professional">Professional</SelectItem>
            <SelectItem value="Witty">Witty</SelectItem>
            <SelectItem value="Inspirational">Inspirational</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isMutating}>
          {isMutating ? "Generating…" : "Generate Newsletter"}
        </Button>
        {error ? (
          <span className="text-sm text-destructive" role="alert">
            Failed to generate. Try again.
          </span>
        ) : null}
      </div>
    </form>
  )
}
