import { Button } from "antd";
import { useAuthRedirect } from "customHooks/useAuthRedirect";
import { CLIENT_ID } from "main/client-id";

export const LoginPage = () => {
    useAuthRedirect();
    
    const home_url="http://localhost:1213/auth.html";
    const scope = "user%3Aread%3Afollows";
    const responseType = "token";
    const authLink =
      `https://id.twitch.tv/oauth2/authorize?response_type=${responseType}&client_id=${CLIENT_ID}&redirect_uri=${home_url}&scope=${scope}`;
      
    return (
        <Button type="primary" href={authLink} target="_blank">
          Log in with Twitch
        </Button>
    );
}