import React, { useState } from 'react'
import { motion } from "motion/react"
import { BsRobot } from "react-icons/bs";
import { BsCoin } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TbLogout } from "react-icons/tb";
import { setUserData } from '../redux/userSlice';
import axiosInstance from '../api/axios';
import Authmodel from './Authmodel';
import { logout } from '../redux/authSlice';

function Navbar() {
    const dispatch = useDispatch()
    const { userData } = useSelector((state) => state.user)
    const [showPopup, setShowPopup] = useState(false)
    const [showUserPopup, setShowUserPopup] = useState(false)
    const [showAuthPopup, setShowAuthpopup] = useState(false)
    const navigate = useNavigate()


    const handleLogout = async () => {
        try {
            await axiosInstance.get("/api/auth/logout")  // interceptor auto-adds auth header
            dispatch(logout())
            dispatch(setUserData(null))
            setShowPopup(false)
            setShowUserPopup(false)
            navigate("/")
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <div className='flex justify-between px-5 py-3'>
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    className='w-full bg-white shadow-xl mt-3 flex justify-between px-3 py-2 rounded-xl'>
                    <div className='flex gap-2 items-center'>
                        <div className='text-white bg-gray-800 rounded-full p-2'>
                            <BsRobot size={16} />
                        </div>
                        <h1 className='text-black font-bold hidden md:block'>InterviewIQ.AI</h1>
                    </div>
                    <div className='relative'>
                        <div className='flex items-center gap-2'>
                            <motion.button
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                    if (!userData) {
                                        setShowAuthpopup(true)
                                        return

                                    }
                                    setShowPopup(prev => !prev)
                                    setShowUserPopup(false)
                                }
                                }
                                className='py-1 bg-gray-800 px-2 rounded-2xl flex items-center gap-1 text-md text-white'>
                                <BsCoin />
                                {userData?.token || 0}
                            </motion.button>

                            {showPopup &&
                                <div className='absolute top-10 bg-white px-2 rounded-xl mt-3 py-3 shadow-md w-[200px] right-[-1px]'>
                                    <p className='text-sm px-4 mt-1'>Need more Credits to Continue the Interview</p>
                                    <button
                                        onClick={() => navigate("/pricing")}
                                        className='bg-gray-800 px-2 py-1 rounded-xl text-xs mt-2 mx-9 text-white' >Buy More Credits</button>
                                </div>}
                            <div className='relative'>
                                <motion.button
                                    whileHover={{ scale: 1.06 }}
                                    whileTap={{ scale: 0.9 }}

                                    onClick={() => {
                                        if (!userData) {
                                            setShowAuthpopup(true)
                                            return
                                        }
                                        setShowUserPopup(prev => !prev)
                                        setShowPopup(false)
                                    }}
                                    className=' bg-gray-400 pl-2 rounded-full flex items-center w-8 h-8 text-xl font-semibold bg-gray-800 text-white'>
                                    {userData?.name.slice(0, 1).toUpperCase()}
                                </motion.button>

                                {showUserPopup &&
                                    <div className='absolute top-10 bg-white px-2 rounded-xl mt-3 py-3 shadow-md w-[200px] right-[-1px] flex flex-col gap-2 '>
                                        <h3 className='text-l px-7'>{userData?.name || null}</h3>
                                        <button
                                            onClick={() => navigate("/interviewHistory")}
                                            className='bg-gray-800 mx-6  py-1 rounded-xl text-sm text-white mt-1'>Interview History</button>
                                        <button onClick={handleLogout}
                                            className='text-red-600 mt-1 flex mx-8 items-center gap-1'>
                                            <TbLogout />
                                            Logout</button>
                                    </div>}
                            </div>
                        </div>
                    </div>


                </motion.div>
            </div>

            {showAuthPopup && <Authmodel onClose={() => setShowAuthpopup(false)} />}
        </>
    )
}

export default Navbar