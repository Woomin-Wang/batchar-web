import { Outlet } from "react-router";
import { Navbar } from "./navbar";
import { Toaster } from "../ui/sonner";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Outlet />
      <Toaster position="top-right" />
    </div>
  );
}
