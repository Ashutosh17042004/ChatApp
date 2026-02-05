import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  const getUsers = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [axios]);

  const getMessages = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) setMessages(data.messages);
    } catch (error) {
      toast.error("Failed to load messages");
    }
  }, [axios]);

  const sendMessage = useCallback(async (messageData) => {
    if (!selectedUser?._id) return;
    try {
      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      }
    } catch (error) {
      toast.error("Message failed to send");
      throw error; 
    }
  }, [axios, selectedUser?._id]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async (newMessage) => {
      // Use state callback to ensure we always have the current selectedUser ID
      setSelectedUser((currentSelected) => {
        if (currentSelected && newMessage.senderId === currentSelected._id) {
          setMessages((prev) => [...prev, newMessage]);
          axios.put(`/api/messages/mark/${newMessage._id}`).catch(() => {});
        } else {
          setUnseenMessages((prev) => ({
            ...prev,
            [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
          }));
        }
        return currentSelected;
      });
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, axios]);

  const value = { messages, users, selectedUser, getUsers, getMessages, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};