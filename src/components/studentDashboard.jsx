import React from "react";
import { useState } from "react";
import { db } from "../utils/firebaseConfig";
import {query,collection,where,getDocs} from "firebase/firestore"
import {  useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const StudentDashboard = () => {
  const [quizId, setquizId] = useState(["", "", "", "", ""]);
  const [error,setError] = useState("");
  const [isJoining,setisJoining] = useState(false);
  const navigate = useNavigate();
  const StudentEmailId = useSelector((store)=>store.user.email);
  const handleChange = (index, event) => {
    const value = event.target.value;
    if (isNaN(value)) return;
    let newquizId = [...quizId];
    newquizId[index] = value.substring(value.length - 1);
    setquizId(newquizId);

    if (value && index < quizId.length - 1) {
      document.getElementById(`quizId-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !quizId[index] && index > 0) {
      document.getElementById(`quizId-input-${index - 1}`).focus();
    }
  };
  const handlejoinCode = async() =>{
    const quizStr = quizId.join("").toString();
    if(quizStr.length<5)
    {
       setError("Enter the Valid 5 Digit Id")
       return; 
    }
    setisJoining(true);
    const quizRef = collection(db, "quizzes");
    const responseRef = collection(db, "responseUser");
    const QuizIdquery = query(quizRef, where("quizId", "==", quizStr));
    const Responsequery = query(responseRef, where("ResponseEmail", "==", StudentEmailId),where(
      "quizId","==",quizStr
    ));
    const existingResponse = await getDocs(Responsequery);
    const existingQuiz = await getDocs(QuizIdquery);
    if(!existingResponse.empty)
    { setisJoining(false) 
      setError("Response Already Recorded");
      return;
    }
    if(existingQuiz.empty) 
    { setisJoining(false)
      setError("Invalid Code")
      return;
    }
    else
    {
        navigate(`/quiz/home/${quizStr}`)
    }  
    

  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative h-[35vh]   md:h-2/5 md:w-1/4 md:mt-10 bg-white opacity-90 shadow-lg rounded-sm md:rounded-lg  flex  flex-col">
       <h1 className="font-bold text-center mt-8 text-xl">Enter the Quiz Code</h1>
       <div className="flex  justify-center gap-2">
       {quizId.map((digit, index) => (
          <input
            key={index}
            id={`quizId-input-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength="1"
            className="w-12 h-12 border-2 text-center mt-8 text-green-950 text-lg font-bold rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        ))}
       </div>
      <button className="bg-blue-600 px-5 py-2 mx-24 text-center mb-5 mt-7 rounded-md text-white font-bold shadow-lg" onClick={handlejoinCode}>{isJoining ?  "Joining ..." : "Join Now"}</button>
      {error && <h2 className="text-red-700 font-medium text-center text-md ">{error}</h2>}
      </div>

    </div>
  );
};

export default StudentDashboard;
