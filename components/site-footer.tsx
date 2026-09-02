export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background px-4 py-10 md:px-8">
      <div className="mx-auto max-w-[1600px] space-y-4">
        <span className="text-xl font-extrabold uppercase tracking-tight text-primary">
          Rebel<span className="text-foreground">Stream</span>
        </span>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Rebel Stream. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
