import React from 'react'

const Greetings = () => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning!" : "Good Evening!";

  return (
    <h2 style={{fontWeight: "600"}}>{greeting}</h2>
  )
}

export default Greetings
