import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const location = useLocation();

  // ❌ Hide Navbar on auth pages
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="bg-[#0F0F0F] min-h-screen text-white">
      
      {/* ✅ Navbar only when needed */}
      {!shouldHideNavbar && <Navbar />}

      <main className={`${!shouldHideNavbar ? "pt-20" : "pt-10"} pb-10 px-4`}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;