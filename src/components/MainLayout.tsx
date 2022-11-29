import { useGetTagsQuery } from "api/sftApi"
import { CLIENT_ID } from "main/client-id"
import { useState } from "react"
import styled from "styled-components"

export const MainLayout = () => {

  const [ accessToken, setAccessToken ] = useState('');
  
  const home_url="http://localhost:1213/receive-tokens"
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

    {!accessToken &&
      <a href={authLink}>Log in</a>}
  </div>
}

const InfoBlock = styled.div`
  display: flex;
`
