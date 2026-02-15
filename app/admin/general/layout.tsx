import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Basic Settings",
};

export default function AdminGeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
