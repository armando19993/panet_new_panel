import { Outlet, useNavigate } from "react-router-dom";
import { Navigation } from "./layout/Navigation";
import { ProfileDropdown } from "./layout/ProfileDropdown";
import { MobileNav } from "./layout/MobileNav";
import Cookies from "js-cookie";

export function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("sesion");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="flex flex-col lg:flex-row">
        {/* Navigation for large screens */}
        <Navigation className="hidden lg:block w-64 min-h-screen fixed left-0 border-r border-gray-300 bg-gray-100" />
        <main className="flex-1 lg:ml-64">
          <header className="flex items-center justify-between p-4 border-b border-gray-300 bg-gray-50">
            <div className="flex items-center gap-3">
              {/* Mobile navigation toggle */}
              <MobileNav />
            </div>
            <div className="flex items-center gap-4">
              {/* Profile dropdown */}
              <ProfileDropdown />
            </div>
          </header>
          <section className="p-6 bg-white">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}
