import Link from "next/link";
import LandingFaq from "@/components/landing/LandingFaq";
import LandingMobileBar from "@/components/landing/LandingMobileBar";
import LandingNav from "@/components/landing/LandingNav";
import {
  MdBolt,
  MdDownloadForOffline,
  MdDraw,
  MdEditNote,
  MdGroups,
  MdUploadFile,
} from "react-icons/md";

const HERO_DASH_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCcqah1L7sUuwZYHqVh4ujp7m4AZDzcocJFOXRte78_1McPaclqXYbIV1MCmaHazZ2MOId85OeZivgjX9va8gA5oPiST0769EiMebtXw6q6MJtSvJ2YIuF4h3J-Rd7B43PsZ7fuCj_KC6VcqoC0y_eXXGePu0nnFRaYZoLSbnghoz1w2srDfpcg6CMGHeXm7MwE5RtXbVuNHMMAxTvESWAb6WnTw0uKmGj5IQ_FC_c6Ve1EeC1X6k9ZJa0nRVjjI1QPvscQrrIKzBAV";

const SECURITY_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDtgglQbiD05ISqjW3545UDDN9h1xaXQZ5ixo7n5w-OtWc8U4UE4LittdqABJW7oXIbFbIjZVPaXuKO_Gs5zrh7fsUO6svmwJS_Ru2lz_7g9B6Ejoprz0iO69xCVoRjw3sNtsVhDehTqUE9tB7ZO8Vj8bLAaaakrjXB6yEvyhv0USAe22003ShjhM3SzQwFMI3cALjVH9029SdONjrHpbbqKRjKG9W-91JJiMKu2ngBGco1WaO4_FJPiE2AvZr461W7On4CSM0dwqC4";

export default function Home() {
  return (
    <div className="min-h-[max(884px,100dvh)] bg-nq-background text-nq-on-surface font-nq-body selection:bg-nq-primary selection:text-nq-on-primary">
      <LandingNav />

      <main className="pt-16 pb-8 md:pb-16">
        {/* Hero */}
        <section className="relative min-h-[707px] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nq-primary/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-nq-secondary/10 blur-[120px] rounded-full" />
          </div>

          <div className="relative z-10 max-w-4xl w-full text-center">
            <span className="inline-block px-4 py-1.5 rounded-full border border-nq-outline-variant/30 text-nq-primary-dim text-xs font-bold uppercase tracking-widest mb-8 bg-nq-surface-container-low">
              The Future of Digital Signatures
            </span>
            <h1 className="font-nq-headline font-extrabold text-5xl md:text-7xl lg:text-8xl text-nq-on-surface leading-[1.1] tracking-tight mb-8">
              Upload. Sign.
              <br />
              Download. <span className="text-nq-primary">Done.</span>
            </h1>
            <p className="text-nq-on-surface-variant max-w-2xl mx-auto mb-12 text-lg md:text-xl leading-relaxed">
              Experience the Obsidian Ledger. A monolithic, secure, and ethereal space for high-stakes
              digital decisions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/upload"
                className="w-full sm:w-auto px-10 py-4 rounded-xl nq-signature-gradient text-nq-on-primary-container font-bold text-lg hover:shadow-[0_0_24px_rgba(88,231,251,0.3)] transition-all active:scale-95 text-center"
              >
                Try Free
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-10 py-4 rounded-xl border border-nq-outline-variant/30 text-nq-on-surface font-bold text-lg hover:bg-nq-surface-container-highest transition-all active:scale-95 text-center"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>

          <div className="mt-20 relative w-full max-w-5xl z-10">
            <div className="bg-nq-surface-container-high rounded-2xl p-4 shadow-2xl transform rotate-1 md:rotate-2 border border-nq-outline-variant/10 nq-landing-signature-glow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="NovaQuill dashboard preview"
                className="rounded-xl w-full object-cover aspect-video shadow-inner"
                src={HERO_DASH_IMG}
              />
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="px-6 py-24 bg-nq-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="font-nq-headline font-bold text-3xl md:text-4xl text-nq-on-surface mb-4">
                The Seamless Workflow
              </h2>
              <div className="h-1 w-20 bg-nq-primary rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group p-8 rounded-2xl bg-nq-surface-container-highest border border-nq-outline-variant/5 hover:border-nq-primary/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-nq-surface-container-lowest flex items-center justify-center mb-6 group-hover:bg-nq-primary/10 transition-colors">
                  <MdUploadFile className="w-7 h-7 text-nq-primary" aria-hidden />
                </div>
                <h3 className="font-nq-headline font-bold text-xl mb-4 text-nq-on-surface">1. Upload</h3>
                <p className="text-nq-on-surface-variant text-sm leading-relaxed">
                  Drop your PDFs, contracts, or legal documents into our secure vault. We support all
                  major file formats with encrypted transit.
                </p>
              </div>
              <div className="group p-8 rounded-2xl bg-nq-surface-container-highest border border-nq-outline-variant/5 hover:border-nq-primary/20 transition-all duration-300 md:translate-y-8">
                <div className="w-12 h-12 rounded-xl bg-nq-surface-container-lowest flex items-center justify-center mb-6 group-hover:bg-nq-primary/10 transition-colors">
                  <MdDraw className="w-7 h-7 text-nq-primary" aria-hidden />
                </div>
                <h3 className="font-nq-headline font-bold text-xl mb-4 text-nq-on-surface">2. Sign</h3>
                <p className="text-nq-on-surface-variant text-sm leading-relaxed">
                  Apply your digital identity with precision. Our signature pad uses vector technology for
                  pixel-perfect obsidian-ink finishes.
                </p>
              </div>
              <div className="group p-8 rounded-2xl bg-nq-surface-container-highest border border-nq-outline-variant/5 hover:border-nq-primary/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-nq-surface-container-lowest flex items-center justify-center mb-6 group-hover:bg-nq-primary/10 transition-colors">
                  <MdDownloadForOffline className="w-7 h-7 text-nq-primary" aria-hidden />
                </div>
                <h3 className="font-nq-headline font-bold text-xl mb-4 text-nq-on-surface">3. Download</h3>
                <p className="text-nq-on-surface-variant text-sm leading-relaxed">
                  Export your legally binding document instantly. Complete with a cryptographic audit trail
                  and timestamped verification.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bento */}
        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-nq-headline font-extrabold text-4xl md:text-5xl mb-6 text-nq-on-surface">
                Why NovaQuill?
              </h2>
              <p className="text-nq-on-surface-variant max-w-xl mx-auto">
                Beyond just signatures—we provide a monolithic infrastructure for professional trust.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(240px,auto)]">
              <div className="md:col-span-8 md:row-span-2 rounded-3xl bg-nq-surface-container-high p-8 relative overflow-hidden group min-h-[280px] md:min-h-0">
                <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                  <div>
                    <h3 className="font-nq-headline font-bold text-2xl mb-4 text-nq-on-surface">
                      Enterprise-Grade Security
                    </h3>
                    <p className="text-nq-on-surface-variant max-w-md">
                      Every document is hashed and stored across multiple nodes, ensuring that your data
                      remains immutable and private.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <span className="px-4 py-2 rounded-lg bg-nq-surface-container-lowest text-nq-primary text-xs font-bold uppercase">
                      AES-256
                    </span>
                    <span className="px-4 py-2 rounded-lg bg-nq-surface-container-lowest text-nq-primary text-xs font-bold uppercase">
                      SOC2 Type II
                    </span>
                  </div>
                </div>
                <div className="absolute right-[-10%] bottom-[-10%] w-2/3 opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    className="w-full object-cover rounded-3xl"
                    src={SECURITY_IMG}
                  />
                </div>
              </div>
              <div className="md:col-span-4 rounded-3xl bg-nq-surface-container-highest p-8 flex flex-col justify-center border border-nq-outline-variant/10">
                <MdBolt className="text-nq-primary mb-4 w-10 h-10" aria-hidden />
                <h3 className="font-nq-headline font-bold text-xl text-nq-on-surface">Instant Processing</h3>
                <p className="text-nq-on-surface-variant text-sm mt-2">Sign and send in under 30 seconds.</p>
              </div>
              <div className="md:col-span-4 rounded-3xl nq-signature-gradient p-8 flex flex-col justify-center text-nq-on-primary-container min-h-[240px]">
                <MdGroups className="mb-4 w-10 h-10" aria-hidden />
                <h3 className="font-nq-headline font-bold text-xl">Collaborative</h3>
                <p className="text-nq-on-primary-container/80 text-sm mt-2">
                  Team-based workflows for complex approvals.
                </p>
              </div>
            </div>
          </div>
        </section>

        <LandingFaq />
      </main>

      <LandingMobileBar />

      <footer
        id="contact"
        className="px-6 pt-12 pb-28 md:pb-12 bg-nq-surface-container-lowest border-t border-nq-outline-variant/5"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <MdEditNote className="text-nq-primary w-6 h-6 shrink-0" aria-hidden />
            <span className="font-nq-headline font-extrabold text-nq-on-surface text-lg">NovaQuill</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-nq-on-surface-variant">
            <Link className="hover:text-nq-primary transition-colors" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="hover:text-nq-primary transition-colors" href="/terms">
              Terms of Service
            </Link>
            <a className="hover:text-nq-primary transition-colors" href="#contact">
              Contact
            </a>
          </div>
          <div className="text-xs text-nq-on-surface-variant/50 text-center md:text-right">
            © {new Date().getFullYear()} NovaQuill Technologies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
