import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../api/axios'
import Step3report from '../components/Step3report'
function InterviewReport() {
  const { id } = useParams()
  const [report, setReport] = useState()
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await axiosInstance.get(`/api/interview/report/${id}`)
        console.log(result.data)
        setReport(result.data)
      }
      catch (error) {
        console.log(error)
        setReport(null)
      }
    }
    fetchReport()
  }, [id])

  return (
    <div>
      <Step3report report={report} />
    </div>
  )
}

export default InterviewReport
