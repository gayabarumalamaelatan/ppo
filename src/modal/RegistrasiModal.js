import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AUTH_SERVICE_CHECK_USER, USER_SERVICE_ADD_USER, USER_SERVICE_BRANCH_LIST, USER_SERVICE_GROUP_LIST } from '../config/ConfigApi';
import { showSuccessToast, showErrorToast } from '../toast/toast';

import { hasMinimumLength, hasNumber, hasUppercaseLetter, hasSpecialCharacter } from '../config/PasswordRules';
import { showDynamicSweetAlert } from '../toast/Swal';
import { Button, Modal } from 'react-bootstrap';
import ReactSelect from 'react-select';

const { userLoggin, getToken, getBranch } = require('../config/Constants');

const RegisterModal = ({ show, handleClose, reloadData }) => {
  const token = getToken();
  const branchId = getBranch();
  const [isLoading, setIsLoading] = useState(false);
  const headers = { Authorization: `Bearer ${token}` };
  const [branchOptions, setBranchOptions] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const initialUserData = {
    userName: '',
    password: '',
    confirmPassword: '',
    createdBy: userLoggin,
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    group: '',
    authenticationMethod: '',
  };

  const [userData, setUserData] = useState(initialUserData);
  const [validationErrors, setValidationErrors] = useState({});
  const [groupList, setGroupList] = useState([]);


  useEffect(() => {
    // Fetch the list of groups from the API
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${USER_SERVICE_GROUP_LIST}?branch=${branchId}`, { headers });
        setGroupList(response.data);
        console.log(groupList); // Assuming the API response directly provides the list of groups
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prevData) => ({ ...prevData, [name]: value }));

    // Reset validation error for the changed input
    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    console.log('Password Length:', userData.password.length); // Add this line for debugging

    if (userData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (userData.password !== userData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    // Password validation: At least 1 uppercase letter
    if (!hasUppercaseLetter(userData.password)) {
      errors.password = 'Password must contain alphabets, numbers, at least 1 uppercase letter, and at least 1 special character (~ ! @ $).';
    }

    // Password validation: Combination of numbers
    if (!hasNumber(userData.password)) {
      errors.password = 'Password must contain alphabets, numbers, at least 1 uppercase letter, and at least 1 special character (~ ! @ $).';
    }

    // Password validation: At least 1 special character
    if (!hasSpecialCharacter(userData.password)) {
      errors.password = 'Password must contain alphabets, numbers, at least 1 uppercase letter, and at least 1 special character (~ ! @ $).';
    }

    // Validasi form username
    if (userData.userName.trim() === '') {
      errors.userName = 'Username is required.';
    } else {
      // Hit the API to check if the username is available
      try {
        const response = await axios.get(`${AUTH_SERVICE_CHECK_USER}?username=${userData.userName}`, { headers });

        if (response.data.status === false) {
          errors.userName = 'Username has been used.';
        }
      } catch (error) {
        console.error('Error checking username availability:', error);
        // Tampilkan toast error jika terjadi kesalahan pada pengecekan username
        showErrorToast('Error checking username availability. Please try again later.');
        return;
      }
    }


    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const postData = {
      userName: userData.userName,
      password: userData.password,
      createdBy: userData.createdBy,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      groupId: parseInt(userData.group, 10),
      authBy: userData.authenticationMethod,
      branchId: selectedBranch ? selectedBranch.value : null
    };
    try {
      setIsLoading(true);
      // Kirim permintaan POST ke API
      //console.log('POST DATA', postData);
      const response = await axios.post(`${USER_SERVICE_ADD_USER}`, postData, { headers });
      console.log('API Response:', response.data);


      
      setTimeout(() => {
        setUserData(initialUserData);
        setIsLoading(false);
        showDynamicSweetAlert('Success!', 'Registration Successfully.', 'success');
        //showSuccessToast('Registration successful!');
        reloadData();
        handleClose();
      }, 1000);

    } catch (error) {
      setTimeout(() => {
        console.error('Error registering member:', error);;
        setIsLoading(false);
        // Tambahkan logika lain sesuai dengan kebutuhan Anda untuk menangani kesalahan
        showDynamicSweetAlert('Error!', 'An error occurred. Please try again later.', 'error');
        //showErrorToast('An error occurred. Please try again later.');

      }, 1000);


    }
  };

  const handleModalClose = () => {
    // Tutup modal dan reset form ke nilai awal
    handleClose();
    setUserData(initialUserData);
  };

  const handleReset = () => {
    setUserData(initialUserData);
  }

  const fetchBranchData = async () => {
    try {
      const response = await axios.get(USER_SERVICE_BRANCH_LIST, { headers });
      const branches = response.data.map(branch => ({
        value: branch.id,
        label: branch.branchName
      }));
      setBranchOptions(branches);
    } catch (error) {
      console.error('Error fetching branch data:', error);
      // Handle error
    }
  };
  useEffect(() => {
    fetchBranchData();
  }, []);

  return (

    <Modal show={show} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Registration User</Modal.Title>
      </Modal.Header>
      {isLoading && (
        <div className="full-screen-overlay">
          <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>User Name</label>
                <input
                  type="text"
                  className={`form-control ${validationErrors.userName ? 'is-invalid' : ''}`}
                  name="userName"
                  value={userData.userName}
                  onChange={handleChange}
                  required
                />
                {validationErrors.userName && <div className="invalid-feedback">{validationErrors.userName}</div>}
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  required
                />
                {validationErrors.password && <div className="invalid-feedback">{validationErrors.password}</div>}
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {validationErrors.confirmPassword && <div className="invalid-feedback">{validationErrors.confirmPassword}</div>}
              </div>
              <div className="form-group">
                <label>Authentication Method</label>
                <select
                  className="form-control"
                  name="authenticationMethod"
                  value={userData.authenticationMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select an Authentication Method</option>
                  <option value="DIRECT">DIRECT</option>
                  <option value="LDAP">LDAP</option>
                </select>
              </div>
              <div className="form-group">
                <label>User Group</label>
                <select
                  className={`form-control ${validationErrors.group ? 'is-invalid' : ''}`}
                  name="group"
                  value={userData.group}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select a group</option>
                  {Array.isArray(groupList) && groupList.length > 0 ? (
                    groupList.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.groupName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No groups available</option>
                  )}
                </select>
                {validationErrors.group && <div className="invalid-feedback">{validationErrors.group}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="selectBranch">Select Branch:</label>
                <ReactSelect
                  id="selectBranch"
                  options={branchOptions}
                  value={selectedBranch}
                  onChange={(selectedOption) => setSelectedBranch(selectedOption)}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="default" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit" className="btn btn-primary">
            Send To Approval
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default RegisterModal;
