import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseProtocol: "http" | "https" = supabaseUrl.startsWith("http://")
  ? "http"
  : "https";
const supabaseHostname = supabaseUrl.replace(/^https?:\/\//, "").split("/")[0];
type RemotePatterns = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>;
const supabaseRemotePatterns: RemotePatterns = supabaseHostname
  ? [
      {
        protocol: supabaseProtocol,
        hostname: supabaseHostname,
        pathname: "/storage/v1/object/public/**",
      },
    ]
  : [];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseRemotePatterns,
  },
};

export default nextConfig;
