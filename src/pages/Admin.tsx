
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsCards from "@/components/admin/AnalyticsCards";
import AdminSettings from "@/components/admin/AdminSettings";
import UserManagement from "@/components/admin/UserManagement";
import AppointmentsManagement from "@/components/admin/AppointmentsManagement";
import RecentAppointments from "@/components/admin/RecentAppointments";
import UserDialog from "@/components/admin/UserDialog";
import { useAuth } from "@/hooks/useAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { User } from "@/types/admin";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [appointmentsSearchTerm, setAppointmentsSearchTerm] = useState("");
  const { user } = useAuth();
  
  const {
    usersData,
    appointmentsData,
    isLoading,
    newUser,
    analyticsData,
    setNewUser,
    fetchAdminData,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser
  } = useAdminData();

  useEffect(() => {
    console.log("Admin page loaded");
    console.log("Auth state:", { isAuthenticated: !!user, user });
    fetchAdminData();
  }, [user]);
  
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
            <AnalyticsCards analyticsData={analyticsData} />
            <RecentAppointments 
              appointments={appointmentsData.slice(0, 5)} 
              isLoading={isLoading}
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
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsManagement 
              appointments={appointmentsData}
              searchTerm={appointmentsSearchTerm}
              onSearchChange={setAppointmentsSearchTerm}
              isLoading={isLoading}
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
        onUpdateUser={() => selectedUser && handleUpdateUser(selectedUser)}
      />
    </Layout>
  );
};

export default Admin;
