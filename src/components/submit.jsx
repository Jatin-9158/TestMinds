import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebaseConfig';

const Submit = () => {
  const navigate = useNavigate();
  const { marks, quizId, InstructorEmailId } = useSelector((store) => store.response);

  const handleExit = () => {
    navigate('/dashboard/student');
  };

  return (
    auth?.currentUser( <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="h-[30vh] w-[40vh] md:h-[40vh] md:w-[50vh] -mt-8 md:mt-0 md:p-10 bg-white rounded-sm md:rounded-md shadow-md flex flex-col p-6 border border-gray-300">
        <h3 className="text-center text-lg font-bold md:text-xl md:font-semibold text-gray-800">
          {`Your Score: ${marks}`}
        </h3>

        <h2 className="text-center text-lg font-bold md:text-xl md:font-semibold text-blue-600 mt-2">
          {`Quiz ID: ${quizId}`}
        </h2>

        <button
          className="w-1/2 md:w-1/2 py-2 mx-auto mt-4 text-base font-medium text-white bg-black rounded-sm md:rounded-md hover:bg-gray-800 transition duration-200"
          onClick={handleExit}
        >
          Exit
        </button>

        <div className="text-center text-gray-600 mt-3 text-base">
          <h4>If you faced any difficulty, contact your Instructor:</h4>
          <h3 className="font-medium text-blue-700 hover:underline hover:text-blue-800">{InstructorEmailId}</h3>
        </div>
      </div>
    </div>)
  );
};

export default Submit;
