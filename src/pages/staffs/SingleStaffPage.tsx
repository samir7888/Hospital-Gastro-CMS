import StaffForm from "@/components/forms/staff-form";
import type { TSingleStaff } from "@/schema/staffs-schema";
import { useAppQuery } from "@/utils/react-query";
import { useParams } from "react-router-dom";

const SingleStaffPage = () => {
  const { id } = useParams<{ id?: string }>();

  const { data, isLoading } = useAppQuery<TSingleStaff>({
    url: id ? `/staffs/${id}` : "",
    queryKey: id ? ["staff", id] : [],
    options: {
      enabled: !!id, // prevent query when there's no id
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!!id && !data) {
    return <div>Staff not found</div>;
  }

  return (
    <div className="">
      <StaffForm defaultValues={data} uploadedImage={data?.profileImage} />
    </div>
  );
};

export default SingleStaffPage;
