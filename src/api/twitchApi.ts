import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CLIENT_ID } from "main/client-id";
import { RootState } from "renderer/store";

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
} = twitchApi

type GetUsersApiModel = {
    id?: string;
    login?: string;
}

type GetUsersApiResponse = {
    data: IUserInfo[];
}

type GetFollowedStreamsApiModel = {
    user_id: string;
    first?: number;
    after?: string;
}

type GetFollowedStreamsApiResponse = {
    data: IStreamInfo[];
    pagination: Pagination;
}

type Pagination = {
    cursor: string;
}

interface IUserInfo {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    email: string;
    created_at: string;
}

interface IStreamInfo {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
    is_mature?: boolean;
}