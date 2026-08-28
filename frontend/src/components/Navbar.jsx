import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/YourParking.png";
import { navItems } from "../constants";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNavbar = () => setMobileDrawerOpen(!mobileDrawerOpen);

  const handleLoginClick = () => navigate('/login');

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-800 bg-ink-950/80 py-3 backdrop-blur-lg">
      <div className="mx-auto px-4 lg:text-sm relative max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-shrink-0">
            <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
              <img className="h-7 w-7" src={logo} alt="Logo" />
            </div>
            <span className="text-xl tracking-tight text-white">
              Your<em className="not-italic text-primary-500">Parking</em>
            </span>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href} className="text-neutral-300 transition-colors hover:text-primary-400">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex items-center space-x-4 ml-8">
            <button className="btn-primary" onClick={handleLoginClick}>
              Ingresar
            </button>
          </div>
          <div className="lg:hidden flex flex-col justify-end">
            <button onClick={toggleNavbar} className="btn-ghost p-2 text-white">
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed top-16 right-0 z-20 w-72 border-l border-b border-neutral-800 bg-ink-900 p-6 lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-3">
                  <a href={item.href} className="text-neutral-200 hover:text-primary-400">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <button className="btn-primary mt-4 w-full" onClick={handleLoginClick}>
              Ingresar
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
