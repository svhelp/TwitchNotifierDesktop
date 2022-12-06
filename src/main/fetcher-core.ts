import axios from "axios";
import { CLIENT_ID } from "./client-id";
import { initAccessToken } from "./tokenStorage";

const getHeaders = (token: string) => ({
    headers: {
        'Client-Id': CLIENT_ID,
        'Authorization': `Bearer ${token}`,
}})

const fetchUserData = (token: string) => {
    console.log("***Fetch user sent.");
    return axios.get('https://api.twitch.tv/helix/users', getHeaders(token))
}

const fetchStreamsData = (token: string, userId: string) => {
    console.log("***Fetch streams sent.");
    return axios.get('https://api.twitch.tv/helix/streams/followed', {
        ...getHeaders(token),
        params: {user_id: userId}
    })
}

const compareStreams = (streamsData1: any, streamsData2: any) => {
    console.log("***Streams compared.");
}

const startPolling = async (token: string) => {
    const userData = await fetchUserData(token);

    if (userData.status !== 200){
        return;
    }

    console.log("***User fetched.");

    const userId = userData.data.data[0].id;

    let streamsData: any;

    const pollingInterval = setInterval(async () => {
        const newStreamsData = await fetchStreamsData(token, userId);
    
        if (newStreamsData.status !== 200){
            return;
        }

        console.log("***Streams fetched.");

        compareStreams(streamsData, newStreamsData.data);
        streamsData = newStreamsData.data;
    }, 15000);

    return pollingInterval;
}

export const initFetcherCore = async () => {
    console.log("***Fetcher core initialization.");

    let accessToken = initAccessToken();
    
    console.log("***Access token gathered.");
    let pollingInterval: NodeJS.Timer | undefined;

    const stopPolling = () => {
        pollingInterval = undefined;
    }

    if (!!accessToken){
        pollingInterval = await startPolling(accessToken);
    }

    return {
        stopPolling
    };
}