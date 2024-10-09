import { createSlice } from "@reduxjs/toolkit";


const initialState = {
     jobStatus: false,
     jobData: null,
}


const jobSlice = createSlice({
    name: "job",
    initialState,
    reducers: {
       createJOB: (state, action) => {
         state.jobStatus = true
         state.jobData = action.payload.jobData;
       }
    }
})


export const { createJOB } = jobSlice.actions;

export default jobSlice.reducer;