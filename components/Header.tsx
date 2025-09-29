export default function Header() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/placeholder-logo.svg" alt="Newsletter Writer logo" className="h-6 w-6" />
          <span className="font-medium">Newsletter Writer</span>
        </div>
        <p className="text-sm text-muted-foreground">Generate, edit, and export</p>
      </div>
    </header>
  )
}
