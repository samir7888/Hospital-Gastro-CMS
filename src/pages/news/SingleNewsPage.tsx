import NewsEventEditPage from "@/components/forms/news-edit";
import type { BaseNewsAndEvents } from "@/schema/news-type";
import { useAppQuery } from "@/utils/react-query";
import { useParams } from "react-router-dom";

const NewsAndEventsPage = () => {
  const { id } = useParams<{ id?: string }>();

  const { data, isLoading } = useAppQuery<BaseNewsAndEvents>({
    url: id ? `/blogs/${id}` : "",
    queryKey: id ? ["blogs", id] : [],
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

  const defaultValues = data
    ? {
        ...data,
        categoryId: data.category.id,
        featuredImageId: data.featuredImage?.id,
      }
    : data;

  return (
    <div>
      <NewsEventEditPage
        defaultValues={defaultValues}
        uploadedFeaturedImage={data?.featuredImage}
        uploadedCoverImage={data?.coverImage}
      />
    </div>
  );
};

export default NewsAndEventsPage;
