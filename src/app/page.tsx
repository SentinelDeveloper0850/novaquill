export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-5xl mx-auto px-6 py-20 grid gap-8">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          Upload. Sign. Download. <span className="text-[color:var(--color-accent)]">Done.</span>
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl">
          Minimalist PDF signing with ShapeAssist real-time correction. No emails. No watermarks.
        </p>
        <div className="flex gap-3">
          <a href="/upload" className="inline-flex items-center rounded-md px-5 py-3 bg-[color:var(--color-accent)] text-white hover:opacity-90 transition">
            Try Free
          </a>
          <a href="/pricing" className="inline-flex items-center rounded-md px-5 py-3 border border-foreground/20 hover:bg-foreground/5 transition">
            Upgrade to Pro
          </a>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 pt-10">
          <div className="rounded-lg border border-foreground/10 p-5 bg-background/60">
            <div className="font-medium mb-1">1. Upload</div>
            <div className="text-foreground/70 text-sm">Drag-and-drop or select your PDF.</div>
          </div>
          <div className="rounded-lg border border-foreground/10 p-5 bg-background/60">
            <div className="font-medium mb-1">2. Sign</div>
            <div className="text-foreground/70 text-sm">Draw, type, or upload signature with real-time smoothing.</div>
          </div>
          <div className="rounded-lg border border-foreground/10 p-5 bg-background/60">
            <div className="font-medium mb-1">3. Download</div>
            <div className="text-foreground/70 text-sm">Get a clean flattened PDF. No branding.</div>
          </div>
        </div>

        <section className="pt-6 grid gap-6">
          <h2 className="text-2xl font-semibold">Why NovaQuill</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="rounded-lg border border-foreground/10 p-5">
              <div className="font-medium mb-1">ShapeAssist</div>
              <div className="text-foreground/70 text-sm">Instant stroke correction after each pen lift for smooth, natural signatures.</div>
            </div>
            <div className="rounded-lg border border-foreground/10 p-5">
              <div className="font-medium mb-1">Clean flattened PDFs</div>
              <div className="text-foreground/70 text-sm">No watermarks, no branding, and a simple output file you can share immediately.</div>
            </div>
            <div className="rounded-lg border border-foreground/10 p-5">
              <div className="font-medium mb-1">Ultra-simple</div>
              <div className="text-foreground/70 text-sm">Upload → Sign → Download. Single signer. No emails, no clutter.</div>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="rounded-lg border border-foreground/10 p-5">
              <div className="font-medium mb-1">Free & Pro</div>
              <div className="text-foreground/70 text-sm">Free: 3 docs/month for accounts. Pro: unlimited cloud storage and signing.</div>
            </div>
            <div className="rounded-lg border border-foreground/10 p-5">
              <div className="font-medium mb-1">Private by design</div>
              <div className="text-foreground/70 text-sm">Encrypted storage for signed documents and user-controlled deletion.</div>
            </div>
            <div className="rounded-lg border border-foreground/10 p-5">
              <div className="font-medium mb-1">Global pricing</div>
              <div className="text-foreground/70 text-sm">EUR pricing with local ZAR checkout via PayFast.</div>
            </div>
          </div>
        </section>

        <section className="pt-6 grid gap-4">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <details className="rounded-lg border border-foreground/10 p-4">
            <summary className="cursor-pointer font-medium">Do I need an account?</summary>
            <div className="text-foreground/70 text-sm mt-2">No. Anonymous users can upload, sign and download. Accounts unlock cloud storage, saved signatures, and usage tracking.</div>
          </details>
          <details className="rounded-lg border border-foreground/10 p-4">
            <summary className="cursor-pointer font-medium">Are there watermarks?</summary>
            <div className="text-foreground/70 text-sm mt-2">Never. Signed PDFs are clean and branding-free.</div>
          </details>
          <details className="rounded-lg border border-foreground/10 p-4">
            <summary className="cursor-pointer font-medium">Is this a qualified digital signature?</summary>
            <div className="text-foreground/70 text-sm mt-2">No. NovaQuill creates simple electronic signatures by placing your signature image onto a PDF. Advanced or qualified signatures require a certified trust service provider.</div>
          </details>
        </section>
      </main>
    </div>
  );
}
