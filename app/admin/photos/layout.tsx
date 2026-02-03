import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photos & Media",
};

export default function AdminPhotosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
