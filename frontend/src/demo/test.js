export async function secureReq(accessToken) {
  let token;
  try {
    token = await accessToken({
      authorizationParams: {
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      },
    });
  } catch (err) {
    console.log(err);
    return;
  }
  fetch("http://localhost:4200/api/v1/test2", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
}

export async function dbReq() {
  fetch("http://localhost:4200/api/v1/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ XP: 4 }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
}
