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
    <div className="absolute w-3/4 h-5/6 md:w-3/4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-9 shadow-2xl bg-gradient-to-br bg-white bg-opacity-35 flex gap-3 rounded-xl">
  <div className="w-[70%] h-full min-w-[350px]"> 
    <img className="w-full h-full object-cover rounded-lg" src={signUpform} alt="Sign Up Form" />
  </div>
  
  <div className="h-full w-[40%]">
    <form className="px-10" onSubmit={handleForm}>
      <h1 className={`text-4xl font-bold mx-2 text-pretty ${(errorMessage !== "" && !passwordCheck) ? "my-2" : "my-7"}`}>Sign Up</h1>
      
      {!passwordCheck && errorMessage && (
        <h2 className="text-base font-semibold text-red-600 my-1 text-center">{errorMessage}</h2>
      )}

      <div className="flex gap-5">
        <div className="flex flex-col w-1/2">
          <label htmlFor="first-name" className="font-semibold text-pretty">First Name</label>
          <input
            className="mb-4 mt-1 w-full p-2 text-pretty text-left rounded-lg bg-gray-200 bg-opacity-70 text-black outline-none shadow-lg"
            type="text"
            ref={FirstNameRef}
          />
        </div>

        <div className="flex flex-col w-1/2">
          <label htmlFor="last_name" className="font-semibold">Last Name</label>
          <input
            className="mb-4 mt-1 w-full p-2 text-pretty text-left rounded-lg bg-gray-200 bg-opacity-70 text-black outline-none shadow-lg"
            type="text"
            ref={LastNameRef}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="Email_Address" className="font-semibold">Email Address</label>
        <input
          className="mb-4 mt-1 w-full p-2 text-pretty text-left rounded-lg bg-gray-200 bg-opacity-70 text-black outline-none shadow-lg"
          type="email"
          ref={EmailRef}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="password" className="font-semibold">Password</label>
        <input
          className="mb-4 mt-1 w-full px-5 py-2 text-pretty text-left rounded-lg bg-gray-200 bg-opacity-70 text-black outline-none shadow-lg"
          type="password"
          ref={PasswordRef}
          onChange={handlePasswordChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="confirm_password" className="font-semibold">Confirm Password</label>
        <input
          className="mb-4 mt-1 w-full px-5 py-2 text-pretty text-left rounded-lg bg-gray-200 bg-opacity-70 text-black outline-none shadow-lg"
          type="password"
          ref={ConfirmPasswordRef}
          onChange={handlePasswordChange}
        />
      </div>

      <div className="flex gap-8">
        <div
          className={`w-1/2 p-3 font-bold text-center rounded-md shadow-lg cursor-pointer ${selected === "Teacher" ? "bg-blue-800 text-white" : "bg-gray-200"}`}
          onClick={() => setSelected("Teacher")}
        >
          I am a Teacher
        </div>
        <div
          className={`w-1/2 p-3 font-bold text-center rounded-md shadow-lg cursor-pointer ${selected === "Student" ? "bg-blue-800 text-white" : "bg-gray-200"}`}
          onClick={() => setSelected("Student")}
        >
          I am a Student
        </div>
      </div>

      <button className="py-2 w-3/4 mx-12 mt-6 mb-4 text-pretty text-center bg-slate-950 text-base rounded-md font-bold text-white shadow-lg" type="submit">
        Sign Up
      </button>
      <h2 className="text-blue-700 cursor-pointer hover:underline text-pretty font-semibold" onClick={() => { navigate("/") }}>Already have an account ?</h2>
    </form>
  </div>
</div>

  );
};

export default SignUp;
