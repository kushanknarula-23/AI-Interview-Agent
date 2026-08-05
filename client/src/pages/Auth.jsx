import React from 'react'
import { FaRobot } from "react-icons/fa6";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axiosInstance from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setAccesstoken } from '../redux/authSlice';

function Auth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleonclick = async () => {

        try {
            const result = await signInWithPopup(auth, provider)
            let user = result.user
            let name = user.displayName
            let email = user.email

            const response = await axiosInstance.post("/api/auth/googleAuth", { name, email })
            const { accessToken } = response.data
            dispatch(setAccesstoken(accessToken))
            // Navigate to home — App.jsx useEffect will fire and fetch user data
            navigate("/")
        }
        catch (error) {
            console.log(error)
        }

    }
    return (
        <>
            <div className='w-full min-h-screen  flex items-center justify-center'>
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 1 }}
                    transition={{ duration: 1.05 }}
                    className='w-[80%] md:w-[full] rounded-3xl bg-white border border-gray-200 px-6 py-5 shadow-2xl'>
                    <div className='flex items-center justify-center gap-1 px-4'>
                        <div className='bg-black text-white p-1 rounded-xl'>
                            <FaRobot />
                        </div>
                        <h1 className='text-m font-semibold flex items-center justify-center'>InterviewIQ.AI</h1>
                    </div>

                    <h1 className='text-xl md:text-2xl flex items-center justify-center mt-4 mb-2 font-semibold'>
                        Continue With
                    </h1>
                    <motion.div
                        whileHover={{ scale: 1.06 }}
                        className='flex justify-center'>
                        <span className='inline-flex items-center  mx-26 gap-2 px-3  bg-emerald-100 py-2 mt-3 rounded-2xl'>
                            <IoSparkles />
                            <h3 className='text-sm text-emerald-600 whitespace-nowrap'>AI Smart Interview</h3>
                        </span>
                    </motion.div>

                    <p className='mt-4 md:text-xl mb-2 md:text-l tracking-tight text-center'>Sign in to start AI-powered mock interviews track your progress and unlock detailed performance insights</p>

                    <div className='flex items-center justify-center'>
                        <motion.button
                            onClick={handleonclick}
                            whileHover={{ opacity: 0.9, scale: 1.05 }}
                            whileTap={{ opacity: 1, scale: 0.9 }}
                            className='bg-blue-300 px-2 py-1 md:py-2 rounded-xl mt-4 text-sm  flex items-center justify-center gap-2 mx-27 whitespace-nowrap'>
                            <FcGoogle />
                            Login in google
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </>
    )
}

export default Auth