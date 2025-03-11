import React, { useRef, useState } from "react";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../utils/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import loginForm from "../utils/loginForm.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../utils/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const EmailRef = useRef("");
  const PasswordRef = useRef("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleForgotPassword = async () => {
    if (!EmailRef.current.value) {
      setErrorMessage("Please enter your email address.");
      return;
    }
  
    try {
      const userRefs = collection(db, "users");
      const q = query(userRefs, where("email", "==", EmailRef.current.value));
      const querySnapShot = await getDocs(q);
      if (querySnapShot.empty) {
        setErrorMessage("Email Not Found. Please Enter a Registered User");
        return;
      }
      await sendPasswordResetEmail(auth, EmailRef.current.value);
      setErrorMessage("Password reset email sent! Check your inbox.");
    } catch (error) {
      setErrorMessage("Failed to send reset email. Please try again.");
    }
  };
  
  const handleSignInWithEmailPassword = async (e) => {
    e.preventDefault();
    if (!EmailRef.current.value || !PasswordRef.current.value) {
      setErrorMessage("Please fill in both fields");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        EmailRef.current.value,
        PasswordRef.current.value
      );
      const user = userCredential.user;
      const userRefs = collection(db, "users");
      const q = query(userRefs, where("email", "==", EmailRef.current.value));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        const userData = querySnapShot.docs[0].data();
        const userDetails = {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
        };
        dispatch(login(userDetails));

        // ✅ Introduce delay before navigating
        setTimeout(() => {
          if (userData.role === "Student") {
            navigate("/dashboard/student");
          } else if (userData.role === "Teacher") {
            navigate("/dashboard/teacher");
          } else {
            setErrorMessage("Role not recognized");
          }
          setLoading(false); // Stop loading after navigation
        }, 500); // Adjust delay time if needed
      }
    } catch (error) {
      if (error.message.includes("auth/invalid-credential")) {
        setErrorMessage("Invalid Credentials");
      }
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="absolute w-[80vw] h-[72vh] md:w-3/4 xl:h-5/6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-9 shadow-2xl bg-gradient-to-br bg-white bg-opacity-35 flex flex-col md:flex-row gap-1 rounded-md md:rounded-lg">
        <div className="flex justify-center items-center -mt-5 md:-mt-0 w-full md:h-full md:w-[65%]">
          <img
            className="w-[100%] h-[80%] -mt-5 -mb-2 md:my-2 md:w-full md:h-full object-cover rounded-md rounded-b-none md:rounded-lg md:rounded-r-none"
            src={loginForm}
            alt="Sign Up Form"
          />
        </div>
        <div className="md:h-full">
          <form className="px-5 md:px-14" onSubmit={handleSignInWithEmailPassword}>
            <h1 className="-mt-6 mb-1 text-xl font-bold text-center md:text-left md:text-4xl md:mt-12 md:mb-8 text-black">
              Sign In
            </h1>
            {errorMessage && (
              <h2 className="mb-1 text-xs text-pretty text-red-600 md:text-sm md:mb-3">
                {errorMessage}
              </h2>
            )}
            <div className="md:w-full">
              <label className="font-bold text-sm md:text-base md:font-semibold text-pretty">
                Email Address
              </label>
              <input
                className="mb-2 md:mb-6 md:mt-1 w-full p-2 px-6 md:px-4 text-pretty text-left rounded-lg bg-gray-200 bg-opacity-70 text-black outline-none shadow-lg"
                type="email"
                ref={EmailRef}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-sm md:text-base md:font-semibold text-pretty">
                Password
              </label>
              <input
                className="my-5 md:my-11 mt-0 md:mt-1 w-full px-6 md:px-4 py-2 text-pretty text-left rounded-lg bg-gray-200 bg-opacity-70 text-black outline-none shadow-lg"
                type="password"
                ref={PasswordRef}
              />
            </div>
            <button
              className={`py-2 w-full md:mb-2 text-center rounded-md font-bold text-white shadow-lg ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-700"
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <h2
              className="text-blue-900 text-center text-sm my-2 md:text-lg md:my-4 font-semibold -ml-2 hover:cursor-pointer hover:underline"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </h2>
            <h2 className="text-black text-sm md:text-lg md:font-medium">
              New to TestMinds?{" "}
              <span
                className="font-bold hover:underline cursor-pointer"
                onClick={() => navigate("/Signup")}
              >
                Sign up Now
              </span>
            </h2>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
