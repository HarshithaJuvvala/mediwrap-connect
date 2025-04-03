
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, User, ShoppingCart, Moon, Sun, Stethoscope, Shield, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    toast({
      title: isDarkMode ? "Light mode activated" : "Dark mode activated",
      duration: 2000,
    });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white dark:bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-mediwrap-blue dark:text-mediwrap-blue-light font-bold text-2xl">Medi</span>
              <span className="text-mediwrap-green dark:text-mediwrap-green-light font-bold text-2xl">Connect</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/consultation" className="text-gray-700 dark:text-gray-300 hover:text-mediwrap-blue dark:hover:text-mediwrap-blue-light px-3 py-2 rounded-md text-sm font-medium">
              Consultation
            </Link>
            <Link to="/pharmacy" className="text-gray-700 dark:text-gray-300 hover:text-mediwrap-blue dark:hover:text-mediwrap-blue-light px-3 py-2 rounded-md text-sm font-medium">
              Pharmacy
            </Link>
            <Link to="/blood-donation" className="text-gray-700 dark:text-gray-300 hover:text-mediwrap-blue dark:hover:text-mediwrap-blue-light px-3 py-2 rounded-md text-sm font-medium">
              Blood Donation
            </Link>
            <Link to="/community" className="text-gray-700 dark:text-gray-300 hover:text-mediwrap-blue dark:hover:text-mediwrap-blue-light px-3 py-2 rounded-md text-sm font-medium">
              Community
            </Link>
            {(!user || user?.role !== 'doctor') && (
              <Link to="/doctor-registration" className="text-gray-700 dark:text-gray-300 hover:text-mediwrap-blue dark:hover:text-mediwrap-blue-light px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
                <Stethoscope className="h-4 w-4" />
                <span>For Doctors</span>
              </Link>
            )}
            {user?.role === 'doctor' && (
              <Link to="/doctor-panel" className="text-gray-700 dark:text-gray-300 hover:text-mediwrap-blue dark:hover:text-mediwrap-blue-light px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30">
                <Stethoscope className="h-4 w-4" />
                <span>Doctor Panel</span>
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-mediwrap-blue dark:hover:text-mediwrap-blue-light px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30">
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-gray-700 dark:text-gray-300">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-gray-700 dark:text-gray-300">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-mediwrap-red rounded-full">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300 relative">
                    <User className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-700 dark:text-gray-300">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="default" className="bg-mediwrap-blue hover:bg-mediwrap-blue-light text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-gray-700 dark:text-gray-300">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-gray-700 dark:text-gray-300">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-mediwrap-red rounded-full">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-gray-700 dark:text-gray-300">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-card shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/consultation"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/consultation' 
                ? 'bg-gray-100 dark:bg-gray-800 text-mediwrap-blue dark:text-mediwrap-blue-light' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Consultation
            </Link>
            <Link
              to="/pharmacy"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/pharmacy' 
                ? 'bg-gray-100 dark:bg-gray-800 text-mediwrap-blue dark:text-mediwrap-blue-light' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Pharmacy
            </Link>
            <Link
              to="/blood-donation"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/blood-donation' 
                ? 'bg-gray-100 dark:bg-gray-800 text-mediwrap-blue dark:text-mediwrap-blue-light' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Blood Donation
            </Link>
            <Link
              to="/community"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/community' 
                ? 'bg-gray-100 dark:bg-gray-800 text-mediwrap-blue dark:text-mediwrap-blue-light' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Community
            </Link>
            
            {(!user || user?.role !== 'doctor') && (
              <Link
                to="/doctor-registration"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/doctor-registration' 
                  ? 'bg-gray-100 dark:bg-gray-800 text-mediwrap-blue dark:text-mediwrap-blue-light' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  <span>For Doctors</span>
                </div>
              </Link>
            )}
            
            {user?.role === 'doctor' && (
              <Link
                to="/doctor-panel"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/doctor-panel' 
                  ? 'bg-gray-100 dark:bg-gray-800 text-mediwrap-blue dark:text-mediwrap-blue-light' 
                  : 'bg-blue-50 dark:bg-blue-900/30 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  <span>Doctor Panel</span>
                </div>
              </Link>
            )}
            
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/admin' 
                  ? 'bg-gray-100 dark:bg-gray-800 text-mediwrap-blue dark:text-mediwrap-blue-light' 
                  : 'bg-purple-50 dark:bg-purple-900/30 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Admin Panel</span>
                </div>
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <User className="h-10 w-10 rounded-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {user ? user.name || "User" : "Guest User"}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {user ? user.email : "Not logged in"}
                </div>
                {user?.role && (
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                    Role: <span className="capitalize">{user.role}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-3 px-2 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setIsOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-mediwrap-blue hover:bg-mediwrap-blue-light rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
