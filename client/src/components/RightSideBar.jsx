// import React, { useContext, useEffect, useState } from "react";
// import assets, { imagesDummyData } from "../assets/assets";
// import { ChatContext } from "../../context/ChatContext";
// import { AuthContext } from "../../context/AuthContext";

// const RightSideBar = () => {
//   const { selectedUser, messages } = useContext(ChatContext);
//   const { onlineUser, logout } = useContext(AuthContext);
//   const [msgImages, setMsgImages] = useState([]);

//   // Get all the message from the message and set them to state
//   useEffect(() => {
//     setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
//   }, [messages]);

//   return (
//     selectedUser && (
//       <div
//         className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${
//           selectedUser ? "max-md:hidden" : ""
//         }`}
//       >
//         <div className="pt-3 flex flex-col items-center gap-2 text-xs font-light mx-auto">
//           <img
//             src={selectedUser?.profilePic || assets.avatar_icon}
//             alt=""
//             className="w-20 aspect-[1/1] rounded-full"
//           />
//           <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
//             {onlineUser.includes(selectedUser._id) && (
//               <p className="w-2 h-2 rounded-full bg-green-500"></p>
//             )}
//             {selectedUser.fullName}
//           </h1>
//           <p className="px-10 mx-auto">{selectedUser.bio}</p>
//         </div>

//         <hr className="border-[#ffffff50] my-4" />
//         <div className="px-5 text-xs">
//           <p>Media</p>
//           <div className=" mt-2 max-h-[150px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80  ">
//             {msgImages.map((url, index) => (
//               <div
//                 key={index}
//                 onClick={() => {
//                   window.open(url);
//                 }}
//                 className="cursor-pointer rounded"
//               >
//                 <img src={url} alt="" className="h-full rounded-md" />
//               </div>
//             ))}
//           </div>
//         </div>

//         <button
//           onClick={() => logout()}
//           className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer"
//         >
//           Logout
//         </button>
//       </div>
//     )
//   );
// };

// export default RightSideBar;



import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSideBar = ({ onClose }) => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { onlineUser, logout } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    if (messages) {
      setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
    }
  }, [messages]);

  const isOnline = selectedUser && onlineUser.includes(selectedUser._id);

  return (
    <div className="flex flex-col h-full w-full bg-[#1a1625] border-l border-gray-700 text-white overflow-hidden">
      
      {/* 1. Profile Section */}
      <div className="p-8 flex flex-col items-center shrink-0 relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-4 left-4 xl:hidden p-2 bg-gray-800 rounded-full">
            <img src={assets.arrow_icon} className="w-4 h-4 invert rotate-180" alt="close" />
          </button>
        )}
        <div className="relative mb-4">
          <img src={selectedUser?.profilePic || assets.avatar_icon} className="w-24 h-24 rounded-full object-cover border-2 border-violet-500" alt="" />
          {isOnline && <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a1625]" />}
        </div>
        <h2 className="text-xl font-bold">{selectedUser?.fullName}</h2>
        <p className="text-xs text-gray-400 italic mt-1 text-center px-4">{selectedUser?.bio || "No bio available"}</p>
      </div>

      <hr className="border-gray-800 mx-6 shrink-0" />

      {/* 2. Media Section */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <p className="text-[10px] uppercase font-bold text-gray-500 mb-4 tracking-widest">Shared Media</p>
        <div className="grid grid-cols-3 gap-2">
          {msgImages.map((img, i) => (
            <img key={i} src={img} className="aspect-square object-cover rounded-lg border border-gray-800 cursor-pointer hover:scale-105 transition" onClick={() => window.open(img)} />
          ))}
        </div>
        {msgImages.length === 0 && <p className="text-xs text-gray-600 text-center py-10">No media shared</p>}
      </div>

      {/* 3. Logout Section*/}
      <div className="p-6 border-t border-gray-800 shrink-0 bg-[#15121e]">
        <button 
          onClick={logout} 
          className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all"
        >
          Logout Account
        </button>
      </div>
    </div>
  );
};

export default RightSideBar;