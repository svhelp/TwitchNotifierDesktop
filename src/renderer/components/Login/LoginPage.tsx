import { Button } from "antd";
import { useAuthRedirect } from "renderer/customHooks/useAuthRedirect";
import styled from "styled-components";

export const LoginPage = () => {
    useAuthRedirect();
    
    const home_url="http://localhost:1213/auth.html";
    const scope = "user%3Aread%3Afollows";
    const responseType = "token";
    const authLink =
      `https://id.twitch.tv/oauth2/authorize?response_type=${responseType}&client_id=${process.env.TWITCH_API_KEY}&redirect_uri=${home_url}&scope=${scope}`;
      
    return (
      <LoginContainer>
        <Button type="primary" href={authLink} target="_blank">
          Log in with Twitch
        </Button>
      </LoginContainer>
    );
}

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 300px;
`