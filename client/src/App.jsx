import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useEffect } from 'react'
import axios from 'axios'
import axiosInstance from './api/axios.js'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from './redux/userSlice'
import Interviewpage from './pages/Interviewpage'
import { setAccesstoken } from './redux/authSlice'
import { setupInterceptors}  from './api/axiosInterceptor.js'
import InterviewHistory from './pages/InterviewHistory.jsx'
import InterviewReport from './pages/InterviewReport.jsx'

// Re-export so other files importing ServerUrl from App.jsx still work
export { ServerUrl } from './api/axios.js'

function App() {
  const dispatch = useDispatch()
  const { accessToken } = useSelector(state => state.auth)

  // On every page load/refresh — get a new accessToken using the httpOnly refresh cookie
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const result = await axiosInstance.post("/api/auth/getAccessToken")
        dispatch(setAccesstoken(result.data.accessToken))
      }
      catch (error) {
        console.log("No active session:", error)
      }
    }

    fetchAccessToken()
  }, [])  // runs only once on mount

  // Whenever accessToken is available — fetch the full user data
  useEffect(() => {
    if (!accessToken) {
      return
    }

    const getUser = async () => {
      try {
        const response = await axiosInstance.get("/api/user/current-user")
        // getCurrentUser returns { user: CurrentUser }, so extract the user object
        dispatch(setUserData(response.data.user))
      }
      catch (err) {
        console.log(err)
        dispatch(setUserData(null))
      }
    }

    getUser()
  }, [accessToken])

  

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/interview" element={<Interviewpage />} />
      <Route path="/history" element={<InterviewHistory />} />
      <Route path="/report/:id" element={<InterviewReport />} />
    </Routes>
  )
}

export default App
