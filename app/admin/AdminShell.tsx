"use client";

import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { usePathname, useRouter } from "next/navigation";

/* shadcn */
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


/* icons */
import { Menu } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { FaGithub } from "react-icons/fa";

/* admin components */
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { UserMenu } from "@/components/admin/UserMenu";
import ThemeToggle from "@/components/admin/ThemeToggle";
import { useAdminSession } from "@/lib/auth/use-admin-session";
import { signOutAdmin } from "@/lib/auth/admin";
import { useIdleLogout } from "@/lib/idle-logout";

/* ================= PAGE META ================= */

const PAGE_META: Record<string, { title: string; description?: string }> = {
   "/admin": {
    title: "Dashboard",
    description: "",
  },
  "/admin/appearance": {
    title: "Appearance",
    description: "Customize the website look and feel, colors, and layout.",
  },
  "/admin/general": {
    title: "General Settings",
    description: "Global website settings and business information.",
  },
  "/admin/texts": {
    title: "Website Texts",
    description: "Main titles, descriptions, and button labels used across the website in multiple languages.",
  },
  "/admin/photos": {
    title: "Photos & Media",
    description: "Images and files displayed across the website sections.",
  },
};

export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pageMeta = PAGE_META[pathname] ?? { title: "" };
  const { status, profile, isGuest, isAuthenticated } = useAdminSession();

  const [host, setHost] = useState("—");

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
    if (status === "unauthorized") {
      router.replace("/login?error=unauthorized");
    }
  }, [status, router]);

  useIdleLogout(isAuthenticated || isGuest);

  async function handleLogout() {
    await signOutAdmin();
    router.replace("/login");
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background text-foreground" />
    );
  }

  if (status === "unauthenticated" || status === "unauthorized") {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="font-sans flex min-h-screen bg-background text-foreground">
        {/* SIDEBAR (desktop) */}
        <aside className="hidden md:flex xl:w-42 2xl:w-64 border-r border-border">
          <AdminSidebar host={host} />
        </aside>

        {/* MAIN */}
        <div className="flex-1 flex flex-col">
          {/* TOP BAR */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-background">
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                {pageMeta.title}
              </h1>
              {pageMeta.description && (
                <p className="text-xs text-muted-foreground hidden md:block">
                  {pageMeta.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              {/* USER MENU (desktop) */}
              <div className="hidden md:block">
                <UserMenu
                  email={profile?.email}
                  firstName={profile?.first_name}
                  fullName={profile?.full_name}
                  avatarUrl={profile?.avatar_url ?? undefined}
                  onLogout={handleLogout}
                  isGuest={isGuest}
                />
              </div>

              {/* MOBILE MENU */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden bg-primary text-primary-foreground"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="p-0 w-72 bg-sidebar">
                  <VisuallyHidden>
                    <SheetTitle>Admin navigation</SheetTitle>
                  </VisuallyHidden>

                  <AdminSidebar host={host} />
                  {/* USER FOOTER */}
                  <div className="border-t border-border p-4 pt-5 space-y-3">
                    {/* USER INFO */}
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-9 w-9 border border-border bg-card text-card-foreground">
                        {(isGuest || profile?.avatar_url) && (
                          <AvatarImage
                            src={
                              isGuest
                                ? "https://github.com/shadcn.png"
                                : profile?.avatar_url ?? ""
                            }
                            alt="User avatar"
                          />
                        )}
                        <AvatarFallback>
                          {(profile?.full_name || profile?.first_name)?.[0] ??
                            "G"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="leading-tight">
                        <div className="text-sm font-medium text-muted-foreground">
                          {isGuest ? "Guest" : profile?.first_name ?? "Owner"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {isGuest ? "guest@domain.com" : profile?.email ?? "—"}
                        </div>
                      </div>
                    </div>

                    {/* LOGOUT */}
                    <Button
                      variant="outline"
                      className="w-full bg-secondary text-secondary-foreground"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 overflow-y-auto bg-muted/40">
            {children}
          </main>

          
        {/* Footer */}
        <footer className="border-t bg-background px-6 py-5 text-xs text-center text-muted-foreground">
          
              © {new Date().getFullYear()} TheGreek — View project on <a href="https://github.com/vasilisgee/thegreek" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline hover:text-white transition"> GitHub <FaGithub className="text-base" /></a>
       
        </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}
