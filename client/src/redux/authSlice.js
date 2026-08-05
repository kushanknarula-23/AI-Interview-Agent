import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    accessToken:null,
    isAuthenticated:false
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setAccesstoken:(state,action)=>{
            state.accessToken = action.payload, 
            state.isAuthenticated = true
        },
        
        logout:(state,action)=>{
            state.accessToken = null,
            state.isAuthenticated = false

        }

    }
})

export const {setAccesstoken,logout} = authSlice.actions
export default authSlice.reducer