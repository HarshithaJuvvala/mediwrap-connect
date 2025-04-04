
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  setUserRole: (role: "patient" | "doctor" | "admin") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Auth provider initialized");
    
    // First set up the auth listener before checking the session
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (session) {
            const userData = session.user.user_metadata;
            console.log("User signed in:", userData);
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
          console.log("User signed out");
        } else if (event === "USER_UPDATED") {
          if (session) {
            const userData = session.user.user_metadata;
            console.log("User updated:", userData);
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: userData?.name,
              phone: userData?.phone,
              location: userData?.location || "India",
              role: userData?.role || "patient",
            });
          }
        }
      }
    );

    // Then check if there's an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const userData = session.user.user_metadata;
        console.log("Auth session found:", userData);
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name: userData?.name,
          phone: userData?.phone,
          location: userData?.location || "India",
          role: userData?.role || "patient",
        });
        setIsAuthenticated(true);
      } else {
        console.log("No auth session found");
      }
      setIsLoading(false);
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Attempting login for:", email);
      
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

      if (data && data.user) {
        const userData = data.user.user_metadata;
        console.log("Login successful, user metadata:", userData);
        
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
          description: `You've successfully logged in as ${userData?.role || "patient"}.`,
        });
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: string) => {
    try {
      setIsLoading(true);
      console.log("Registering new user:", email, "with role:", role);
      
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

      if (data && data.user) {
        console.log("Registration successful:", data.user);
        toast({
          title: "Registration successful",
          description: `Your ${role} account has been created.`,
        });
      }
    } catch (error) {
      console.error("Unexpected registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      console.log("Logging out user");
      
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

  const updateUserProfile = async (userData: Partial<User>): Promise<User | null> => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile",
          variant: "destructive",
        });
        return null;
      }
      
      console.log("Updating profile with data:", userData);
      
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: userData.name,
          phone: userData.phone,
          location: userData.location,
          role: userData.role || user.role,
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
        console.log("Updated user metadata:", updatedUserData);
        
        const updatedUser = {
          id: data.user.id,
          email: data.user.email || "",
          name: updatedUserData.name || user.name,
          phone: updatedUserData.phone || user.phone,
          location: updatedUserData.location || "India",
          role: updatedUserData.role || user.role,
        };
        
        setUser(updatedUser);
        
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
        
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

  const setUserRole = async (role: "patient" | "doctor" | "admin"): Promise<void> => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to change roles",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Setting user role to:", role);
      
      const { data, error } = await supabase.auth.updateUser({
        data: { role }
      });
      
      if (error) {
        console.error("Role update error:", error);
        toast({
          title: "Role update failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      if (data.user) {
        const updatedUserData = data.user.user_metadata;
        console.log("Updated user metadata after role change:", updatedUserData);
        
        const updatedUser = {
          ...user,
          role: updatedUserData.role,
        };
        
        setUser(updatedUser);
        
        toast({
          title: "Role updated",
          description: `Your role has been updated to ${role}`,
        });
        
        // Force page reload to reflect new role
        window.location.href = role === 'doctor' ? '/doctor-panel' : 
                              role === 'admin' ? '/admin' : '/';
      }
    } catch (error) {
      console.error("Unexpected role update error:", error);
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
        setUserRole,
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
