"use client";

import { useEffect, useRef, useState } from "react";

export type SignatureKind = "draw" | "type" | "upload";

// Constants
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 200;
const DRAWING_LINE_WIDTH = 2;
const DRAWING_COLOR = "#111";
const BACKGROUND_COLOR = "#fff";

export default function SignatureTools({ onSignature }: { onSignature: (dataUrl: string) => void }) {
  const [mode, setMode] = useState<SignatureKind>("draw");
  const [typed, setTyped] = useState("");
  const [font, setFont] = useState("cursive");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("Failed to initialize canvas");
      return;
    }
    
    // Clear and setup canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = DRAWING_COLOR;
    ctx.lineWidth = DRAWING_LINE_WIDTH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [mode]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = DRAWING_COLOR;
    ctx.lineWidth = DRAWING_LINE_WIDTH;
  };

  const toDataUrl = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      if (mode === "draw") {
        const canvas = canvasRef.current;
        if (!canvas) {
          throw new Error("Canvas not available");
        }
        onSignature(canvas.toDataURL("image/png"));
      } else if (mode === "type") {
        if (!typed.trim()) {
          throw new Error("Please enter text for your signature");
        }
        
        // Render typed text to a temp canvas
        const canvas = document.createElement("canvas");
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Failed to create temporary canvas");
        }
        
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = DRAWING_COLOR;
        ctx.font = `64px ${font}`;
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        ctx.fillText(typed.trim(), 20, canvas.height / 2);
        
        onSignature(canvas.toDataURL("image/png"));
      } else if (mode === "upload") {
        throw new Error("Please select an image file first");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create signature";
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image file must be smaller than 5MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setError(null);
        onSignature(reader.result);
      }
    };
    reader.onerror = () => {
      setError("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  // Get coordinates from mouse or touch event
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      };
    }
  };

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    
    drawing.current = true;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!drawing.current) return;
    
    const coords = getCoordinates(e);
    if (!coords) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    
    const x = coords.x;
    const y = coords.y;
    
    // Simple smoothing: draw short quadratic curve to the next point
    ctx.quadraticCurveTo(x, y, x, y);
    ctx.stroke();
  };

  const handleEnd = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    drawing.current = false;
  };

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <button 
          onClick={() => setMode("draw")} 
          className={`px-3 py-1 rounded-md border transition-colors ${
            mode === "draw" ? "bg-foreground/5 border-foreground/30" : "hover:bg-foreground/5"
          }`}
          aria-label="Draw signature"
        >
          Draw
        </button>
        <button 
          onClick={() => setMode("type")} 
          className={`px-3 py-1 rounded-md border transition-colors ${
            mode === "type" ? "bg-foreground/5 border-foreground/30" : "hover:bg-foreground/5"
          }`}
          aria-label="Type signature"
        >
          Type
        </button>
        <button 
          onClick={() => setMode("upload")} 
          className={`px-3 py-1 rounded-md border transition-colors ${
            mode === "upload" ? "bg-foreground/5 border-foreground/30" : "hover:bg-foreground/5"
          }`}
          aria-label="Upload signature image"
        >
          Upload
        </button>
      </div>

      {mode === "draw" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Draw your signature</span>
            <button 
              onClick={clearCanvas}
              className="text-sm text-foreground/70 hover:text-foreground hover:underline"
              aria-label="Clear canvas"
            >
              Clear
            </button>
          </div>
          <div className="border rounded-md inline-block">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="bg-white cursor-crosshair touch-none"
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
              role="img"
              aria-label="Signature drawing canvas"
            />
          </div>
          <p className="text-xs text-foreground/60">
            Use mouse or touch to draw your signature
          </p>
        </div>
      )}

      {mode === "type" && (
        <div className="grid gap-3">
          <div>
            <label htmlFor="signature-text" className="block text-sm font-medium mb-2">
              Type your signature
            </label>
            <input 
              id="signature-text"
              value={typed} 
              onChange={(e) => setTyped(e.target.value)} 
              placeholder="Enter your name or signature" 
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] focus:border-transparent" 
            />
          </div>
          <div>
            <label htmlFor="signature-font" className="block text-sm font-medium mb-2">
              Font style
            </label>
            <select 
              id="signature-font"
              value={font} 
              onChange={(e) => setFont(e.target.value)} 
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] focus:border-transparent"
            >
              <option value="cursive">Cursive</option>
              <option value="serif">Serif</option>
              <option value="sans-serif">Sans</option>
              <option value="monospace">Mono</option>
            </select>
          </div>
        </div>
      )}

      {mode === "upload" && (
        <div className="space-y-3">
          <label htmlFor="signature-upload" className="block text-sm font-medium">
            Upload signature image
          </label>
          <input 
            id="signature-upload"
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] focus:border-transparent"
          />
          <p className="text-xs text-foreground/70">
            Supported formats: JPG, PNG, GIF. Max size: 5MB.
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700 text-sm">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div>
        <button 
          onClick={toDataUrl} 
          disabled={isProcessing || (mode === "type" && !typed.trim())}
          className="w-full rounded-md px-4 py-2 bg-[color:var(--color-accent)] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          aria-label="Use this signature"
        >
          {isProcessing ? "Processing..." : "Use Signature"}
        </button>
      </div>
    </div>
  );
}


