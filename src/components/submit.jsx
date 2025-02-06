import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Submit = () => {
  const navigate = useNavigate();
  const { marks, quizId, InstructorEmailId } = useSelector((store) => store.response);

  const handleExit = () => {
    navigate('/dashboard/student');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="h-auto w-80 bg-white rounded-lg shadow-md flex flex-col p-6 border border-gray-300">
        <h3 className="text-center text-lg font-semibold text-gray-800">
          {`Your Score: ${marks}`}
        </h3>

        <h2 className="text-center text-base font-bold text-gray-700 mt-2">
          {`Quiz ID: ${quizId}`}
        </h2>

        <button
          className="w-full py-2 mt-4 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition duration-200"
          onClick={handleExit}
        >
          Exit
        </button>

        <div className="text-center text-gray-600 mt-3 text-sm">
          <h4>If you faced any difficulty, contact your instructor:</h4>
          <h3 className="font-medium text-gray-800">{InstructorEmailId}</h3>
        </div>
      </div>
    </div>
  );
};

export default Submit;
