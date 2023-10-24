import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
export default function useGetToken() {
  const [token, setToken] = useState(null);
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          },
        });
        setToken(token);
        return;
      } catch (err) {
        console.log(err);
        setToken("none");
        return;
      }
    };
    getToken();
  }, []);
  return token;
}
