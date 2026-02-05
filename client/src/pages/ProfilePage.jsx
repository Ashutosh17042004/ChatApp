// import React, { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import assets from "../assets/assets";
// import { AuthContext } from "../../context/AuthContext";

// const ProfilePage = () => {
//   const { authUser, updateProfile } = useContext(AuthContext);

//   const [selectedImg, setSelectedImg] = useState(null);
//   const navigate = useNavigate();
//   const [name, setName] = useState(authUser.fullName);
//   const [bio, setBio] = useState(authUser.bio);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedImg) {
//       await updateProfile({ fullName: name, bio });
//       navigate("/");
//       return;
//     }
//     const reader = new FileReader();
//     reader.readAsDataURL(selectedImg);
//     reader.onload = async () => {
//       const base64Image = reader.result;
//       await updateProfile({ profilePic: base64Image, fullName: name, bio });
//       navigate("/");
//     };
//   };

//   return (
//     <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
//       <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col gap-5 p-10 flex-1"
//         >
//           <h3 className="text-lg">Profile details</h3>
//           <label
//             htmlFor="avatar"
//             className="flex items-center gap-3 cursor-pointer"
//           >
//             <input
//               onChange={(e) => setSelectedImg(e.target.files[0])}
//               type="file"
//               id="avatar"
//               accept=".png, .jpg, .jpeg"
//               hidden
//             />
//             <img
//               src={
//                 selectedImg
//                   ? URL.createObjectURL(selectedImg)
//                   : assets.avatar_icon
//               }
//               className={`w-12 h-12 ${selectedImg && "rounded-full"}`}
//               alt=""
//             />
//             upload profile image
//           </label>
//           <input
//             onChange={(e) => setName(e.target.value)}
//             value={name}
//             type="text"
//             required
//             placeholder="Your name"
//             className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
//           />
//           <textarea
//             onChange={(e) => setBio(e.target.value)}
//             value={bio}
//             placeholder="Write profile bio "
//             required
//             className=" p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2   focus:ring-violet-500  "
//             rows={4}
//           ></textarea>
//           <button
//             type="submit"
//             className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
//           >
//             Save
//           </button>
//         </form>
//         <img
//           src={authUser?.profilePic || assets.logo_icon}
//           className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${
//             selectedImg && "rounded-full"
//           }`}
//           alt=""
//         />
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;




import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!selectedImg) {
        await updateProfile({ fullName: name, bio });
        navigate("/");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);
      reader.onload = async () => {
        const base64Image = reader.result;
        await updateProfile({ profilePic: base64Image, fullName: name, bio });
        navigate("/");
      };
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1625] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-2xl backdrop-blur-2xl bg-white/5 text-gray-300 border border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-2xl overflow-hidden shadow-2xl"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8 md:p-12 flex-1 w-full">
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-semibold text-white mb-2"
          >
            Profile Details
          </motion.h3>

          {/* Avatar Upload Preview */}
          <label htmlFor="avatar" className="flex items-center gap-4 cursor-pointer group">
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <div className="relative">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon}
                className="w-16 h-16 rounded-full object-cover border-2 border-violet-500/50 p-1"
                alt="preview"
              />
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-[10px] text-white">Edit</span>
              </div>
            </div>
            <span className="text-sm text-gray-400 group-hover:text-violet-400 transition-colors">
              Click to upload profile image
            </span>
          </label>

          {/* Input Fields */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Full Name</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                required
                placeholder="Your name"
                className="bg-[#282142]/40 p-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Bio</label>
              <motion.textarea
                whileFocus={{ scale: 1.01 }}
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                placeholder="Write profile bio..."
                required
                className="bg-[#282142]/40 p-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-white resize-none"
                rows={4}
              ></motion.textarea>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className={`mt-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-violet-500/20 flex items-center justify-center gap-3 transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : "Save Profile"}
          </motion.button>
        </form>

        {/* Right Side Image Display */}
        <div className="p-8 flex items-center justify-center bg-violet-500/5 h-full self-stretch">
          <motion.img
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePic || assets.logo_icon)}
            className="w-48 md:w-56 aspect-square rounded-full object-cover border-4 border-violet-500 shadow-[0_0_30px_rgba(139,92,246,0.3)]"
            alt="profile"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;