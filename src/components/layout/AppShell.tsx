import { ReactNode } from "react";
import { Topbar } from "./Topbar";
import { PolarisAssistant } from "../polaris/PolarisAssistant";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="dark-zone bg-background">
        <Topbar />
      </div>
      <main className="flex-1 min-w-0">{children}</main>
      <PolarisAssistant />
    </div>
  );
}
