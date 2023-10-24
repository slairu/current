# Current: Sprint 1 Review

### Iteration 01 - Review & Retrospect
 * When: June 15, 2023
 * Where: Online

### Process - Reflection

In this iteration, our primary focus was on refining our team's processes and enhancing collaboration. Through the course of this iteration, we have identified both our strengths and weaknesses, and we intend to address them in the upcoming iterations. Here are the key reflections from our review meeting:

### Decisions that turned out well

#### Beginning with Sign Up and Log In Pages

Explanation: All of the other pages need to use authorization, so it is easier to set it up at the beginning than add it at the end.

#### Using Auth0

Explanation: Auth0 provides simple authentication management eliminating the need to store sensitive user information ourselves. It also allows us to very easily enable convenient third-party-signon n in with google). Additionally, it comes with management and recovery services like blacklisting users and account recovery provided out of the box. Finally, it also makes implementing the frontend easier as we do not need to create the forms used to signup/signin. 

#### Using mongodb

Explanation: Using a NoSQL database like mongodb allows us to store data without a set schema. This makes experimenting and prototyping much faster and non-committal, and allows us to iterate as we develop with much lower costs associated with modifications. MongoDB also allows us to easily host our database in the cloud with Atlas eliminating time spent figuring out deployment.

#### Using Node & Express

Explanation: The Express.js framework allows us to very quickly and intuitively create a RESTful API. Our backend developer also had previous experience with this environment which allowed us to get started right away without the high time costs of learning a new framework.

### Decisions that did not turn out as well as we hoped

During this iteration, here are some of the decisions which did not turn out as well as we expected:

#### Estimating the time it would take to complete each user story:

Explanation: We had planned a set amount of time to spend on user stories, however, some of them took a lot longer than we were expecting. As a result, we ended up rushing near the end of the sprint in order to finish what we had planned to finish.

#### Having our own sign-in page:

Explanation: We had planned on designing our own sign-in page. However, due to financial restrictions causing us to be unable to go with our original plan, we had to use a different method than we wanted. The new method that we are using works well, however, we cannot customize the sign-in page to our original design. 

#### Lack of clear communication channels:

Explanation: We encountered challenges in communication due to people not checking messages in the amount of time that we had outlined in our team agreement. This caused people to miss meetings and deadlines that we had set, setting our team back by days. 

### Planned changes

We are planning the following changes in our process for the next iteration:

#### Having our planning meeting earlier:

Explanation: We had our planning meeting and review meetings relatively close to each other, which limited the time that we had to work on the project during the sprint. Having our planning meeting as early as possible would have allowed us more time to work on the project, since we needed the meeting to set out what we wanted done during the coming sprint. 

## Product - Review

### Goals and/or tasks that were met/completed:

#### Account Management: Build a sign-in page with basic sign-in and account creation functionality (User Stories 1 and 2).

We successfully implemented a sign-in page that allows users to create new accounts and sign in with existing credentials. The functionality was thoroughly tested and met the acceptance criteria outlined in the user stories.

Artifact: Screenshot of the sign-in page

<img src="https://i.imgur.com/KAHvNZh.png" alt="Alt Text" width="50%" height="50%">

#### Video Calling: Develop the video call component.

We have successfully integrated a video call component into the messaging system, allowing users to initiate video calls with other users. The functionality was tested for reliability and usability, and it meets the requirements specified in the user stories.

Artifact: Screenshot showcasing the video call feature

<img src="https://i.imgur.com/FAoT2le.png" alt="Alt Text" width="50%" height="50%">

#### User Authentication: Implement user authentication and authorization features.

We have implemented robust user authentication and authorization features, ensuring secure access to the system and protecting user data. Authentication mechanisms, such as username/password validation and session management, were successfully integrated.

Artifact: Code snippets demonstrating authentication and authorization implementation

Frontend:
```export async function secureReq(accessToken) {
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
```

Backend:
```
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

//sample route to test auth checking
app.get("/api/v1/test2", checkJwt, async (req, res, next) => {
  console.log("authheader", req.auth.header);
  console.log("authpayload", req.auth.payload);
  const email = req.auth.payload["https://example.com/email"];
  console.log(email);
  res.json({ email: email }).status(200);
});
```

#### Profile Management: Develop user profile management capabilities.

We have implemented user profile management functionalities, allowing users to update their personal information, change passwords, and manage their preferences. The profile management system adheres to the defined user stories and provides a seamless user experience.

Artifact: Screenshots of the user profile management interface

<img src="https://i.imgur.com/4Z9an2W.png" alt="Alt Text" width="50%" height="50%">

### Goals and/or tasks that were planned but not met/completed:

#### Implement the basic frontend for the home page

We planned on implementing the frontend for the home page at the beginning of the sprint. However, due to time restriction, we were not able to get a start on that.

### Meeting Highlights

Going into the next iteration, our main insights are:

#### Time Management 
We underestimated the amount of time and effort each feature would take, and as such, ran out of time to complete everything that we wanted to do. In the future, we will plan more accordingly for going over the anticipated amount of time that each feature takes. 

#### Having Set Times for Meetings to Work on Features Together
We collaborated on working on many of the features, but people would spontaneously ask to meet, and some people would not be available, so the meetings got put off over and over again. This caused us to cram most of the work near the end of the sprint, causing everyone more panic and stress. In the future, we will have set times to work on features at least 24 hours before the meeting time. 

#### Improve sprint planning and capacity management
It is essential to ensure realistic and achievable sprint planning by accurately estimating the effort required for each user story. We will emphasize refining our estimation techniques and capacity management to avoid overcommitment and ensure a smoother sprint execution.
