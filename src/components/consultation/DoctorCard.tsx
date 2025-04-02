
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, MapPin, Calendar, Star } from "lucide-react";
import { Doctor } from "@/services/api/types";

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (doctorId: string, doctorName: string, type: string) => void;
}

const DoctorCard = ({ doctor, onBookAppointment }: DoctorCardProps) => {
  return (
    <Card key={doctor.id} className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 p-6 flex flex-col items-center justify-center border-r border-gray-200 dark:border-gray-800">
          <div className="relative">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-32 h-32 rounded-full object-cover border-2 border-mediwrap-blue/30"
            />
            {doctor.available && (
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
            )}
          </div>
          <h3 className="mt-4 text-xl font-semibold text-center">{doctor.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center">{doctor.specialty}</p>
          <div className="flex items-center mt-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="ml-1 text-gray-700 dark:text-gray-300">{doctor.rating}</span>
            <span className="ml-1 text-gray-500">({doctor.reviews} reviews)</span>
          </div>
        </div>
        
        <div className="md:w-3/4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hospital</p>
              <p className="font-medium">{doctor.hospital}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Next Available</p>
              <p className="font-medium text-green-600 dark:text-green-400">
                {doctor.next_available ? new Date(doctor.next_available).toLocaleString() : 'Not available'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Consultation Fee</p>
              <p className="font-medium">₹{doctor.fee}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Education</p>
              <p className="font-medium">{doctor.education}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
              <p className="font-medium">{doctor.experience}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
              <p className="font-medium">{doctor.location}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
            {doctor.online && (
              <Button
                variant="outline"
                className="flex items-center border-mediwrap-blue text-mediwrap-blue hover:bg-mediwrap-blue/10"
                onClick={() => onBookAppointment(doctor.id, doctor.name, "video")}
              >
                <Video className="mr-2 h-4 w-4" />
                Book Video Consultation
              </Button>
            )}
            <Button
              variant={doctor.online ? "outline" : "default"}
              className={doctor.online ? "flex items-center border-mediwrap-green text-mediwrap-green hover:bg-mediwrap-green/10" : "flex items-center bg-mediwrap-blue hover:bg-mediwrap-blue-light text-white"}
              onClick={() => onBookAppointment(doctor.id, doctor.name, "in-person")}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Book In-Person Visit
            </Button>
            <Button
              variant="outline"
              className="flex items-center"
            >
              <Calendar className="mr-2 h-4 w-4" />
              View Schedule
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DoctorCard;
