import type { ReactNode } from "react";
import "./globals.css";

import { ChildProvider } from "../hooks/useChild";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-brand-slate">
        <ChildProvider>{children}</ChildProvider>
      </body>
    </html>
  );
}
