import React from 'react'
import Navbar from '../components/Navbar'
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Authmodel from "../components/Authmodel.jsx"
import { useNavigate } from 'react-router-dom';
import { BsMic, BsRobot, BsClock, BsFileEarmarkText, BsBarChart } from "react-icons/bs";
import credit from "../assets/credit.png"
import history from "../assets/history.png"
import aians from "../assets/ai-ans.png"
import confi from "../assets/confi.png"
import hr from "../assets/hr.png"
// import mm from "../assets/mm.png"
import pdf from "../assets/pdf.png"
import resume from "../assets/resume.png"
import tech from "../assets/tech.png"
import Footer from '../components/Footer.jsx';
function Home() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const [showAuthPopup, setShowAuthpopup] = useState(false)
  return (
    <>
      <Navbar />
      <div className='flex flex-col items-center justify-center gap-2'>
        <div className='flex gap-2 items-center justify-center mt-6'>
          <IoSparkles size={18} className='text-green-400 ' />
          <span className='text-xl font-semibold'>AI powered Smart interview platform</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='flex items-center justify-center'>
          <span className='flex flex-col items-center'>
            <span className='text-3xl font-semibold mt-2'>Practice Interview with</span>
            <span className='text-green-500 text-3xl mt-4 bg-emerald-100 px-3 py-1 rounded-xl font-semibold'>AI Intelligence</span>
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          className='mt-1'
        >
          <span className='pl-2 text-md' >Role-based Mock interviews with smart follow-ups,</span>
          <br />
          <span className='text-l'>adaptive difficulty and real-time performane evaluation</span>
        </motion.p>

        <div className='flex items-center justify-center gap-4 mt-2'>
          <motion.button
            onClick={() => {
              if (!userData) {
                setShowAuthpopup(true)
                return
              }
              navigate("/interview")
            }}
            whileHover={{ opacity: 0.9, scale: 1.05 }}
            whileTap={{ opacity: 1, scale: 0.9 }}
            className='bg-black px-3 text-white py-1 rounded-xl'>Start Interview</motion.button>
          <motion.button
            onClick={() => {
              if (!userData) {
                setShowAuthpopup(true)
                return
              }
              navigate("/history")
            }}
            whileHover={{ opacity: 0.9, scale: 1.05 }}
            whileTap={{ opacity: 1, scale: 0.9 }}
            className='px-3 text-black py-1 rounded-xl border-1'>View history</motion.button>
        </div>
      </div>

      <div className='flex flex-col items-center mt-16 mb-10 px-6'>
      
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-2xl font-bold text-gray-900 mb-10 text-center'
        >
          Three steps to your dream job
        </motion.h2>

        <div className='flex flex-col md:flex-row items-stretch justify-center gap-6'>
          {[
            {
              icon: <BsRobot size={22} />,
              step: "Step 1",
              title: "Role & Experience Selection",
              description: "AI adjusts difficulty based on your selected role and years of experience.",
              color: "from-emerald-50 to-green-100",
              border: "border-emerald-200",
              iconBg: "bg-emerald-100 text-emerald-600",
              rotate: "rotate-[-2deg]",
            },
            {
              icon: <BsMic size={22} />,
              step: "Step 2",
              title: "Smart Voice Interview",
              description: "Dynamic follow-up questions based on your answers and resume.",
              color: "from-sky-50 to-blue-100",
              border: "border-sky-200",
              iconBg: "bg-sky-100 text-sky-600",
              rotate: "rotate-[0deg]",
            },
            {
              icon: <BsClock size={22} />,
              step: "Step 3",
              title: "Timer-Based Evaluation",
              description: "Real-world interview pressure with time tracking and instant AI feedback.",
              color: "from-violet-50 to-purple-100",
              border: "border-violet-200",
              iconBg: "bg-violet-100 text-violet-600",
              rotate: "rotate-[2deg]",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 + index * 0.15 }}
              whileHover={{ rotate: 0, scale: 1.04}}
              className={`${item.rotate} bg-gradient-to-br ${item.color} border-2 ${item.border} rounded-2xl p-6 w-72 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col gap-3 cursor-default`}
            >
              {/* Step badge */}
              <span className='text-xs font-bold text-gray-400 tracking-widest uppercase'>
                {item.step}
              </span>

              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.iconBg} shadow-sm`}>
                {item.icon}
              </div>

              {/* Title */}
              <h3 className='text-base font-bold text-gray-900 leading-snug'>
                {item.title}
              </h3>

              {/* Description */}
              <p className='text-sm text-gray-500 leading-relaxed'>
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className='mt-22'>
          <motion.h2
          initial={{opacity:0 , y:40}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.6}}
          whileHover={{scale:1.02}}
          className='text-3xl font-semibold tracking-tight'
          >
            Advanced AI{"   "}
            <span className='text-3xl text-green-600'>Capabilities</span>
          </motion.h2>
        </div>
      </div>
      
      <div className='grid md:grid-cols-2 gap-10 ml-15 mr-15 md:ml-30 md:mr-30'>
        {
          [
            {
              image:aians,
              icon:<BsBarChart size={20}/>,
              title:"AI answer evaluation",
              desc:"Scores communication ,technical accuracy and confidence"
            },
            {
              image:resume,
              icon:<BsFileEarmarkText size={20}/>,
              title:"Resume based Interview",
              desc:"Project specific question based on the Resume"
            },
            {
              image:pdf,
              icon:<BsFileEarmarkText size={20}/>,
              title:"Downloadable pdf Report",
              desc:"Detailed strengths , weaknessess and improvement insights"
            },
            {
              image:history,
              icon:<BsBarChart size={20}/>,
              title:"History and Analytics",
              desc:"Track progress with performance graps and topic analysis"
            }
          ].map((item,index)=>{
            return <motion.div key={index}
            initial={{opacity:0,y:30}}
            whileInView={{opacity:1 , y:0}}
            whileHover={{scale:1.04}}
            className='bg-white border border-gray-500 shadow-xl hover-shadow-2xl p-8 rounded-2xl '>
              <div className='flex flex-col md:flex-row items-center gap-1'>
                <div className='w-full md:w-[1/2] flex justify-center'>
                  <img className="w-full object-contain h-40" src={item.image} alt={item.title}></img>
                </div>
                <div className='flex flex-col justify-center'>
                    <span className='bg-emerald-100 text-green-700 px-2 py-2 w-[40px] rounded-l'>{item.icon}</span>
                    <h3 className='mt-3 text-xl font-semibold'>{item.title}</h3>
                    <p className='text-md mt-2 font-'>{item.desc}</p>
                </div>
              </div>
            </motion.div>
          })
        }
      </div>
      <div className='mb-15 mt-20 px-[15%] md:px-[35%] text-xl'>
          <motion.h2
          initial={{opacity:0 , y:40}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.6}}
          whileHover={{scale:1.02}}
          className='text-3xl font-semibold tracking-tight whitespace-nowrap'
          >
            Multiple Interview{"   "}
            <span className='text-3xl text-green-600'>Modes</span>
          </motion.h2>
      </div>

      <div className='grid md:grid-cols-2 gap-10 ml-15 mr-15 md:ml-30 md:mr-30'>
        {
          [
            {
              image:hr,
              icon:<BsBarChart size={20}/>,
              title:"HR Interview mode",
              desc:"Behavioral and communication based evaluation"
            },
            {
              image:tech,
              icon:<BsFileEarmarkText size={20}/>,
              title:"Technical Mode",
              desc:"Deep technical questioning based on the selected role"
            },
            {
              image:confi,
              icon:<BsFileEarmarkText size={20}/>,
              title:"Confidence detection",
              desc:"Basic tone and voice analysis insights"
            },
            {
              image:credit,
              icon:<BsBarChart size={20}/>,
              title:"credit System",
              desc:"Unlock premium interview sessions"
            }
          ].map((item,index)=>{
            return <motion.div key={index}
            initial={{opacity:0,y:30}}
            whileInView={{opacity:1 , y:0}}
            whileHover={{scale:1.04}}
            className='bg-white border border-gray-500 shadow-xl hover-shadow-2xl px-4 py-1 rounded-2xl '>
              <div className='w-full flex flex-col md:flex-row'>
                <div className='w-[1/2] flex flex-col justify-center'> 
                    <h3 className='mt-1 text-xl font-semibold'>{item.title}</h3>
                    <p className='text-md mt-1 font-'>{item.desc}</p>
                </div>
                <div className='w-[1/2] flex justify-center'>
                  <img className="w-full object-contain h-40" src={item.image} alt={item.title}></img>
                </div>
              </div>
            </motion.div>
          })
        }

        
      </div>
      <Footer />
      
      

      {showAuthPopup && <Authmodel onClose={() => setShowAuthpopup(false)} />}
    </>
  )
}

export default Home
