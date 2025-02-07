import React, { useState, useRef, useEffect } from "react";
import signUpform from "../utils/signUpform.jpg";
import { Navigate, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword,sendSignInLinkToEmail,signOut } from "firebase/auth";
import { setDoc,doc } from "firebase/firestore";
import { auth } from "../utils/firebaseConfig";
import { db } from "../utils/firebaseConfig";
const SignUp = () => {
  const navigate = useNavigate();
  const FirstNameRef = useRef("");
  const LastNameRef = useRef("");
  const EmailRef = useRef("");
  const PasswordRef = useRef("");
  const ConfirmPasswordRef = useRef("");
  const [selected, setSelected] = useState("");
  const [passwordCheck, setPasswordCheck] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const actionCodeSettings = {
    url: "http://localhost:3000/", 
    handleCodeInApp: true,
  };
  const validatePassword = (password) => {
    const minLength = 8; 
    const upperCase = /[A-Z]/;  
    const lowerCase = /[a-z]/; 
    const digit = /\d/; 
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/; 

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!upperCase.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!lowerCase.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!digit.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!specialChar.test(password)) {
      return "Password must contain at least one special character.";
    }
    return ""; 
  };

  const handlePasswordChange = () => {
    const password = PasswordRef.current.value;
    const confirmPassword_temp = ConfirmPasswordRef.current.value;

    const errorMessage = validatePassword(password); 

    if (errorMessage) {
      setPasswordCheck(false);
      setErrorMessage(errorMessage);
    } else if (password !== confirmPassword_temp) {
      setPasswordCheck(false);
      setErrorMessage("Password and Confirm Password do not match.");
    } else {
      setPasswordCheck(true);
      setErrorMessage("");
    }

  };
  

  const handleForm = async (e) => {
    e.preventDefault();
    if (
      !FirstNameRef.current.value ||
      !LastNameRef.current.value ||
      !EmailRef.current.value ||
      !PasswordRef.current.value ||
      !ConfirmPasswordRef.current.value
    ) {
      alert("All fields are required.");
      return;
    }

    try {
      // const actionCodeSettings = {
      //   url: "http://localhost:3000/", 
      //   handleCodeInApp: true,
      // };
  
      // await sendSignInLinkToEmail(auth, EmailRef.current.value, actionCodeSettings);
      // setErrorMessage("Verification link sent! Check your inbox.");
     
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        EmailRef.current.value,
        PasswordRef.current.value
      );
      const user = userCredential.user;
      const userDocRef = doc(db,"users",user.uid);
      await setDoc(userDocRef, {
        firstName: FirstNameRef.current.value,
        lastName: LastNameRef.current.value,
        email: EmailRef.current.value,
        role: selected,
      });
      
      alert("Signed up Successfully");
      try{
          await signOut(auth);
      }
      catch(error)
      {
        console.log("error");
      }
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };
 useEffect(()=>{
  if(passwordCheck && errorMessage!=="")
       setErrorMessage("");
 },[passwordCheck,errorMessage])

  return (
    <div className="absolute w-[80vw] h-[80vh] md:h-5/6 md:w-3/4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-9 shadow-2xl bg-gradient-to-br bg-white bg-opacity-35 flex flex-col md:flex-row gap-1 rounded-md md:rounded-lg">
        <div className="flex justify-center items-center -mt-5 md:-mt-0 w-full md:h-full md:w-[65%]">
    <img className="w-full h-full object-cover rounded-md rounded-b-none md:rounded-lg md:rounded-r-none" src={signUpform} alt="Sign Up Form" />
  </div>
  
  <div className="md:h-full md:w-[40%]">
    <form className="px-4 md:px-10" onSubmit={handleForm}>
      <h1 className={`text-2xl text-center md:text-left md:text-4xl font-bold md:mx-2 text-pretty ${(errorMessage !== "" && !passwordCheck) ? "mt-1 mb-2 md:my-10" : "mt-2 mb-3 md:my-7"}`}>Sign Up</h1>
      
      {!passwordCheck && errorMessage && (
        <h2 className="text-sm md:text-base font-semibold  text-red-600 my-1 text-center">{errorMessage}</h2>
      )}

      <div className="flex justify-center gap-2 md:gap-5">
        <div className="flex flex-col w-1/2">
          <label htmlFor="first-name" className="font-bold text-xs md:text-base md:font-semibold text-pretty">First Name</label>
          <input
            className="md:mb-4 mt-1 md:w-full px-5 py-2 md:p-2 md:px-4 text-pretty text-left rounded-lg bg-gray-200 bg-opacity-70 text-black outline-none shadow-lg"
            type="text"
            ref={FirstNameRef}
          />
        </div>

        <div className="flex flex-col w-1/2">
          <label htmlFor="last_name" className="font-bold text-xs md:text-base md:font-semibold text-pretty">Last Name</label>
          <input
            className="mb-2 md:mb-4 mt-1 w-full px-5 py-2 md:p-2 md:px-4 text-pretty text-left rounded-lg bg-gray-200 bg-opacity-70 text-black outline-none shadow-lg"
            type="text"
            ref={LastNameRef}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="Email_Address" className="font-bold text-xs md:text-base md:font-semibold text-pretty">Email Address</label>
        <input
          className="mb-2 md:mb-4 md:mt-1 w-full px-5 py-2 md:p-2 md:px-4 text-pretty text-left rounded-lg bg-gray-200 bg-opacity-70 text-black outline-none shadow-lg"
          type="email"
          ref={EmailRef}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="password" className="font-bold text-xs md:text-base md:font-semibold text-pretty">Password</label>
        <input
          className="mb-2 md:mb-4 mt-1 w-full px-5 py-2 md:p-2 md:px-4 text-pretty text-left rounded-lg bg-gray-200 bg-opacity-70 text-black outline-none shadow-lg"
          type="password"
          ref={PasswordRef}
          onChange={handlePasswordChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="confirm_password" className="font-bold text-xs md:text-base md:font-semibold text-pretty">Confirm Password</label>
        <input
          className="mb-3 mt-1 w-full px-5 py-2 md:p-2 md:px-4 text-pretty text-left rounded-lg bg-gray-200 bg-opacity-70 text-black outline-none shadow-lg"
          type="password"
          ref={ConfirmPasswordRef}
          onChange={handlePasswordChange}
        />
      </div>

      <div className="flex gap-16 md:gap-8">
        <div
          className={`text-sm  md:text-base md:w-1/2 p-2 md:p-3 font-bold text-center rounded-md shadow-lg cursor-pointer ${selected === "Teacher" ? "bg-blue-800 text-white" : "bg-gray-200"}`}
          onClick={() => setSelected("Teacher")}
        >
          I am a Teacher
        </div>
        <div
          className={`text-sm  md:text-base md:w-1/2 p-2 md:p-3 font-bold text-center rounded-md shadow-lg cursor-pointer ${selected === "Student" ? "bg-blue-800 text-white" : "bg-gray-200"}`}
          onClick={() => setSelected("Student")}
        >
          I am a Student
        </div>
      </div>

      <button className="mt-3 py-2 md:py-2 w-1/2 md:w-3/4 mx-16 md:mx-12 md:mt-6 md:mb-4 text-pretty text-center bg-slate-950 text-sm md:text-base rounded-md md:font-bold text-white shadow-lg" type="submit">
        Sign Up
      </button>
      <h2 className="text-blue-700 py-2 md:py-0 cursor-pointer text-xs md:text-base hover:underline text-pretty md:font-semibold" onClick={() => { navigate("/") }}>Already have an account ?</h2>
    </form>
  </div>
</div>

  );
};

export default SignUp;
