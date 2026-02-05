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




import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import RightSideBar from "./RightSideBar";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const formatMessageTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
};

const ChatContainer = () => {
  const { messages, selectedUser, getMessages, sendMessage, setSelectedUser } = useContext(ChatContext);
  const { authUser, onlineUser } = useContext(AuthContext);
  
  
  const scrollEndRef = useRef(null);
  
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const isOnline = selectedUser && onlineUser.includes(selectedUser._id);

  // 2. Logic to scroll to bottom whenever messages array changes
  const scrollToBottom = () => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      setShowProfile(false);
    }
  }, [selectedUser]);

  // Trigger scroll every time messages update or an image starts uploading
  useEffect(() => {
    scrollToBottom();
  }, [messages, isUploading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return toast.error("Select an image file");
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try { await sendMessage({ image: reader.result }); } 
      finally { setIsUploading(false); e.target.value = ""; }
    };
    reader.readAsDataURL(file);
  };

  return selectedUser ? (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-[#1a1625]/20">
      
      {/* HEADER */}
      <div className="flex items-center justify-between py-3 px-4 border-b border-gray-700 bg-[#1a1625]/90 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="md:hidden flex items-center pr-2" onClick={() => setSelectedUser(null)}>
             <img src={assets.arrow_icon} alt="Back" className="w-6 h-6 invert opacity-80 cursor-pointer" />
          </div>
          <div className="relative cursor-pointer" onClick={() => setShowProfile(true)}>
            <img src={selectedUser.profilePic || assets.avatar_icon} className="w-10 h-10 rounded-full object-cover" alt="" />
            {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1a1625] rounded-full" />}
          </div>
          <div className="flex flex-col" onClick={() => setShowProfile(true)}>
            <p className="text-white font-medium truncate max-w-[150px]">{selectedUser.fullName}</p>
            <span className="text-[10px] text-gray-400 uppercase tracking-tighter font-bold">
                {isOnline ? "• Online" : "Offline"}
            </span>
          </div>
        </div>
        <button onClick={() => setShowProfile(true)} className="p-2 xl:hidden hover:bg-white/5 rounded-full transition">
          <img src={assets.help_icon} className="w-5 h-5 invert opacity-70" alt="info" />
        </button>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <div key={msg._id || index} className={`flex flex-col ${msg.senderId === authUser._id ? "items-end" : "items-start"}`}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[80%] sm:max-w-[70%] ${msg.senderId === authUser._id ? "bg-violet-600 rounded-2xl rounded-tr-none text-white shadow-lg" : "bg-[#383348] rounded-2xl rounded-tl-none text-white"} px-4 py-2.5 shadow-sm`}
              >
                {msg.image ? (
                  <img src={msg.image} className="max-w-full rounded-lg mb-1 cursor-pointer" alt="attachment" onClick={() => window.open(msg.image)} />
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                )}
                <p className={`text-[9px] mt-1 opacity-60 font-medium ${msg.senderId === authUser._id ? "text-right" : "text-left"}`}>
                  {formatMessageTime(msg.createdAt)}
                </p>
              </motion.div>
            </div>
          ))}
          
          {isUploading && (
            <div className="self-end bg-violet-600/20 px-4 py-2 rounded-xl animate-pulse">
               <span className="text-xs text-violet-300">Sending media...</span>
            </div>
          )}
        </AnimatePresence>
        
        {/* 3. THIS DIV IS THE ANCHOR: It pulls the view down */}
        <div ref={scrollEndRef} className="h-2 w-full shrink-0" />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-[#1a1625] border-t border-gray-700 shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-3 bg-[#282142] px-4 py-2 rounded-full border border-gray-600 focus-within:border-violet-500 shadow-xl">
          <input onChange={handleSendImage} type="file" id="image-input" accept="image/*" hidden />
          <label htmlFor="image-input" className="p-1 hover:bg-white/5 rounded-full transition cursor-pointer">
            <img src={assets.gallery_icon} className="w-6 h-6 opacity-60 hover:opacity-100" />
          </label>
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Type a message..." 
            className="flex-1 bg-transparent outline-none text-white text-sm"
          />
          <button type="submit" disabled={!input.trim()} className="p-1 hover:scale-110 active:scale-95 transition-transform">
            <img src={assets.send_button} className={`w-8 h-8 ${input.trim() ? "opacity-100" : "opacity-30"}`} />
          </button>
        </form>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {showProfile && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} className="absolute inset-0 z-50 xl:hidden">
            <RightSideBar onClose={() => setShowProfile(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    <div className="hidden md:flex flex-col items-center justify-center w-full h-full bg-[#1a1625] text-gray-500">
      <div className="p-6 rounded-full bg-white/5 mb-4">
        <img src={assets.logo_icon} className="w-16 opacity-10 invert" alt="logo" />
      </div>
      <h2 className="text-xl font-semibold text-gray-400">Your messages await</h2>
      <p className="text-sm opacity-50">Select a contact to view the conversation</p>
    </div>
  );
};

export default ChatContainer;