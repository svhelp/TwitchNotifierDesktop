import { useGetTagsQuery } from "api/sftApi"
import { CLIENT_ID } from "main/client-id"
import { useEffect, useState } from "react"
import styled from "styled-components"

export const MainLayout = () => {

  const [ accessToken, setAccessToken ] = useState('');

  useEffect(() => {
    const addressToken = document.location.hash;

    if (!!addressToken){
      window.electron.store.set('accessToken', addressToken);
    }

    const token = !!addressToken
      ? addressToken
      : window.electron.store.get<string>('accessToken');

    setAccessToken(token ?? '');
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
      <span>Access token:</span>
      <span>{accessToken}</span>
    </InfoBlock>

      <a target="_blank" href={authLink}>Log in</a>
  </div>
}

const InfoBlock = styled.div`
  display: flex;
`
