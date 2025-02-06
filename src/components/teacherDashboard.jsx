import FileUploader from "./FileUploader";
import { useState } from "react";
import { auth } from "../utils/firebaseConfig";
import { collection, where, query, getDocs, addDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const TeacherDashboard = () => {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isGenerateQuiz, setIsGenerateQuiz] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const emailId = useSelector((store) => store.user.email);

  const generateQuizId = async () => {
    let quizId;
    let isDuplicateId = true;

    while (isDuplicateId) {
      quizId = Math.floor(10000 + Math.random() * 90000).toString();

      const quizRef = collection(db, "quizzes");
      const q = query(quizRef, where("quizId", "==", quizId));
      const existingQuiz = await getDocs(q);

      if (existingQuiz.empty) {
        isDuplicateId = false;
      }
    }

    return quizId;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          extractedText +=
            textContent.items.map((item) => item.str).join(" ") + "\n";
        }

        setText(extractedText);
      } catch (error) {
        console.error("Error reading PDF:", error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleGenerateQuiz = async () => {
    if (!text) {
      console.log("No text extracted from PDF");
      return;
    }

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINIAI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an AI that processes quiz data. Convert the following text into a structured JSON format containing questions, answer choices, marks, and correct answers.  
        
        ⚠️ **Important Rules:**  
        1. **Do NOT generate any response** if marks are missing for any question.  
        2. **Do NOT assume or modify** any missing fields—return an error instead.  
        3. **If data is unclear or invalid, return an null re without attempting corrections.  
        4. **Ensure questions are properly structured** before processing.  
        
        📌 **Example Input:**  
        1. What is the capital of France? (1 mark)  
           a) Berlin  
           b) Madrid  
           c) Paris  
           d) Rome  
        
        ✅ **Expected JSON Output:**  
        [
          {
            "question": "What is the capital of France?",
            "marks": 1,
            "options": ["Berlin", "Madrid", "Paris", "Rome"],
            "correct_answer": "Paris"
          }
        ]
        
        Now, process the following quiz data and return a properly formatted JSON output.  
        **Return only JSON (without code blocks).**  
        
        If any ambiguity or missing marks is found, **return an error immediately** without making any assumptions.  
        
        📌 **Input:**  
        ${text} ${message}
         `;

    try {
      const result = await model.generateContent(prompt);
      const rawText = await result.response.text();
      const cleanQuizData = rawText.replace(/```json|```/g, "").trim();
      const quizData = JSON.parse(cleanQuizData);
      console.log(quizData);

      const quizId = await generateQuizId();
      await addDoc(collection(db, "quizzes"), {
        quizId: quizId,
        emailId: emailId,
        questions: quizData,
        createdAt: new Date().toISOString(),
      });

      navigate(`/quiz/${quizId}`);
    } catch (error) {
      console.error("Error generating or saving quiz:", error);
    }
  };

  const handleClickQuiz = async () => {
    setIsGenerateQuiz(true);
    await handleGenerateQuiz();
    setIsGenerateQuiz(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative h-3/4 w-1/2 mt-10 bg-white opacity-90 shadow-lg rounded-lg p-6 flex flex-col gap-4">
        <h2 className="text-xl text-center font-medium text-gray-700">
          Upload PDF to Create Quiz
        </h2>
        <div className="flex justify-center mt-6">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          className="text-white bg-blue-500 px-4 mx-64 py-3 mt-6 rounded-xl shadow-lg hover:bg-blue-600 transition duration-200"
          onClick={handleClickQuiz}
        >
          {isGenerateQuiz ? "Generating ..." : "Generate a Quiz"}
        </button>

        <div className="mt-8">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Instructions for Teacher:
          </label>
          <ul className="list-inside list-disc text-sm text-gray-600 space-y-1">
            <li>Upload a PDF file containing quiz content.</li>
            <li>
              Ensure the PDF is well-structured with clear questions and
              multiple-choice options.
            </li>
            <li>
              After uploading, type any additional instructions or messages in
              the text box.
            </li>
            <li>
              Click "Generate a Quiz" to convert the text from the PDF into a
              structured quiz format.
            </li>
            <li>
              Once the quiz is generated, it will be saved, and you will be
              redirected to the newly created quiz.
            </li>
          </ul>
        </div>

        <textarea
          id="message"
          value={message}
          onChange={handleMessageChange}
          disabled={isGenerateQuiz}
          placeholder="Type your message here."
          rows="4"
          className="w-full p-3 mt-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;
