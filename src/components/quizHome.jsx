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
      <div className="relative h-2/5 w-1/4 mt-10 bg-white opacity-90 items-center justify-center shadow-lg rounded-lg  flex  flex-col">
        <button
          className="bg-green-600 px-3 py-3 text-white rounded-md hover:bg-green-800"
          onClick={handleStartQuiz}
        >
          Start the Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizHome;
