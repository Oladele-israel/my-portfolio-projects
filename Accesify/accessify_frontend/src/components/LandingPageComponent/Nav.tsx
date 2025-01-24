import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { pathname } = useLocation();

  const links = [
    { name: "about", path: "/about" },
    { name: "integration", path: "/integration" },
    { name: "blog", path: "/blog" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="w-full hidden lg:block">
        <div className="w-full bg-[#FFFFFF]  absolute h-20 opacity-5 border-white border-b-2" />
        <div className="flex w-[70rem] ml-auto mr-auto justify-between pt-5 items-center">
          <div className="text-white">Accessify</div>
          <div className="flex gap-10 clear-start text-white">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path} // Replace href with to
                className={`p-4 rounded-full text-sm capitalize border transition-colors ${
                  pathname === link.path
                    ? "bg-[rgba(177,161,161,0.05)] border-white"
                    : "border-transparent"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="bg-[rgba(177,161,161,0.05)] p-4 rounded-full text-sm border-white capitalize border border-gray-600 text-white">
            <p>login with google</p>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex justify-between items-center px-4 py-5 text-white w-full">
        <div>Accessify</div>
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="focus:outline-none"
        >
          {/* Hamburger Icon */}
          <div className="space-y-2">
            <span className="block w-8 h-1 bg-gray-200"></span>
            <span className="block w-8 h-1 bg-gray-200"></span>
            <span className="block w-8 h-1 bg-gray-200"></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 lg:hidden w-full bg-black shadow-lg z-50">
          <ul className="flex flex-col items-center gap-4 py-5 text-white">
            {links.map((link) => (
              <li key={link.name} className="w-full text-center">
                <Link
                  to={link.path} // Replace href with to
                  className={`block py-3 w-full text-sm capitalize transition-colors ${
                    pathname === link.path
                      ? "bg-[rgba(177,161,161,0.05)] border-white"
                      : "border-transparent"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <div className="bg-[rgba(177,161,161,0.05)] p-4 rounded-full text-sm border-white capitalize border border-gray-600 text-white">
                <p>login with google</p>
              </div>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Nav;
