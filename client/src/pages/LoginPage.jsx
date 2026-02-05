// import React, { useContext, useState } from "react";
// import assets from "../assets/assets";
// import { AuthContext } from "../../context/AuthContext";

// const LoginPage = () => {
//   const [currentState, setCurrentState] = useState("Sign Up");
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [bio, setBio] = useState("");
//   const [isDataSubmitted, setIsDataSubmitted] = useState(false);

//   const { login } = useContext(AuthContext);

//   const onSubmitHandler = (event) => {
//     event.preventDefault();
//     if (currentState === "Sign Up" && !isDataSubmitted) {
//       setIsDataSubmitted(true);
//       return;
//     }
//     login(currentState === "Sign Up" ? "signup" : "login", {
//       fullName,
//       email,
//       password,
//       bio,
//     });
//   };

//   return (
//     <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
//       {/* left side */}
//       <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />

//       {/* right side  */}
//       <form
//         onSubmit={onSubmitHandler}
//         className="border-2 bg-white/8 border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
//       >
//         <h2 className="font-medium text-2xl text-white flex justify-between items-center">
//           {currentState}
//           {isDataSubmitted && (
//             <img
//               onClick={() => setIsDataSubmitted(false)}
//               src={assets.arrow_icon}
//               alt=""
//               className="w-5 cursor-pointer"
//             />
//           )}
//         </h2>
//         {currentState === "Sign Up" && !isDataSubmitted && (
//           <input
//             onChange={(e) => setFullName(e.target.value)}
//             value={fullName}
//             type="text"
//             className="p-2 border border-gray-500 rounded-md focus:outline-none text-white"
//             placeholder="User Name"
//             required
//           />
//         )}
//         {!isDataSubmitted && (
//           <>
//             <input
//               onChange={(e) => setEmail(e.target.value)}
//               value={email}
//               type="email"
//               placeholder="Email Address "
//               required
//               className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
//             />
//             <input
//               onChange={(e) => setPassword(e.target.value)}
//               value={password}
//               type="password"
//               placeholder="Password "
//               required
//               className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
//             />
//           </>
//         )}
//         {currentState === "Sign Up" && isDataSubmitted && (
//           <textarea
//             onChange={(e) => setBio(e.target.value)}
//             value={bio}
//             rows={4}
//             className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
//             placeholder="Bio..."
//             required
//           ></textarea>
//         )}
//         <button
//           type="submit"
//           className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
//         >
//           {currentState === "Sign Up" ? "Create Account " : "Login Now"}
//         </button>
//         <div className="flex items-center ga2 text-sm text-gray-500">
//           <input type="checkbox" />
//           <p>Agree to the terms of use & privacy policy.</p>
//         </div>
//         <div className="flex flex-col gap-2">
//           {currentState === "Sign Up" ? (
//             <p className="text-sm text-gray-600">
//               Already have an account ?
//               <span
//                 onClick={() => {
//                   setCurrentState("Login");
//                   setIsDataSubmitted(false);
//                 }}
//                 className="font-medium text-violet-500 cursor-pointer"
//               >
//                 Login here
//               </span>
//             </p>
//           ) : (
//             <p className="text-sm text-gray-600">
//               Create an account
//               <span
//                 onClick={() => {
//                   setCurrentState("Sign Up");
//                 }}
//                 className="font-medium text-violet-500 cursor-pointer"
//               >
//                 Click here
//               </span>
//             </p>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;




import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currentState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(currentState === "Sign Up" ? "signup" : "login", {
      fullName, email, password, bio,
    });
  };

  const springTransition = { type: "spring", stiffness: 400, damping: 17 };

  return (
    
    <div className="min-h-dvh bg-cover bg-center flex items-center justify-center gap-6 sm:gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl px-4 py-8">
      
      {/* 1. Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
        transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" }, opacity: { duration: 1 } }}
        className="cursor-pointer"
      >
       
        <img src={assets.logo_big} alt="logo" className="w-[180px] sm:w-[min(30vw,250px)] drop-shadow-[0_0_20px_rgba(167,139,250,0.3)]" />
      </motion.div>

      {/* 2. Form Container */}
      <motion.form
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmitHandler}
        
        className="border border-white/20 bg-white/10 p-6 sm:p-8 flex flex-col gap-4 sm:gap-5 rounded-3xl shadow-2xl backdrop-blur-xl w-full max-w-[380px] sm:max-w-[420px] overflow-hidden relative"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <motion.h2 layout className="font-bold text-2xl sm:text-3xl text-white flex justify-between items-center tracking-tight">
          {currentState}
          {isDataSubmitted && (
            <motion.img
              whileHover={{ x: -5, scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="back"
              className="w-5 sm:w-6 cursor-pointer invert"
            />
          )}
        </motion.h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentState + isDataSubmitted}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={springTransition}
            className="flex flex-col gap-3 sm:gap-4"
          >
            {currentState === "Sign Up" && !isDataSubmitted && (
              <motion.input
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                type="text"
                className="p-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400 text-white transition-colors text-sm"
                placeholder="User Name"
                required
              />
            )}

            {!isDataSubmitted && (
              <>
                <motion.input
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Email Address"
                  required
                  className="p-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400 text-white transition-colors text-sm"
                />
                <motion.input
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder="Password"
                  required
                  className="p-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400 text-white transition-colors text-sm"
                />
              </>
            )}

            {currentState === "Sign Up" && isDataSubmitted && (
              <motion.textarea
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                rows={4}
                className="p-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400 text-white text-sm"
                placeholder="Write your bio..."
                required
              ></motion.textarea>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={springTransition}
          type="submit"
          className="py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold mt-2 shadow-lg tracking-wide uppercase text-xs sm:text-sm"
        >
          {currentState === "Sign Up" ? (isDataSubmitted ? "Create Account" : "Next Step") : "Login Now"}
        </motion.button>

        <motion.div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-300 cursor-pointer">
          <input type="checkbox" className="accent-purple-500 w-3 h-3 sm:w-4 sm:h-4 cursor-pointer" required />
          <p>I agree to the terms of use & privacy policy.</p>
        </motion.div>

        <motion.div layout className="pt-4 border-t border-white/10 mt-2">
          <p className="text-xs sm:text-sm text-gray-400 text-center">
            {currentState === "Sign Up" ? "Already have an account?" : "New to our platform?"}{" "}
            <span
              onClick={() => {
                setCurrentState(currentState === "Sign Up" ? "Login" : "Sign Up");
                setIsDataSubmitted(false);
              }}
              className="font-bold text-purple-400 cursor-pointer inline-block ml-1 hover:text-purple-300"
            >
              {currentState === "Sign Up" ? "Login here" : "Sign up"}
            </span>
          </p>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default LoginPage;