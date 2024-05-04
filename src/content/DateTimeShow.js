import React, { useEffect, useState } from 'react'

const DateTimeShow = () => {
    const [time, setTime] = useState(new Date())

    useEffect(()=>{
        setInterval(()=>setTime(new Date()), 1000)
    },[])

    return (
        <>
            {time.toLocaleTimeString()}
        </>
    )
}

export default DateTimeShow;