import React, { useState, useEffect, useRef } from "react";
import "./styles/Chat.css";
import { Icon } from "@iconify/react";
import LoadingScreen from "./LoadingScreen";
import Modal from "react-modal";
import logoW from "./current-name.png"; // Adjust the path if necessary
import useGetToken from "../../utils/useGetToken";
import io, { Socket } from "socket.io-client";
import useSocket from "../useSocket";
import data from "@emoji-mart/data";
import useUser from "../../utils/useUser";
import Picker from "@emoji-mart/react";
import SideBar from "../SideBar";

const ChattingFunction = (props) => {
  const [pizzartio, setPizzartio] = useState(["hello"]);
  const [searchText, setSearchText] = useState("");
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [lastSeenIndex, setLastSeenIndex] = useState(0);
  const [editingMessageIndex, setEditingMessageIndex] = useState(null);
  const [editedMessageText, setEditedMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showProfile, setShowProfile] = useState(false); // New state to toggle profile visibility
  const [usersInSameGroup, setUsersInSameGroup] = useState([]);
  const [usersInSameGroup2, setUsersInSameGroup2] = useState([]);
  const { socketRef, socketLoaded } = useSocket();
  const [isTyping, setIsTyping] = useState(false);
  const [group, setGroup] = useState(true);
  const [context, setContext] = useState([]);
  const [userID, setUserID] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [modifyParticipants, setModifyParticipants] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [messagekey, setMessageKey] = useState(0);
  const [xs, setXS] = useState(null);
  const [message_settings, setMessageSettings] = useState(false);

  const userObj = useUser();

  const handleMessge_Settings = () => {
    setMessageSettings(!message_settings);
  };

  var value = 0;
  const [mentioned, setMentioned] = useState(false);
  const handleMentionClick2 = (mention) => {
    if (mention[0] === userObj.id) {
      setMentioned(true);
    }
  };

  useEffect(() => {
    console.log(userObj);
    if (!socketRef.current) {
      return;
    }
    socketRef.current.emit("getGroups", (groups) => {
      console.log(groups);
      for (let i = 0; i < groups.length; i++) {
        setUsersInSameGroup2((prevUsers) => [...prevUsers, groups[i]]);
      }
    });

    // socketRef.current.on("receiveGroupRemoval", (message) => {
    //   console.log(message);
    // });

    // socketRef.current.emit(
    //   "reactToMessage",
    //   {
    //     messageId: "64cd2050dc9d94c0176947a0",
    //     reaction: "thumbs-down",
    //   },
    //   (ack) => {
    //     console.log(ack);
    //   }
    // );

    socketRef.current.emit(
      "editMessage",
      {
        messageId: "64d408b049b48db4e2b5aad4",
        content: "new mention test",
        mentions: [],
      },
      (ack) => {
        console.log(ack);
      }
    );

    setContext([]);
    socketRef.current.emit(
      "getMessages",
      {
        groupId: userID,
        limit: 100,
      },
      (ack) => {
        console.log(ack);
        if (ack.messages) {
          const messages2 = ack.messages;
          for (let i = 0; i < messages2.length; i++) {
            setContext((prevContext) => [...prevContext, messages2[i]]);
          }
        }
        //reverse the array
        setContext((prevContext) => [...prevContext.reverse()]);
      }
    );

    if (props.isVideoCall) {
      handleShrinkClick();
      setChat(false);
    }

    // socketRef.current.onAny((eventName, . ..args) => {
    //   console.log(eventName, args);
    // });
  }, [socketLoaded]);

  const [mocking, setMocking] = useState([]);
  const mockUsers = mocking.map((user) => {
    return {
      id: user._id,
      name: user.username,
      profilePicture: user.profilePicture,
    };
  });

  const [groupInvite, setGroupInvite] = useState(null);
  useEffect(() => {
    if (!socketRef.current) {
      return;
    }
    // socketRef.current.on("receiveMessageReact", (message) => {
    //   console.log(message);
    // });
    socketRef.current.on("receiveGroupInvite", (message) => {
      console.log("receiveGroupInvite", message);
      setGroupInvite(message.group);
      setUsersInSameGroup2((prevUsers) => [...prevUsers, message.group]);
    });
    console.log("Group Invite:", groupInvite);
  }, [socketLoaded]);

  const [groupRemoval, setgroupRemoval] = useState(null);
  useEffect(() => {
    if (!socketRef.current) {
      return;
    }
    socketRef.current.on("receiveGroupRemoval", (message) => {
      setgroupRemoval(message.group);
      //remove the group from the list
      console.log("receiveGroupRemoval", message);
      console.log("receiveGroupRemoval", usersInSameGroup2);
      setUsersInSameGroup2((prevUsers) => [
        ...prevUsers.filter((user) => user._id !== message.group._id),
      ]);
    });
    console.log("Group Removal:", groupRemoval);
  }, [socketLoaded]);

  // Listen for the "receiveMessage" event on component mount
  useEffect(() => {
    if (!socketRef.current) {
      return;
    }
    socketRef.current.on("receiveMessage", (message) => {
      console.log(message, "receiveMessage");
      setContext((prevContext) => [...prevContext, message]);
    });
  }, [socketLoaded]);

  const X = ({
    users,
    selectedUsers,
    handleCheckboxChange,
    handleSubmitPrompt,
    usersInSameGroup,
  }) => {
    // ... (existing code)

    const [isModalOpen, setIsModalOpen] = useState(false);

    // ... (rest of the existing code)
  };

  const handleTyping = (e) => {
    setIsTyping(e.target.value !== "");
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);

  const [replyMessage, setReplyMessage] = useState("");
  const [isCustomInputOpen, setCustomInputOpen] = useState(false);
  const searchInputRef = useRef(null);
  const [isCustomInputOpen2, setCustomInputOpen2] = useState(false);

  const handleOpenModalParticipants = () => {
    setModalOpen(true);
  };

  const handleOpenModalParticipants10 = () => {
    setModalOpen2(true);
  };
  const handleCloseParticipants = () => {
    setModalOpen(false);
    setModifyParticipants(false);
  };

  const handleDeleteMessages = (index) => {
    socketRef.current.emit(
      "deleteMessage",
      {
        messageId: index,
      },
      (ack) => {
        console.log(ack);
      }
    );
  };

  // Listen for the "receiveMessage" event on component mount
  useEffect(() => {
    if (!socketRef.current) {
      return;
    }
    socketRef.current.on("receiveMessageDelete", (message) => {
      //remove the message from the list with the id from context item
      setContext((prevContext) => [
        ...prevContext.filter((context) => context._id !== message.messageId),
      ]);
    });
  }, [socketLoaded]);

  // Listen for the "receiveMessage" event on component mount
  useEffect(() => {
    if (!socketRef.current) {
      return;
    }
    socketRef.current.on("receiveMessageEdit", (message) => {
      //remove the message from the list with the id from context item
      console.log("editted message", message);
      //replace the old message ith teh new onw basedon tjeh id from context items
      setContext((prevContext) => [
        ...prevContext.map((context) =>
          context._id === message._id ? message : context
        ),
      ]);
    });
  }, [socketLoaded]);

  const mentionOptions = mockUsers.map((user) => {
    return { name: user.name };
  });
  const [showMentionList, setShowMentionList] = useState(false);
  const [edit_shower, setEditShower] = useState(false);
  const editMesseges = (index) => {
    // setEditShower(true);
    searchInputRef.current.focus();
    const ppp = prompt("Edit Your Message");
    socketRef.current.emit(
      "editMessage",
      {
        messageId: index,
        content: ppp,
      },
      (ack) => {
        console.log(ack);
      }
    );
  };

  const handleOpenModal = () => {
    setCustomInputOpen(true);
    searchInputRef.current.focus();
  };
  const handleOpenModal2 = () => {
    setCustomInputOpen2(true);
    searchInputRef.current.focus();
  };

  const handleCloseModal = () => {
    setCustomInputOpen(false);
  };
  const [showSearch, setShowSearch] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [searchText2, setSearchText2] = useState("");

  const [showBackwards, setShowBackwards] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [settings, setSetttings] = useState(false);
  const [chat, setChat] = useState(false);

  const showSettings = () => setSetttings(!settings);

  const handleCreateGroupClick = () => {
    setShowSearch((prevShowSearch) => !prevShowSearch);
    setShowCreate((prevShowCreate) => !prevShowCreate);
    setShowCancel((prevShowCancel) => !prevShowCancel);
    setShowBackwards((prevShowBackwards) => !prevShowBackwards);
    setShowDone((prevShowDone) => false);
  };

  const handleUserSearch = () => {
    setShowSearch((prevShowSearch) => !prevShowSearch);
    setShowCreate((prevShowCreate) => false);
    setShowCancel((prevShowCancel) => false);
    setShowDone((prevShowDone) => !prevShowDone);
    setShowBackwards((prevShowBackwards) => false);
  };

  const handleInputChange2 = (event) => {
    setSearchText2(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setEditShower(false);
      if (!isCustomInputOpen && !isCustomInputOpen2) {
        handleSendMessage();
      } else if (!isCustomInputOpen && isCustomInputOpen2) {
        handleReplySubmit(searchInputRef.current.value);
      } else {
        handleReply(lastSeenIndex);
        handleReplySubmit(searchInputRef.current.value);
      }
      searchInputRef.current.value = ""; // Clear the input text
    }
  };
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  const handleReplySubmit = (reply) => {
    setReplyMessage(reply);
    setCustomInputOpen(false); // Hide the message when the user clicks "Send"
    setCustomInputOpen2(false); // Hide the message when the user clicks "Send"

    setMessage({ text: "", file: null });
  };

  const handleAddParticipant = () => {
    setModifyParticipants(true);
  };

  const myUser = {
    id: 0,
    name: "John Doe",
    profilePicture: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  };

  const myGroup = {
    id: 0,
    name: "Cool group",
    profilePicture:
      "https://img.freepik.com/premium-vector/profile-icon-world-globe-group-user-member-avatar_48369-2481.jpg?w=2000",
  };

  useEffect(() => {
    async function getUsers() {
      await fetch("http://localhost:4200/api/v1/users")
        .then((res) => res.json())
        .then((data) => {
          setMocking(data.users);
          console.log(data.users);
        });
    }
    getUsers();
  }, []);

  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHeading, setChatHeading] = useState("Chat Bot");
  const [chatHeadingProfile, setchatHeadingProfile] = useState(
    "https://pavzi.com/wp-content/uploads/2023/04/Discord.png"
  );

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [customName, setCustomName] = useState("");
  const [selectedUsersID, setSelectedUsersID] = useState([]);
  const handleUserSelection = (user) => {
    console.log("user", user);
    console.log("userID", user.id);
    setSelectedUsersID((prevSelected) => {
      if (prevSelected.includes(user.id)) {
        return prevSelected.filter((id) => id !== user.id);
      } else {
        return [...prevSelected, user.id];
      }
    });
    console.log("selectedUsersID", selectedUsersID);
    // setSelectedUsers((prevSelected) => {
    //   if (prevSelected.includes(userId)) {
    //     return prevSelected.filter((id) => id !== userId);
    //   } else {
    //     return [...prevSelected, userId];
    //   }
    // });
  };

  const [showReplyButton, setShowReplyButton] = useState(false);

  const handleReply3 = (itemId) => {
    // Add your reply logic here
    console.log("Replying to message with ID:", itemId);
  };
  const [profilePicture, setProfilePicture] = useState("");

  const handleConfirm = () => {
    setConfirmed(true);
    setShowSearch((prevShowSearch) => false);
    setShowCreate((prevShowCreate) => false);
    setShowCancel((prevShowCancel) => false);
    setShowBackwards((prevShowBackwards) => false);
    setShowDone((prevShowDone) => false);

    const groupStat = window.prompt(
      "Enter group status:",
      "This is a cool group"
    );
    const profilePic = window.prompt(
      "Enter profile picture URL:",
      "https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png"
    );

    if (profilePic !== null) {
      setchatHeadingProfile(
        "https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png"
      );
    }
  };
  const [name, setName] = useState("user_name");
  const [user_status, setStatus] = useState("Group Status");
  const [stringArray, setStringArray] = useState([]);

  const handlesModalSubmit = () => {
    setChat(true);
    setGroup(true);
    setUsersInSameGroup((prevUsers) => [...prevUsers, myUser]);
    setConfirmed(true);
    setShowSearch((prevShowSearch) => false);
    setShowCreate((prevShowCreate) => false);
    setShowCancel((prevShowCancel) => false);
    setShowBackwards((prevShowBackwards) => false);
    setShowDone((prevShowDone) => false);
    setStringArray((prevStringArray) => [
      ...prevStringArray,
      "64c1b44f9501a7c06871cd0b",
    ]);
    const userSend = {
      groupDetails: { name: name, description: user_status },
      accounts: stringArray,
    };
    console.log("userSend", selectedUsers);
    const testData = {
      groupDetails: { name: name, description: user_status },
      accounts: selectedUsersID,
    };
    socketRef.current.emit("createGroup", testData, (response) => {
      if (response.errors) {
        console.log(response.errors);
        return;
      }
      console.log("response", response);
      handleSubmitPrompt(response);
      // do something with response
    });
    // for (var i = 0; i < selectedUsers.length; i++) {
    //   socketRef.current.emit(
    //     "addToGroup",
    //     {
    //       groupId: "64c9eb8dd2a1283ca695d2e7",
    //       userId: selectedUsers[i],
    //     },
    //     (response) => {
    //       if (response.errors) {
    //         console.log(response.errorss);
    //         return;
    //       }
    //       console.log("response", response);
    //     }
    //   );
    // }
    console.log("userID", userID);
    console.log("selectedUsers", selectedUsers);
    for (var i = 0; i < selectedUsersID.length; i++) {
      socketRef.current.emit(
        "addToGroup",
        {
          groupId: "64cb4f691e8318ef2d73fec2",
          userId: selectedUsersID[i],
        },
        (response) => {
          if (response.errors) {
            console.log(response.errorss);
            return;
          }
          console.log("response", response);
        }
      );
    }

    // socketRef.current.emit(
    //   "sendMessage",
    //   {
    //     message: {
    //       groupId: "64c2a6fa6a67d02c3e9c246a", // This should be a valid ObjectId for a "Group" document in your "Group" collection
    //       content: "This is a test message.",
    //       attachment: "example_attachment.png", // This could be a URL or file path to an attachment
    //     },
    //   },
    //   (response) => {
    //     console.log(response);
    //   }
    // );
  };

  const handleParticipantClick = () => {
    setConfirmed(true);
    setShowSearch((prevShowSearch) => false);
    setShowCreate((prevShowCreate) => false);
    setShowCancel((prevShowCancel) => false);
    setShowBackwards((prevShowBackwards) => false);
    setShowDone((prevShowDone) => false);
  };
  const handleCancel = () => {
    setSelectedUsers([]);
    setConfirmed(false);
    setCustomName("");
  };

  const handleRefresh = () => {
    setSelectedUsers([]);
    setConfirmed(false);
    setCustomName("");
  };

  const renderSelectedUsers = () => {
    if (!confirmed || selectedUsers.length === 0) {
      return null;
    }
    return name;
  };
  const mockUsers2 = [
    {
      id: 1,
      name: "C01",
      profilePicture:
        "https://harveykalles.com/wp-content/uploads/2020/05/Osprey-Hoot13-scaled.jpg",
    },
    {
      id: 2,
      name: "C43",
      profilePicture:
        "https://equipped.youthsmart.ca/wp-content/uploads/2022/08/Equipped-Course-Graphics-1-1024x807.png",
    },
    {
      id: 3,
      name: "C10",
      profilePicture:
        "https://www.acs.edu.au/database/images/course_3945700.jpg",
    },
    // Add more mock users as needed
  ];

  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [filteredUsers2, setFilteredUsers2] = useState(mockUsers2);
  const [x, setx] = useState(false);

  useEffect(() => {
    const filterUsers = (query) => {
      if (query === "") {
        setFilteredUsers(mockUsers); // If the search query is empty, show all users
      } else {
        const lowercaseQuery = query.toLowerCase();
        const filtered = mockUsers.filter((user) =>
          user.name.toLowerCase().includes(lowercaseQuery)
        );
        setFilteredUsers(filtered);
      }
    };

    filterUsers(searchText);
  }, [searchText]);

  useEffect(() => {
    console.log("filteredUsers", groupInvite);
    // Function to filter users based on the search query
    const filterUsers2 = (query) => {
      if (query === "") {
        setFilteredUsers2(mockUsers2);
        //add groupInvite also
      } else {
        const lowercaseQuery = query.toLowerCase();
        const filtered = mockUsers2.filter((user) =>
          user.name.toLowerCase().includes(lowercaseQuery)
        );
        setFilteredUsers2(filtered);
      }
    };

    filterUsers2(searchText);
  }, [searchText]);
  const [messages, setMessages] = useState([
    {
      text: "Hello there! Welcome to our chat platform!",
      timestamp: new Date().toLocaleString(),
      sender: {
        name: "ChatBot",
        profilePicture:
          "https://pavzi.com/wp-content/uploads/2023/04/Discord.png",
        type: "ChatBot",
        status: "Online",
      },
      reactions: [],
      replies: [],
      seen: false,
    },
  ]);
  const handleLeaveGroup = () => {
    console.log(userID);
    socketRef.current.emit(
      "leaveGroup",
      {
        groupId: userID,
      },
      (messages) => {
        console.log(messages);
        setUsersInSameGroup2((prevUsers) => [
          ...prevUsers.filter((user) => user._id !== userID),
        ]);
        // for (let i = 0; i < messages.length; i++) {
        //   setContext((prevContext) => [...prevContext, messages[i]]);
        // }
      }
    );
  };
  // Rest of the code...
  const [react4, setReact4] = useState(false);

  const [groupusers, setGroupUsers] = useState([]);
  const [created, setCreated] = useState("date of creation");
  const handleSearchResultClick = (userName, userPhoto, userID, date) => {
    console.log(userObj.username);
    setChat(true);
    socketRef.current.emit("getGroupUsers", { groupId: userID }, (users) => {
      if (users) {
        console.log(users);
        setGroupUsers(users.users);
      }
    });
    console.log(selectedUsers);
    console.log(`Clicked on user: ${userName}`);
    console.log(`Clicked on userID: ${userID}`);
    // Rest of the code...
    setSelectedUser(userName);
    console.log(date);
    const datex = new Date(date);
    setCreated(
      datex.toLocaleString()[0] +
        datex.toLocaleString()[1] +
        datex.toLocaleString()[2] +
        datex.toLocaleString()[3] +
        datex.toLocaleString()[4] +
        datex.toLocaleString()[5] +
        datex.toLocaleString()[6] +
        datex.toLocaleString()[7]
    );
    setChatHeading(userName || "New Chat");
    setUserID("" + userID + "");
    setchatHeadingProfile(
      userPhoto ||
        "https://img.freepik.com/premium-vector/profile-icon-group_48369-2510.jpg?w=2000"
    );
    setContext([]);
    console.log("userID", typeof userID);
    socketRef.current.emit(
      "getMessages",
      {
        groupId: userID,
        limit: 100,
      },
      (ack) => {
        console.log(ack);
        if (ack.messages) {
          const messages2 = ack.messages;
          for (let i = 0; i < messages2.length; i++) {
            setContext((prevContext) => [...prevContext, messages2[i]]);
          }
        }
        console.log("context from seaerch reult clikc", context);
        setContext((prevContext) => [...prevContext.reverse()]);
      }
    );

    // socketRef.current.emit(
    //   "getMessages",
    //   {
    //     groupId: userID,
    //     limit: 100,
    //   },
    //   (ack) => {
    //     const messages2 = ack.messages;
    //     console.log(messages2);
    //     for (let i = 0; i < messages2.length; i++) {
    //       setContext((prevContext) => [...prevContext, messages2[i].content]);
    //     }
    //   }
    // );
  };

  const handleParticpantlose = () => {
    setModifyParticipants(false);
  };

  const handleParticpantlose10 = () => {
    // setModalOpen2(false);
  };

  const [message, setMessage] = useState({
    text: "",
    file: null, // Add a file property to the message state
  });

  useEffect(() => {
    if (messages.length > 0) {
      setLastSeenIndex(0);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];

        // updatedMessages[0].seen = false;
        return updatedMessages;
      });
    }
  }, []);

  const containerStyles = {
    // display: "flex",
    // flexDirection: "column",
    animation: "slideFromLeft 1s",
  };
  const handleClosePrompt = () => {
    setIsPromptOpen(false);
  };

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [profilePictureURL, setProfilePictureURL] = useState("");

  const handleOpenPrompt = () => {
    setIsPromptOpen(true);
  };

  const handleEditMessage = (messageIndex) => {
    setIsTyping(false);

    const replyMessage = message.text;

    if (replyMessage) {
      const updatedMessages = [...messages];
      updatedMessages[messageIndex].text = replyMessage;
      setMessages(updatedMessages);
    }
  };
  // CSS animation keyframes for sliding from the left
  const keyframes = `
    @keyframes slideFromLeft {
      0% {
        transform: translateX(-100%);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  const handleDeleteMessage = (index) => {
    const updatedMessages = [...messages];
    updatedMessages.splice(index, 1);
    setMessages(updatedMessages);
    localStorage.setItem("messages", JSON.stringify(updatedMessages));
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      background: "#f2f2f2",
      borderRadius: "10px",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#333333",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    inputContainer: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "20px",
    },
    label: {
      fontSize: "18px",
      marginBottom: "10px",
      color: "#555555",
    },
    input: {
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #dddddd",
      fontSize: "16px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
    },
    button: {
      padding: "10px 20px",
      background: "#4CAF50",
      color: "white",
      fontSize: "18px",
      fontWeight: "bold",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    userLabel: {
      display: "block",
      marginBottom: "8px",
      cursor: "pointer",
    },
    selectedUsersContainer: {
      marginTop: "20px",
      padding: "10px",
      background: "#f2f2f2",
      borderRadius: "5px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    selectedUserItem: {
      marginBottom: "4px",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      textAlign: "center",
      margin: "20px 0",
    },
    inputContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "20px",
    },
    label: {
      fontSize: "18px",
      margin: "5px 0",
    },
    input: {
      width: "300px",
      padding: "10px",
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      marginBottom: "10px",
    },
    profilePictureContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "20px",
    },
    profilePictureWrapper: {
      position: "relative",
    },
    profilePicture: {
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      objectFit: "cover",
    },
    profilePicturePlaceholder: {
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      border: "2px dashed #ccc",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "16px",
    },
    profilePictureInput: {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      opacity: "0",
      cursor: "pointer",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
    },
    xdscs: {
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      border: "2px dashed #ccc",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "16px",
      backgroundColor: "#f9f9f9", // Add a light background color
      color: "#777", // Text color for the placeholder
    },
    button: {
      padding: "10px 20px",
      fontSize: "18px",
      backgroundColor: "#000000",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },

    profilePicturePlaceholder: {
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      border: "2px dashed #ccc",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "16px",
      backgroundColor: "#f9f9f9", // Add a light background color
      color: "#777", // Text color for the placeholder
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
      cursor: "pointer",
      transition: "background-color 0.3s ease-in-out", // Add a smooth transition effect
    },

    profilePictureWrapper: {
      position: "relative",
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      overflow: "hidden",
      margin: "0 auto", // Center the wrapper
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
    },
    profilePicture: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    profilePicturePlaceholder: {
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "16px",
      backgroundColor: "#f9f9f9", // Add a light background color
      color: "#777", // Text color for the placeholder
      cursor: "pointer",
      transition: "background-color 0.3s ease-in-out", // Add a smooth transition effect
    },
    modalStyles: {
      overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: "1000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      content: {
        maxWidth: "400px",
        width: "90%",
        borderRadius: "10px",
        margin: "auto",
        background: "#ffffff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        height: "fit-content",
      },
    },
  };
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const newObject = {};
  newObject["id"] = 999;
  newObject["name"] = name;

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePictureFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setchatHeadingProfile(reader.result); // Set the selected picture data URL
      };
      reader.readAsDataURL(file);
      newObject["profilePicture"] = file;
    }
  };

  const handleCloseModalParticipants = () => {
    setModalOpen(false);
    setModifyParticipants(false);
    console.log("userID", userID);
    console.log("selectedUsers", selectedUsers);
    console.log("selectedUsersIDs", selectedUsersID);
    for (var i = 0; i < selectedUsersID.length; i++) {
      socketRef.current.emit(
        "addToGroup",
        {
          groupId: userID,
          userId: selectedUsersID[i],
        },
        (response) => {
          if (response.errors) {
            console.log(response.errorss);
            return;
          }
          console.log("response", response);
        }
      );
    }
  };

  const handleCloseModalParticipants10 = () => {
    setModalOpen2(false);
    console.log("userID", userID);
    console.log("userID", selectedUsers[2]);
    console.log("selectedUsers", selectedUsersID);
    for (var i = 0; i < selectedUsersID.length; i++) {
      socketRef.current.emit(
        "removeFromGroup",
        {
          groupId: userID,
          userId: selectedUsersID[i],
        },
        (response) => {
          console.log("response", response);
        }
      );
    }
    //to do stuff
  };

  const handleSubmitPrompt = (group) => {
    setIsPromptOpen(false);
    // Update the usersInSameGroup array
    const usersInGroup = group.users.map((user) => user.user);
    setUsersInSameGroup(usersInGroup);
    myGroup.name = group.name;
    // ... (perform any additional logic you want when the prompt is submitted)
  };
  // New state variable to handle animation class
  const [profileAnimation, setProfileAnimation] = useState("");

  const handleProfileClick = () => {
    setShowProfile((prevShowProfile) => !prevShowProfile);
    setProfileAnimation(showProfile ? "fallFromTop" : ""); // Add animation class based on showProfile state
  };

  // ... (Existing code)

  // CSS animation keyframes for falling from the top
  const keyframes2 = `
    @keyframes fallFromTop {
      0% {
        transform: translateY(-100%);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;

  // Add the animation keyframes to a new style element
  const styleElement2 = document.createElement("style");
  styleElement2.appendChild(document.createTextNode(keyframes2));
  document.head.appendChild(styleElement2);

  const handleFileInputChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Add the animation keyframes to a new style element
  const styleElement = document.createElement("style");
  styleElement.appendChild(document.createTextNode(keyframes));
  document.head.appendChild(styleElement);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowWelcomeScreen(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleMessageChange = (e) => {
    if (e.target.value.endsWith("@")) {
      setShowMentionList(true);
    } else {
      setShowMentionList(false);
    }
    setMessage((prevMessage) => ({
      ...prevMessage,
      text: e.target.value,
    }));
  };

  const videocall = () => {
    window.open("http://localhost:3000/audio");
  };

  const callhistory = () => {
    window.open("http://localhost:3000/" + userID + "/calls");
  };
  const emojis = ["👍", "❤️", "😄", "😊", "🎉"];

  const handleReaction = (index, emoji) => {
    const updatedMessages = [...messages];
    const messageReactions = updatedMessages[index].reactions;

    const reactionExists = messageReactions.find(
      (reaction) => reaction.emoji === emoji
    );

    if (reactionExists) {
      // Remove the reaction if it already exists
      updatedMessages[index].reactions = messageReactions.filter(
        (reaction) => reaction.emoji !== emoji
      );
    } else {
      // Add the reaction if it doesn't exist
      updatedMessages[index].reactions = [
        ...messageReactions,
        { emoji, timestamp: new Date().toLocaleString() },
      ];
    }

    setMessages(updatedMessages);
    localStorage.setItem("messages", JSON.stringify(updatedMessages));
  };

  //...

  const handleCopyMessage = (index) => {
    const messageText = messages[index].text;
    navigator.clipboard
      .writeText(messageText)
      .then(() => {
        // Optionally, you can provide a visual feedback to the user that the message was copied.
        alert("Message copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy message: ", error);
      });
  };
  const { webkitSpeechRecognition } = window;
  const [isRecording, setIsRecording] = useState(false);
  const recognition = new webkitSpeechRecognition();

  const startRecording = () => {
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognition.stop();
    setIsRecording(false);
  };
  recognition.onresult = (event) => {
    const speechResult = event.results[event.results.length - 1][0].transcript;
    setMessage((prevMessage) => ({ ...prevMessage, text: speechResult }));
  };

  const [searchValue, setSearchValue] = useState("");

  const handleResetSearchBar = () => {
    setSearchValue("");
  };

  const [usermen, setUsemen] = useState([]);
  const handleMentionClick = (mention) => {
    setUsemen((prevUsemen) => [...prevUsemen, mention.name]);
    setMessage((prevMessage) => ({
      ...prevMessage,
      text: prevMessage.text + mention.name + " ",
    }));
    setShowMentionList(false);
  };

  const handleSendMessage = (x) => {
    setShowEmojiPicker(false);

    setIsTyping(false);
    if (isRecording) {
      stopRecording(); // Stop the recording if it's in progress
    }

    if (message.text !== "" || selectedFile) {
      const newMessage = {
        text: message.text,
        file: selectedFile,
        timestamp: new Date().toLocaleString(),
        sender: {
          name: "John Doe",
          profilePicture:
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          type: "user",
          online: true,
          status: "Online",
        },
        reactions: [],
        replies: [],
        seen: true,
      };
      setMessages([...messages, newMessage]);
      setMessage({ text: "", file: null });
      setSelectedFile(null);
      console.log(newMessage.text);
      console.log(usermen);
      socketRef.current.emit(
        "sendMessage",
        {
          message: {
            groupId: userID,
            content: newMessage.text,
          },
        },
        (response) => {
          // console.log(response);
          console.log("x", chatHeading);
        }
      );
      // Update the local state and also save it to local storage
      // localStorage.setItem(
      //   "messages",
      //   JSON.stringify([...messages, newMessage])
      // );
      // setLastSeenIndex(messages.length);
    }
  };

  const handleReply = (messageIndex) => {
    setIsTyping(false);

    const replyMessage = message.text;

    if (replyMessage) {
      const updatedMessages = [...messages];

      const reply = {
        text: replyMessage,
        file: selectedFile,
        timestamp: new Date().toLocaleString(),
        sender: {
          name: "John Doe",
          profilePicture:
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          type: "user",
          online: true,
        },
        reactions: [],
        replies: [],
        seen: true,
      };
      updatedMessages[messageIndex].replies.push(reply);
      setMessages(updatedMessages);
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
    }
  };

  const handleEmojiSelect = (emoji) => {
    setShowEmojiPicker(false);
    setMessage((prevMessage) => ({
      ...prevMessage,
      text: prevMessage.text + emoji.native,
    }));
  };

  const handleEmojiSelect2 = (emoji) => {
    setReact4(false);
  };

  const handleShrinkClick = () => {
    document.body.classList.toggle("shrink");
  };

  // Function to check if it's a group or user
  function checkIsGroup() {
    // Add your logic here to determine if it's a group or a user
    // For example, you might have a variable or a condition that determines the type
    // For this example, let's assume 'isGroup' is a boolean variable that indicates if it's a group or not
    const isGroup = true; // Change this value as per your logic
    return isGroup;
  }

  const handleCheckboxChange = (event) => {
    const userId = parseInt(event.target.value);
    const isSelected = event.target.checked;

    if (isSelected) {
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, userId]);
    } else {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter((id) => id !== userId)
      );
    }
  };
  // Inside your component
  const isGroup = checkIsGroup();
  const status = isGroup ? "Absent" : "Online";
  const additionalOption = isGroup ? "Leave Group" : "Delete Contact";

  const [messageIndex, setMessageIndex] = useState(-1); // Store the index of the message being hovered

  // Other code in your component...

  // Function to handle hovering over a message and showing the reply button
  const handleMouseEnter = (index) => {
    setShowReplyButton(true);
    setMessageIndex(index);
  };

  // Function to handle leaving the message area and hiding the reply button
  const handleMouseLeave = () => {
    setShowReplyButton(false);
    setMessageIndex(-1);
  };

  return (
    <div
      className={`page-container ${profileAnimation}`}
      style={showWelcomeScreen ? {} : containerStyles}
    >
      {showWelcomeScreen ? (
        <div className="welcome-screen">
          <LoadingScreen />
        </div>
      ) : (
        <>
          <SideBar/>
          <div className="left-section">
            <div className="left-section-bottom">
              {chat && <img id="logo-img" src={logoW} alt="Logo" />}
              <div className="people_heading">
                <button
                  className="create-group-button"
                  onClick={handleCreateGroupClick}
                >
                  <div className="creater_name">
                    {showBackwards ? "Go Back" : "Create Group"}
                  </div>
                </button>
                <button
                  className="create-group-button"
                  onClick={handleUserSearch}
                >
                  <div className="creater_name">
                    {showDone ? "Done" : "Search User"}
                  </div>
                </button>

                <div className="button-container">
                  {showSearch && (
                    <div className="searchbar">
                      <div className="searchbar-part1">
                        <div>
                          <Icon icon="bx:search" width="20" height="20" />
                        </div>
                      </div>
                      <div className="searchbar-part2">
                        <input
                          type="text"
                          placeholder="Search for users..."
                          value={searchText}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}
                  {showCreate && (
                    <button
                      onClick={handleRefresh}
                      className="confirm-group-button"
                    >
                      Refresh
                    </button>
                  )}

                  {showCreate && (
                    <button
                      className="confirm-group-button"
                      onClick={() => {
                        handleOpenPrompt();
                      }}
                    >
                      Confirm
                    </button>
                  )}
                  {showCancel && (
                    <button
                      className="cancel-group-button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              {group && <div className="text">Groups</div>}
              {group && (
                <div className="people_list">
                  <ol className="number_list">
                    {filteredUsers2.length === 0 ? (
                      <div className="search-resultsdcds">
                        <div className="ss">No group found </div>
                      </div>
                    ) : (
                      usersInSameGroup2.map((user) => (
                        <div
                          key={user.id}
                          className="search-result"
                          onClick={() =>
                            handleSearchResultClick(
                              user.name,
                              user.profilePicture,
                              user._id,
                              user.createdAt
                            )
                          }
                        >
                          <img
                            src="https://img.freepik.com/premium-vector/profile-icon-group_48369-2510.jpg?w=2000"
                            className="profile-picture"
                            alt="Profile"
                          />
                          <div>{user.name}</div>
                        </div>
                      ))
                    )}
                  </ol>
                </div>
              )}
              <div className="text">Users</div>

              {group && (
                <div className="people_list">
                  <ol className="number_list">
                    {filteredUsers.length === 0 ? (
                      <div>
                        {mockUsers.map((user) => (
                          <div key={user.id} className="search-result">
                            <img
                              className="profile-picture"
                              alt="Profile"
                              src={user.profilePicture}
                            />
                            <div>{user.name}</div>

                            {showCreate && showCancel && (
                              <input
                                type="checkbox"
                                className="custom-checkbox "
                                style={{ marginLeft: "auto" }}
                                onChange={() => {
                                  console.log(user);

                                  handleUserSelection(user);
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div key={user.id} className="search-result">
                          <img
                            className="profile-picture"
                            alt="Profile"
                            src={user.profilePicture}
                          />
                          <div>{user.name}</div>

                          {showCreate && showCancel && (
                            <input
                              type="checkbox"
                              className="custom-checkbox "
                              style={{ marginLeft: "auto" }}
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleUserSelection(user.id)}
                            />
                          )}
                        </div>
                      ))
                    )}
                  </ol>
                </div>
              )}
              {group === false ? (
                <div className="people_list2">
                  <ol className="number_list">
                    {filteredUsers.length === 0 ? (
                      <div className="search-resultsdcds">
                        <div className="ss">No person found </div>
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="search-result"
                          onClick={() =>
                            handleSearchResultClick(
                              user.name,
                              user.profilePicture
                            )
                          }
                        >
                          <img
                            className="profile-picture"
                            alt="Profile"
                            src={user.profilePicture}
                          />
                          <div>{user.name} </div>

                          {showCreate && showCancel && (
                            <input
                              type="checkbox"
                              className="custom-checkbox "
                              style={{ marginLeft: "auto" }}
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleUserSelection(user.id)}
                            />
                          )}
                        </div>
                      ))
                    )}
                  </ol>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          {chat && (
            <div className="right-section">
              <div className="chat_heading" onClick={handleProfileClick}>
                <img
                  className="profile-picture"
                  alt="Profile"
                  src={chatHeadingProfile}
                />
                <div className="person-name">
                  {selectedUser ? (
                    <>
                      {chatHeading}
                      {renderSelectedUsers()}
                      {/* Display "You are typing..." if the user is typing */}
                      {isTyping && (
                        <div className="typing-online">You are typing...</div>
                      )}
                    </>
                  ) : (
                    <>
                      Chat Bot
                      {/* Display "You are typing..." if the user is typing */}
                      {isTyping && (
                        <div className="typing-online">You are typing...</div>
                      )}
                    </>
                  )}
                </div>

                <div className="person-info">
                  <div className="call-options">
                    <button className="call-button" onClick={videocall}>
                      <Icon icon="majesticons:video" color="blue" />
                    </button>
                    <button className="video-button" onClick={callhistory}>
                      <Icon icon="material-symbols:call-log" color="blue" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="message-history">
                {context.length === 0 ? (
                  <div className="no-chat-history">
                    <div className="ss3">
                      A group has been created. Feel free to start the
                      conversation and share your thoughts, questions, or
                      anything you'd like to discuss with your group members
                    </div>
                    <div className="ss">
                      No chat history exists! Feel free to start the
                      conversation and share your thoughts, questions, or
                      anything you'd like to discuss. NewsUser is here to engage
                      in a meaningful exchange with you
                    </div>
                    {/* {context.map((item) => (
                      <div className="message-text">{item}</div>
                    ))} */}
                  </div>
                ) : (
                  pizzartio.map((msg, index) => (
                    <div>
                      <div className="no-chat-history2">
                        {/*clear earlier messages*/}
                        {/*please keep the context updated with the latest message*/}
                        {context.map((item) => (
                          <div
                            key={item._id}
                            className={`message`}
                            onMouseEnter={() => handleMouseEnter(item._id)}
                            onMouseLeave={() => handleMouseLeave(item._id)}
                          >
                            <div className="">
                              {item.sender.username}{" "}
                              <div className="timestamp">
                                {item.updatedAt[0] +
                                  item.updatedAt[1] +
                                  item.updatedAt[2] +
                                  item.updatedAt[3] +
                                  item.updatedAt[4] +
                                  item.updatedAt[5] +
                                  item.updatedAt[6] +
                                  item.updatedAt[7] +
                                  item.updatedAt[8] +
                                  item.updatedAt[9] +
                                  " " +
                                  item.updatedAt[14] +
                                  item.updatedAt[15] +
                                  item.updatedAt[16] +
                                  item.updatedAt[17] +
                                  item.updatedAt[18] +
                                  item.updatedAt[19] +
                                  item.updatedAt[20] +
                                  item.updatedAt[21]}
                              </div>
                              <div className="message-info">
                                <div class="image-con4">
                                  <img
                                    class="profile-picture"
                                    alt="Profile"
                                    src={item.sender.profilePicture}
                                  />
                                  <div class="message4">Status</div>
                                </div>
                                {item.mentions[0] ? (
                                  <div className="mentions">
                                    <div className="mention">
                                      {item.sender.username ===
                                        userObj.username && (
                                        <div className={"message-text"}>
                                          {item.content}
                                        </div>
                                      )}
                                      {item.sender.username !==
                                        userObj.username && (
                                        <div className={"message-text2"}>
                                          {item.content}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    {item.sender.username ===
                                      userObj.username && (
                                      <div className={"message-text"}>
                                        {item.content}
                                      </div>
                                    )}
                                    {item.sender.username !==
                                      userObj.username && (
                                      <div className={"message-text2"}>
                                        {item.content}
                                      </div>
                                    )}
                                  </div>
                                )}
                                {showReplyButton &&
                                  messageIndex === item._id && (
                                    <button
                                      onClick={handleMessge_Settings}
                                      className="reply-button"
                                    >
                                      <Icon
                                        icon="mi:options-vertical"
                                        color="gray"
                                        width="20"
                                        height="20"
                                      />
                                    </button>
                                  )}
                                {message_settings &&
                                  messageIndex === item._id && (
                                    <div key={item._id}>
                                      <button
                                        className="reply-button"
                                        style={{
                                          fontSize: "8px",
                                          display: "inline-block",
                                        }}
                                        onClick={() => setReact4(!react4)}
                                      >
                                        <Icon
                                          icon="codicon:reactions"
                                          width="20"
                                          height="20"
                                        />
                                      </button>

                                      <button
                                        className="reply-button"
                                        style={{
                                          fontSize: "8px",
                                          display: "inline-block",
                                        }}
                                        onClick={() => handleReply(index)}
                                      >
                                        <Icon
                                          icon="bi:reply-fill"
                                          width="20"
                                          height="20"
                                        />
                                      </button>
                                      <button
                                        className="reply-button"
                                        style={{
                                          fontSize: "8px",
                                          display: "inline-block",
                                        }}
                                        onClick={() => handleCopyMessage(index)} // Add this onClick handler to copy the message
                                      >
                                        <Icon
                                          icon="uil:copy"
                                          color="gray"
                                          width="20"
                                          height="20"
                                        />
                                      </button>
                                      <button
                                        className="reply-button"
                                        style={{
                                          fontSize: "8px",
                                          display: "inline-block",
                                        }}
                                        onClick={() => editMesseges(item._id)}
                                      >
                                        <Icon
                                          icon="material-symbols:edit"
                                          color="gray"
                                          width="20"
                                          height="20"
                                        />
                                      </button>
                                      <button
                                        className="reply-button"
                                        style={{
                                          fontSize: "8px",
                                          display: "inline-block",
                                        }}
                                        onClick={() =>
                                          handleDeleteMessages(item._id)
                                        } // Add this onClick handler to delete the message
                                      >
                                        <Icon
                                          icon="fluent:delete-48-filled"
                                          color="gray"
                                          width="20"
                                          height="20"
                                        />
                                      </button>
                                    </div>
                                  )}
                              </div>
                              {react4 && (
                                <Picker
                                  data={data}
                                  onEmojiSelect={handleEmojiSelect2}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {showProfile && (
                <div className="profile-container">
                  <div className="profile-info">
                    <img
                      className="profile-picture"
                      alt="Profile"
                      src={chatHeadingProfile}
                    />
                    <div className="profile-name">
                      {" "}
                      {chatHeading}
                      {renderSelectedUsers()}
                    </div>
                    {isGroup ? (
                      <>
                        <div className="groups-status">
                          Group created on: {created}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="profile-status">Online</div>
                      </>
                    )}
                    {isGroup ? (
                      <div className="user-status">{user_status}</div>
                    ) : (
                      <div className="user-status">Hey! I'm using Current!</div>
                    )}

                    {/* Additional profile options */}

                    <div className="profile-options">
                      <div className="option2">
                        <Icon
                          icon="fluent:person-settings-16-filled"
                          color="gray"
                        />
                        <button
                          className="profile_button"
                          onClick={showSettings}
                        >
                          {!settings ? "Group Settings" : "Go back"}
                        </button>
                      </div>
                      {settings && (
                        <div>
                          <div className="option">
                            <Icon
                              icon="fluent:calendar-checkmark-16-filled"
                              color="gray"
                            />
                            <button
                              onClick={handleOpenModalParticipants}
                              className="create-group-button"
                            >
                              Schedule Meeting
                            </button>
                          </div>

                          {isGroup ? (
                            <>
                              <div className="option">
                                <Icon
                                  icon="fluent:people-checkmark-16-filled"
                                  color="gray"
                                />
                                <button
                                  onClick={handleOpenModalParticipants}
                                  className="create-group-button"
                                >
                                  Add Participants
                                </button>
                              </div>
                              <div className="option">
                                <Icon icon="clarity:remove-line" color="gray" />

                                <button
                                  onClick={handleOpenModalParticipants10}
                                  className="create-group-button"
                                >
                                  Remove Participants
                                </button>
                              </div>

                              <div className="option">
                                <Icon
                                  icon={`pepicons-print:leave`}
                                  color="red"
                                />
                                <button
                                  onClick={handleLeaveGroup}
                                  className="create-group-button"
                                >
                                  Leave Group
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="option">
                                <Icon
                                  icon="fluent:call-16-filled"
                                  color="gray"
                                />
                                Call User
                              </div>
                              <div className="option">
                                <Icon
                                  icon="fluent:video-16-filled"
                                  color="gray"
                                />
                                Video Call User
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {edit_shower && (
                <div className="replyingto">Edit your message</div>
              )}
              {isCustomInputOpen && (
                <div className="replyingto">
                  Replying to: {messages[lastSeenIndex].sender.name}
                </div>
              )}
              {showEmojiPicker && (
                <Picker data={data} onEmojiSelect={handleEmojiSelect} />
              )}

              {showMentionList && (
                <div className="replyingto">
                  {mockUsers.map((user) => (
                    <div
                      key={user.id}
                      className="mention-list-item"
                      onClick={() => handleMentionClick(user)}
                    >
                      <div>{user.name}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="message-input">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="attach-file-button"
                >
                  <Icon icon="mdi:emoji" color="gray" />
                </button>
                <input
                  type="text"
                  placeholder="Type your message..."
                  ref={searchInputRef}
                  value={message.text}
                  onKeyPress={handleKeyPress}
                  onChange={(e) => {
                    handleMessageChange(e);
                    handleTyping(e); // Update typing status based on input value
                  }}
                />
                {/* please make a dropdown menu that conatin a loist of all the MockUsers items*/}

                {/* Add the file input element */}
                <label className="attach-file-button">
                  <Icon icon="teenyicons:attachment-solid" color="gray" />

                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileInputChange}
                  />
                </label>
                <button
                  className="send-button"
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? (
                    <img
                      src="https://lifeonrecord.com/gifts/wp-content/themes/eighteen-tags-child/images/recording.gif"
                      width="20"
                      height="20"
                      alt="Recording"
                    />
                  ) : (
                    <Icon icon="icon-park-twotone:voice" color="gray" />
                  )}
                </button>

                <button
                  className="send-button"
                  onClick={() => {
                    // Call both functions when the "Send" button is clicked
                    setEditShower(false);

                    if (!isCustomInputOpen && !isCustomInputOpen2) {
                      console.log("chat heading =" + chatHeading);
                      handleSendMessage(chatHeading);
                    } else if (!isCustomInputOpen && isCustomInputOpen2) {
                      setEditShower(false);
                      handleReplySubmit(searchInputRef.current.value);
                    } else {
                      handleReply(lastSeenIndex);
                      handleReplySubmit(searchInputRef.current.value);
                    }
                  }}
                >
                  <Icon icon="fluent:send-16-filled" color="blue" />
                </button>
              </div>
            </div>
          )}
          {chat === false && (
            <div className="right-section2">
              <div className="ss4">
                <div>
                  <img id="logo-img" src={logoW} alt="Logo" />
                </div>
                <p>
                  Welcome to our chatting wonderland! <br></br>
                  <br></br>Connect with friends and loved ones in real-time,
                  sharing messages, photos, and emotions effortlessly. Embrace
                  the joy of a seamless and delightful chat experience that
                  keeps you connected, no matter the distance! <br></br>
                  <br></br> With our enchanting emoji-filled realm, your
                  conversations will be as innovative as can be, and our
                  attention-grabbing interface will leave you mesmerized!
                  <br></br>
                  <br></br>Join us now and embark on an extraordinary journey of
                  heartfelt connections and endless smiles!
                </p>
              </div>
            </div>
          )}
          <Modal
            isOpen={modalOpen}
            onRequestClose={handleCloseModalParticipants}
            style={styles.modalStyles}
          >
            <div className="particpants_foreditting">
              <h3>Group Participants</h3>
              <div className="small_size">Current Group members</div>

              <div className="user-list-container">
                {groupusers && (
                  <div>
                    {groupusers.map((user) => (
                      <div key={user._id} className="search-result">
                        <img
                          className="profile-picture"
                          alt="Profile"
                          src={user.profilePicture}
                        />
                        <div>{user.username}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleAddParticipant}
                className="close-group-button"
              >
                Add Participants
              </button>

              {modifyParticipants && (
                <div>
                  <div className="small_size">Please add the members</div>

                  <button
                    onClick={handleCloseModalParticipants}
                    className="confirm-group-button"
                  >
                    Confirm
                  </button>
                  <button
                    className="cancel-group-button"
                    onClick={handleParticpantlose}
                  >
                    Cancel
                  </button>
                  <div className="user-list-container">
                    {mockUsers.map((user) => (
                      <div key={user.id} className="search-result">
                        <img
                          className="profile-picture"
                          alt="Profile"
                          src={user.profilePicture}
                        />
                        <div>{user.name}</div>
                        <input
                          type="checkbox"
                          className="custom-checkbox "
                          style={{ marginLeft: "auto" }}
                          onChange={() => {
                            console.log(user);

                            handleUserSelection(user);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <button
                  onClick={handleCloseParticipants}
                  className="close-group-button"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            isOpen={modalOpen2}
            onRequestClose={handleCloseModalParticipants10}
            style={styles.modalStyles}
          >
            <div className="particpants_foreditting">
              <h3>Group Participants</h3>
              <div className="small_size">Current Group members</div>

              <div>
                <div className="small_size">Please remove the members</div>

                <button
                  onClick={handleCloseModalParticipants10}
                  className="confirm-group-button"
                >
                  Confirm
                </button>
                <button
                  className="cancel-group-button"
                  onClick={handleParticpantlose}
                >
                  Cancel
                </button>
                <div className="user-list-container">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="search-result">
                      <img
                        className="profile-picture"
                        alt="Profile"
                        src={user.profilePicture}
                      />
                      <div>{user.name}</div>
                      <input
                        type="checkbox"
                        className="custom-checkbox "
                        style={{ marginLeft: "auto" }}
                        onChange={() => {
                          console.log(user);
                          handleUserSelection(user);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <button
                  onClick={handleCloseModalParticipants10}
                  className="close-group-button"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            isOpen={isPromptOpen}
            onRequestClose={handleClosePrompt}
            style={styles.modalStyles}
          >
            <div style={styles.container}>
              <div>
                <h3 style={styles.heading}>Set Group Information</h3>
                <div style={styles.inputContainer}>
                  <label style={styles.label}>
                    Group Name:
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Cool Group :)"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>

                  <label style={styles.label}>
                    Group Status:
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="This is a Cool Group :)"
                      onChange={(e) => setStatus(e.target.value)}
                    />
                  </label>
                </div>
                <div style={styles.profilePictureContainer}>
                  <div style={styles.profilePictureWrapper}>
                    {profilePictureFile ? (
                      <img
                        src={URL.createObjectURL(profilePictureFile)}
                        alt="Profile"
                        style={styles.profilePicture}
                      />
                    ) : (
                      <div
                        style={styles.profilePicturePlaceholder}
                        className="xdscs"
                      >
                        <Icon
                          icon="healthicons:ui-user-profile"
                          color="black"
                          width="100"
                          height="100"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      style={styles.profilePictureInput}
                    />
                  </div>
                </div>

                <div style={styles.buttonContainer}>
                  <button
                    className="confirm-group-button"
                    onClick={handlesModalSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>{" "}
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ChattingFunction;
