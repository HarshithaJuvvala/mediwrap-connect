
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Appointment {
  id: string;
  doctor_name: string;
  patient_name: string;
  date: string;
  time: string;
  status: string;
  type: string;
}

interface RecentAppointmentsProps {
  appointments: Appointment[];
}

const RecentAppointments = ({ appointments }: RecentAppointmentsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.slice(0, 5).map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.doctor_name}</TableCell>
                <TableCell>{appointment.patient_name}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : appointment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      appointment.type === 'video' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {appointment.type}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentAppointments;
