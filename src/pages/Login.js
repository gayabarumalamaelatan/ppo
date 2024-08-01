import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios'; // Import axios
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_SERVICE_LOGIN, LICENSE_SERVICE_CHECK } from '../config/ConfigApi';
import { active, expiredPass, getToken, pendingDelete } from '../config/Constants';
import '../css/designDigitalSign.css';
//import '../css/designMestika.css';
import { showDynamicSweetAlert } from '../toast/Swal';
import Greetings from '../content/Greetings';
import { event } from 'jquery';


function LoginPage() {
  const [userId, setUserId] = useState('');
  const [userPass, setUserPass] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const navigate = useNavigate();
  const [hashedPassword, setHashedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    // Check if the session is still active when the LoginPage component is rendered
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/');
    }
  }, [navigate]);


  const checkLicense = async () => {
    try {
      const response = await axios.get(`${LICENSE_SERVICE_CHECK}`);

      const remainingDaysString = response.data.remainingDays;
      const expiryDate = response.data.expiryDate;

      if (remainingDaysString) {
        // Extract numeric value from the remaining days string
        const remainingDays = parseInt(remainingDaysString);

        console.log(`Remaining days: ${remainingDays}`);
        console.log(`Expiry date: ${expiryDate}`);

        // Check if remaining days are less than 30 for a warning
        const daysThreshold = 30;
        if (remainingDays < daysThreshold) {
          const alertMessage = `License will expire soon. Remaining days: ${remainingDays}. Renew it as soon as possible!`;
          showDynamicSweetAlert('Warning', alertMessage, 'warning');
          console.warn("Warning: License will expire soon. Renew it as soon as possible!");
        }
      } else {
        console.log("No license information found.");
        showDynamicSweetAlert('Success!', 'No license information found', 'success');
      }
    } catch (error) {
      console.error("Error fetching license data:", error);
    }



  }
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${AUTH_SERVICE_LOGIN}`, {
        userName: userId,
        userPass: userPass,
      },
        {
          timeout: 15000, // Set the timeout to 15000 milliseconds (15 seconds)
        }
      );
      console.log(response);
      if (response.status === 200 && response.data.status === active) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userId', response.data.userName);
        sessionStorage.setItem('accessToken', response.data.accessToken);
        sessionStorage.setItem('id', response.data.id);
        sessionStorage.setItem('branch', response.data.branchId);
        checkLicense();
        navigate('/');
      } else if (response.status === 200 && response.data.status === expiredPass) {
        sessionStorage.setItem('accessToken', response.data.accessToken);
        sessionStorage.setItem('id', response.data.id);
        window.location.href = '/reset';
      } else if (response.status === 200 && response.data.status === pendingDelete) {
        setLoginError(true);
        setLoginErrorMessage('User is disabled, Please contact administrator');
      } else {
        console.log('Invalid userId or password.');
        setLoginError(true);
        setLoginErrorMessage('Invalid username or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response && error.response.status === 403) {
        // Handling 403 status code
        console.error('Error 403 - Forbidden:', error.response.data);
        let errorMessage = 'License expired! Please contact your administrator';

        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        if (error.response.data.message === 'The password you have provided is not correct') {
          errorMessage = 'Invalid userId or password.';
          setLoginError(true);
          setLoginErrorMessage(errorMessage);
        } else {
          showDynamicSweetAlert('Error', errorMessage, 'error');
        }
        
      } else if (error.response && error.response.status === 423) {
        // Handling 423 status code
        setLoginError(true);
        console.log('License is locked:', error.response.data.message);
        setLoginErrorMessage('User is locked. Please contact your administrator');
        // showDynamicSweetAlert('Warning', error.response.data.message, 'warning');
      } else {
        setLoginError(true);
        setLoginErrorMessage('An error occurred during login.');
      }

    }
  };


  // Function to reset the error message when the user tries to log in again
  const handleResetError = () => {
    setLoginError(false);
  };

  return (
   <div className='con'>
    <div className="lgn row">
      
      <div className="col-lg-5 col-md-5 lgn">
        <div className='login-box'>
          {loginError && ( // Conditionally render the alert if loginError is true
            <div className="alert alert-danger" role="alert">
              {loginErrorMessage}
            </div>
          )}
          
              <p className="login-box-msg text-start"><Greetings/></p>
              <form onSubmit={handleLogin}>
                <div className="input-group mb-3">
                  <input
                    type="input"
                    className="form-control"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fa-solid fa-user"></span>
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Password"
                    value={userPass}
                    onChange={(e) => setUserPass(e.target.value)}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span
                        className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: 'pointer' }}
                      ></span>
                    </div>
                  </div>
                </div>
                <hr></hr>


                  
                    <button type="submit" className="btn btn-primary btn-block">
                      Log in
                    </button>
                  
                  <hr></hr>
                
              </form>
            </div>
         
            </div>
            <div className='col-6 image-container'></div>
      </div>
    </div>

    
  
  );
}

export default LoginPage;
