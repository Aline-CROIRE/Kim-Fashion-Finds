import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { useState } from "react";
import { Link} from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import { useCartStore } from "../../stores/useCartStore";

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
 

  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();

  return (
    <header className="fixed top-0 left-0 w-full bg-[#112843] bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-[#8C9EFF] py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center relative">
          {/* Logo */}
          <Link
            to={user ? "/" : "/signup"}
            className="relative flex items-center space-x-2 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              className="filter brightness-200 contrast-300 transition-transform duration-300"
              src="/log.png"
              alt="Logo"
              width={80}
              height={80}
            />
            <span className="hidden sm:inline text-xl text-[#8C9EFF]">
              KIMÉLIA Lux Fashion
            </span>

            {/* Floating Badge on Hover */}
            {isHovered && (
              <div className="absolute top-12 left-0 bg-[#112843] border border-[#8C9EFF] p-2 rounded-lg shadow-lg">
                <img
                  className="w-48 h-48filter brightness-200 contrast-300 transition-transform duration-300"
                  src="/log.png"
                  alt="Logo Hover Badge"
                />
              </div>
            )}
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="text-[#E0E0E0] hover:text-[#8C9EFF] transition duration-300"
            >
              Home
            </Link>

            {user && (
              <Link
                to="/cart"
                className="relative group text-[#E0E0E0] hover:text-[#8C9EFF] transition duration-300"
              >
                <ShoppingCart className="inline-block mr-1" size={20} />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -left-2 bg-[#8C9EFF] text-white rounded-full px-2 py-0.5 text-xs">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {isAdmin && (
              <Link
                className="bg-[#8C9EFF] hover:bg-[#6C7EFF] text-white px-3 py-1 rounded-md flex items-center transition duration-300"
                to="/secret-dashboard"
              >
                <Lock size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300"
                onClick={logout}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-[#8C9EFF] hover:bg-[#6C7EFF] text-white py-2 px-4 rounded-md flex items-center transition duration-300"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
