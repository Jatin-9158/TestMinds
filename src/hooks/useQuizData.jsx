import React from 'react'
import { useEffect } from 'react'
import { collection,query,where,getDocs } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { fetchQuizSucces,fetchquizStart,fetchQuizFailure } from '../utils/quizSlice'
import { db } from '../utils/firebaseConfig'
const useQuizData = (quizId) => {
     const dispatch = useDispatch();
     const {quiz,loading,error} = useSelector((store)=>store.quizData);
     useEffect(()=>{
      if(!quizId) return;
      dispatch(fetchquizStart());
      const fetchQuizData = async ()=>{
        try{
          const quizRef = collection(db,"quizzes");
          const q = query(quizRef,where("quizId","==",quizId));
          const snapShot = await getDocs(q);
          if(!snapShot.empty)
          {
             dispatch(fetchQuizSucces(snapShot.docs[0].data()));
          }   
          else
          {
             dispatch(fetchQuizFailure("Quiz not found"));
          }
        }
        catch(error)
        {
            dispatch(fetchQuizFailure(error));
        }
      }  
      fetchQuizData();
     },[quizId,dispatch])
     return {quiz,loading,error}; 
}

export default useQuizData;