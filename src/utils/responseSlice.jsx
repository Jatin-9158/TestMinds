import { createSlice } from "@reduxjs/toolkit";
const responseSlice = createSlice({
    name:"response",
    initialState:{
       quizId:null, 
       InstructorEmailId:null,    
       responseEmailId:null,
       marks:0,
    },
    reducers:{
       responseRecord : (state,action)=>{
          state.quizId=action.payload.quizId;
          state.InstructorEmailId=action.payload.InstructorEmailId;
          state.responseEmailId=action.payload.responseEmailId;
          state.marks=action.payload.marks;

       }
    }

})
export const {responseRecord} = responseSlice.actions;
export default responseSlice.reducer;