import { useGetTagsQuery } from "api/sftApi"

export const MainLayout = () => {

  const { data } = useGetTagsQuery('')
  
  return <div>
    <h1>
      Tags:
    </h1>
    {data?.map(tag => (
      <div>
        {tag.name}
      </div>
    ))}
  </div>
}
