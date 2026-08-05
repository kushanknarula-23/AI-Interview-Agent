import React from 'react'
import { useState } from 'react'
import Step1Setup from '../components/Step1Setup'
import Step2interview from '../components/Step2interview'
import Step3report from '../components/Step3report'
function Interviewpage() {
    const[step,setStep] = useState(1)
    const [interviewData,setInterviewData] = useState(null)
  return (
    <div className='max-h-screen '>
        {step === 1 && (<Step1Setup onstart={(data)=>{setInterviewData(data)
            setStep(2)
        }}/>)}
        {step === 2 && interviewData && (<Step2interview interviewData={interviewData} onFinish={(report)=>{setInterviewData(report)
            setStep(3)
        }}/>)}
        {step === 3 && (<Step3report report={interviewData} />)}
    </div>
  )
}

export default Interviewpage