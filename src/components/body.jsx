import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./login";
import SignUp from "./signUp";
import UserProfile from "./userProfile";
import QuizPage from "./quizPage";
import TeacherDashboard from "./teacherDashboard";
import StudentDashboard from "./studentDashboard";
import QuizHome from "./quizHome";
import StartQuiz from "./startQuiz";
import Submit from "./submit";
const Body = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
      <Route path="/dashboard/student" element={<StudentDashboard />} />
      <Route path="/quiz/:quizId" element={<QuizPage />} />
      <Route path="/quiz/home/:quizId" element={<QuizHome />} />
      <Route path="/quiz/start/:quizId" element={<StartQuiz />} />
      <Route path="/quiz/:quizId/submit" element={<Submit/>} />
    </Routes>
  );
};

export default Body;
