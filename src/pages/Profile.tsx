
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import apiClient from "@/services/api";
import { CalendarDays, Clock, User, MapPin, Phone, Mail, UserCircle, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "+91 ",
    location: ""
  });

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  // Set initial profile data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        phone: user.phone || "+91 ",
        location: user.location || "India"
      });
    }
  }, [user]);

  // Fetch user appointments
  const { 
    data: appointments = [], 
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['userAppointments', user?.id],
    queryFn: () => {
      if (!user) return [];
      return apiClient.getPatientAppointments(user.id);
    },
    enabled: !!user,
  });

  // Fetch blood donations (if user is a donor)
  const { 
    data: bloodDonations = [], 
    isLoading: loadingDonations,
  } = useQuery({
    queryKey: ['userDonations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const service = new (await import('@/services/api/blood-donation-service')).BloodDonationService();
      const isDonor = await service.checkDonorStatus(user.id);
      
      if (isDonor) {
        return service.getUserDonations(user.id);
      }
      
      return [];
    },
    enabled: !!user,
  });

  // Profile update mutation
  const updateProfile = useMutation({
    mutationFn: async () => {
      if (!user) return null;
      
      const updates = {
        ...user,
        name: profileData.name,
        phone: profileData.phone,
        location: profileData.location
      };
      
      return updateUserProfile(updates);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Listen for real-time changes to appointments
  useEffect(() => {
    if (user) {
      const channel = supabase
        .channel('public:appointments')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'appointments',
          filter: `patient_id=eq.${user.id}`
        }, () => {
          refetch();
        })
        .subscribe();
        
      return () => {
        channel.unsubscribe();
      };
    }
  }, [user, refetch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate();
  };

  const handleResetProfile = () => {
    if (user) {
      setProfileData({
        name: user.name || "",
        phone: user.phone || "+91 ",
        location: user.location || "India"
      });
    }
    setIsEditing(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">Please log in to view your profile</p>
            <Button 
              className="mt-4 bg-mediwrap-blue hover:bg-mediwrap-blue-light"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>My Profile</span>
                  <Button 
                    variant="outline" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => logout()}
                  >
                    Logout
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={`https://avatar.vercel.sh/${user.email}?size=128`} alt={user.name} />
                  <AvatarFallback>
                    <UserCircle className="w-32 h-32 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="w-full mt-6 space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={profileData.name} 
                        onChange={handleInputChange} 
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        value={profileData.phone} 
                        onChange={handleInputChange} 
                        placeholder="Your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        value={profileData.location} 
                        onChange={handleInputChange} 
                        placeholder="Your location"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-mediwrap-blue hover:bg-mediwrap-blue-light"
                        disabled={updateProfile.isPending}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {updateProfile.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1" 
                        onClick={handleResetProfile}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
                    <Badge className="mt-2 capitalize">{user.role}</Badge>
                    
                    <div className="w-full mt-8 space-y-4">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-gray-500" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-gray-500" />
                        <span>{profileData.phone || "+91 (Not set)"}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                        <span>{profileData.location || "India"}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-8 bg-mediwrap-blue hover:bg-mediwrap-blue-light"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>My Health Records</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="appointments">
                  <TabsList className="mb-4">
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    <TabsTrigger value="donations">Blood Donations</TabsTrigger>
                    <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="appointments" className="space-y-4">
                    {isLoading ? (
                      <div className="py-8 text-center text-gray-500">
                        Loading appointments...
                      </div>
                    ) : appointments.length > 0 ? (
                      appointments.map((appointment) => (
                        <Card key={appointment.id}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div className="flex items-center">
                                <div className="bg-mediwrap-blue/10 p-3 rounded-full">
                                  <User className="h-6 w-6 text-mediwrap-blue" />
                                </div>
                                <div className="ml-4">
                                  <p className="font-semibold">Doctor #{appointment.doctor_id}</p>
                                  <p className="text-sm text-gray-500">Medical Specialist</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center mt-4 md:mt-0">
                                <div className="flex items-center mr-4">
                                  <CalendarDays className="h-4 w-4 text-gray-500 mr-2" />
                                  <span className="text-sm">{appointment.date}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                  <span className="text-sm">{appointment.time}</span>
                                </div>
                              </div>
                              
                              <div className="mt-4 md:mt-0">
                                <Badge variant={
                                  appointment.status === "confirmed" ? "default" : 
                                  appointment.status === "pending" ? "outline" : 
                                  "destructive"
                                }>
                                  {appointment.status}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex justify-end mt-4 space-x-2">
                              <Button variant="outline" size="sm">Reschedule</Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => apiClient.updateAppointmentStatus(appointment.id, "canceled")}
                              >
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="py-8 text-center text-gray-500">
                        No appointments found.
                        <div className="mt-4">
                          <Button onClick={() => navigate('/consultation')} className="bg-mediwrap-blue hover:bg-mediwrap-blue-light">
                            Book an Appointment
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="donations" className="space-y-4">
                    {loadingDonations ? (
                      <div className="py-8 text-center text-gray-500">
                        Loading donation records...
                      </div>
                    ) : bloodDonations.length > 0 ? (
                      bloodDonations.map((donation: any, index: number) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div className="flex items-center">
                                <div className="bg-mediwrap-red/10 p-3 rounded-full">
                                  <MapPin className="h-6 w-6 text-mediwrap-red" />
                                </div>
                                <div className="ml-4">
                                  <p className="font-semibold">{donation.center_name}</p>
                                  <p className="text-sm text-gray-500">Blood Donation Center</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center mt-4 md:mt-0">
                                <div className="flex items-center mr-4">
                                  <CalendarDays className="h-4 w-4 text-gray-500 mr-2" />
                                  <span className="text-sm">{donation.date}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                  <span className="text-sm">{donation.time}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="py-8 text-center text-gray-500">
                        No donation records found.
                        <div className="mt-4">
                          <Button onClick={() => navigate('/blood-donation')} className="bg-mediwrap-red hover:bg-mediwrap-red/90">
                            Schedule a Donation
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="prescriptions">
                    <div className="py-8 text-center text-gray-500">
                      Your prescription history will appear here.
                      <div className="mt-4">
                        <Button onClick={() => navigate('/pharmacy')} className="bg-mediwrap-blue hover:bg-mediwrap-blue-light">
                          Visit Pharmacy
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
