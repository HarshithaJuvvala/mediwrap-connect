
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { Suspense, lazy } from "react";

// Pages
import Index from "./pages/Index";
import Consultation from "./pages/Consultation";
import Pharmacy from "./pages/Pharmacy";
import BloodDonation from "./pages/BloodDonation";
import Community from "./pages/Community";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import DoctorRegistration from "./pages/DoctorRegistration";
import NotFound from "./pages/NotFound";
import DoctorPanel from "./pages/DoctorPanel";

// Create a new query client with improved settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ 
  element, 
  requiredRole, 
  redirectPath = "/login" 
}: { 
  element: JSX.Element, 
  requiredRole?: "admin" | "doctor" | "patient", 
  redirectPath?: string 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to", redirectPath);
    return <Navigate to={redirectPath} />;
  }

  // If role is required but user doesn't have it, handle appropriately
  if (requiredRole && user?.role !== requiredRole) {
    console.log(`Role ${requiredRole} required, but user has role ${user?.role}`);
    
    if (requiredRole === 'admin') {
      // For admin pages, redirect to home
      console.log("Admin page requested, user is not admin, redirecting to home");
      return <Navigate to="/" />;
    } else if (requiredRole === 'doctor') {
      // For doctor pages, redirect to registration if not a doctor
      console.log("Redirecting to doctor registration");
      return <Navigate to="/doctor-registration" />;
    } else {
      // Default case, redirect to home
      console.log("Redirecting to home due to insufficient role");
      return <Navigate to="/" />;
    }
  }

  console.log("Access granted to protected route for role:", requiredRole);
  return element;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/consultation" element={<Consultation />} />
    <Route path="/pharmacy" element={<Pharmacy />} />
    <Route path="/blood-donation" element={<BloodDonation />} />
    <Route path="/community" element={<Community />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
    <Route path="/login" element={<Login />} />
    <Route path="/admin" element={<ProtectedRoute element={<Admin />} requiredRole="admin" />} />
    <Route path="/doctor-panel" element={<ProtectedRoute element={<DoctorPanel />} requiredRole="doctor" />} />
    <Route path="/doctor-registration" element={<DoctorRegistration />} />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
