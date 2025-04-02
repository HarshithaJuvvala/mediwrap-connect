
import { Doctor } from "@/services/api/types";
import DoctorCard from "./DoctorCard";

interface DoctorListProps {
  filteredDoctors: Doctor[];
  isLoading: boolean;
  onBookAppointment: (doctorId: string, doctorName: string, type: string) => void;
}

const DoctorList = ({ filteredDoctors, isLoading, onBookAppointment }: DoctorListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-500 dark:text-gray-400">Loading doctors...</p>
      </div>
    );
  }

  if (filteredDoctors.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-500 dark:text-gray-400">No doctors found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {filteredDoctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} onBookAppointment={onBookAppointment} />
      ))}
    </div>
  );
};

export default DoctorList;
