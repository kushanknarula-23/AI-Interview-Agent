import React from 'react'
import { BsRobot } from 'react-icons/bs'
import{motion} from "motion/react"
function Footer() {
  return (
    <motion.div 
    whileHover={{scale:1.02}}
    className='bg-white flex items-center justify-center mt-15'>
        <div
        className='w-full rounded-2xl bg-white shadow-xl hover:shadow-2xl px-8 py-2 border border-gray-400 mx-8 md:mx-28 mb-10'>
            <div className='flex items-center justify-center gap-2 mt-3'>
                <div className=''><BsRobot size={22}/></div>
                <h2 className='text-xl font-bold' >Interview.IQ</h2>
            </div>
            <p className='text-center mt-2 mb-4'>AI powered interview platform designed to improve communication skills , techincal depth and professional confidence</p>
        </div>
    </motion.div>
  )
}

export default Footer