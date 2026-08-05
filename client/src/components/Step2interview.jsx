import React, { useEffect, useRef, useState } from 'react'
import { motion } from "motion/react"
import maleVideo from "../assets/videos/male-ai.mp4"
import femaleVideo from "../assets/videos/female-ai.mp4"
import Timer from './Timer'
import axiosInstance from '../api/axios'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa6'
function Step2interview({ interviewData, onFinish }) {
  const[isTimeup,setIstimeup] = useState(false)
  const { interviewId, name, question } = interviewData || {}
  const questions = question || []
  const [isintrophase, setIntrophase] = useState(true)
  const [isMicon, setMicon] = useState(false)
  const recoginitionref = useRef(null)
  const [isAiplaying, setaiplaying] = useState(false)
  const [currentindex, setCurrentindex] = useState(0)
  const [answer, setanswer] = useState("")
  const [feedback, setfeedback] = useState("")
  const [timeleft, settimeleft] = useState(questions[0]?.timelimit || 60)
  const [selectedvoice, setselectedvoice] = useState(null)
  const [isSubmitting, setisSubmitting] = useState(false)
  const [voicegender, setVoicegender] = useState("female")
  // const [subtitle, setSubtitle] = useState("")
  const videoref = useRef(null)
  const currentQuestion = questions[currentindex]

  useEffect(() => {
    const loadVoice = () => {
      const voice = window.speechSynthesis.getVoices()
      if (!voice.length) return

      const femaleVoice = voice.find(v => v.name.toLowerCase().includes("zira") || v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("samantha"))
      if (femaleVoice) {
        setselectedvoice(femaleVoice)
        setVoicegender("female")
        return
      }

      const maleVoice = voice.find(v => v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("david") || v.name.toLowerCase().includes("mark"))
      if (maleVoice) {
        setVoicegender("male")
        setselectedvoice(maleVoice)
        return
      }

      setselectedvoice(voice[0])
      setVoicegender("female")
    }

    loadVoice()
    window.speechSynthesis.onvoiceschanged = loadVoice

    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])  // ← runs only once on mount


  const speaktext = (text) => {
    return new Promise((resolve) => {
      const humanText = text.replace(/,/g, " ... ").replace(/\./g, " ... ")
      const utterance = new SpeechSynthesisUtterance(humanText)
      utterance.voice = selectedvoice
      utterance.rate = 0.92
      utterance.pitch = 1.05
      utterance.volume = 1

      utterance.onstart = () => {
        setaiplaying(true)
        stopMic()
        videoref.current?.play()
      }

      utterance.onend = () => {
        videoref.current?.pause()
        if (videoref.current) videoref.current.currentTime = 0
        setaiplaying(false)
        if (isMicon) {
          startMic()
        }
        resolve()   // ← Promise resolves here, AFTER speech finishes
      }

      utterance.onerror = () => resolve()  // resolve on error too so it doesn't hang

      window.speechSynthesis.speak(utterance)
    })
  }


  // convert text to voice 
  useEffect(() => {
    if (!selectedvoice) {
      return
    }
    const runIntro = async () => {
      await new Promise(r => setTimeout(r, 1000))
      if (isintrophase) {
        await speaktext(`Hi ${name} ,It's great to meet you today.i hope your'e feeling confident and ready`)
        await speaktext(`I'll ask your a few questions.Just answer it naturally,and take your time.Let's begin`)
        setIntrophase(false)
      }
      else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 1000))
        if (currentQuestion === question.length - 1) {
          await speaktext("alright,this one might be a bit more challenging")
        }
        await speaktext(currentQuestion.question)
        if (isMicon) {
          startMic()
        }
      }
    }
    runIntro()
  }, [selectedvoice, isintrophase, currentindex])

  // for the timer 
  useEffect(() => {
    if (isintrophase) return;
    if (!currentQuestion) return;
    if (isSubmitting) return;
    if (feedback) return; // Do not run timer while feedback is being shown

    // Reset clock to this question's time limit
    settimeleft(currentQuestion?.timelimit || 60)

    const interval = setInterval(() => {
      settimeleft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentQuestion, isintrophase, isSubmitting, feedback])

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return
    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = "en-US";
    recognition.continuous = true
    recognition.interimResults = false
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
      setanswer((prev) => prev + " " + transcript)
    }
    recoginitionref.current = recognition
  }, [])


  const startMic = () => {
    if (recoginitionref.current && !isAiplaying) {
      try {
        recoginitionref.current.start()   
      } catch (error) {
        console.log(error)
      }
    }
  }

  const stopMic = () => {
    if (recoginitionref.current) {        
      recoginitionref.current.stop()
    }
  }

  const toggleMic = () => {
    if (isMicon) {
      stopMic()
    } else {
      startMic()
    }
    setMicon(!isMicon)
  }

  const submitAnswer = async () => {
    if (isSubmitting) return
    stopMic()
    setisSubmitting(true)
    // settimeleft(0)
    try {
      const result = await axiosInstance.post("/api/interview/submit-answer", {  // fixed: .post() + URL typo
        interviewid: interviewId,
        questionIndex: currentindex,
        answer,
        timetaken: currentQuestion.timelimit - timeleft
      })

      setfeedback(result.data.feedback)
      speaktext(result.data.feedback)
      setisSubmitting(false)
    }
    catch (error) {
      console.log(error)
      setisSubmitting(false)
    }
  }

  const handleNextbutton = () => {
    setanswer("")
    setfeedback("")
    setIstimeup(false)

    if (currentindex + 1 >= question.length) {
      FinishInterview()
      return
    }
    setCurrentindex(currentindex + 1)
  }

  const FinishInterview = async () => {
    try {
      console.log("FinishInterview called with interviewId:", interviewId)
      if (!interviewId) {
        console.error("Error: interviewId is undefined in Step2interview!", interviewData)
        return
      }
      const result = await axiosInstance.post("/api/interview/finish-interview", { interviewId })
      console.log("FinishInterview API success payload:", result.data)
      onFinish(result.data)
    }
    catch (error) {
      console.error("FinishInterview API failed:", error)
    }
  }

  useEffect(() => {
    if (isintrophase) return
    if (!currentQuestion) return
    if (timeleft === 0 && !isSubmitting && !feedback) {
      submitAnswer()
    }
  }, [timeleft])

  useEffect(() => {
    return () => {
      if (recoginitionref.current) {
        recoginitionref.current.stop()
        recoginitionref.current.abort()
      }

      window.speechSynthesis.cancel()
    }
  }, [])

// if the time get up disable the text area 
useEffect(()=>{
  if(timeleft === 0){
    setIstimeup(true)
  }
},[timeleft])

  const videoSource = voicegender === "male" ? maleVideo : femaleVideo
  return (
    <div className='w-full max-h-screen bg-white flex items-center justify-center md:px-20 md:py-6'>
      <div className='bg-white  w-full min-h-screen px-2 py-10 md:px-8 md:pt-8'>
        <div className='w-full md:max-h-[90vh] h-screen bg-white rounded-2xl shadow-2xl px-5 py-3 flex flex-col md:flex-row overflow-auto'>
          <div className='w-full md:w-[95%] md:border-r border-dashed'>
            <div className='w-full md:w-[95%] shadow-2xl py-1'>
              <video src={videoSource}
                key={videoSource}
                ref={videoref}
                muted
                playsInline
                preload='auto'
                className='object-cover w-full h-52'
              />
            </div>

            {/* timer area */}

            <div className='w-full md:w-[95%] mt-3 px-3 py-4  bg-white border border-gray-200 rounded-2xl '>
              <div className='flex items-center justify-between px-3 pb-2 '>
                <span className='text-xs font-semibold whitespace-nowrap' >Interview Status</span>
                {isAiplaying && <span className='text-xs whitespace-nowrap text-green-300'>{isAiplaying ? "AI speaking" : ""}</span>}
              </div>

              <div className='h-px bg-gray-200'></div>

              <div className='flex items-center justify-center py-4'>
                <Timer timeleft={timeleft} totaltime={currentQuestion?.timelimit || 60} />
              </div>

              <div className='h-px bg-gray-200'></div>

              <div className='grid grid-cols-2 gap-6 text-center'>
                <div>
                  <span className='text-xs md:text-xl '>{currentindex + 1}</span>
                  <span className='md:text-xl  tracking-tight whitespace-nowrap text-xs text-emerald-300 pl-1'>Current Question</span>
                </div>

                <div>
                  <span className='md:text-xl text-xs '>{question.length}</span>
                  <span className='md:text-xl tracking-tight whitespace-nowrap text-xs text-emerald-300 pl-1'>Total Question</span>
                </div>
              </div>
            </div>
          </div>

          <div className='flex-col mt-3 md:mx-5 w-full'>
            <h2 className='text-s md:text-2xl text-green-300 font-semibold leading-tight px-2'>AI Smart Interview</h2>
            {!isintrophase && <div className='bg-white mt-3 rounded-2xl border border-gray-200 px-4 py-4 shadow-2xl'>
              <h2 className='text-s tracking-tight leading-tight'>Question {currentindex + 1}  {" "}  of {question.length}</h2>
              <p className='pt-3'>{currentQuestion?.question}</p>
            </div>}
            <div className='w-full border border-gray-200 mt-3 rounded-2xl bg-white'>
              <textarea
                disabled={isTimeup}
                value={answer}
                onChange={(e) => setanswer(e.target.value)}
                className="px-3 py-3 w-full outline-none h-[28vh] md:h-[45vh] focus:ring-2 focus:ring-emerald-500 rounded-2xl"
                placeholder='Type your answer here or speak...'
              />
            </div>
            {!feedback ? (<div className='w-full mt-4'>
              <div className='flex items-center justify-between gap-2'>
                <div className='bg-black w-10 h-10 rounded-full flex px-4 items-center justify-center cursor-pointer'>
                  <motion.button
                    onClick={toggleMic}
                    whileTap={{ scale: 0.7 }}
                    className='text-white cursor-pointer
                    '>{isMicon ? (<FaMicrophone size={20} />) : (<FaMicrophoneSlash size={20} />)}</motion.button>
                </div>
                <div className='w-full flex items-center justify-center'>
                  <motion.button
                    onClick={submitAnswer}
                    disabled={isSubmitting}
                    whileTap={{ scale: 0.9 }}
                    className='bg-green-400 w-full rounded-full px-2 py-2 disabled:bg-gray-500 cursor-pointer'>
                    {isSubmitting ? "Submitting" : "Submit Answer"}
                  </motion.button>
                </div>
              </div>
            </div>) : (
              <div className='w-full mt-4'>
                <div className='flex flex-col justify-center items-center gap-2'>
                  <p className="text-black">{feedback}</p>
                  <motion.button onClick={handleNextbutton}
                    className='flex items-center justify-center px-2 py-1 bg-green-300 w-full rounded-2xl mt-1'>Next Question</motion.button>
                </div>
              </div>)}
          </div>


        </div>
      </div>
    </div>
  )
}

export default Step2interview