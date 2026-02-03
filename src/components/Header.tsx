import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BsCart, BsPerson, BsSearch } from "react-icons/bs";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "MartAi", path: "/martai" },
  { name: "Category", path: "/category" },
  { name: "Videos", path: "/videos" },
  { name: "PC Builder", path: "/pcbuilder" },
  { name: "Tutor", path: "/tutor" },
  { name: "Repair", path: "/repair" },
  { name: "Become Seller", path: "/becomeseller" },
  { name: "About Us", path: "/aboutus" },
];

function Header() {
  const location = useLocation();

  return (
    <>
      {/* Sticky Wrapper */}
      <div className="sticky top-0 z-50">

        {/* Top Header */}
        <header className="py-2 bg-transparent">
          <div className="max-w-7xl mx-auto flex items-center justify-between bg-[#EBF6FA] rounded-2xl p-4 border border-white shadow-xl">

            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center gap-3 font-bold text-xl text-gray-900"
            >
              <img src="/logo.png" alt="Mart IT Logo" className="w-9 h-9" />
              <span>Mart IT</span>
            </NavLink>

            {/* Search */}
            <div className="relative w-96 lg:w-[50rem]">
              <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-full bg-gray-100 border border-gray-400 py-2 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Icons */}
            <div className="flex items-center gap-6">
              <NavLink to="/cart">
                <BsCart size={22} className="text-gray-600 hover:text-blue-600" />
              </NavLink>
              <NavLink to="/profile">
                <BsPerson size={24} className="text-gray-600 hover:text-blue-600" />
              </NavLink>
            </div>
          </div>
        </header>

        {/* Tabs Navigation */}
        <nav className="bg-white/80 backdrop-blur border-b">
          <div className="flex justify-center gap-4 py-3 flex-wrap">
            {navLinks.map((link) => {
              const isActive =
                link.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.path);

              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300
                    ${
                      isActive
                        ? "bg-[#EBF6FA] text-gray-900"
                        : "text-gray-500 hover:bg-[#EBF6FA] hover:text-gray-900"
                    }`}
                >
                  {link.name}
                </NavLink>
              );
            })}
          </div>
        </nav>

      </div>
    </>
  );
}

export default Header;
