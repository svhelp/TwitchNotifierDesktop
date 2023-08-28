import { GetFollowedStreamsApiResponse, GetUsersApiResponse, IStreamInfo } from "api-domain/models";
import axios from "axios";
import {Notification} from "electron";
import { initAccessToken } from "./token-storage";

export interface INotifierCore {
    updateToken: (newToken: string | undefined) => void;
    stopPolling: () => void;
}

const log = (message: string) => {
    console.log(`***Notifier service: ${message}`);
}

const createNotification = (title: string, streams: IStreamInfo[]) => {
    if (streams.length === 0){
        return;
    }

    const notification = new Notification({
        title: title,
        body: streams.map(s => s.user_name).join("\n"),
        silent: true
    });

    notification.show();
}

const notify = (newStreams: IStreamInfo[], changedStreams: IStreamInfo[]) => {
    createNotification("Streams started:", newStreams);
    createNotification("Streams updated:", changedStreams);

    console.log("Notifications sent.");
}

const compareStreams = (oldStreamsData: IStreamInfo[], newStreamsData: IStreamInfo[]) => {
    const newStreams: IStreamInfo[] = [];
    const changedStreams: IStreamInfo[] = [];

    for (const stream of newStreamsData){
        const oldStream = oldStreamsData.find(s => s.id === stream.id);

        if (!oldStream){
            newStreams.push(stream);
            continue;
        }

        if (stream.game_id !== oldStream.game_id){
            changedStreams.push(stream);
            continue;
        }
    }

    notify(newStreams, changedStreams);

    console.log("Streams compared.");
}

const getHeaders = (token: string) => ({
    headers: {
        'Client-Id': process.env.TWITCH_API_KEY,
        'Authorization': `Bearer ${token}`,
}})

const fetchUserData = (token: string) => {
    log("Fetch user sent.");
    return axios.get<GetUsersApiResponse>('https://api.twitch.tv/helix/users', getHeaders(token))
}

const fetchStreamsData = (token: string, userId: string) => {
    log("Fetch streams sent.");
    return axios.get<GetFollowedStreamsApiResponse>('https://api.twitch.tv/helix/streams/followed', {
        ...getHeaders(token),
        params: {user_id: userId}
    })
}

const startPolling = async (token: string) => {
    const userData = await fetchUserData(token);

    if (userData.status !== 200){
        log(`ERROR: ${userData.statusText}`);
        return;
    }

    const userResponseData = userData.data;

    if (!userResponseData || userResponseData.data.length !== 1){
        log(`ERROR: Unexpected user data fetched.`);
        return;
    }

    log("User fetched.");

    const userId = userResponseData.data[0].id;

    let streamsData: IStreamInfo[];

    const pollingInterval = setInterval(async () => {
        const newStreamsData = await fetchStreamsData(token, userId);
    
        if (newStreamsData.status !== 200){
            log(`ERROR: ${newStreamsData.statusText}`);
            return;
        }

        const streamsResponseData = newStreamsData.data;
        
        if (!streamsResponseData){
            log(`ERROR: Unexpected streams data fetched.`);
            return;
        }

        log("Streams fetched.");

        compareStreams(streamsData ?? [], streamsResponseData.data);
        streamsData = streamsResponseData.data;
    }, 15000);

    return pollingInterval;
}

export const initNotifierCore = () => {
    log("Initialization.");
    let pollingInterval: NodeJS.Timeout | undefined;
    let accessToken: string | undefined;

    const stopPolling = () => {
        log("Stop polling.");
        clearInterval(pollingInterval);
    }

    const updateToken = async (newToken: string | undefined) => {
        log("Update token.");

        accessToken = newToken;

        if (!accessToken){
            stopPolling();
            return;
        }

        log("Start polling.");
        pollingInterval = await startPolling(accessToken);
    }

    updateToken(initAccessToken());

    return {
        updateToken,
        stopPolling
    };
}