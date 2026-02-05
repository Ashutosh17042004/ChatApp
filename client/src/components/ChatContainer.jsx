// import React, { useContext, useEffect, useRef, useState } from "react";
// import assets, { messagesDummyData } from "../assets/assets";
// import { formatMessageTime } from "../lib/utils";
// import { ChatContext } from "../../context/ChatContext";
// import { AuthContext } from "../../context/AuthContext";
// import toast from "react-hot-toast";

// const ChatContainer = () => {
//   const { messages, selectedUser, getMessages, sendMessage, setSelectedUser } =
//     useContext(ChatContext);
//   const { authUser, onlineUser } = useContext(AuthContext);

//   const scrollEnd = useRef();

//   const [input, setInput] = useState("");

//   // Handle sending a message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (input.trim() === "") return null;
//     await sendMessage({ text: input.trim() });
//     setInput("");
//   };

//   // Handle sending a message
//   const handleSendImage = async (e) => {
//     const file = e.target.files[0];
//     if (!file || !file.type.startsWith("image/")) {
//       toast.error("select an image file");
//       return;
//     }
//     const reader = new FileReader();
//     reader.onloadend = async () => {
//       await sendMessage({ image: reader.result });
//       e.target.value = "";
//     };
//     reader.readAsDataURL(file);
//   };

//   useEffect(() => {
//     if (selectedUser) {      
//       getMessages(selectedUser._id);
//     }
//   }, [selectedUser]);

//   useEffect(() => {
//     if (scrollEnd.current && messages) {
//       scrollEnd.current.scrollIntoView({ behaviour: "smooth" });
//     }
//   }, [messages]);

//   return selectedUser ? (
//     <div className="h-full overflow-scroll relative backdrop-blur-lg">
//       {/*..... Header.... */}
//       <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
//         <img
//           src={selectedUser.profilePic || assets.avatar_icon}
//           alt=""
//           className="w-8 rounded-full"
//         />
//         <p className=" flex flex-1 text-lg text-white  items-center gap-2">
//           {selectedUser.fullName}
//           {onlineUser.includes(selectedUser._id) && (
//             <span className="w-2 h-2 rounded-full bg-green-500"></span>
//           )}
//         </p>
//         <img
//           onClick={() => {
//             setSelectedUser(null);
//           }}
//           src={assets.arrow_icon}
//           alt=""
//           className="md:hidden max-w-7"
//         />
//         <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
//       </div>

//       {/*..... Chat area.....  */}
//       <div className="flex  flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex items-end gap-2 justify-end ${
//               msg.senderId !== authUser._id && "flex-row-reverse"
//             }`}
//           >
//             {msg.image ? (
//               <img
//                 src={msg.image}
//                 alt=""
//                 className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
//               />
//             ) : (
//               <p
//                 className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
//                   msg.senderId === authUser._id
//                     ? "rounded-br-none "
//                     : "rounded-bl-none"
//                 } `}
//               >
//                 {msg.text}
//               </p>
//             )}
//             <div className="text-center text-xs ">
//               <img
//                 src={
//                   msg.senderId === authUser._id
//                     ? authUser?.profilePic || assets.avatar_icon
//                     : selectedUser?.profilePic || assets.avatar_icon
//                 }
//                 alt=""
//                 className="w-7 rounded-full"
//               />
//               <p className="text-gray-500">
//                 {formatMessageTime(msg.createdAt)}
//               </p>
//             </div>
//           </div>
//         ))}
//         <div ref={scrollEnd}></div>
//       </div>

//       {/* Bottom area to send message  */}
//       <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
//         <div className="flex-1 flex items-center  bg-gray-100/12 px-3 rounded-full">
//           <input
//             onChange={(e) => setInput(e.target.value)}
//             value={input}
//             onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
//             type="text"
//             placeholder="Send a message"
//             className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
//           />
//           <input
//             onChange={handleSendImage}
//             type="file"
//             id="image"
//             accept="image/png image/jpeg"
//             hidden
//           />
//           <label htmlFor="image">
//             <img
//               src={assets.gallery_icon}
//               alt=""
//               className="w-5 mr-2 cursor-pointer"
//             />
//           </label>
//         </div>
//         <img
//           onClick={handleSendMessage}
//           src={assets.send_button}
//           alt=""
//           className="w-7 cursor-pointer"
//         />
//       </div>
//     </div>
//   ) : (
//     <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
//       <img src={assets.logo_icon} className="max-w-16" alt="" />
//       <p className="text-lg font-medium text-white">Chat anytime,anywhere</p>
//     </div>
//   );
// };

// export default ChatContainer;



import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import assets from "../assets/assets";
import RightSideBar from "./RightSideBar";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const ChatContainer = () => {
  const { messages, selectedUser, getMessages, sendMessage, setSelectedUser } = useContext(ChatContext);
  const { authUser, onlineUser } = useContext(AuthContext);
  
  const scrollEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const lastFetchedId = useRef(null); // Safety lock to stop infinite fetches

  const [input, setInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const isOnline = selectedUser && onlineUser.includes(selectedUser._id);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (scrollEndRef.current) {
      scrollEndRef.current.scrollIntoView({ behavior, block: "end" });
    }
  }, []);

  // 1. FETCH MESSAGES: Only runs if user ID actually changes
  useEffect(() => {
    if (selectedUser?._id && selectedUser._id !== lastFetchedId.current) {
      lastFetchedId.current = selectedUser._id;
      getMessages(selectedUser._id);
      setShowProfile(false);
      
      // Snap to bottom instantly when changing chats
      const timer = setTimeout(() => scrollToBottom("auto"), 50);
      return () => clearTimeout(timer);
    }
  }, [selectedUser?._id, getMessages, scrollToBottom]);

  // 2. NEW MESSAGE SCROLL: Smart detection (only scrolls if you are already at bottom)
  useEffect(() => {
    if (messages.length > 0 && messageContainerRef.current) {
      const container = messageContainerRef.current;
      // If user is within 200px of bottom, they probably want to see new messages
      const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 200;
      const lastMsgIsMe = messages[messages.length - 1].senderId === authUser._id;

      if (isNearBottom || lastMsgIsMe) {
        scrollToBottom("smooth");
      }
    }
  }, [messages, authUser._id, scrollToBottom]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input;
    setInput(""); 
    try {
      await sendMessage({ text });
    } catch (err) {
      setInput(text);
      toast.error("Failed to send");
    }
  };

  return selectedUser ? (
    <div className="flex flex-col h-[100dvh] md:h-full w-full bg-[#100e17] overflow-hidden relative">
      <header className="h-[70px] flex items-center justify-between px-4 border-b border-gray-800 bg-[#1a1625] z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="md:hidden" onClick={() => setSelectedUser(null)}>
             <img src={assets.arrow_icon} className="w-6 h-6 invert opacity-80 cursor-pointer" />
          </div>
          <img src={selectedUser.profilePic || assets.avatar_icon} className="w-10 h-10 rounded-full object-cover" onClick={() => setShowProfile(true)} />
          <div className="flex flex-col" onClick={() => setShowProfile(true)}>
            <p className="text-white text-sm font-medium truncate max-w-[150px]">{selectedUser.fullName}</p>
            <span className={`text-[10px] font-bold ${isOnline ? "text-green-500" : "text-gray-500"}`}>
              {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
        </div>
        <button onClick={() => setShowProfile(true)} className="xl:hidden opacity-50"><img src={assets.help_icon} className="w-5 invert"/></button>
      </header>

      <main ref={messageContainerRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={msg._id || idx} className={`flex ${msg.senderId === authUser._id ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.senderId === authUser._id ? "bg-violet-600 text-white rounded-br-none" : "bg-[#2d283e] text-white rounded-bl-none border border-gray-700"}`}>
              {msg.image ? <img src={msg.image} className="rounded-lg mb-1 max-h-60" /> : <p className="text-sm">{msg.text}</p>}
            </div>
          </div>
        ))}
        <div ref={scrollEndRef} className="h-1 shrink-0" />
      </main>

      <footer className="p-4 bg-[#1a1625] border-t border-gray-800 shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-[#282142] px-3 py-2 rounded-full border border-gray-700">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-transparent outline-none text-white text-sm" />
          <button type="submit" disabled={!input.trim()}><img src={assets.send_button} className="w-8 h-8" /></button>
        </form>
      </footer>

      <AnimatePresence>
        {showProfile && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="absolute inset-0 z-50 xl:hidden">
            <RightSideBar onClose={() => setShowProfile(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    <div className="hidden md:flex flex-1 items-center justify-center bg-[#1a1625] text-gray-500 italic">Select a chat to start</div>
  );
};

export default ChatContainer;