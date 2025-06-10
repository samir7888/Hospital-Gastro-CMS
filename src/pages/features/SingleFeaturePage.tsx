import { FeatureForm } from "@/components/forms/feature-form";

import { Navigate, useLocation } from "react-router-dom";

import { z } from "zod";

const featureSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be between 3 and 50 characters")
    .max(50, "Title must be between 3 and 50 characters"),
  description: z
    .string()
    .min(10, "Description must be between 10 and 300 characters")
    .max(300, "Description must be between 10 and 300 characters"),
  image: z
    .object({
      id: z.string(),
      url: z.string(),
    })
    .nullable(),
});

const SingleFeaturePage = () => {
  const state = useLocation().state;

  if (!state) {
    return <Navigate to={"/features"} />;
  }

  const { data, success } = featureSchema.safeParse(state);

  if (!data || !success) {
    return <Navigate to={"/features"} />;
  }

  return (
    <div className="">
      <FeatureForm
        defaultValues={{ ...data, imageId: data?.image?.id }}
        uploadedImage={data?.image}
      />
    </div>
  );
};

export default SingleFeaturePage;
