import React, { useEffect } from "react";
import axios from 'axios'; // Import axios
import { AUTH_SERVICE_BASE, AUTH_SERVICE_LOGOUT } from "./ConfigApi";
import { refreshToken } from "./TokenHandler";
import { showDynamicSweetAlert } from "../toast/Swal";

const { token } = require('../config/Constants');

function SessionTimeout() {
  let timeout; // Declare the timeout variable outside of useEffect

//   const logoutUser = async () => {
//     try {
//     // Menggunakan Axios untuk melakukan permintaan POST ke API logout
//     const response = await axios.post(`${AUTH_SERVICE_LOGOUT}`, {
//       // Jika Anda memerlukan data tambahan untuk logout, tambahkan di sini
//       userId: sessionStorage.getItem('userId')
//     });
//     showDynamicSweetAlert('Success!', 'Logout Successfully.', 'success');
//     // Cek status respons untuk menentukan apakah logout berhasil
//     console.log(response.status);
//     if (response.status === 200) {
//       sessionStorage.clear();
//     }

//     console.log('Response:', response);
//   } catch (error) {
//     console.error('Error:', error);
//     // Handle error jika permintaan logout gagal
//   }
// };

  // Function to reset the session timeout
  const resetTimeout =  () => {
    clearTimeout(timeout); // Clear the previous timeout
    timeout = setTimeout(() => {
      try {
        // Menggunakan Axios untuk melakukan permintaan POST ke API logout
        const headers = { Authorization: `Bearer ${token}` };
        const response = axios.post(`${AUTH_SERVICE_LOGOUT}`,{
          // Jika Anda memerlukan data tambahan untuk logout, tambahkan di sini
          userId: sessionStorage.getItem('userId')
        },{ headers });
  
        console.log('Response:', response);
      } catch (error) {
        console.error('Error:', error);
        // Handle error jika permintaan logout gagal
      }
      sessionStorage.clear();
      console.log("timeout called");
      window.location.href = '/login';
    }, 900000); // Set the timeout again for 15 minutes
  };

  
  useEffect(() => {
    // Set the initial timeout when the component mounts
    refreshToken();
    resetTimeout();

    // Attach event listeners to relevant DOM elements for user activity
    const activityEvents = ['click', 'keydown', 'mousemove', 'scroll'];
    const resetOnActivity = () => resetTimeout();
    activityEvents.forEach((event) => {
      document.addEventListener(event, resetOnActivity);
      
    });

    // Clear the event listeners when the component is unmounted
    return () => {
      clearTimeout(timeout);
      activityEvents.forEach((event) => {
        document.removeEventListener(event, resetOnActivity);
      });
    };
  }, []);

  return null; // This component doesn't render anything, it's just for handling the timeout logic
}

export default SessionTimeout;
