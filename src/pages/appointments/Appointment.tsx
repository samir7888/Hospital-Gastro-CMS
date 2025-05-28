// app/dashboard/appointments/[id]/page.jsx

import AppointmentDetailsPage from "@/components/forms/appointment-detail";
import type { Appointment } from "@/schema/appointment-schema";
import { useAppQuery } from "@/utils/react-query";
import { useParams } from "react-router-dom";





export default function AppointmentView () {
 const { id } = useParams<{ id?: string }>();

  const { data, isLoading } = useAppQuery<Appointment>({
    url: id ? `/appointments/${id}` : "",
    queryKey: id ? ["appointments", id] : [],
    options: {
      enabled: !!id, // prevent query when there's no id
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!!id && !data) {
    return <div>Doctor not found</div>;
  }

  return (
    <div>
      {data && <AppointmentDetailsPage appointment={data} />}
    </div>
  )
}




