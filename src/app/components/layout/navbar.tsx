import { Link, useLocation, useNavigate } from "react-router";
import { Search, User, Plus, Menu, MessageCircle, LogOut, Bell, Map } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import logoImage from "figma:asset/e713beec509811896d7b73b03c4deee125aeff6f.png";
import { NotificationSidebar } from "../notification-sidebar";
import { CampusMapModal } from "../campus-map-modal";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCampusMapOpen, setIsCampusMapOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3">
          {/* Top Row */}
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-[#6BCF7F] flex-shrink-0">
              <img src={logoImage} alt="BatChar Logo" className="h-8 w-8 rounded-lg" />
              BatChar
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-md relative">
              <Input
                type="text"
                placeholder="상품 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pr-10 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#6BCF7F] focus-visible:border-[#6BCF7F]"
              />
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6BCF7F] hover:text-[#5ABD6D] transition-colors p-1.5 rounded-md hover:bg-gray-100"
                aria-label="검색"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Right Actions - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <Link to="/register-product">
                <Button 
                  size="default"
                  className="bg-[#6BCF7F] hover:bg-[#5ABD6D] text-white h-10 px-5 font-medium shadow-sm hover:shadow transition-all"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  상품 등록
                </Button>
              </Link>
              <Link to="/messages">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 ${
                    location.pathname === "/messages"
                      ? "bg-gray-100 text-[#6BCF7F]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCampusMapOpen(true)}
                className="h-10 w-10 text-gray-600 hover:bg-gray-100"
                title="캠퍼스 지도"
              >
                <Map className="w-5 h-5" />
              </Button>
              <Link to="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 ${
                    location.pathname === "/profile"
                      ? "bg-gray-100 text-[#6BCF7F]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotificationOpen(true)}
                className="h-10 w-10 text-gray-600 hover:bg-gray-100 relative"
                title="알림"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-10 w-10 text-gray-600 hover:bg-red-50 hover:text-red-600"
                  title="로그아웃"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Right Actions - Mobile */}
            <div className="flex md:hidden items-center gap-1">
              <Link to="/register-product">
                <Button 
                  size="sm"
                  className="bg-[#6BCF7F] hover:bg-[#5ABD6D] text-white h-9 px-3 font-medium"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/messages">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 ${
                    location.pathname === "/messages"
                      ? "bg-gray-100 text-[#6BCF7F]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCampusMapOpen(true)}
                className="h-9 w-9 text-gray-600 hover:bg-gray-100"
              >
                <Map className="w-4 h-4" />
              </Button>
              <Link to="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 ${
                    location.pathname === "/profile"
                      ? "bg-gray-100 text-[#6BCF7F]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <User className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotificationOpen(true)}
                className="h-9 w-9 text-gray-600 hover:bg-gray-100 relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full\"></span>
              </Button>
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-9 w-9 text-gray-600 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <NotificationSidebar 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />

      <CampusMapModal 
        isOpen={isCampusMapOpen} 
        onClose={() => setIsCampusMapOpen(false)} 
      />
    </>
  );
}