import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Texts",
};

export default function AdminTextsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
