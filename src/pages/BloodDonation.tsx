
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Calendar, Bell, Heart, Clock, Check, X } from "lucide-react";
import { BloodDonationService } from "@/services/api/blood-donation-service";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

// Mock data for blood donation centers - updated for India
const donationCenters = [
  {
    id: 1,
    name: "Apollo Hospitals",
    address: "Plot No, 1, Film Nagar, Hyderabad",
    distance: "1.2 km",
    bloodNeeded: ["A+", "O+", "B-"],
    slots: ["9:00 AM", "11:30 AM", "2:00 PM"],
    image: "https://images.unsplash.com/photo-1587351021759-3772687a4d9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    urgent: true
  },
  {
    id: 2,
    name: "AIIMS Blood Bank",
    address: "Saket Nagar, Bhopal",
    distance: "2.5 km",
    bloodNeeded: ["AB+", "O-"],
    slots: ["10:00 AM", "1:00 PM", "3:30 PM"],
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    urgent: false
  },
  {
    id: 3,
    name: "Fortis Blood Donation Centre",
    address: "Mulund Goregaon Link Road, Mumbai",
    distance: "3.7 km",
    bloodNeeded: ["A-", "B+", "O+"],
    slots: ["8:30 AM", "12:00 PM", "4:00 PM"],
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    urgent: true
  },
  {
    id: 4,
    name: "Max Healthcare Blood Bank",
    address: "Press Enclave Road, New Delhi",
    distance: "4.1 km",
    bloodNeeded: ["AB-", "O+"],
    slots: ["9:30 AM", "1:30 PM", "3:00 PM"],
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    urgent: false
  }
];

// Mock data for recent requests - updated for India
const recentRequests = [
  {
    id: 1,
    name: "Raj K.",
    bloodType: "A+",
    hospital: "Apollo Hospitals",
    urgency: "Urgent",
    dateNeeded: "Today",
    reason: "Surgery"
  },
  {
    id: 2,
    name: "Priya M.",
    bloodType: "O-",
    hospital: "AIIMS",
    urgency: "Critical",
    dateNeeded: "Today",
    reason: "Accident"
  },
  {
    id: 3,
    name: "Aditya R.",
    bloodType: "B+",
    hospital: "Fortis Healthcare",
    urgency: "Medium",
    dateNeeded: "Tomorrow",
    reason: "Surgery"
  }
];

const BloodDonation = () => {
  const { user, isAuthenticated } = useAuth();
  const [bloodType, setBloodType] = useState("");
  const [location, setLocation] = useState("");
  const { toast } = useToast();
  const [showRegistration, setShowRegistration] = useState(false);
  const [donorFormData, setDonorFormData] = useState({
    name: "",
    bloodType: "",
    dob: "",
    phone: "",
    address: ""
  });
  const navigate = useNavigate();
  
  const bloodDonationService = new BloodDonationService();
  
  // Check if user is already registered as donor
  const { data: isRegistered = false, refetch: refetchDonorStatus } = useQuery({
    queryKey: ['donorStatus', user?.id],
    queryFn: () => {
      if (!user) return false;
      return bloodDonationService.checkDonorStatus(user.id);
    },
    enabled: !!user,
  });
  
  // Get user's donations
  const { data: userDonations = [], refetch: refetchDonations } = useQuery({
    queryKey: ['userDonations', user?.id],
    queryFn: () => {
      if (!user) return [];
      return bloodDonationService.getUserDonations(user.id);
    },
    enabled: !!user && isRegistered,
  });

  // Register donor mutation
  const registerDonor = useMutation({
    mutationFn: async () => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please login to register as a donor",
          variant: "destructive"
        });
        navigate("/login");
        return null;
      }
      
      return bloodDonationService.registerDonor({
        user_id: user.id,
        name: donorFormData.name || user.name || "",
        blood_type: donorFormData.bloodType,
        dob: donorFormData.dob,
        phone: donorFormData.phone,
        address: donorFormData.address
      });
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "You've been registered as a blood donor. You'll receive notifications about donation opportunities near you.",
      });
      setShowRegistration(false);
      refetchDonorStatus();
    }
  });

  // Schedule donation mutation
  const scheduleDonation = useMutation({
    mutationFn: async ({centerName, slot, centerId}: {centerName: string, slot: string, centerId: number}) => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please login to schedule a donation",
          variant: "destructive"
        });
        navigate("/login");
        return false;
      }
      
      return bloodDonationService.scheduleDonation({
        user_id: user.id,
        center_id: centerId,
        center_name: centerName,
        date: new Date().toISOString().split('T')[0], // Today's date
        time: slot
      });
    },
    onSuccess: () => {
      toast({
        title: "Donation Scheduled",
        description: "Your blood donation has been scheduled successfully.",
      });
      refetchDonations();
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setDonorFormData(prev => ({
      ...prev,
      [id.replace("donor-", "")]: value
    }));
  };

  const handleRegisterAsDonor = (e: React.FormEvent) => {
    e.preventDefault();
    registerDonor.mutate();
  };

  const handleScheduleDonation = (centerName: string, slot: string, centerId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to schedule a donation",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    if (!isRegistered) {
      setShowRegistration(true);
      return;
    }
    
    scheduleDonation.mutate({centerName, slot, centerId});
  };

  const handleNotifyMe = (bloodType: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to set notifications",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    if (!isRegistered) {
      setShowRegistration(true);
      return;
    }
    
    toast({
      title: "Notification Set",
      description: `You'll be notified when ${bloodType} blood type is needed near you.`,
    });
  };

  // Set initial form data from user if available
  useEffect(() => {
    if (user) {
      setDonorFormData(prev => ({
        ...prev,
        name: user.name || ""
      }));
    }
  }, [user]);

  return (
    <Layout>
      {/* Hero section */}
      <div className="bg-gradient-to-br from-mediwrap-red/10 to-mediwrap-blue/10 dark:from-mediwrap-red/5 dark:to-mediwrap-blue/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Blood Donation Network
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join our network of donors and help save lives by donating blood when and where it's needed in India
            </p>
          </div>
          
          <div className="mt-8 max-w-3xl mx-auto bg-white dark:bg-card shadow-md rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="blood-type">Blood Type</Label>
                <Select value={bloodType} onValueChange={setBloodType}>
                  <SelectTrigger id="blood-type" className="w-full">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="Enter your location in India" 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-mediwrap-red hover:bg-mediwrap-red/90 text-white">
                  Find Donation Centers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Donation Centers */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Nearby Donation Centers</h2>
            <div className="space-y-6">
              {donationCenters.map((center) => (
                <Card key={center.id} className={`overflow-hidden border ${center.urgent ? 'border-mediwrap-red/50' : ''}`}>
                  {center.urgent && (
                    <div className="bg-mediwrap-red text-white px-4 py-1 text-sm font-medium">
                      Urgent Need for {center.bloodNeeded.join(", ")} Blood Types
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <img 
                        src={center.image} 
                        alt={center.name}
                        className="w-full h-full object-cover"
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <CardHeader className="p-0 pb-4">
                        <CardTitle>{center.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 space-y-3">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{center.address} ({center.distance})</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Heart className="w-4 h-4 mr-2" />
                          <span>Blood Types Needed: {center.bloodNeeded.join(", ")}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Available Slots: {center.slots.join(", ")}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-0 pt-4 flex flex-wrap gap-2">
                        {center.slots.map((slot) => (
                          <Button
                            key={slot}
                            variant="outline"
                            className="flex items-center border-mediwrap-blue text-mediwrap-blue hover:bg-mediwrap-blue/10"
                            onClick={() => handleScheduleDonation(center.name, slot, center.id)}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {slot}
                          </Button>
                        ))}
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Right column - Recent Requests & Registration */}
          <div>
            {/* Donor Registration */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Become a Blood Donor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Register as a blood donor to receive notifications when your blood type is needed in your area.
                </p>
                {isRegistered ? (
                  <div className="flex items-center bg-green-500/10 text-green-600 dark:text-green-400 p-4 rounded-md mb-4">
                    <Check className="w-5 h-5 mr-2" />
                    <span>You are registered as a blood donor!</span>
                  </div>
                ) : (
                  <Button 
                    className="w-full bg-mediwrap-red hover:bg-mediwrap-red/90 text-white"
                    onClick={() => setShowRegistration(true)}
                  >
                    Register as Donor
                  </Button>
                )}
                
                {/* Show user donations if registered */}
                {isRegistered && userDonations.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Your Scheduled Donations</h3>
                    <div className="space-y-2">
                      {userDonations.map((donation: any, index: number) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          <div className="font-medium">{donation.center_name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {donation.date} at {donation.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Recent Blood Requests */}
            <h2 className="text-2xl font-bold mb-4">Recent Blood Requests</h2>
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <Card key={request.id} className={`${request.urgency === "Critical" ? "border-mediwrap-red" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{request.bloodType} Blood Needed</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{request.hospital}</p>
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded ${
                        request.urgency === "Critical" ? "bg-mediwrap-red/10 text-mediwrap-red" :
                        request.urgency === "Urgent" ? "bg-orange-500/10 text-orange-500" :
                        "bg-yellow-500/10 text-yellow-500"
                      }`}>
                        {request.urgency}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Needed by:</span> {request.dateNeeded}
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Reason:</span> {request.reason}
                    </div>
                    <Button 
                      className="w-full mt-4 bg-mediwrap-red hover:bg-mediwrap-red/90 text-white flex items-center justify-center"
                      onClick={() => handleNotifyMe(request.bloodType)}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notify Me
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Blood Donor Registration</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowRegistration(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegisterAsDonor} className="space-y-4">
                <div>
                  <Label htmlFor="donor-name">Full Name</Label>
                  <Input 
                    id="donor-name" 
                    placeholder="Enter your full name" 
                    value={donorFormData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="donor-bloodType">Blood Type</Label>
                  <Select 
                    value={donorFormData.bloodType} 
                    onValueChange={(value) => setDonorFormData(prev => ({ ...prev, bloodType: value }))}
                  >
                    <SelectTrigger id="donor-bloodType">
                      <SelectValue placeholder="Select your blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="donor-dob">Date of Birth</Label>
                  <Input 
                    id="donor-dob" 
                    type="date" 
                    value={donorFormData.dob}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="donor-phone">Phone Number</Label>
                  <Input 
                    id="donor-phone" 
                    placeholder="Enter your phone number" 
                    value={donorFormData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="donor-address">Address</Label>
                  <Input 
                    id="donor-address" 
                    placeholder="Enter your address" 
                    value={donorFormData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="pt-4">
                  <Button 
                    type="submit"
                    className="w-full bg-mediwrap-red hover:bg-mediwrap-red/90 text-white"
                    disabled={registerDonor.isPending}
                  >
                    {registerDonor.isPending ? "Registering..." : "Complete Registration"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default BloodDonation;
