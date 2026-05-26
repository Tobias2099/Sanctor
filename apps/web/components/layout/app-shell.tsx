import { ReactNode } from "react";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";

interface AppShellProps {
  children: ReactNode;
  floatingAction?: ReactNode;
  surface?: "cream";
}

export function AppShell({ children, floatingAction }: AppShellProps) {
  const surfaceClassName = "page-surface";

  return (
    <div className={`min-h-screen flex flex-col ${surfaceClassName} font-sans`}>
      <SiteHeader />
      <main className={`flex-1 ${surfaceClassName}`}>{children}</main>
      <SiteFooter />
      {floatingAction}
    </div>
  );
}
