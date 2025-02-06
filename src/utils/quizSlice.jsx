import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    quiz:null,
    loading:false,
    error:null,
}
const quizSlice = createSlice({
    name:"quizData",
    initialState,
    reducers:{
        fetchquizStart(state)
        {
            state.loading=true;
            state.error=false;
        },
        fetchQuizSucces(state,action)
        {
            state.loading=false;
            state.quiz=action.payload;
        },
        fetchQuizFailure(state,action)
        {
            state.loading=false;
            state.error=action.payload;
        }
    }
})
export const {fetchquizStart,fetchQuizSucces,fetchQuizFailure} = quizSlice.actions;
export default quizSlice.reducer;
