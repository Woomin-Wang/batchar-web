import { Outlet, useLocation } from "react-router";
import { Navbar } from "./components/layout/navbar";
import { ScrollToTop } from "./components/scroll-to-top";

export function Root() {
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