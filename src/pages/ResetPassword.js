import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios'; // Import axios
import { AUTH_SERVICE_CHANGE_PASSWORD, AUTH_SERVICE_RESET_PASSWORD } from '../config/ConfigApi';
import { getToken, idUser } from '../config/Constants';
import { showSuccessToast } from '../toast/toast';

// ... (previous imports)

function ResetPasswordPage() {
  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: true,
    message: '',
  });
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    // Add any necessary logic when the component mounts
    if (!token) {
      navigate('/login'); // Redirect to login if the token is not available
    }
  }, []);

  // Function to validate the password
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@$]).{8,}$/;

    if (password.length < 8) {
      return {
        isValid: false,
        message: 'Password must be at least 8 characters long.',
      };
    }

    if (regex.test(password)) {
      return { isValid: true, message: '' };
    } else {
      return {
        isValid: false,
        message:
          'Password must contain alphabets, numbers, at least 1 uppercase letter, and at least 1 special character (~ ! @ $).',
      };
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    const headers = { Authorization: `Bearer ${token}` };

    try {
      // Validate the new password
      const passwordValidationResult = validatePassword(newPassword);

      if (!passwordValidationResult.isValid) {
        setResetError(true);
        setPasswordValidation(passwordValidationResult);
        return;
      }

      // Check if the new password and confirm password match
      if (newPassword !== confirmPassword) {
        setResetError(true);
        setPasswordValidation({
          isValid: false,
          message: 'Passwords do not match.',
        });
        return;
      }

      // Call the API to reset the password
      const response = await axios.put(
        `${AUTH_SERVICE_CHANGE_PASSWORD}`,
        {
          userId: idUser,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
        { headers },
        {
          timeout: 15000,
        }
      );

      if (response.status === 200) {
        // Handle successful password reset, e.g., show a success message
        showSuccessToast('Reset password successfully. Please Login !');
        navigate('/login'); // Redirect to the login page after resetting
      } else {
        setResetError(true);
        setPasswordValidation({
          isValid: false,
          message: 'Password reset failed. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setResetError(true);
      setPasswordValidation({
        isValid: false,
        message: 'Password reset failed. Please try again.',
      });
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
            {passwordValidation.message || 'Password reset failed. Please try again.'}
          </div>
        )}
        <div className="card card-outline card-primary">
          <div className="card-body">
            <p className="reset-password-box-msg">Reset Your Password</p>
            <form onSubmit={handleResetPassword}>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className={`form-control ${passwordValidation.isValid ? '' : 'is-invalid'}`}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordValidation({ isValid: true, message: '' });
                  }}
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
                  className={`form-control ${passwordValidation.isValid ? '' : 'is-invalid'}`}
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
              {/* Display password validation error message */}
              {!passwordValidation.isValid && (
                <div className="invalid-feedback">{passwordValidation.message}</div>
              )}
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
