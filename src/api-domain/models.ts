export const TwitchBaseUrl = 'https://api.twitch.tv/helix/'

export type GetUsersApiModel = {
    id?: string;
    login?: string;
}

export type GetUsersApiResponse = {
    data: IUserInfo[];
}

export type GetFollowedStreamsApiModel = {
    user_id: string;
    first?: number;
    after?: string;
}

export type GetFollowedStreamsApiResponse = {
    data: IStreamInfo[];
    pagination: Pagination;
}

export type Pagination = {
    cursor: string;
}

export interface IUserInfo {
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

export interface IStreamInfo {
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