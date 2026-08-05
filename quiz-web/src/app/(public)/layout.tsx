import { AppHeader } from "@/features/auth/ui/app-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <><AppHeader/>{children}</>;
}
