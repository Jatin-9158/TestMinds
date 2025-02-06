import React from 'react'
import { useRef,useState} from 'react';
import { getAuth, sendPasswordResetEmail, sendSignInLinkToEmail } from "firebase/auth";
import {auth,db} from "../utils/firebaseConfig"
import { collection,query,where,getDocs } from "firebase/firestore";
import loginForm from "../utils/loginForm.png"
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { login } from '../utils/userSlice';
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const EmailRef = useRef("");
  const PasswordRef = useRef("");
  const [errorMessage,setErrorMessage] = useState("");
 
   const handleSignInWithEmailPassword = async(e) =>{
    e.preventDefault();
    if(!EmailRef.current.value || !PasswordRef.current.value)
    {
      setErrorMessage("Please fill in both fields")
    } 
     try {

      const userCredential= await signInWithEmailAndPassword(auth,EmailRef.current.value,PasswordRef.current.value)
      const user = userCredential.user;
      const userRefs = collection(db,"users");
      const q = query(userRefs,where("email","==",EmailRef.current.value));
      const querySnapShot = await getDocs(q);
      if (!querySnapShot.empty) {

        const userData = querySnapShot.docs[0].data();
        const userDetails = {
          email:userData.email,
          firstName:userData.firstName,
          lastName:userData.lastName,
          role:userData.role,

        }
        dispatch(login(userDetails))
  
        if (userData.role === "Student") {
          navigate("/dashboard/student");
        } else if (userData.role === "Teacher") {
          navigate("/dashboard/teacher");
        } else {
          setErrorMessage("Role not recognized");
        }

     }
    }
     catch(error)
     {
       if(error.message==="Firebase: Error (auth/invalid-credential).")
             setErrorMessage("Invalid Credentials");
     }
   }


   const handleForgotPassword = async () => {
     if (!EmailRef.current.value) {
       setErrorMessage("Please enter your email address.");
       return;
     }
   
     try {
       const userRefs = collection(db,"users");
       const q = query(userRefs,where("email","==",EmailRef.current.value));
       const querySnapShot = await getDocs(q);
       if(querySnapShot.empty)
       {     setErrorMessage("Email Not Found. Please Enter a Registered User")
             return;
       } 
       await sendPasswordResetEmail(auth, EmailRef.current.value);
       setErrorMessage("Password reset email sent! Check your inbox.");
     } catch (error) {

       setErrorMessage("Failed to send reset email. Please try again.");
     }
   };
   
  return (
    <div>
      <div className="absolute w-3/4 h-5/6 md:w-3/4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-9 shadow-2xl bg-gradient-to-br bg-white bg-opacity-35 flex gap-3 rounded-xl">
        <div className="w-[65%] h-full">
          <img className="w-full h-full object-cover rounded-lg" src={loginForm} alt="Sign Up Form" />
        </div>

        <div className="h-full">
        <form className="px-14" onSubmit={handleSignInWithEmailPassword} >
          <h1 className='text-4xl font-bold mt-12 mb-8  text-black'>Sign In</h1>
          {errorMessage && <h2 className='text-sm text-pretty text-red-600 mb-3 '>{errorMessage}</h2>}
          <div className="w-full">
              <label htmlFor="Email_Address" className="font-semibold">Email Address</label>
              <input
                className="mb-6 mt-1 w-full p-2 px-4 text-pretty text-left rounded-lg bg-gray-200 bg-opacity-70 text-black outline-none shadow-lg"
                type="email"
                ref={EmailRef} 
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="font-semibold">Password</label>
              <input
                className="my-11 mt-1 w-full px-5 py-2 text-pretty text-left rounded-lg bg-gray-200 bg-opacity-70 text-black outline-none shadow-lg"
                type="password"
                ref={PasswordRef}
              />
            </div>
          <button className='py-2 w-full mb-2  text-center bg-blue-700 text-base rounded-md text-lg font-bold text-white shadow-lg'  type="submit" >Login</button>
          
          <h2 className='text-blue-900 text-center text-lg my-4 font-semibold -ml-2 hover:cursor-pointer hover:underline' onClick={handleForgotPassword}>Forgot Password ?</h2>
          <h2 className='text-black text-lg font-medium'>New to TestMinds ? <span className='font-bold hover:underline cursor-pointer' onClick={()=>navigate("/Signup")}>Sign up Now</span></h2>
      </form>
        </div>
          
  </div>
      
     
      </div>
   

  )
}

export default Login