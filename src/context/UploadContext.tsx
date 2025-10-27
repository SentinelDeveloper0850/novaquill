"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type UploadContextValue = {
  file: File | null;
  setFile: (file: File | null) => void;
};

const UploadContext = createContext<UploadContextValue | undefined>(undefined);

export function UploadProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <UploadContext.Provider value={{ file, setFile }}>
      {children}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const ctx = useContext(UploadContext);
  if (!ctx) throw new Error("useUpload must be used within UploadProvider");
  return ctx;
}


