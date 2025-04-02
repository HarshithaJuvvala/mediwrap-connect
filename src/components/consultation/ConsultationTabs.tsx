
import { Doctor } from "@/services/api/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Users } from "lucide-react";
import DoctorList from "./DoctorList";

interface ConsultationTabsProps {
  consultationType: string;
  setConsultationType: (type: string) => void;
  filteredDoctors: Doctor[];
  isLoading: boolean;
  onBookAppointment: (doctorId: string, doctorName: string, type: string) => void;
}

const ConsultationTabs = ({
  consultationType,
  setConsultationType,
  filteredDoctors,
  isLoading,
  onBookAppointment
}: ConsultationTabsProps) => {
  return (
    <Tabs defaultValue="all" className="mb-8">
      <TabsList>
        <TabsTrigger 
          value="all" 
          onClick={() => setConsultationType("all")}
        >
          All Consultations
        </TabsTrigger>
        <TabsTrigger 
          value="online" 
          onClick={() => setConsultationType("online")}
          className="flex items-center"
        >
          <Video className="w-4 h-4 mr-2" />
          Online
        </TabsTrigger>
        <TabsTrigger 
          value="in-person" 
          onClick={() => setConsultationType("in-person")}
          className="flex items-center"
        >
          <Users className="w-4 h-4 mr-2" />
          In-Person
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-6">
        <DoctorList
          filteredDoctors={filteredDoctors}
          isLoading={isLoading}
          onBookAppointment={onBookAppointment}
        />
      </TabsContent>
      
      <TabsContent value="online">
        {/* Content will be shown through filtering */}
      </TabsContent>
      
      <TabsContent value="in-person">
        {/* Content will be shown through filtering */}
      </TabsContent>
    </Tabs>
  );
};

export default ConsultationTabs;
