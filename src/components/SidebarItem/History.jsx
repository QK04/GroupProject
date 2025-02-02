import React, { useEffect, useState } from "react";
import axios from "axios";
import "./History.css";

const History = ({ isOpen, onChatSelect }) => {
  const [conversations, setConversations] = useState([]);
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  useEffect(() => {
    const fetchConversations = async () => {
      const userId = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).user_id
        : null;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/chatbot/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Response history: ", response);

        // Ensure the body is parsed if it is a string
        const parsedBody = typeof response.data.body === "string"
          ? JSON.parse(response.data.body)
          : response.data.body;

        // Extract conversations from the parsed body
        const conversations = parsedBody || [];
        setConversations(conversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className={`history ${isOpen ? "open" : ""}`}>
      <h2 className="history-header">Conversation History</h2>
      <div className="chat-list">
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <div
              key={conversation.conversation_id}
              className="chat"
              onClick={() => onChatSelect(conversation.conversation_id)}
            >
              {conversation.name || `Conversation ${conversation.conversation_id}`}
            </div>
          ))
        ) : (
          <p>No conversations found.</p>
        )}
      </div>
    </div>
  );
};

export default History;
