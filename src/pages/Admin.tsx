import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users, 
  UserCog, 
  PieChart, 
  Calendar, 
  Settings, 
  Search, 
  PlusCircle, 
  Pill, 
  Droplet, 
  MessagesSquare, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit,
  Trash
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

interface Ticket {
  id: number;
  user: string;
  issue: string;
  status: "Open" | "In Progress" | "Closed" | "Cancelled";
  priority: "High" | "Medium" | "Low";
  date: string;
}

interface AppointmentAdmin {
  id: number;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "Cancelled";
}

const Admin = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    role: string;
    status: "Active" | "Inactive";
  }>({
    name: "",
    email: "",
    role: "patient",
    status: "Active"
  });
  
  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You must be an admin to access this page",
        variant: "destructive"
      });
      navigate("/");
    }
    
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate, toast]);

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.auth.admin.listUsers();
        
        if (error) {
          console.error("Error fetching users:", error);
          return [];
        }
        
        return data.users.map(authUser => ({
          id: authUser.id,
          name: authUser.user_metadata?.name || "N/A",
          email: authUser.email || "N/A",
          role: authUser.user_metadata?.role || "patient",
          status: authUser.banned ? "Inactive" : "Active"
        })) as User[];
      } catch (error) {
        console.error("Error in fetchUsers:", error);
        return [
          { id: "1", name: "John Doe", email: "john@example.com", role: "patient", status: "Active" },
          { id: "2", name: "Sarah Johnson", email: "sarah@example.com", role: "doctor", status: "Active" },
          { id: "3", name: "Michael Brown", email: "michael@example.com", role: "patient", status: "Inactive" },
          { id: "4", name: "Emily Davis", email: "emily@example.com", role: "admin", status: "Active" },
        ];
      }
    },
    enabled: isAuthenticated && user?.role === 'admin'
  });

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 1, user: "John Doe", issue: "Cannot book appointment", status: "Open", priority: "High", date: "2024-03-28" },
    { id: 2, user: "Sarah Johnson", issue: "Payment not processed", status: "In Progress", priority: "Medium", date: "2024-03-27" },
    { id: 3, user: "Robert Smith", issue: "Missing prescription", status: "Closed", priority: "Low", date: "2024-03-25" },
  ]);

  const { data: appointments = [], isLoading: loadingAppointments } = useQuery({
    queryKey: ['adminAppointments'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*');
        
        if (error) {
          console.error("Error fetching appointments:", error);
          return [];
        }
        
        return data.map(apt => ({
          id: apt.id,
          patient: `Patient #${apt.patient_id}`,
          doctor: `Doctor #${apt.doctor_id}`,
          date: apt.date,
          time: apt.time,
          status: apt.status.charAt(0).toUpperCase() + apt.status.slice(1) as "Confirmed" | "Pending" | "Cancelled"
        }));
      } catch (error) {
        console.error("Error in fetchAppointments:", error);
        return [
          { id: 1, patient: "John Doe", doctor: "Dr. Sarah Johnson", date: "2024-03-30", time: "10:00 AM", status: "Confirmed" },
          { id: 2, patient: "Michael Brown", doctor: "Dr. Robert Adams", date: "2024-03-29", time: "2:30 PM", status: "Cancelled" },
          { id: 3, patient: "Emily Davis", doctor: "Dr. Sarah Johnson", date: "2024-03-31", time: "9:15 AM", status: "Pending" },
        ];
      }
    },
    enabled: isAuthenticated && user?.role === 'admin'
  });
  
  const updateTicketStatus = (id: number, newStatus: Ticket["status"]) => {
    setTickets(tickets.map(ticket => 
      ticket.id === id ? { ...ticket, status: newStatus } : ticket
    ));
    
    toast({
      title: "Ticket Updated",
      description: `Ticket #${id} status changed to ${newStatus}`,
    });
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const addUser = useMutation({
    mutationFn: async () => {
      const newUserId = Math.random().toString(36).substring(2, 15);
      const createdUser = {
        id: newUserId,
        ...newUser
      };
      
      return createdUser;
    },
    onSuccess: (createdUser) => {
      queryClient.setQueryData(['adminUsers'], (old: User[] = []) => [...old, createdUser]);
      setIsAddUserOpen(false);
      setNewUser({
        name: "",
        email: "",
        role: "patient",
        status: "Active"
      });
      toast({
        title: "User Created",
        description: `User ${createdUser.name} has been created successfully.`,
      });
    }
  });
  
  const updateUser = useMutation({
    mutationFn: async (user: User) => {
      return user;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['adminUsers'], (old: User[] = []) => 
        old.map(user => user.id === updatedUser.id ? updatedUser : user)
      );
      setIsEditUserOpen(false);
      setEditingUser(null);
      toast({
        title: "User Updated",
        description: `User ${updatedUser.name} has been updated successfully.`,
      });
    }
  });
  
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      return userId;
    },
    onSuccess: (userId) => {
      queryClient.setQueryData(['adminUsers'], (old: User[] = []) => 
        old.filter(user => user.id !== userId)
      );
      toast({
        title: "User Deleted",
        description: "User has been deleted successfully.",
      });
    }
  });
  
  const stats = {
    users: users.length,
    appointments: appointments.length,
    medications: 839,
    bloodDonations: 86
  };
  
  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value } as typeof newUser);
    }
  };
  
  const handleRoleChange = (value: string) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, role: value });
    } else {
      setNewUser({ ...newUser, role: value });
    }
  };
  
  const handleStatusChange = (value: "Active" | "Inactive") => {
    if (editingUser) {
      setEditingUser({ ...editingUser, status: value });
    } else {
      setNewUser({ ...newUser, status: value });
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold">{stats.users}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Appointments</p>
                <h3 className="text-2xl font-bold">{stats.appointments}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Pill className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Medications</p>
                <h3 className="text-2xl font-bold">{stats.medications}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Droplet className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Blood Donations</p>
                <h3 className="text-2xl font-bold">{stats.bloodDonations}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Support Tickets</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>User Management</span>
                  <Button 
                    className="bg-mediwrap-blue hover:bg-mediwrap-blue-light flex items-center gap-2"
                    onClick={() => setIsAddUserOpen(true)}
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Add User</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage all registered users in the system
                </CardDescription>
                <div className="flex items-center mt-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search users..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingUsers ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Loading users...
                          </TableCell>
                        </TableRow>
                      ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.id.substring(0, 8)}...</TableCell>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === "admin" ? "outline" : "secondary"}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === "Active" ? "default" : "destructive"}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setEditingUser(user);
                                    setIsEditUserOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500"
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
                                      deleteUser.mutate(user.id);
                                    }
                                  }}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>
                  Manage user support tickets and inquiries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Issue</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell>{ticket.id}</TableCell>
                          <TableCell>{ticket.user}</TableCell>
                          <TableCell>{ticket.issue}</TableCell>
                          <TableCell>
                            <Badge variant={
                              ticket.status === "Open" ? "destructive" : 
                              ticket.status === "In Progress" ? "outline" : 
                              "default"
                            }>
                              {ticket.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              ticket.priority === "High" ? "destructive" : 
                              ticket.priority === "Medium" ? "outline" : 
                              "secondary"
                            }>
                              {ticket.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{ticket.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="icon" onClick={() => updateTicketStatus(ticket.id, "In Progress")} title="Mark as In Progress">
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" className="text-green-500" onClick={() => updateTicketStatus(ticket.id, "Closed")} title="Close Ticket">
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500" onClick={() => updateTicketStatus(ticket.id, "Cancelled")} title="Cancel Ticket">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointments Management</CardTitle>
                <CardDescription>
                  View and manage all appointments in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingAppointments ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            Loading appointments...
                          </TableCell>
                        </TableRow>
                      ) : appointments.length > 0 ? (
                        appointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell>{appointment.id}</TableCell>
                            <TableCell>{appointment.patient}</TableCell>
                            <TableCell>{appointment.doctor}</TableCell>
                            <TableCell>{appointment.date}</TableCell>
                            <TableCell>{appointment.time}</TableCell>
                            <TableCell>
                              <Badge variant={
                                appointment.status === "Confirmed" ? "default" : 
                                appointment.status === "Pending" ? "outline" : 
                                "destructive"
                              }>
                                {appointment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-red-500">Cancel</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            No appointments found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>System Analytics</CardTitle>
                <CardDescription>
                  View system usage and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center p-12 border-2 border-dashed rounded-md">
                  <div className="text-center">
                    <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">Analytics dashboard content would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center p-12 border-2 border-dashed rounded-md">
                  <div className="text-center">
                    <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">System settings configuration would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                name="name"
                value={newUser.name}
                onChange={handleUserFormChange}
                placeholder="Full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={newUser.email}
                onChange={handleUserFormChange}
                placeholder="Email address"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={newUser.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={newUser.status} onValueChange={handleStatusChange as (value: string) => void}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
            <Button onClick={() => addUser.mutate()}>
              {addUser.isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input 
                id="edit-name"
                name="name"
                value={editingUser?.name || ""}
                onChange={handleUserFormChange}
                placeholder="Full name"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input 
                id="edit-email"
                name="email"
                type="email"
                value={editingUser?.email || ""}
                onChange={handleUserFormChange}
                placeholder="Email address"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editingUser?.role || ""} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select 
                value={editingUser?.status || ""} 
                onValueChange={handleStatusChange as (value: string) => void}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
            <Button onClick={() => editingUser && updateUser.mutate(editingUser)}>
              {updateUser.isPending ? "Updating..." : "Update User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Admin;
