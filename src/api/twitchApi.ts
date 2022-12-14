import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CLIENT_ID } from "constants/client-id";
import { RootState } from "renderer/store";
import { GetUsersApiResponse, GetUsersApiModel, GetFollowedStreamsApiResponse, GetFollowedStreamsApiModel } from "./models";

export const twitchApi = createApi({
    reducerPath: 'twitchApi',
    baseQuery: fetchBaseQuery({
      baseUrl: 'https://api.twitch.tv/helix/',
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).mainLayoutReducer.authToken;

        headers.set('Client-Id', CLIENT_ID);
    
        // If we have a token set in state, let's assume that we should be passing it.
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
    
        return headers
      }
    }),
    endpoints: (build) => ({
        getUsers: build.query<GetUsersApiResponse, GetUsersApiModel>({
            query: (model) => ({
                url: `users`,
                params: model,
            }),
        }),
        getFollowedStreams: build.query<GetFollowedStreamsApiResponse, GetFollowedStreamsApiModel>({
            query: (model) => ({
                url: `streams/followed`,
                params: model,
            }),
        })
    })
})

export const {
    useGetUsersQuery,
    useGetFollowedStreamsQuery
} = twitchApi;