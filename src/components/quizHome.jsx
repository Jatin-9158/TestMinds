import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const QuizHome = () => {
  const navigate = useNavigate();
  const {quizId}  = useParams();

  const handleStartQuiz = () => {
    navigate(`/quiz/start/${quizId}`);
  };
  return (
<div className="flex items-center justify-center h-screen bg-gray-100">
  <div className="relative h-auto w-4/5 -mt-4 sm:w-3/4 md:w-1/3 md:mt-10 bg-slate-700 opacity-95 rounded-md md:rounded-lg shadow-xl flex flex-col p-8">

      <label
        htmlFor="instructions"
        className="block text-xl font-semibold text-white  mb-6 text-center"
      >
        Quiz Instructions
      </label>
      <ul className="list-inside ml-2 md:ml-8 list-disc text-sm sm:text-base text-gray-100 space-y-3">
        <li>Each question has multiple-choice answers.</li>
        <li>You can skip questions and come back to them later.</li>
        <li>Once you submit your answer for a question, you cannot change it.</li>
        <li>Review your answers before submitting the quiz.</li>
      </ul>


    <div className="flex justify-center mt-6">
      <button
        className="bg-green-600 px-5 py-2 md:px-8  text-white rounded-md md:rounded-lg text-base md:text-lg font-semibold hover:bg-green-800 transition-all duration-300 ease-in-out"
        onClick={handleStartQuiz}
      >
        Start the Quiz
      </button>
    </div>
  </div>
</div>
  )
};

export default QuizHome;
