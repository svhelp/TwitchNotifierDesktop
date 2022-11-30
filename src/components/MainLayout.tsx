import { useGetFollowedStreamsQuery, useGetUsersQuery } from "api/twitchApi"
import { CLIENT_ID } from "main/client-id"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { isAuthenticated, setAuthToken } from "./logic/slice"

export const MainLayout = () => {
  const dispatch = useDispatch();

  const isAuth = useSelector(isAuthenticated);

  const { data: userData } = useGetUsersQuery({}, {skip: !isAuth});
  const { data: streamsData } = useGetFollowedStreamsQuery({user_id: userData?.data[0]?.id ?? ""}, {skip: !userData});

  useEffect(() => {
    const addressToken = document.location.hash.slice(1);

    if (!!addressToken){
      window.electron.store.set('accessToken', addressToken);
    }

    const token = !!addressToken
      ? addressToken
      : window.electron.store.get<string>('accessToken');

    dispatch(setAuthToken(token));
  }, []);
  
  const home_url="http://localhost:1213/access_token"
  const scope = "user%3Aread%3Afollows"
  const authLink =
    `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${home_url}&scope=${scope}`;

  return <div>
    <InfoBlock>
      <span>Client ID:</span>
      <span>{CLIENT_ID}</span>
    </InfoBlock>
    <InfoBlock>
      <span>Is authenticated:</span>
      <span>{isAuth.toString()}</span>
    </InfoBlock>

      <a target="_blank" href={authLink}>Log in</a>
      
    <InfoBlock>
      <span>User ID:</span>
      <span>{userData?.data[0]?.id}</span>
    </InfoBlock>
    
    <InfoBlock>
      <span>Streams:</span>
      {streamsData?.data.map(s =>
        <span>{s.user_login}</span>)}
      
    </InfoBlock>
  </div>
}

const InfoBlock = styled.div`
  display: flex;
`
