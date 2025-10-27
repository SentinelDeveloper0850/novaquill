"use client";

import { ReactNode } from "react";
import { UploadProvider } from "@/context/UploadContext";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <UploadProvider>{children}</UploadProvider>
    </SessionProvider>
  );
}


