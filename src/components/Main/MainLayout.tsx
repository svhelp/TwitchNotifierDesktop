import { useAuthRedirect } from "customHooks/useAuthRedirect"
import { useLogOut } from "customHooks/useLogOut"
import { useUserData } from "customHooks/useUserData"
import { CLIENT_ID } from "main/client-id"
import styled from "styled-components"
import { StreamList } from "../Streams/StreamList"

export const MainLayout = () => {
  useAuthRedirect();

  const { data: userData, isLoading } = useUserData();

  const onLogOut = useLogOut();

  return <div>
    <InfoBlock>
      <span>Client ID:</span>
      <span>{CLIENT_ID}</span>
    </InfoBlock>

    <button onClick={onLogOut}>
      Log out
    </button>
      
    <InfoBlock>
      <span>User ID:</span>
      <span>{userData?.data[0]?.id}</span>
    </InfoBlock>
    
    <StreamList />
  </div>
}

const InfoBlock = styled.div`
  display: flex;
`
