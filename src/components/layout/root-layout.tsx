import { Outlet, useLocation } from "react-router";
import { Navbar } from "./navbar";
import { ScrollToTop } from "../scroll-to-top";

export function RootLayout() {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/signup"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {shouldShowNavbar && <Navbar />}
      <Outlet />
    </>
  );
}
