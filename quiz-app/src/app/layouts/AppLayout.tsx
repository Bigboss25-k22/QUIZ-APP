import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { StarBackground } from "@/components/StarBackgroud";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <StarBackground />
      <Navbar />
      <Outlet />
    </div>
  );
}
