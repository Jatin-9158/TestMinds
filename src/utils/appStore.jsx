import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"
import quizReducer from "./quizSlice"
import responseReducer from "./responseSlice"
const appStore = configureStore(
    {
        reducer :{
           user:userReducer,
           quizData:quizReducer,
           response:responseReducer,
           
        }
    }
)
export default appStore;