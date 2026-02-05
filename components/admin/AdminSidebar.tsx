"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { FiFileText } from "react-icons/fi";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { MdOutlineSettingsInputComponent } from "react-icons/md";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { LuPaintbrushVertical } from "react-icons/lu";

type Props = {
  host: string;
  onNavigate?: () => void; // used to close Sheet on mobile
};

export function AdminSidebar({ host, onNavigate }: Props) {
  return (
    <div className="flex h-auto w-full md:h-full flex-col bg-sidebar">
      {/* BRAND */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <strong className="font-extrabold bg-brand-primary text-white px-2 py-1 rounded-lg text-lg">
          theGreek
        </strong>
        <span className="ml-2 text-sm font-semibold text-muted-foreground">
          Admin
        </span>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-4 py-6 space-y-6 text-sm">
        <div>
          <p className="px-3 mb-4 text-xs font-semibold text-muted-foreground/80">
            {host}
          </p>

          <div className="space-y-1">
            <NavItem
              href="/admin"
              icon={<HiOutlineRocketLaunch />}
              onNavigate={onNavigate}
            >
              Dashboard
            </NavItem>

            <NavItem
              href="/admin/texts"
              icon={<FiFileText />}
              onNavigate={onNavigate}
            >
              Website Texts
            </NavItem>

            <NavItem
              href="/admin/photos"
              icon={<MdOutlinePhotoSizeSelectActual />}
              onNavigate={onNavigate}
            >
              Photos & Media
            </NavItem>

            <NavItem
              href="/admin/general"
              icon={<MdOutlineSettingsInputComponent />}
              onNavigate={onNavigate}
            >
              General Settings
            </NavItem>

            <NavItem
              href="/admin/appearance"
              icon={<LuPaintbrushVertical />}
              onNavigate={onNavigate}
            >
              Appearance
            </NavItem>
          </div>
        </div>
      </nav>
    </div>
  );
}

/* ---------- NAV ITEM ---------- */

function NavItem({
  href,
  icon,
  children,
  onNavigate,
}: {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const isActive =
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md transition
        ${
          isActive
            ? "bg-muted text-foreground font-medium"
            : "text-muted-foreground hover:bg-muted hover:text-foreground font-semibold"
        }
      `}
    >
      <span className="text-lg">{icon}</span>
      {children}
    </Link>
  );
}
