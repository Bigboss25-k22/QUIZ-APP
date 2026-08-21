import { AppHeader } from "@/features/auth/ui/app-header";
import { AuthGate } from "@/features/auth/ui/auth-gate";
import { WorkspaceNavigation } from "@/ui/layouts/workspace-navigation";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate><AppHeader/><div className="flex min-h-[calc(100vh-4rem)] w-full bg-paper"><WorkspaceNavigation/><main className="min-w-0 flex-1 bg-paper">{children}</main></div></AuthGate>;
}
