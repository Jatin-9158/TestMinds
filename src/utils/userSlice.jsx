import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    firstName:"",
    lastName:"",
    email:"",
    role:"",
}
const userSlice = createSlice({
    name:"user",
    initialState,
    reducers :{
        login : (state,action) =>{
           state.firstName=action.payload.firstName;
           state.lastName=action.payload.lastName;
           state.email=action.payload.email;
           state.role=action.payload.role;
        },
        logout: (state) =>{
            state.email="";
            state.firstName="";
            state.lastName="";
            state.role="";

        }
    }
});
export const {login,logout} = userSlice.actions;
export default userSlice.reducer;