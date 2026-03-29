"use client";

import Finalizer from "@/app/sign/Finalizer";
import PdfViewer from "@/components/PdfViewer";
import SignatureTools from "@/components/SignatureTools";
import { useUpload } from "@/context/UploadContext";
import { track } from "@/lib/track";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46]; // %PDF
const INITIAL_SIGNATURE_POSITION = { x: 24, y: 24 };
const INITIAL_SIGNATURE_WIDTH = 220;
const MIN_SCALE = 0.6;
const MAX_SCALE = 2.8;
const SCALE_STEP = 0.1;

type UsageState = {
  subscription: "FREE" | "PRO" | "ANON";
  used: number;
  limit: number | null;
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const { file, setFile } = useUpload();

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadProcessing, setIsUploadProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [sigDataUrl, setSigDataUrl] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [sigPos, setSigPos] = useState(INITIAL_SIGNATURE_POSITION);
  const [sigWidth, setSigWidth] = useState(INITIAL_SIGNATURE_WIDTH);
  const [isDraggingSignature, setIsDraggingSignature] = useState(false);
  const [state, setState] = useState<UsageState | null>(null);
  const [docs, setDocs] = useState<Array<{ id: string; filename: string; createdAt: string }>>([]);
  const [analytics, setAnalytics] = useState<Array<{ name: string; count: number }>>([]);
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?next=/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then(setState)
      .catch(() => setState(null));
  }, []);

  const sub = state?.subscription ?? "ANON";
  const used = state?.used ?? 0;
  const limit = state?.limit;

  useEffect(() => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then((d) => setDocs(d || []))
      .catch(() => setDocs([]));
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => setAnalytics(d || []))
      .catch(() => setAnalytics([]));
  }, []);

  const validatePdfHeader = async (candidate: File): Promise<boolean> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const array = new Uint8Array((e.target?.result as ArrayBuffer) || new ArrayBuffer(0));
        resolve(PDF_MAGIC.every((byte, index) => array[index] === byte));
      };
      reader.onerror = () => resolve(false);
      reader.readAsArrayBuffer(candidate.slice(0, 4));
    });

  const handleFileSelect = async (selectedFile: File) => {
    setIsUploadProcessing(true);
    setUploadError(null);
    try {
      if (selectedFile.type !== "application/pdf") {
        throw new Error("Please upload a PDF document.");
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        throw new Error(`Document size must be under ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      }
      const isValidPdf = await validatePdfHeader(selectedFile);
      if (!isValidPdf) {
        throw new Error("The selected file is not a valid PDF.");
      }

      setFile(selectedFile);
      setPage(1);
      setScale(1.2);
      setSigPos(INITIAL_SIGNATURE_POSITION);
      setSigDataUrl(null);
      track("dashboard_upload_select");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to process file";
      setUploadError(message);
    } finally {
      setIsUploadProcessing(false);
    }
  };

  const handleUploadInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    handleFileSelect(selected);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    handleFileSelect(dropped);
  };

  const handleScaleChange = (direction: "increase" | "decrease") => {
    setScale((current) =>
      direction === "increase"
        ? Math.min(MAX_SCALE, current + SCALE_STEP)
        : Math.max(MIN_SCALE, current - SCALE_STEP)
    );
  };

  const handlePageChange = (direction: "next" | "prev") => {
    setPage((current) =>
      direction === "next" ? Math.min(numPages, current + 1) : Math.max(1, current - 1)
    );
  };

  const handleSignaturePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const overlayRect = e.currentTarget.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - overlayRect.left,
      y: e.clientY - overlayRect.top,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingSignature(true);
  };

  const handleSignaturePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingSignature || !viewerRef.current) return;
    const containerRect = viewerRef.current.getBoundingClientRect();
    const overlayWidth = e.currentTarget.offsetWidth;
    const overlayHeight = e.currentTarget.offsetHeight;
    const offset = dragOffsetRef.current ?? { x: overlayWidth / 2, y: overlayHeight / 2 };

    const x = e.clientX - containerRect.left - offset.x;
    const y = e.clientY - containerRect.top - offset.y;
    const boundedX = Math.max(0, Math.min(x, containerRect.width - overlayWidth));
    const boundedY = Math.max(0, Math.min(y, containerRect.height - overlayHeight));
    setSigPos({ x: boundedX, y: boundedY });
  };

  const handleSignaturePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragOffsetRef.current = null;
    setIsDraggingSignature(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  if (status === "loading") {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold mb-4">Signing Dashboard</h1>
        <div className="text-sm text-foreground/60">Loading…</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 md:py-10 space-y-8">
      <section className="rounded-2xl border border-foreground/15 p-6 md:p-8 bg-gradient-to-b from-[color:var(--color-accent)]/10 via-background to-background">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 items-start">
          <div className="space-y-5">
            <p className="inline-flex items-center rounded-full border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/10 px-3 py-1 text-xs font-medium">
              NovaQuill dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Upload document to sign
            </h1>
            <p className="text-foreground/75 max-w-xl">
              Fast path: upload a PDF, pick a saved signature or draw a new one with stroke cleanup,
              place it, and download your signed document in minutes.
            </p>
            <ol className="grid gap-2 text-sm text-foreground/80">
              <li><span className="font-medium">1.</span> Upload a file to sign</li>
              <li><span className="font-medium">2.</span> Choose a saved signature or draw a new one</li>
              <li><span className="font-medium">3.</span> Optionally refine drawing with cleanup assist</li>
              <li><span className="font-medium">4.</span> Place signature on the document</li>
              <li><span className="font-medium">5.</span> Save your signature for next time</li>
              <li><span className="font-medium">6.</span> Download the signed PDF</li>
            </ol>
          </div>

          <div className="rounded-xl border border-foreground/15 bg-background p-5 shadow-sm">
            <div
              className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                dragActive
                  ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/5"
                  : "border-foreground/25 hover:border-[color:var(--color-accent)]/60"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <p className="text-3xl mb-3" aria-hidden="true">✍️</p>
              <p className="text-lg font-medium">
                {dragActive ? "Drop your PDF here" : "Start signing a document"}
              </p>
              <p className="text-sm text-foreground/65 mt-1 mb-4">
                PDF only, up to {MAX_FILE_SIZE / (1024 * 1024)}MB
              </p>
              <input
                id="dashboard-upload"
                type="file"
                accept="application/pdf"
                onChange={handleUploadInput}
                className="hidden"
                disabled={isUploadProcessing}
              />
              <label
                htmlFor="dashboard-upload"
                className="inline-flex items-center rounded-md px-5 py-3 bg-[color:var(--color-accent)] text-white font-medium hover:opacity-90 transition cursor-pointer"
              >
                {isUploadProcessing ? "Processing..." : "Upload document to sign"}
              </label>
            </div>

            {uploadError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {uploadError}
              </div>
            )}

            {file && (
              <div className="mt-4 rounded-lg border border-foreground/15 bg-foreground/[0.02] p-3 text-sm">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-foreground/70">Ready to sign • {formatFileSize(file.size)}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid xl:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="rounded-xl border border-foreground/15 p-4 md:p-5">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs rounded-full border px-3 py-1">Step 4: Place signature</span>
            <button
              className="rounded-md border px-3 py-1 hover:bg-foreground/5 transition-colors"
              onClick={() => handleScaleChange("decrease")}
              aria-label="Zoom out"
              disabled={!file}
            >
              -
            </button>
            <div className="text-sm">Zoom {(scale * 100).toFixed(0)}%</div>
            <button
              className="rounded-md border px-3 py-1 hover:bg-foreground/5 transition-colors"
              onClick={() => handleScaleChange("increase")}
              aria-label="Zoom in"
              disabled={!file}
            >
              +
            </button>
            <button
              className="rounded-md border px-3 py-1 hover:bg-foreground/5 transition-colors"
              onClick={() => handlePageChange("prev")}
              disabled={!file || page <= 1}
              aria-label="Previous page"
            >
              Prev
            </button>
            <div className="text-sm">Page {page} / {numPages}</div>
            <button
              className="rounded-md border px-3 py-1 hover:bg-foreground/5 transition-colors"
              onClick={() => handlePageChange("next")}
              disabled={!file || page >= numPages}
              aria-label="Next page"
            >
              Next
            </button>
            <div className="ml-auto flex items-center gap-2">
              <label htmlFor="signature-width" className="text-xs text-foreground/70">Signature size</label>
              <input
                id="signature-width"
                type="range"
                min={120}
                max={320}
                value={sigWidth}
                onChange={(e) => setSigWidth(Number(e.target.value))}
                disabled={!sigDataUrl}
                aria-label="Signature width"
              />
            </div>
          </div>

          <div ref={viewerRef} className="relative rounded-lg border border-foreground/15 p-3 min-h-[420px] overflow-auto bg-foreground/[0.02]">
            <PdfViewer onMeta={({ numPages: totalPages }) => setNumPages(totalPages)} page={page} scale={scale} />
            {sigDataUrl && (
              <div
                className={`absolute select-none ${isDraggingSignature ? "cursor-grabbing" : "cursor-grab"}`}
                style={{ left: sigPos.x, top: sigPos.y, width: sigWidth }}
                onPointerDown={handleSignaturePointerDown}
                onPointerMove={handleSignaturePointerMove}
                onPointerUp={handleSignaturePointerUp}
                onPointerCancel={handleSignaturePointerUp}
                role="button"
                tabIndex={0}
                aria-label="Drag signature placement"
              >
                <Image
                  src={sigDataUrl}
                  alt="Selected signature preview"
                  width={sigWidth}
                  height={Math.round((sigWidth * 2) / 5)}
                  className="w-full h-auto pointer-events-none"
                  unoptimized
                />
              </div>
            )}
          </div>

          {!file && (
            <p className="text-sm text-foreground/65 mt-3">
              Upload a document above to unlock the signing workspace.
            </p>
          )}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-6">
          <div className="rounded-xl border border-foreground/15 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Step 2-3: Signature</h2>
              <span className="text-xs text-foreground/60">Saved + draw</span>
            </div>
            <SignatureTools
              onSignature={(value) => {
                setSigDataUrl(value);
                track("dashboard_signature_ready");
              }}
            />
          </div>

          <div className="rounded-xl border border-foreground/15 p-4">
            <h3 className="font-semibold mb-2">Step 6: Download signed PDF</h3>
            <p className="text-sm text-foreground/70 mb-3">
              Place the signature on the page, then finalize and download.
            </p>
            <Finalizer sigDataUrl={sigDataUrl} page={page} x={sigPos.x} y={sigPos.y} width={sigWidth} />
          </div>
        </aside>
      </section>

      <section className="rounded-xl border border-foreground/15 p-5">
        <h2 className="text-lg font-semibold mb-4">Account overview</h2>
        <div className="grid gap-4 sm:grid-cols-3 mb-4">
          <div className="rounded-lg border border-foreground/15 p-4">
            <div className="text-xs uppercase tracking-wide text-foreground/60">Usage</div>
            <div className="text-xl font-semibold mt-1">
              {sub === "PRO" ? `Pro: ${used}` : `${used} / ${limit ?? 0}`}
            </div>
          </div>
          <div className="rounded-lg border border-foreground/15 p-4">
            <div className="text-xs uppercase tracking-wide text-foreground/60">Subscription</div>
            <div className="text-xl font-semibold mt-1">{sub}</div>
          </div>
          <div className="rounded-lg border border-foreground/15 p-4">
            <div className="text-xs uppercase tracking-wide text-foreground/60">Analytics events</div>
            <div className="text-xl font-semibold mt-1">{analytics.reduce((sum, item) => sum + item.count, 0)}</div>
          </div>
        </div>

        <div className="rounded-lg border border-foreground/15 p-4">
          <div className="text-sm text-foreground/60 mb-2">Recent signed documents</div>
          <div className="grid gap-2">
            {docs.length === 0 && <div className="text-sm text-foreground/60">No documents yet.</div>}
            {docs.map((d) => (
              <div key={d.id} className="flex items-center justify-between border border-foreground/10 rounded-md px-3 py-2">
                <div className="min-w-0">
                  <div className="text-sm truncate">{d.filename}</div>
                  <div className="text-xs text-foreground/60">{new Date(d.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`/api/documents/${d.id}`} className="rounded-md border px-2 py-1 text-sm">Download</a>
                  <button
                    className="rounded-md border px-2 py-1 text-sm"
                    onClick={async () => {
                      await fetch(`/api/documents/${d.id}`, { method: "DELETE" });
                      setDocs((prev) => prev.filter((x) => x.id !== d.id));
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <details className="mt-4 rounded-lg border border-foreground/15 p-4">
          <summary className="cursor-pointer font-medium">Advanced account controls</summary>
          <div className="mt-3 space-y-4">
            <div className="grid gap-2">
              <div className="text-sm text-foreground/60">Analytics (aggregate)</div>
              {analytics.length === 0 && <div className="text-sm text-foreground/60">No events yet.</div>}
              {analytics.map((a) => (
                <div key={a.name} className="flex items-center justify-between border border-foreground/10 rounded-md px-3 py-2 text-sm">
                  <div>{a.name}</div>
                  <div className="font-medium">{a.count}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="text-sm text-foreground/60 mb-2">Data control</div>
              <div className="flex items-center gap-2">
                <a href="/api/dsar/export" className="rounded-md border px-3 py-2 text-sm">Export account</a>
                <form
                  action="/api/dsar/delete"
                  method="post"
                  onSubmit={(e) => {
                    if (!confirm("Delete your account and all documents?")) e.preventDefault();
                  }}
                >
                  <button className="rounded-md border px-3 py-2 text-sm text-red-600">Delete account</button>
                </form>
              </div>
              <div className="text-xs text-foreground/60 mt-2">
                See also: <a className="underline" href="/privacy">Privacy Policy</a> •{" "}
                <a className="underline" href="/terms">Terms</a>
              </div>
            </div>
          </div>
        </details>
      </section>
    </div>
  );
}


