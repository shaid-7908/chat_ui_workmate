import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  session_id: '1234',
};

export const sessionSlice = createSlice({
    name:'session_slice',
    initialState,
    reducers:{
        create_session:(state,action)=>{
           state.session_id = action.payload
        }
    }
})

export const {create_session} = sessionSlice.actions
export default sessionSlice.reducer