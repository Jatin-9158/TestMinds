import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { auth } from "../utils/firebaseConfig";
import Login from "./login";
import SignUp from "./signUp";
import QuizPage from "./quizPage";
import TeacherDashboard from "./teacherDashboard";
import StudentDashboard from "./studentDashboard";
import QuizHome from "./quizHome";
import StartQuiz from "./startQuiz";
import Submit from "./submit";

const ProtectedRoute = ({ element }) => {
  const user = auth?.currentUser;
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = () => {
      if (user) {
        auth.signOut(); // Log out user when they try to go back
        window.location.href = "/"; // Redirect to login
      }
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [user, location]);

  return user ? element : <Navigate to="/" replace />;
};

const Body = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard/teacher" element={<ProtectedRoute element={<TeacherDashboard />} />} />
      <Route path="/dashboard/student" element={<ProtectedRoute element={<StudentDashboard />} />} />
      <Route path="/quiz/:quizId" element={<ProtectedRoute element={<QuizPage />} />} />
      <Route path="/quiz/home/:quizId" element={<ProtectedRoute element={<QuizHome />} />} />
      <Route path="/quiz/start/:quizId" element={<ProtectedRoute element={<StartQuiz />} />} />
      <Route path="/quiz/:quizId/submit" element={<ProtectedRoute element={<Submit />} />} />
    </Routes>
  );
};

export default Body;
