
  <h3 style="text-align: center;">Software Design Documentation</h3>


  **Team Current:**
- Chelsea Chan (```chanyang```)
- Jinfeng He (```hejinfe1```)
- Matthew Snelgrove (```snelgr18```)
- Shadmehr Hashem Zehi (```hashemz4```)
- Sarah Liu (```liusara8```)
- Divyansh Kachchhava (```kachchha```)
- Victor Hurst (```hurstvi1```)

</div>
</div>
</div>

<br>

<div style="display: flex; justify-content: space-between; height: 100vh">
  <div>

# Table of Contents

1. Overview

2. CRC Cards  

3. Software Architecture Design

4. Conclusion

# CRC Cards

| **Class Name:**  User                                         |
|---------------------------------------------------------|
| **Parent Class:** None                                     |
| **Subclass:** TeamLeader                                              |
| **Responsibilities:** <br>- Sign up with a unique username, email, and password<br>- Receive confirmation/verification email<br>- Sign in and sign out securely<br>- Upload and change profile picture<br>- Set status<br>- Access and modify account settings<br>- Manage notification settings                                 |
| **Collaborators:** EmailService, AuthenticationManager, ProfileManager, StatusManager, AccountSettingsManager, NotificationManager                      |

| **Class Name:**  Team                                         |
|---------------------------------------------------------|
| **Parent Class:** User                                     |
| **Subclass:** None                                              |
| **Responsibilities:** <br>- Manage team/group membership <br>- Add and remove members                               |
| **Collaborators:** User                                      |

| **Class Name:**  TeamLeader                                         |
|---------------------------------------------------------|
| **Parent Class:** User                                     |
| **Subclass:** None                                              |
| **Responsibilities:** <br>- Manage team/group composition<br>- Add and remove members as a leader                                |
| **Collaborators:** Team                                      |

| **Class Name:**  Participant                                         |
|---------------------------------------------------------|
| **Parent Class:** User                                     |
| **Subclass:** None                                              |
| **Responsibilities:** <br>- Participate in teams/groups and video conferences                       |
| **Collaborators:** Team, VideoConference                                    |

| **Class Name:**  MessagingManager                                         |
|---------------------------------------------------------|
| **Parent Class:** None                                     |
| **Subclass:** None                                              |
| **Responsibilities:** <br>- Facilitate messaging within teams/groups<br>- Send and receive messages<br>- Edit and delete own messages<br>- Reply to specific messages<br>- Mention or tag specific users                                |
| **Collaborators:** User, Team|

| **Class Name:**  FileSharingManager                                        |
|---------------------------------------------------------|
| **Parent Class:** MessagingManager                                     |
| **Subclass:** None                                              |
| **Responsibilities:** <br>- Manage file and image sharing within teams/groups<br>- Handle file upload, storage, and retrieval                           |
| **Collaborators:** User, Team                                      |

| **Class Name:**  VideoConference                                         |
|---------------------------------------------------------|
| **Parent Class:** None                                     |
| **Subclass:** None                                              |
| **Responsibilities:** <br>- Create and manage video conferences<br>- Handle video and audio streaming<br>- Manage participants and permissions<br>- Mute and unmute participants<br>- Turn camera on and off for participants<br>- Display a timer for the duration of the conference                              |
| **Collaborators:** User                                      |

| **Class Name:**  RecordingManager	                                         |
|---------------------------------------------------------|
| **Parent Class:** VideoConference                                     |
| **Subclass:** None                                              |
| **Responsibilities:** <br>- Manage recording of video conferences<br>- Handle storage, retrieval, and access control for recordings|
| **Collaborators:** User, VideoConference                                     |

| **Class Name:**  Calendar                                         |
|---------------------------------------------------------|
| **Parent Class:** None                                     |
| **Subclass:** None                                              |
| **Responsibilities:** <br>- Manage user calendars<br>- Handle event creation, modification, and deletion<br>- Share calendar details with other users/groups<br>- Compare calendars for mutual availability<br>- Set recurring events for busy hours<br>- Book meetings with users/groups                        |
| **Collaborators:** User                                      |

| **Class Name:**  EventManager                                         |
|---------------------------------------------------------|
| **Parent Class:** Calendar                                     |
| **Subclass:** None                                              |
| **Responsibilities:** <br>- Manage events and appointments on the calendar     |
| **Collaborators:** Calendar                                      |

| **Class Name:**  Dashboard                                         |
|---------------------------------------------------------|
| **Parent Class:** None                                     |
| **Subclass:** ProfileManager                                              |
| **Responsibilities:** <br>- Display and visualize data in an interactive dashboard <br>- Customize dashboard layout and components <br> - Provide real-time data updates      |
| **Collaborators:** User, Team                                      |

| **Class Name:**  ProfileManager                                         |
|---------------------------------------------------------|
| **Parent Class:** Dashboard                                     |
| **Subclass:** StatusManager                                              |
| **Responsibilities:** <br>- Manage user profile information <br>- Handle profile picture upload and retrieval|
| **Collaborators:** User  

| **Class Name:**  StatusManager                                         |
|---------------------------------------------------------|
| **Parent Class:** ProfileManager                                     |
| **Subclass:** None                                              |
| **Responsibilities:** <br>- Set and manage user status (active, away, do not disturb, invisible)      |

| **Class Name:**  AccountSettingsManager                 |
|---------------------------------------------------------|
| **Parent Class:** ProfileManager                                     |
| **Subclass:** None                                              |
| **Responsibilities:** <br>- Manage user account settings <br>- Allow modification of username and password      |
| **Collaborators:** User                                      |

| **Class Name:**  NotificationManager                                         |
|---------------------------------------------------------|
| **Parent Class:** ProfileManager                                     |
| **Subclass:** None                                              |
| **Responsibilities:** <br>- Handle notification preferences and delivery      |
| **Collaborators:** User                                      |

# Software Architecture Design

# Conclusion
<img src="https://i.imgur.com/HHknmj2.png" alt="Alt Text" width="50%" height="50%">

### Summary of the system design document

The system design paper offers a thorough description of the app's architecture, components, and design considerations in its conclusion. The basic characteristics of the system are described, along with design concepts for the user interface, data management plans, methods for handling errors, testing procedures, deployment schedules, and maintenance plans.

### Future considerations and enhancements

Future considerations and enhancements for the app may include incorporating additional features based on user feedback, optimizing performance and scalability as user base grows, integrating advanced security measures, exploring cloud-based solutions for improved flexibility and scalability, and leveraging emerging technologies to enhance the app's functionality and user experience.
