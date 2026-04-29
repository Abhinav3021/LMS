import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Loan Management System",
  description: "Professional lending workflow platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
