"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SWRConfig } from "swr";
import { CalendarDays, ChevronsLeft, ChevronsRight, ExternalLink, LogOut, SquareKanban, Users } from "lucide-react";
import sturnusIcon from "@/assets/IconeAzulSemFundo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fetcher } from "@/lib/api";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/crm", label: "CRM", icon: SquareKanban },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarDays },
];

export function AdminShell({ user, children }: { user: { name: string; email: string }; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  async function handleSignOut() {
    await signOut();
    window.location.href = "/admin/login";
  }

  return (
    <SWRConfig value={{ fetcher }}>
      <TooltipProvider>
        <div className="flex h-dvh overflow-hidden">
          <aside
            className={cn(
              "bg-sidebar-gradient border-border flex flex-col border-r transition-[width] duration-200",
              collapsed ? "w-16" : "w-64",
            )}
          >
            <Link
              href="/admin/leads"
              className={cn("flex h-14 items-center gap-2 px-4", collapsed ? "justify-center" : "justify-start")}
            >
              <Image src={sturnusIcon} alt="Sturnus Flow" className="h-8 w-8 shrink-0 object-contain" />
              {!collapsed && (
                <span className="font-[family-name:var(--font-display)] text-lg font-semibold">Sturnus Flow</span>
              )}
            </Link>

            <nav className="flex-1 overflow-y-auto px-2 py-2">
              {!collapsed && <p className="text-muted-foreground px-2 py-1 text-xs font-medium uppercase">Comercial</p>}
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const link = (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-2 text-base transition-colors",
                        collapsed ? "justify-center" : "justify-start",
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <item.icon className="size-5 shrink-0" />
                      {!collapsed && item.label}
                    </Link>
                  );

                  if (!collapsed) return <div key={item.href}>{link}</div>;
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </nav>

            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className={cn(
                "text-muted-foreground hover:text-foreground flex items-center gap-2 px-4 py-3 text-sm",
                collapsed ? "justify-center" : "justify-start",
              )}
            >
              {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
              {!collapsed && "Recolher"}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "border-border hover:bg-accent flex items-center gap-2 border-t px-4 py-3 text-left",
                    collapsed ? "justify-center" : "justify-start",
                  )}
                >
                  <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                    {user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  {!collapsed && (
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="text-muted-foreground truncate text-xs">Administrador</p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" target="_blank">
                    <ExternalLink className="size-4" /> Ver site
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="size-4" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </aside>

          <main className="bg-sidebar-gradient flex-1 overflow-y-auto">{children}</main>
        </div>
      </TooltipProvider>
    </SWRConfig>
  );
}
