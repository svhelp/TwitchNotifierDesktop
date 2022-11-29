import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TagModel } from 'domain/TagModel'

export const sftApi = createApi({
    reducerPath: 'sftApi',
    baseQuery: fetchBaseQuery({
      baseUrl: 'http://localhost:5112/api/',
    }),
    endpoints: (build) => ({
        getTags: build.query<TagModel[], string>({
            query: () => ({ url: `tag/` }),
        })
    })
})

export const { useGetTagsQuery } = sftApi