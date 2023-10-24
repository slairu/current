import { React, useEffect, useState } from "react";
import useGetToken from "./useGetToken";

function useUser() {
  const token = useGetToken();
  const [user, setUser] = useState();

  useEffect(() => {
    if (!token) {
      console.log(token);
      return;
    }

    if (token == "none") {
      setUser("none");
      console.log("no user logged in");
      return;
    }

    async function getUser() {
      const response = await fetch("http://localhost:4200/api/v1/session", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      const JSON = await response.json();
      const user = await fetch(
        `http://localhost:4200/api/v1/users/${JSON.userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return await user.json();
    }

    getUser()
      .then((response) => setUser(response))
      .catch((err) => console.log(err));
  }, [token]);

  return user;
}

export default useUser;
