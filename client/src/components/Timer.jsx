import React from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
function Timer({timeleft,totaltime}) {
    const percentage = (timeleft/totaltime)*100
  return (
    <div className='w-20 h-20'>
        <CircularProgressbar 
        value={percentage} text={`${timeleft}s`}
        />
    </div>
  )
}

export default Timer