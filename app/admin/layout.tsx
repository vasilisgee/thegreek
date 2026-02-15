import type { Metadata } from "next";
import AdminShell from "./AdminShell";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "theGreek — Admin Panel",
    template: "%s — theGreek — Admin Panel",
  },
  description: "theGreek Admin Panel",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": 0,
      "max-image-preview": "none",
      "max-snippet": 0,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminShell>
        {children}
        <Toaster />
      </AdminShell>
    </>
  );
}
