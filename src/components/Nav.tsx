"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  CalendarCheck2,
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  UserCircle,
  Plus,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { clsx } from "clsx";

type NavProps = {
  role: "STUDENT" | "TEACHER";
  displayName: string;
};

const baseLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pruefungen", label: "Prüfungen", icon: ListChecks },
  { href: "/kalender", label: "Kalender", icon: CalendarDays },
  { href: "/profil", label: "Profil", icon: UserCircle },
];

export function Nav({ role, displayName }: NavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <CalendarCheck2 size={18} />
          </span>
          <span className="hidden sm:inline">Prüfungsplaner</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {baseLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-soft text-primary"
                    : "text-muted hover:bg-surface-hover hover:text-foreground",
                )}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {role === "TEACHER" && (
            <Link
              href="/lehrer/neu"
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              <Plus size={16} />
              Prüfung erstellen
            </Link>
          )}
          <ThemeToggle />
          <div className="mx-1 h-6 w-px bg-border" />
          <div className="flex items-center gap-2 pl-1">
            <span className="text-sm text-muted">
              {displayName}
              <span className="ml-1 text-xs text-muted">
                ({role === "TEACHER" ? "Lehrer" : "Schüler"})
              </span>
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              title="Abmelden"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition hover:bg-surface-hover hover:text-danger cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground cursor-pointer"
            aria-label="Menü öffnen"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-surface px-4 pb-4 pt-2 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-1">
            {baseLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                    active ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-hover",
                  )}
                >
                  <Icon size={17} />
                  {link.label}
                </Link>
              );
            })}
            {role === "TEACHER" && (
              <Link
                href="/lehrer/neu"
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                <Plus size={17} />
                Prüfung erstellen
              </Link>
            )}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm text-muted">
              {displayName} <span className="text-xs">({role === "TEACHER" ? "Lehrer" : "Schüler"})</span>
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-danger cursor-pointer"
            >
              <LogOut size={15} />
              Abmelden
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
