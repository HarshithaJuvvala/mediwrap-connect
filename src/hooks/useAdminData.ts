
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, Doctor, Appointment, AnalyticsData } from "@/types/admin";
import { fetchUsers, fetchDoctors, fetchAppointments, addUser, updateUser, deleteUser } from "@/services/admin-service";
import { v4 as uuidv4 } from 'uuid';

export function useAdminData() {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [doctorsData, setDoctorsData] = useState<Doctor[]>([]);
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [newUser, setNewUser] = useState<User>({
    id: uuidv4(),
    name: "",
    email: "",
    role: "patient",
    status: "Active"
  });

  const analyticsData: AnalyticsData = {
    totalUsers: usersData.length,
    totalDoctors: doctorsData.length,
    activeAppointments: appointmentsData.length,
    totalRevenue: 25000
  };

  const fetchAdminData = async () => {
    try {
      console.log("Fetching admin data...");
      setIsLoading(true);
      
      // Fetch users
      const users = await fetchUsers();
      setUsersData(users);
      
      // Fetch doctors
      const doctors = await fetchDoctors();
      setDoctorsData(doctors);
      
      // Fetch appointments
      const appointments = await fetchAppointments();
      
      // Process appointments to add doctor and patient names
      const processedAppointments = appointments.map(appointment => {
        const doctor = doctors.find(d => d.id === appointment.doctor_id);
        return {
          ...appointment,
          doctor_name: doctor ? doctor.name : "Unknown Doctor",
          patient_name: "Patient"
        };
      });
      
      setAppointmentsData(processedAppointments);
      
      console.log("Fetched data:", { 
        usersData: users, 
        doctorsData: doctors, 
        appointmentsData: processedAppointments 
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
    if (!newUser.name || !newUser.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const userId = await addUser({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status
      });
      
      // Add the user to our state with the new ID
      setUsersData([...usersData, { ...newUser, id: userId || uuidv4() }]);
      
      toast({
        title: "Success",
        description: "User added successfully",
      });
      
      // Reset form
      setNewUser({
        id: uuidv4(),
        name: "",
        email: "",
        role: "patient",
        status: "Active"
      });
      
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

  const handleUpdateUser = async (user: User) => {
    try {
      await updateUser(user.id, user);
      
      // Update in the local state
      setUsersData(
        usersData.map(u => u.id === user.id ? user : u)
      );
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      
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
      await deleteUser(userId);
      
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

  return {
    usersData,
    doctorsData,
    appointmentsData,
    isLoading,
    newUser,
    analyticsData,
    setNewUser,
    fetchAdminData,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser
  };
}
