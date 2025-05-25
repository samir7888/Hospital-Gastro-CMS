import DoctorForm from "@/components/forms/doctor-form";
import type { TSingleDoctor } from "@/schema/Doctors";
import { useAppQuery } from "@/utils/react-query";
import { useParams } from "react-router-dom";

const DoctorCreatePage = () => {
  const { id } = useParams<{ id?: string }>();

  const { data, isLoading } = useAppQuery<TSingleDoctor>({
    url: id ? `/doctors/${id}` : "",
    queryKey: id ? ["doctor", id] : [],
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
    <div className="">
      <DoctorForm defaultValues={data} uploadedImage={data?.profileImage} />
    </div>
  );
};

export default DoctorCreatePage;
