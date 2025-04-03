
import { Doctor } from "@/services/api/types";
import DoctorCard from "./DoctorCard";

interface DoctorListProps {
  filteredDoctors: Doctor[];
  isLoading: boolean;
  onBookAppointment: (doctorId: string, doctorName: string, type: string) => void;
  emptyMessage?: string;
  loadingMessage?: string;
}

const DoctorList = ({ 
  filteredDoctors, 
  isLoading, 
  onBookAppointment,
  emptyMessage = "No doctors found matching your criteria.",
  loadingMessage = "Loading doctors..."
}: DoctorListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="animate-pulse">
          <p className="text-xl text-gray-500 dark:text-gray-400">{loadingMessage}</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 dark:bg-gray-800 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (filteredDoctors.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <p className="text-xl text-gray-500 dark:text-gray-400">{emptyMessage}</p>
        <p className="mt-4 text-gray-400 dark:text-gray-500">Try adjusting your search criteria or explore other specialties.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredDoctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} onBookAppointment={onBookAppointment} />
      ))}
    </div>
  );
};

export default DoctorList;
