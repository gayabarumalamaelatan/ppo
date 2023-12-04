import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios'; // Import axios
import { AUTH_SERVICE_LOGIN } from '../config/ConfigApi';
import { active, expired, expiredPass } from '../config/Constants';


function LoginPage() {
  const [userId, setUserId] = useState('');
  const [userPass, setUserPass] = useState('');
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();
  const [hashedPassword, setHashedPassword] = useState('');


  useEffect(() => {
    // Check if the session is still active when the LoginPage component is rendered
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/Dashboard');
    }
  }, [navigate]);

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
      
      if (response.status === 200 && response.data.status === active) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userId', response.data.userName);
        sessionStorage.setItem('accessToken',response.data.accessToken);
        sessionStorage.setItem('id', response.data.id);
        navigate('/');
      } else if (response.status === 200 && response.data.status === expiredPass) {
        sessionStorage.setItem('accessToken',response.data.accessToken);
        sessionStorage.setItem('id', response.data.id);
        window.location.href = '/reset';
      } else {
        setLoginError(true); // Set login error state to true
        
      }
    } catch (error) {
      console.error('Error:', error);
      setLoginError(true); // Set login error state to true in case of an error
    }
  };

  // Function to reset the error message when the user tries to log in again
  const handleResetError = () => {
    setLoginError(false);
  };

  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        {loginError && ( // Conditionally render the alert if loginError is true
          <div className="alert alert-danger" role="alert">
            Invalid userId or password.
          </div>
        )}
        <div className="card card-outline card-primary">
          <div className="card-body">
            <p className="login-box-msg">Welcome Back!</p>
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
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={userPass}
                  onChange={(e) => setUserPass(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
              </div>
              <hr></hr>
              <div className="row">
                <div className="col-8">
                </div>
               
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign In
                  </button>
                </div>
                <hr></hr>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
