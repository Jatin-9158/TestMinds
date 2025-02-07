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
  const [ErrorMessage,setErrorMessage] = useState("");
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

    const prompt = `You are an AI that processes quiz data from PDFs and messages. Convert the following quiz data into a structured JSON format containing questions, answer choices, marks, and correct answers.

**Strict Rules:**   
1. **If the message specifies "Marks each question X marks and no of question Y marks", apply the specified marks (X) to each question and ensure the total number of questions is Y.**  
2. **If any question is missing marks, and the message specifies "Marks each question X marks", apply X marks to those questions.**  
3. **If the message specifies "No of Questions should be X", validate the count of questions.** If the number of questions does not match, do the following:  
    - If the message specifies a certain number of questions (e.g., "Number of questions should be 20"), and the number of questions is less than expected, automatically generate the missing questions based on the content of the PDF.  
    - Assign marks as specified in the message for each question.  
    - If the number of questions exceeds the specified value, trim the extra questions accordingly.  
4. **Ensure all options are properly framed and clearly separated.**  
5. **Return only JSON (without code blocks).**  

 **Example Input (Message: Marks each question 20 marks and no of question 20 marks):**   
**Message**: "Marks each question 20 marks and no of question 20 marks"  
1. What is the capital of France?  
   a) Berlin  
   b) Madrid  
   c) Paris  
   d) Rome  

 **Expected JSON Output:**   
[
  {
    "question": "What is the capital of France?",
    "marks": 20,
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "correct_answer": "Paris"
  },
  {
    "question": "What is the capital of Spain?",
    "marks": 20,
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "correct_answer": "Madrid"
  },
  ...
  {
    "question": "What is the capital of Italy?",
    "marks": 20,
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "correct_answer": "Rome"
  }
]

 **Example Input (Incorrect Number of Questions):**   
**Message**: "Marks each question 20 marks and no of question 20 marks"  
**Quiz contains only 18 questions**  

If the number of questions is less than 20, automatically generate 2 additional questions and assign 20 marks to each:

 **Expected JSON Output (Automatically Generated Questions):**   
[
  {
    "question": "What is the capital of France?",
    "marks": 20,
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "correct_answer": "Paris"
  },
  {
    "question": "What is the capital of Spain?",
    "marks": 20,
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "correct_answer": "Madrid"
  },
  ...
  {
    "question": "What is the capital of Italy?",
    "marks": 20,
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "correct_answer": "Rome"
  }
]

 **Example Input (Missing Marks, and No Marks Specified in Message):**   
1. What is the capital of France?  
   a) Berlin  
   b) Madrid  
   c) Paris  
   d) Rome  

 **Expected JSON Output:**   
{ "error": "Marks missing in one or more questions." }

Now, process the following quiz data and return **only JSON**.                                         
 **Input:**   
${text} ${message}
`;

    

    try {
      const result = await model.generateContent(prompt);
      const rawText = await result.response.text();
      const cleanQuizData = rawText.replace(/```json|```/g, "").trim();
      const quizData = JSON.parse(cleanQuizData);
      console.log(quizData)
      if(quizData?.error)
      {
         setErrorMessage(quizData.error);
         return;
      }

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
    auth?.currentUser && (
      <div className="flex items-center justify-center  h-screen bg-gray-100">
      <div className="relative h-auto w-[45vh] md:h-4/5 md:w-1/2 mt-14 md:mt-20 bg-white opacity-90 shadow-lg rounded-sm md:rounded-lg p-6 flex flex-col gap-4">
        <h2 className="text-xl md:text-2xl text-center font-medium text-gray-700">
          Upload PDF to Create Quiz
        </h2>
        <div className="flex justify-center mt-6">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className=" md:py-2 md:px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          className="text-white bg-blue-500 px-3 font-semibold md:font-normal md:px-4 mx-auto py-2 md:py-3 mt-6 rounded-md md:rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
          onClick={handleClickQuiz}
        >
          {isGenerateQuiz ? "Generating ..." : "Generate a Quiz"}
        </button>
        {
          ErrorMessage && 
          <h1 className="text-red-600 text-base text-center">{`${ErrorMessage}`}</h1>
        }
        <div className="mt-4">
          <label
            htmlFor="message"
            className="block text-base md:text-lg font-medium text-gray-700 mb-2"
          >
            Instructions for Teacher:
          </label>
          <ul className="list-inside  list-disc text-sm text-gray-600 space-y-1">
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
          className="w-full p-3 mt-4 border border-gray-300 rounded-sm md:rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>
    </div>
    )
  );
};

export default TeacherDashboard;
