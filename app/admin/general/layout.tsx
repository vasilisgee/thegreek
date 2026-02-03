import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "General Settings",
};

export default function AdminGeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
