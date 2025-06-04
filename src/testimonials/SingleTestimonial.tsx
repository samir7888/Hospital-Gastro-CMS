import TestimonialForm from "@/components/forms/testimonial-edit";
import type { ITestimonial } from "@/schema/testmonial-schema";
import { useAppQuery } from "@/utils/react-query";
import { useParams } from "react-router-dom";

const TestimonialsPage = () => {
  const { id } = useParams<{ id?: string }>();

  const { data, isLoading } = useAppQuery<ITestimonial>({
    url: id ? `/testimonials/${id}` : "",
    queryKey: id ? ["testimonials", id] : [],
    options: {
      enabled: !!id, // prevent query when there's no id
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!!id && !data) {
    return <div>Blogs not found</div>;
  }
  return (
    <div>
      <TestimonialForm
        defaultValues={
          data
          // ? {
          //     ...data,
          //     personImageId:
          //       typeof data.personImage === "object" && data.personImage !== null
          //         ? data.personImage.id // or .url or whatever string property you need
          //         : data.personImage,
          //   }
          // : undefined
        }
        uploadedImage={data?.personImage}
      />
    </div>
  );
};

export default TestimonialsPage;
