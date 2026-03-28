import type { ReactNode } from "react";
import { MdEditNote } from "react-icons/md";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuABQ-v4jX0vzKTyRBV6CouK3dJXEEb8VhKfGocYXKW9cT58PA1Pw6wRFT4Umvimne5yRlyV7L1DlAIaeCC1dkn1y2mLgq-YF2Cq06auWpsqZJIR6fRBLYlg_-ZAbFPT5ZkbEOR1kbmCkWA4E6iDV1G4w7iHtK2jSZKMdN9x_XFBhcMOGrS-cIu_OGuwdtIdqapPCMoK1bEfnDxSRbWmJ7ZKD6I1YmJRXVqx1Z8ZcHEXRvGg_1t2mPMQW6kw84cQJlEWX4qbOPl-q_9l";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-[max(884px,100dvh)] flex flex-col md:flex-row overflow-hidden bg-nq-background text-nq-on-surface font-nq-body selection:bg-nq-primary/30">
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative items-center justify-center overflow-hidden bg-nq-surface-container-lowest">
        <div className="absolute inset-0 z-0 opacity-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="w-full h-full object-cover"
            src={HERO_IMAGE}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-nq-background via-transparent to-transparent z-10" />
        <div className="relative z-20 p-16 max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <MdEditNote className="w-10 h-10 shrink-0 text-nq-primary" aria-hidden />
            <span className="font-nq-headline font-extrabold text-3xl tracking-tight text-nq-on-surface">
              NovaQuill
            </span>
          </div>
          <h1 className="font-nq-headline text-5xl lg:text-7xl font-extrabold tracking-tighter leading-tight mb-6">
            The <span className="text-nq-primary">Obsidian</span> Ledger for the Modern Age.
          </h1>
          <p className="text-nq-on-surface-variant text-xl leading-relaxed max-w-md">
            Experience a monolithic space designed for high-stakes decisions and ethereal digital
            signatures.
          </p>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 bg-nq-surface z-30">
        <div className="w-full max-w-md space-y-10">
          <div className="md:hidden flex flex-col items-center mb-12">
            <div className="flex items-center gap-2 mb-4">
              <MdEditNote className="w-8 h-8 shrink-0 text-nq-primary" aria-hidden />
              <span className="font-nq-headline font-extrabold text-2xl tracking-tight">
                NovaQuill
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-nq-headline text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-nq-on-surface-variant">{subtitle}</p>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
