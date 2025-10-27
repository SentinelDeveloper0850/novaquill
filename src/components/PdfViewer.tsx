"use client";

import { useEffect, useRef, useState } from "react";
import { useUpload } from "@/context/UploadContext";
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import LoadingSpinner from "./LoadingSpinner";

// Configure worker served from /public
// The file will be copied to /public/pdf.worker.min.mjs during setup
if (typeof window !== "undefined") {
  GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

// Constants
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export default function PdfViewer({
  onSize,
  onMeta,
  page = 1,
  scale = 1.2,
}: {
  onSize?: (size: { width: number; height: number }) => void;
  onMeta?: (meta: { numPages: number }) => void;
  page?: number;
  scale?: number;
}) {
  const { file } = useUpload();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let retryTimeout: NodeJS.Timeout;

    async function render() {
      if (!file) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = getDocument({ data: arrayBuffer });
        const pdf: PDFDocumentProxy = await loadingTask.promise;
        
        if (cancelled) return;
        
        if (onMeta) onMeta({ numPages: pdf.numPages });
        
        const pg = await pdf.getPage(page);
        const viewport = pg.getViewport({ scale });
        const canvas = canvasRef.current;
        
        if (!canvas) return;
        
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Failed to get canvas context");
        }
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await pg.render({ 
          canvasContext: context as CanvasRenderingContext2D, 
          viewport 
        }).promise;
        
        if (!cancelled && onSize) {
          onSize({ width: viewport.width, height: viewport.height });
        }
        
        // Reset retry count on success
        setRetryCount(0);
        
      } catch (e: unknown) {
        if (cancelled) return;
        
        const message = e instanceof Error ? e.message : "Failed to render PDF";
        setError(message);
        
        // Implement retry logic for certain errors
        if (retryCount < MAX_RETRIES && shouldRetry(e)) {
          setRetryCount(prev => prev + 1);
          retryTimeout = setTimeout(() => {
            if (!cancelled) {
              render();
            }
          }, RETRY_DELAY * (retryCount + 1));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    function shouldRetry(error: unknown): boolean {
      if (error instanceof Error) {
        // Retry on network or temporary errors
        const retryableErrors = [
          'network error',
          'timeout',
          'temporary',
          'connection'
        ];
        return retryableErrors.some(msg => 
          error.message.toLowerCase().includes(msg)
        );
      }
      return false;
    }

    render();
    
    return () => {
      cancelled = true;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [file, page, scale, onSize, onMeta, retryCount]);

  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
  };

  if (!file) {
    return (
      <div className="flex items-center justify-center h-64 text-foreground/70">
        <div className="text-center">
          <div className="text-4xl mb-2">📄</div>
          <p>No file selected. Go to Upload.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      {/* Loading State */}
      {isLoading && (
        <LoadingSpinner text="Loading PDF..." />
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-red-600 mb-3">{error}</p>
            {retryCount < MAX_RETRIES && (
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-[color:var(--color-accent)] text-white rounded-md hover:opacity-90 transition-opacity"
              >
                Retry
              </button>
            )}
            {retryCount >= MAX_RETRIES && (
              <p className="text-sm text-foreground/70">
                Max retries reached. Please try uploading the file again.
              </p>
            )}
          </div>
        </div>
      )}

      {/* PDF Canvas */}
      {!isLoading && !error && (
        <canvas 
          ref={canvasRef} 
          className="max-w-full h-auto block" 
          role="img"
          aria-label={`PDF page ${page}`}
        />
      )}
    </div>
  );
}


