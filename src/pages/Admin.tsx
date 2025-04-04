
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsCards from "@/components/admin/AnalyticsCards";
import AdminSettings from "@/components/admin/AdminSettings";
import UserManagement from "@/components/admin/UserManagement";
import AppointmentsManagement from "@/components/admin/AppointmentsManagement";
import RecentAppointments from "@/components/admin/RecentAppointments";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import UserDialog from "@/components/admin/UserDialog";
import { v4 as uuidv4 } from 'uuid';

// Types
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviews: number;
  image: string;
  available: boolean;
  next_available: string;
  fee: number;
  education: string;
  experience: string;
  location: string;
  online: boolean;
}

interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  date: string;
  time: string;
  type: string;
  status: string;
  doctor_name?: string;
  patient_name?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [doctorsData, setDoctorsData] = useState<Doctor[]>([]);
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const [newUser, setNewUser] = useState<User>({
    id: uuidv4(),
    name: "",
    email: "",
    role: "patient",
    status: "Active"
  });

  useEffect(() => {
    console.log("Admin page loaded");
    console.log("Auth state:", { isAuthenticated: !!user, user });
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      console.log("Fetching admin data...");
      setIsLoading(true);
      
      // Fetch users
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*');
      
      if (usersError) {
        console.error("Error fetching users:", usersError);
        toast({
          title: "Error",
          description: "Failed to fetch users data",
          variant: "destructive",
        });
      } else {
        const formattedUsers = users?.map(user => ({
          id: user.id,
          name: user.name || "Unknown",
          email: user.email || "No email",
          role: user.role || "patient",
          status: "Active" as "Active" | "Inactive"
        })) || [];
        setUsersData(formattedUsers);
      }
      
      // Fetch doctors
      const { data: doctors, error: doctorsError } = await supabase
        .from('doctors')
        .select('*');
      
      if (doctorsError) {
        console.error("Error fetching doctors:", doctorsError);
        toast({
          title: "Error",
          description: "Failed to fetch doctors data",
          variant: "destructive",
        });
      } else {
        setDoctorsData(doctors || []);
      }
      
      // Fetch appointments
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*');
      
      if (appointmentsError) {
        console.error("Error fetching appointments:", appointmentsError);
        toast({
          title: "Error",
          description: "Failed to fetch appointments data",
          variant: "destructive",
        });
      } else {
        // Process appointments to add doctor and patient names
        const processedAppointments = appointments?.map(appointment => {
          const doctor = doctorsData.find(d => d.id === appointment.doctor_id);
          return {
            ...appointment,
            doctor_name: doctor ? doctor.name : "Unknown Doctor",
            patient_name: "Patient"
          };
        }) || [];
        
        setAppointmentsData(processedAppointments);
      }
      
      console.log("Fetched data:", { 
        usersData: users, 
        doctorsData: doctors, 
        appointmentsData: appointments 
      });
      
    } catch (error) {
      console.error("Error in fetchAdminData:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred fetching admin data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    // Validate the new user data
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate a proper UUID
      const userId = uuidv4();
      console.log("Adding new user with ID:", userId);
      
      // Add the user to the profiles table
      const { error } = await supabase.from('profiles').insert([
        {
          id: userId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      ]);

      if (error) {
        console.error("Error adding user:", error);
        toast({
          title: "Error",
          description: `Failed to add user: ${error.message}`,
          variant: "destructive",
        });
        throw error;
      }

      // Add the user to our state
      setUsersData([...usersData, { ...newUser, id: userId }]);
      
      toast({
        title: "Success",
        description: "User added successfully",
      });
      
      // Reset form and close dialog
      setNewUser({
        id: uuidv4(),
        name: "",
        email: "",
        role: "patient",
        status: "Active"
      });
      setIsDialogOpen(false);
      
      // Refresh data
      fetchAdminData();
      
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred adding the user",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: selectedUser.name,
          email: selectedUser.email,
          role: selectedUser.role
        })
        .eq('id', selectedUser.id);
      
      if (error) {
        console.error("Error updating user:", error);
        toast({
          title: "Error",
          description: `Failed to update user: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      // Update in the local state
      setUsersData(
        usersData.map(user => 
          user.id === selectedUser.id ? selectedUser : user
        )
      );
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      
      setSelectedUser(null);
      setIsDialogOpen(false);
      
      // Refresh data
      fetchAdminData();
      
    } catch (error) {
      console.error("Error in handleUpdateUser:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred updating the user",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Error",
          description: `Failed to delete user: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      // Update in the local state
      setUsersData(usersData.filter(user => user.id !== userId));
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      
    } catch (error) {
      console.error("Error in handleDeleteUser:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred deleting the user",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-8">
            <AnalyticsCards 
              analyticsData={{
                totalUsers: usersData.length,
                totalDoctors: doctorsData.length,
                activeAppointments: appointmentsData.length,
                totalRevenue: 25000
              }}
            />
            <RecentAppointments 
              appointments={appointmentsData.slice(0, 5).map(a => ({
                id: a.id,
                doctor_name: a.doctor_name || "Unknown Doctor",
                patient_name: a.patient_name || "Unknown Patient",
                date: a.date,
                time: a.time,
                status: a.status,
                type: a.type
              }))} 
            />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement 
              users={usersData}
              handleAddUser={() => {
                setSelectedUser(null);
                setIsDialogOpen(true);
              }}
              handleEditUser={(user) => {
                setSelectedUser(user);
                setIsDialogOpen(true);
              }}
              handleDeleteUser={handleDeleteUser}
            />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsManagement 
              appointments={appointmentsData.map(a => ({
                id: a.id,
                doctor_name: a.doctor_name || "Unknown Doctor",
                patient_name: a.patient_name || "Unknown Patient",
                date: a.date,
                time: a.time,
                status: a.status,
                type: a.type
              }))}
              searchTerm=""
            />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
      
      <UserDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
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
