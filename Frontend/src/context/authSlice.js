import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    status : false,
    userData: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
       signup: (state, action) => {
          state.status = true;
          state.userData = action.payload.userData;
       },
       login: (state, action) => {
          state.userData = action.payload.userData;
          state.status = true;
          localStorage.setItem("authToken", JSON.stringify(action.payload.userData))
       },
       logout: (state) => {
          state.userData = null;
          state.status = false;
          localStorage.removeItem('authToken')
     },
    }
})


export const {signup, login, logout} = authSlice.actions;

export default authSlice.reducer;