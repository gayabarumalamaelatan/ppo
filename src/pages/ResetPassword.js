import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios'; // Import axios
import { AUTH_SERVICE_CHANGE_PASSWORD, AUTH_SERVICE_RESET_PASSWORD } from '../config/ConfigApi';
import { idUser, token } from '../config/Constants';
import { showSuccessToast } from '../toast/toast';

function ResetPasswordPage() {
  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Add any necessary logic when component mounts
    if (!token) {
        navigate('/login'); // Redirect to login if token is not available
      }
  }, []);

  const handleResetPassword = async (event) => {
    event.preventDefault();

    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (newPassword !== confirmPassword) {
        setResetError(true); // Set reset error state to true
        return;
      }

      const response = await axios.put(`${AUTH_SERVICE_CHANGE_PASSWORD}`, {
        userId: idUser,
        newPassword: newPassword,
        confirmPassword: newPassword,
      },
      {headers},
      {
        timeout: 15000,
      });

      if (response.status === 200) {
        // Handle successful password reset, e.g., show a success message
        showSuccessToast('Reset password successfully. Please Login !');
        navigate('/login'); // Redirect to the login page after resetting
      } else {
        setResetError(true); // Set reset error state to true
      }
    } catch (error) {
      console.error('Error:', error);
      setResetError(true); // Set reset error state to true in case of an error
    }
  };

  // Function to reset the error message
  const handleResetError = () => {
    setResetError(false);
  };

  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        {resetError && (
          <div className="alert alert-danger" role="alert">
            Password reset failed. Please try again.
          </div>
        )}
        <div className="card card-outline card-primary">
          <div className="card-body">
            <p className="reset-password-box-msg">Reset Your Password</p>
            <form onSubmit={handleResetPassword}>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
              </div>
              <hr></hr>
              <div className="row">
                <div className="col-12">
                  <button type="submit" className="btn btn-primary btn-block">
                    Reset Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
