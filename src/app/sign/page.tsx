"use client";
import PdfViewer from "@/components/PdfViewer";
import SignatureTools from "@/components/SignatureTools";
import { useState } from "react";
import Finalizer from "./Finalizer";
import Image from "next/image";

// Constants
const INITIAL_SIGNATURE_POSITION = { x: 20, y: 20 };
const INITIAL_SCALE = 1.2;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3.0;
const SCALE_STEP = 0.1;

export default function SignPage() {
  const [pdfSize, setPdfSize] = useState<{ width: number; height: number } | null>(null);
  const [sigDataUrl, setSigDataUrl] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>(INITIAL_SIGNATURE_POSITION);
  const [drag, setDrag] = useState(false);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [scale, setScale] = useState(INITIAL_SCALE);

  const handleScaleChange = (direction: 'increase' | 'decrease') => {
    setScale((currentScale) => {
      if (direction === 'increase') {
        return Math.min(MAX_SCALE, currentScale + SCALE_STEP);
      } else {
        return Math.max(MIN_SCALE, currentScale - SCALE_STEP);
      }
    });
  };

  const handlePageChange = (direction: 'next' | 'prev') => {
    setPage((currentPage) => {
      if (direction === 'next') {
        return Math.min(numPages, currentPage + 1);
      } else {
        return Math.max(1, currentPage - 1);
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-4">Sign Document</h1>
      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="relative border rounded-md overflow-auto p-3">
          <div className="flex items-center gap-3 mb-3">
            <button 
              className="rounded-md border px-3 py-1 hover:bg-foreground/5 transition-colors" 
              onClick={() => handleScaleChange('decrease')}
              aria-label="Zoom out"
            >
              -
            </button>
            <div className="text-sm">Zoom {(scale * 100).toFixed(0)}%</div>
            <button 
              className="rounded-md border px-3 py-1 hover:bg-foreground/5 transition-colors" 
              onClick={() => handleScaleChange('increase')}
              aria-label="Zoom in"
            >
              +
            </button>
            <div className="ml-4 flex items-center gap-2">
              <button 
                className="rounded-md border px-3 py-1 hover:bg-foreground/5 transition-colors" 
                onClick={() => handlePageChange('prev')}
                disabled={page <= 1}
                aria-label="Previous page"
              >
                Prev
              </button>
              <div className="text-sm">Page {page} / {numPages}</div>
              <button 
                className="rounded-md border px-3 py-1 hover:bg-foreground/5 transition-colors" 
                onClick={() => handlePageChange('next')}
                disabled={page >= numPages}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
          <PdfViewer onSize={setPdfSize} onMeta={({ numPages }) => setNumPages(numPages)} page={page} scale={scale} />
          {sigDataUrl && pdfSize && (
            <div
              className="absolute cursor-move"
              style={{ left: pos.x, top: pos.y }}
              onMouseDown={() => setDrag(true)}
              onMouseUp={() => setDrag(false)}
              onMouseMove={(e) => {
                if (!drag) return;
                const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
                const x = e.clientX - rect.left - 50;
                const y = e.clientY - rect.top - 20;
                setPos({ 
                  x: Math.max(0, Math.min(x, rect.width - 100)), 
                  y: Math.max(0, Math.min(y, rect.height - 40)) 
                });
              }}
            >
              <Image 
                src={sigDataUrl} 
                alt="Signature" 
                width={200}
                height={80}
                className="select-none" 
                draggable={false}
                unoptimized
              />
            </div>
          )}
        </div>
        <div className="sticky top-6">
          <SignatureTools onSignature={setSigDataUrl} />
          <div className="mt-4">
            <Finalizer sigDataUrl={sigDataUrl} page={page} x={pos.x} y={pos.y} width={200} />
          </div>
        </div>
      </div>
    </div>
  );
}


