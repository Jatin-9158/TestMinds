import React from 'react'
import { useParams } from 'react-router-dom';
import { FaRocket } from "react-icons/fa";
import CopyToClipboard from './CopiedToClipboard';



const QuizPage = () => {
  const quizId = useParams();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative h-1/3 w-1/3 mt-10 bg-white opacity-90 shadow-lg rounded-lg p-12">
      <div className="flex items-center gap-2 bg-blue-100 p-4 rounded-md shadow-md">
          <FaRocket className="text-blue-600 text-2xl animate-bounce" />
      <span className="text-green-700 font-semibold">Quiz Created Successfully! 🚀</span>
      </div>
      <div className='mx-5 my-8'>
      <CopyToClipboard quizID={quizId}/>
      </div>
 
      </div>
    </div>  
  )
}

export default QuizPage;