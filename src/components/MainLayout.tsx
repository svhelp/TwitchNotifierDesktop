import { useGetFollowedStreamsQuery, useGetUsersQuery } from "api/twitchApi"
import { CLIENT_ID } from "main/client-id"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { isAuthenticated, logOut, setAuthToken } from "./logic/slice"

export const MainLayout = () => {
  const dispatch = useDispatch();

  const isAuth = useSelector(isAuthenticated);

  const { data: userData } = useGetUsersQuery({}, {skip: !isAuth});
  const { data: streamsData } = useGetFollowedStreamsQuery({user_id: userData?.data[0]?.id ?? ""}, {skip: !userData});

  useEffect(() => {
    const token = window.electron.store.get<string>('accessToken');

    dispatch(setAuthToken(token));
  }, [ ]);
  
  const home_url="http://localhost:1213/auth.html"
  const scope = "user%3Aread%3Afollows"
  const authLink =
    `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${home_url}&scope=${scope}`;

  const onLogOut = () => {
    window.electron.store.set('accessToken', '');
    dispatch(logOut());
  }

  const onNotification = () => {
    new Notification("NOTIFICATION_TITLE", { body: "NOTIFICATION_BODY" })
  }

  return <div>
    <InfoBlock>
      <span>Client ID:</span>
      <span>{CLIENT_ID}</span>
    </InfoBlock>

    {isAuth ?
      <button onClick={onLogOut}>
        Log out
      </button>
      : <a target="_blank" href={authLink}>Log in</a>}
      
    <InfoBlock>
      <span>User ID:</span>
      <span>{isAuth && userData?.data[0]?.id}</span>
    </InfoBlock>
    
    <InfoBlock>
      <span>Streams:</span>
      <VerticalInfoBlock>
        {isAuth && streamsData?.data.map(s =>
          <div key={s.id}>{s.user_login}</div>)}
      </VerticalInfoBlock>
    </InfoBlock>

    <button onClick={onNotification}>
      Show notification
    </button>
  </div>
}

const InfoBlock = styled.div`
  display: flex;
`

const VerticalInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
`
