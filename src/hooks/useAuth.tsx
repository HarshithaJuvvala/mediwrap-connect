
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  location?: string;
  role: "patient" | "doctor" | "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check active session and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const userData = session.user.user_metadata;
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name: userData?.name,
          phone: userData?.phone,
          location: userData?.location || "India",
          role: userData?.role || "patient",
        });
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.info("Auth state changed:", event);
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (session) {
            const userData = session.user.user_metadata;
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: userData?.name,
              phone: userData?.phone,
              location: userData?.location || "India",
              role: userData?.role || "patient",
            });
            setIsAuthenticated(true);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Successfully logged in
      if (data && data.user) {
        const userData = data.user.user_metadata;
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          name: userData?.name,
          phone: userData?.phone,
          location: userData?.location || "India",
          role: userData?.role || "patient",
        });
        setIsAuthenticated(true);
        
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string, role: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            email_verified: true,
            phone_verified: false,
          },
        },
      });

      if (error) {
        console.error("Registration error:", error);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Successfully registered
      if (data && data.user) {
        toast({
          title: "Registration successful",
          description: "Your account has been created.",
        });
      }
    } catch (error) {
      console.error("Unexpected registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setUser(null);
      setIsAuthenticated(false);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Unexpected logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update user profile
  const updateUserProfile = async (userData: Partial<User>): Promise<User | null> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: userData.name,
          phone: userData.phone,
          location: userData.location,
          role: userData.role,
        }
      });
      
      if (error) {
        console.error("Profile update error:", error);
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }
      
      if (data.user) {
        const updatedUserData = data.user.user_metadata;
        const updatedUser = {
          id: data.user.id,
          email: data.user.email || "",
          name: updatedUserData.name,
          phone: updatedUserData.phone,
          location: updatedUserData.location || "India",
          role: updatedUserData.role,
        };
        
        setUser(updatedUser);
        return updatedUser;
      }
      
      return null;
    } catch (error) {
      console.error("Unexpected profile update error:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
