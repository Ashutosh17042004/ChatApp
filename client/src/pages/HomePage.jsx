// import React, { useContext, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import ChatContainer from "../components/ChatContainer";
// import RightSideBar from "../components/RightSideBar";
// import { ChatContext } from "../../context/ChatContext";

// const HomePage = () => {
//   const { selectedUser } = useContext(ChatContext);

//   return (
//     <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
//       <div
//         className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${
//           selectedUser
//             ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
//             : "md:grid-cols-2"
//         } `}
//       >
//         <Sidebar />
//         <ChatContainer />
//         <RightSideBar />
//       </div>
//     </div>
//   );
// };

// export default HomePage;




import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSideBar from "../components/RightSideBar";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#0f0c15] sm:p-6 overflow-hidden">
      <div className={`w-full h-full bg-[#1a1625] sm:rounded-3xl border border-gray-800 overflow-hidden grid shadow-2xl transition-all duration-500
        ${selectedUser 
          ? "grid-cols-1 md:grid-cols-[320px_1fr] xl:grid-cols-[320px_1fr_320px]" 
          : "grid-cols-1 md:grid-cols-[320px_1fr]"}`}
      >
        {/* Sidebar */}
        <div className={`h-full ${selectedUser ? "hidden md:block" : "block"}`}>
          <Sidebar />
        </div>

        {/* Chat Area */}
        <div className="h-full overflow-hidden">
          <ChatContainer />
        </div>

        {/* Profile Sidebar (Desktop Only) */}
        <div className="hidden xl:block h-full overflow-hidden">
          {selectedUser && <RightSideBar />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;