import React from 'react'
import { useParams } from 'react-router-dom';
import { FaRocket } from "react-icons/fa";
import CopyToClipboard from './CopiedToClipboard';
import { auth } from '../utils/firebaseConfig';


const QuizPage = () => {
  const quizId = useParams();

  return (
    auth?.currentUser &&(
      <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative w-5/6  md:h-1/3 md:w-1/3 -mt-10 md:mt-10 bg-white opacity-90 shadow-lg rounded-sm md:rounded-lg p-8 md:p-12">
      <div className="flex items-center gap-2 bg-blue-100 p-2 md:p-4 rounded-sm md:rounded-md shadow-md">
          <FaRocket className="text-blue-600 text-2xl animate-bounce" />
      <span className="text-green-700 font-semibold">Quiz Created Successfully! 🚀</span>
      </div>
      <div className='mx-5 my-8'>
      <CopyToClipboard quizID={quizId}/>
      </div>
 
      </div>
    </div>  
    )
  )
}

export default QuizPage;