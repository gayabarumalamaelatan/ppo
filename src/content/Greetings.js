import React from 'react'

const Greetings = () => {
  const currentHour = new Date().getHours();
  let greeting;
  // const greeting = currentHour < 12 ? "Good Morning!" : "Good Evening!";
  if (currentHour < 12) {
    greeting = "Good Morning!";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon!";
  } else {
    greeting = "Good Evening!";
  }

  return (
    <h2 style={{fontWeight: "700"}}>{greeting}</h2>
  )
}

export default Greetings
