import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Calendar, Search, Settings2, User, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Import admin components
import AnalyticsCards from "@/components/admin/AnalyticsCards";
import RecentAppointments from "@/components/admin/RecentAppointments";
import UserManagement from "@/components/admin/UserManagement";
import AppointmentsManagement from "@/components/admin/AppointmentsManagement";
import UserDialog from "@/components/admin/UserDialog";
import AdminSettings from "@/components/admin/AdminSettings";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

interface Appointment {
  id: string;
  doctor_name: string;
  patient_name: string;
  date: string;
  time: string;
  status: string;
  type: string;
}

interface AnalyticsData {
  totalUsers: number;
  totalDoctors: number;
  activeAppointments: number;
  totalRevenue: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, setUserRole } = useAuth();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDevelopmentMode] = useState(true); // Always true for easier testing
  
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalDoctors: 0,
    activeAppointments: 0,
    totalRevenue: 0
  });

  // New user form state
  const [newUser, setNewUser] = useState<User>({
    id: "",
    name: "",
    email: "",
    role: "patient",
    status: "Active"
  });

  useEffect(() => {
    // Load the data immediately without checking authentication first
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      console.log("Fetching admin data...");
      
      // Fetch analytics data
      const { data: usersData } = await supabase.from('profiles').select('*');
      const { data: doctorsData } = await supabase.from('doctors').select('*');
      const { data: appointmentsData } = await supabase.from('appointments').select('*');
      
      console.log("Fetched data:", { usersData, doctorsData, appointmentsData });
      
      // Calculate approximate revenue (for demo purposes)
      let revenue = 0;
      if (appointmentsData) {
        revenue = appointmentsData.length * 500; // ₹500 per appointment
      }
      
      setAnalyticsData({
        totalUsers: usersData?.length || 0,
        totalDoctors: doctorsData?.length || 0,
        activeAppointments: appointmentsData?.filter(a => a.status === 'confirmed').length || 0,
        totalRevenue: revenue
      });
      
      // Fetch users - we can't directly query auth.users so we work with profiles
      const { data: profilesData } = await supabase.from('profiles').select('*');
      
      // We need to create User objects from profile data
      const mergedUsers: User[] = profilesData?.map(profile => {
        return {
          id: profile.id,
          name: profile.name || 'Unknown',
          email: `user-${profile.id.substring(0, 6)}@example.com`, // Use placeholder emails
          role: profile.role || 'patient',
          status: 'Active' as const
        };
      }) || [];
      
      setUsers(mergedUsers);
      
      // Fetch appointments with doctor and patient names
      const { data: appointmentsWithDetails, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id, 
          date,
          time,
          status,
          type,
          patient_id,
          doctor_id
        `);
        
      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
        return;
      }
      
      // Get doctor and patient names
      const enhancedAppointments: Appointment[] = await Promise.all(
        appointmentsWithDetails?.map(async appointment => {
          // Get doctor name
          const { data: doctorData } = await supabase
            .from('doctors')
            .select('name')
            .eq('id', appointment.doctor_id)
            .single();
            
          // Get patient name
          const { data: patientData } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', appointment.patient_id)
            .single();
            
          return {
            id: appointment.id,
            doctor_name: doctorData?.name || 'Unknown Doctor',
            patient_name: patientData?.name || 'Unknown Patient', 
            date: appointment.date,
            time: appointment.time,
            status: appointment.status,
            type: appointment.type
          };
        }) || []
      );
      
      setAppointments(enhancedAppointments);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleBecomeAdmin = async () => {
    try {
      await setUserRole('admin');
      toast({
        title: "Success",
        description: "You are now an admin. The page will refresh to apply changes.",
        duration: 5000,
      });
      
      // Refresh the page after a short delay to ensure user state is updated
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error becoming admin:', error);
      toast({
        title: "Error",
        description: "Failed to set admin role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddUser = async () => {
    try {
      // In a real application, you'd send an invite to the user's email
      // For this demo, we'll just add a profile
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            id: newUser.id, // In a real app, this would be created by auth
            name: newUser.name,
            role: newUser.role
          }
        ]);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User has been added.",
      });
      
      fetchData(); // Refresh the user list
      setIsUserDialogOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to add user.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser({...user});
    setIsUserDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: selectedUser.name,
          role: selectedUser.role
        })
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User has been updated.",
      });
      
      fetchData(); // Refresh the user list
      setIsUserDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      // In a real application with Supabase Auth, you'd need admin privileges
      // For this demo, we'll just remove the profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User has been deleted.",
      });
      
      fetchData(); // Refresh the user list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  const handleAddNewUser = () => {
    setSelectedUser(null);
    setNewUser({
      id: "",
      name: "",
      email: "",
      role: "patient",
      status: "Active"
    });
    setIsUserDialogOpen(true);
  };

  // Show authorization message if not an admin
  if (isAuthenticated && user && user.role !== 'admin') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Alert className="mb-6 border-amber-500">
            <AlertTitle className="text-amber-500">Admin Access Required</AlertTitle>
            <AlertDescription>
              You need admin privileges to access this page. Click the button below to gain admin access for testing.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleBecomeAdmin}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Become Admin (Development Mode)
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Alert className="mb-6 border-red-500">
            <AlertTitle className="text-red-500">Authentication Required</AlertTitle>
            <AlertDescription>
              You need to login before accessing the admin panel.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/login')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Admin Dashboard</h1>
          <div className="flex space-x-2 w-full md:w-auto">
            <Button 
              onClick={handleBecomeAdmin}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Refresh Admin Status
            </Button>
            <Input
              type="text"
              placeholder="Search..."
              className="w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center">
              <Search size={18} className="ml-2 text-gray-500" />
            </div>
          </div>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="dashboard" className="flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="doctors" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Doctors</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings2 className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <AnalyticsCards analyticsData={analyticsData} />
            <RecentAppointments appointments={appointments} />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <UserManagement 
              users={users} 
              handleAddUser={handleAddNewUser}
              handleEditUser={handleEditUser}
              handleDeleteUser={handleDeleteUser}
            />
          </TabsContent>
          
          <TabsContent value="doctors" className="space-y-4">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Manage Doctors</h2>
              <button 
                onClick={() => navigate('/doctor-registration')} 
                className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
              >
                Add Doctor
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8">
              <p className="text-center py-8 text-muted-foreground">
                Doctor management interface under development. 
                Use the Doctor Registration page to add new doctors.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="appointments" className="space-y-4">
            <AppointmentsManagement appointments={appointments} searchTerm={searchTerm} />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* User Dialog */}
      <UserDialog
        isOpen={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        selectedUser={selectedUser}
        newUser={newUser}
        onSelectedUserChange={setSelectedUser}
        onNewUserChange={setNewUser}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
      />
    </Layout>
  );
};

export default Admin;
