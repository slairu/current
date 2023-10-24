import React, { useState } from "react";
import "./styles/X.css";
function X() {
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentionList, setShowMentionList] = useState(false);
  const [selectedMention, setSelectedMention] = useState(""); // Track the selected mention
  const [mentionOptions, setMentionOptions] = useState(["a", "b", "c"]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setMessage(inputValue);

    if (inputValue.endsWith("@")) {
      setShowMentionList(true);
    } else {
      setShowMentionList(false);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      setSentMessages([...sentMessages, message]);
      setMessage("");
      setShowMentionList(false);
    }
  };

  const handleMentionClick = (mention) => {
    setMessage((prevMessage) => prevMessage.slice(0, -1) + mention + " ");
    setSelectedMention(mention); // Set the selected mention
    setShowMentionList(false);
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        placeholder="Type your message"
      />
      <button onClick={handleSendMessage}>Send</button>
      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        Emoji
      </button>

      {showMentionList && (
        <div className="mention-list">
          {mentionOptions.map((mention, index) => (
            <div
              key={index}
              onClick={() => handleMentionClick(mention)}
              className={selectedMention === mention ? "selected" : ""}
            >
              {mention}
            </div>
          ))}
        </div>
      )}

      {showEmojiPicker && (
        <div>
          {" "}
          {/* Replace with your Emoji Picker component */}
          Emoji Picker Placeholder
        </div>
      )}

      <div>
        {sentMessages.map((sentMessage, index) => (
          <div key={index}>{sentMessage}</div>
        ))}
      </div>
    </div>
  );
}

export default X;
