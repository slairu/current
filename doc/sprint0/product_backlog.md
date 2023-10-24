**Accounts:**
1. As an unregistered user, I want to be able to sign up with a unique username, email, and password so that I can create a personalized account.
	- Given the user entered a unique email and valid password, when the user creates an account, then they should receive a confirmation/verification email.

2. As a user, I want to be able to sign in and sign out of my account so that I can securely access and manage my account.
	- Given a user has a registered account, when they enter their credentials (username/email and password), then they should be able to sign in and access their account.
	- Given a signed-in user, when they choose to sign out, then they should be logged out of their account and redirected to the sign-in page.

3. As a user, I want to be able to upload and change my profile picture so that I can personalize my account and be easily recognizable.
	- Given a user wants to set a profile picture, when they upload an image, then the selected image should be displayed as their profile picture across the application.

4. As a user, I want to be able to set my status as active, away, do not disturb, or invisible so that other users can know my availability and responsiveness.
	- Given a user wants to set their status, when they choose to set their status as active, away, do not disturb, or invisible, then the chosen status should be visible to other users as appropriate

5. As a user, I want to be able to access and modify my account settings, including changing my username or password so that I can customize my account preferences.
	- Given a user wants to modify their account details, when they access the account settings page and make changes to their username or password, then the changes should be saved and reflected in their account.

6. As a user, I want to be able to manage my notification settings, such as muting or configuring notification preferences, so that I can control how I receive notifications.
	- Given a user wants to configure their notification preferences, when they customize their notification settings such as muting specific types of notifications or adjusting notification sounds, then the chosen notification settings should be applied and trigger notifications accordingly.

**Team/Groups:**
1. As a user, I want to be able to join or leave teams or groups so that I can collaborate and communicate with specific sets of people.
	- Given a user wants to join a team/group, when they select the join option or use specific commands, then they should be added to the team/group.
	- Given a user wants to leave a team/group, when they choose the leave option or use specific commands, and they should be removed from the team/group

2. As a team/group leader, I want to be able to add or remove members from the team/group so that I can manage the composition of the team/group effectively.
	- Given a team/group leader wants to add new members, when they initiate the process and provide the necessary information, then the new members should be added to the team/group successfully.
	- Given a team/group leader wants to remove members, when they initiate the removal process, then the specified members should be removed from the team/group

3. As a user, I want to be able to send messages within a team or group so that I can communicate and share information with other team/group members.
	- Given a user wants to send messages within teams or groups, when they enter the message content and choose to send, then the message should be delivered to all members of the team/group.
    
	- Given a user wants to view received messages within teams or groups, when they access the conversation or refresh the page, then the messages should be displayed in real-time or with minimal delay.

4. As a user, I want to be able to edit or delete my own messages within a team or group so that I can correct errors or remove outdated information.
	- Given a user wants to edit their own messages within teams or groups, when they select the edit option and modify the message content, then the edited message should be updated and displayed to all members of the team/group.
    
	- Given a user wants to delete their own messages within teams or groups, when they choose the delete option, then the message should be removed from the conversation and no longer visible to any members.

5. As a user, I want to be able to reply to specific messages within a team or group so that I can provide targeted responses and maintain conversational context.
	- Given a user wants to reply to specific messages within teams or groups, when they choose the reply option and enter their response, then the reply should be displayed in a threaded or nested format, providing clear context and readability.

6. As a user, I want to be able to mention or tag specific users within a team or group so that I can draw their attention to relevant messages or actions.
	- Given a user wants to mention or tag specific users within teams or groups, when they use the mention feature and enter the username or select the user from a list, then the mentioned users should receive notifications or highlighted indicators for the relevant messages. 

7. As a user, I want to be able to see the timestamp of messages within a team or group so that I can track the chronology of conversations.
	- Given a user wants to view the timestamp of messages within teams or groups, when they access the conversation or scroll through the messages, then each message should display a timestamp indicating when it was sent.

8. As a user, I want to be able to see read receipts for messages within a team or group so that I can know if my messages have been viewed or read.
	- Given a user wants to see read receipts for their sent messages within teams or groups, when the recipient's device is connected to the internet and the message is delivered, then the sender should be able to detect the delivery status, such as two tick marks indicating that the message was received and/or read by the recipient.

**Video Conferencing:**
1. As a user, I want to be able to mute and unmute myself during a video conference so that I can control my audio input.
	- Given a user wants to mute themselves during a video conference, when they select the mute option, then their audio input should be disabled, and other participants should not hear their audio.
	
	- Given a user is muted during a video conference, when they select the unmute option, then their audio input should be re-enabled, and other participants should hear their audio.

2. As a user, I want to be able to turn my camera on and off during a video conference so that I can control my video input.
	- Given a user wants to turn their camera on during a video conference, when they select the camera on option, then their video feed should be enabled, and other participants should see their video.
	
	- Given a user wants to turn their camera off during a video conference, when they select the camera off option, then their video feed should be disabled, and other participants should not see their video.
    

3. As a user, I want to be able to see a timer for the duration of a video conference so that I can keep track of the duration of the call.
	- Given a user has joined a meeting, when they select the timer, then they should be able to see the duration of the ongoing call.

**Calendar:**
1. As a user, I want to have an independent calendar where I can manage my events and appointments so that I can keep track of my schedule.
	- Given each user has their own calendar, when they access their calendar, then they should only see their own events and appointments.

2. As a user, I want to be able to choose whether to share the details of specific time slots with other users or groups, or marking them as "busy," so that others can see my availability for potential meetings or events.
	- Given a user wants to share details of specific time slots with users/groups, when they select the sharing option for those time slots, then the details should be visible to the specified users/groups, indicating a shared event.
    
	- Given a user wants to indicate unavailability of specific time slots, when they mark those time slots as "busy", then the details should not be visible to other users/groups, indicating unavailability.

3. As a user, I want to be able to compare my calendar with other users or group members to find mutually available time slots so that we can schedule meetings or events more efficiently.
	- Given a user wants to compare their calendar with other users/group members, when they initiate the comparison process, then the system should identify and display overlapping free time slots for potential meetings or events.

4. As a user, I want to be able to set recurring events for busy hours on my calendar so that I can automatically block off time for repetitive commitments.
	- Given a user wants to set busy hours or recurring events on their calendar, when they specify the desired time slots and recurrence pattern, then the calendar should automatically block off those time slots on a recurring basis, indicating unavailability

5. As a user, I want to be able to book meetings by adding individual users or groups and see their responses (accept/decline) so that I can coordinate and manage collaborative meetings effectively.
	- Given a user wants to book meetings, when they create a meeting event and add individual users or groups as invited members, then the invitation should be sent
