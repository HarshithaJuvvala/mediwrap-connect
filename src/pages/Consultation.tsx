import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import ConsultationHero from "@/components/consultation/ConsultationHero";
import ConsultationTabs from "@/components/consultation/ConsultationTabs";
import { Doctor } from "@/services/api/types";

// Indian doctor mockup data to use if API fetch fails
const indianDoctors = [
  {
    id: "1",
    name: "Dr. Rajesh Sharma",
    specialty: "Cardiology",
    hospital: "Narayana Health",
    rating: 4.9,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    available: true,
    next_available: "2023-06-15T10:00:00",
    fee: 1000,
    education: "MBBS, MD - Cardiology",
    experience: "15+ years",
    location: "Bangalore",
    online: true
  },
  {
    id: "2",
    name: "Dr. Priya Patel",
    specialty: "Pediatrics",
    hospital: "Apollo Hospitals",
    rating: 4.8,
    reviews: 132,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    available: true,
    next_available: "2023-06-14T14:30:00",
    fee: 800,
    education: "MBBS, DCH, MD - Pediatrics",
    experience: "10+ years",
    location: "Mumbai",
    online: true
  },
  {
    id: "3",
    name: "Dr. Arun Kumar",
    specialty: "Orthopedics",
    hospital: "AIIMS",
    rating: 4.7,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    available: false,
    next_available: "2023-06-18T11:00:00",
    fee: 1200,
    education: "MBBS, MS - Orthopedics",
    experience: "12+ years",
    location: "Delhi",
    online: false
  },
  {
    id: "4",
    name: "Dr. Sunita Reddy",
    specialty: "Dermatology",
    hospital: "Fortis Healthcare",
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    available: true,
    next_available: "2023-06-13T09:15:00",
    fee: 900,
    education: "MBBS, MD - Dermatology",
    experience: "8+ years",
    location: "Hyderabad",
    online: true
  }
];

const Consultation = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [consultationType, setConsultationType] = useState("all");
  const { toast } = useToast();
  
  // Fixed useQuery hook
  const { data: fetchedDoctors = [], isLoading, refetch } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => apiClient.getDoctors(),
    initialData: indianDoctors
  });

  // If fetched doctors list is empty, use the mock data
  const doctors = fetchedDoctors.length > 0 ? fetchedDoctors : indianDoctors;

  useEffect(() => {
    const channel = supabase
      .channel('public:doctors')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'doctors' 
      }, () => {
        refetch();
      })
      .subscribe();
      
    return () => {
      channel.unsubscribe();
    };
  }, [refetch]);

  const handleBookAppointment = (doctorId: string, doctorName: string, type: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to book an appointment.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    toast({
      title: "Appointment Requested",
      description: `Your ${type} appointment with ${doctorName} has been requested. We'll confirm shortly.`,
    });
    
    try {
      apiClient.bookAppointment(doctorId, {
        type: type === "video" ? "video" : "in-person",
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
      });
    } catch (e) {
      console.error("Error booking appointment:", e);
      toast({
        title: "Error",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredDoctors = doctors.filter((doctor: Doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (doctor.hospital && doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (consultationType === "online" && !doctor.online) return false;
    if (consultationType === "in-person" && doctor.online) return false;
    
    return matchesSearch;
  });

  return (
    <Layout>
      <ConsultationHero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ConsultationTabs
          consultationType={consultationType}
          setConsultationType={setConsultationType}
          filteredDoctors={filteredDoctors}
          isLoading={isLoading}
          onBookAppointment={handleBookAppointment}
        />
      </div>
    </Layout>
  );
};

export default Consultation;
