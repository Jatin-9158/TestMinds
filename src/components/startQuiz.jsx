import { collection, addDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { db,auth } from '../utils/firebaseConfig';
import { useParams, useNavigate } from 'react-router-dom';
import useQuizData from '../hooks/useQuizData';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { responseRecord } from '../utils/responseSlice';

const StartQuiz = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quizId } = useParams(); 
  const { loading, quiz, error } = useQuizData(quizId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState({});
  const [handleSubmitText, setHandleSubmitText] = useState(false);
  const [marks, setMarks] = useState(0);
  const [answers, setAnswers] = useState({});

  const studentEmail = useSelector((store) => store.user.email);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: -50, opacity: 1 }}
          transition={{ yoyo: Infinity, duration: 0.6, ease: "easeInOut" }}
          className="text-6xl"
        >
        </motion.div>
        <p className="mt-4 text-lg font-semibold text-gray-700">Launching Quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="mt-4 text-lg font-semibold text-gray-700">Error</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="mt-4 text-lg font-semibold text-gray-700">Quiz Not Available</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleSelectedOption = (option) => {
    if (answers[currentQuestionIndex] !== undefined) return;

    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }));
    setShowAnswer((prev) => ({ ...prev, [currentQuestionIndex]: true }));
    setSelectedOption(option);

    if (option === currentQuestion.correct_answer) {
      setMarks((marks) => marks + currentQuestion.marks);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
    }
  };

  const recordResponse = async () => {
    await addDoc(collection(db, "responseUser"), {
      quizId,
      InstructorEmail: quiz.emailId,
      ResponseEmail: studentEmail,
      Marks: marks,
    });


    dispatch(responseRecord({
      quizId,
      InstructorEmailId: quiz.emailId,
      responseEmailId: studentEmail,
      marks,
    }));

  };

  const handleSubmit = () => {
    setHandleSubmitText(true);
    recordResponse();
    setHandleSubmitText(false);
    navigate(`/quiz/${quizId}/submit`);
  };

  return ( auth?.currentUser && (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white relative h-auto w-5/6 md:w-2/5 mt-10 md:mt-14 rounded-md md:rounded-lg opacity-85 shadow-xl p-6">
        <h2 className="text-lg md:text-xl font-extrabold md:font-bold text-center mt-2 mb-4 text-gray-800">
          Quiz ID: {quizId}
        </h2>

        <h3 className="font-bold md:font-medium text-base md:text-lg text-right mr-4">
          Marks: {currentQuestion.marks}
        </h3>

        <div className="bg-slate-200 text-base font-bold md:text-lg md:font-semibold mb-4 p-2 md:p-4 rounded-sm md:rounded-md shadow-md">
          {`${currentQuestionIndex + 1}. ${currentQuestion.question}`}
        </div>

        <div className="space-y-2 md:space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectedOption(option)}
              disabled={answers[currentQuestionIndex] !== undefined}
              className={`w-full font-semibold py-2 md:py-3 px-4 rounded-sm md:rounded-md border border-gray-300 
              transition duration-300 ease-in-out shadow-sm 
              ${
                selectedOption === option
                  ? currentQuestion.correct_answer === selectedOption
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : answers[currentQuestionIndex] !== undefined
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-blue-500 hover:text-white"
              }`}
            >
              {option}
            </button>
          ))}
          {showAnswer[currentQuestionIndex] && (
            <div>
              <h2 className="text-center text-green-600 font-semibold mt-2">
                ✅ Correct Answer: {currentQuestion.correct_answer}
              </h2>
              <h2 className="text-center text-black font-semibold mt-2">
                Your Answer: {answers[currentQuestionIndex]}
              </h2>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-4 mx-2">
          <button
            className={`px-6 py-2 rounded-sm md:rounded-md shadow-lg text-white transition duration-300 
                      ${
                        currentQuestionIndex === 0
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
            disabled={currentQuestionIndex === 0}
            onClick={handlePrev}
          >
            {`< Prev`}
          </button>

          <button
            className={`px-6 py-2 rounded-sm md:rounded-md shadow-lg text-white transition duration-300 
                      ${
                        currentQuestionIndex === quiz.questions.length - 1
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
            onClick={handleNext}
            disabled={currentQuestionIndex === quiz.questions.length - 1}
          >
            {`Next >`}
          </button>
        </div>

        {currentQuestionIndex === quiz.questions.length - 1 && (
          <div className="flex justify-center mt-6">
            <button
              className="px-5 py-2 rounded-lg text-white bg-green-700 shadow-lg hover:bg-green-800 transition duration-300"
              onClick={handleSubmit}
            >
              {handleSubmitText ? "Submitting ..." : "Submit"}
            </button>
          </div>
        )}
      </div>
    </div>
  ));
};

export default StartQuiz;
