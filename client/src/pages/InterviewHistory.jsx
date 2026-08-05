import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axios'
import { FaArrowLeft } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { motion, scale } from "motion/react"
function InterviewHistory() {
    const [interviews, setinterview] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        const getinterview = async () => {
            try {
                const result = await axiosInstance.get("/api/interview/get-interview")
                console.log(result.data)
                setinterview(result.data.interview)
            }
            catch (error) {
                console.log(error)
                setinterview([])
            }
        }
        getinterview()
    }, [])
    return (
        <div className='min-h-screen w-full'>
            <div className='w-[90vw] md:w-[80vw] max-w-full mt-5 bg-white  mx-auto py-3 px-3'>
                <div className='flex items-center px-3 py-2 gap-4'>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className='flex justify-center items-center bg-gray-200 w-10 h-10 rounded-full cursor-pointer '
                        onClick={() => navigate("/")}
                    >
                        <FaArrowLeft size={18} />
                    </motion.button>
                    <div>
                        <h2 className='text-xl font-semibold leading-tight'>Interview History</h2>
                        <p>Track your past Interviews and performance reports</p>
                    </div>
                </div>

                {interviews.length === 0 ? <div className='flex justify-center px-4 py-4 w-[80vw] mt-5 md:w-[70vw] bg-gray-100  rounded-2xl  mx-auto'>
                    <p>No Interview found.Start your first Inteview</p>
                </div> :
                    <div className='grid gap-3'>
                        {interviews.map((item, index) => (
                            <div
                                onClick={() => navigate(`/report/${item._id}`)}
                                key={index} className='px-4 py-4 w-[80vw] mt-5 md:w-[70vw] bg-gray-100  rounded-2xl  mx-auto hover:shadow-xl transition-all cursor-pointer'>
                                <div className='flex flex-col md:flex-row w-full px-3'>
                                    <div className="md:w-[50vw]">
                                        <h4 className='text-xl font-semibold'>{item.role}</h4>
                                        <p className='text-s whitespace-pre-wrap mt-2'>{item.experience}.{item.mode}</p>
                                        <p className='mt-2 '>{new Date(item.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className=' flex-col mt-3 md:mt-1 md:mx-auto'>
                                        <div className='flex flex-col justify-center'>
                                            <p className='mb-1 font-medium text-[20px] whitespace-nowrap'>Overall Score</p>
                                            <p className='mb-2 ml-1 text-start font-medium text-[20px] text-emerald-800'>{item.finalScore || 0}/10</p>
                                        </div>

                                        <span className={`px-2 py-1 rounded-xl ${item.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-800"}`}>{item.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}

export default InterviewHistory