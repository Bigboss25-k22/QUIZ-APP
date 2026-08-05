import { AppHeader } from "@/features/auth/ui/app-header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <><AppHeader/>{children}</>;
}
