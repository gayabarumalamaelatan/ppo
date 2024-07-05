import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { AUTH_SERVICE_LOGOUT, FORM_SERVICE_LOAD_DATA } from '../config/ConfigApi';

const { getToken, getBranch } = require('../config/Constants');

export default function Nav() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [currentBusinessDate, setCurrentBusinessDate] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const navigate = useNavigate();
  const token = getToken();
  const branchId = getBranch();
  const userName = sessionStorage.getItem('userId'); // Assuming userName is stored in sessionStorage


  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // Fetch branch code from API
    const fetchBranchCode = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${FORM_SERVICE_LOAD_DATA}?t=core_branch&branchId=${branchId}&filterBy=id&filterValue=${branchId}&operation=EQUAL&viewOnly=YES`, { headers });
        const branchCodeFromResponse = response.data.data[0].BRANCH_CODE; // Ambil BRANCH_CODE dari data pertama
        setBranchCode(branchCodeFromResponse);
        console.log('Branch code:', branchCodeFromResponse);
      } catch (error) {
        console.error('Error fetching branch code:', error);
      }
    };

    fetchBranchCode();
  }, [branchId, branchCode]);

  useEffect(() => {
    if (branchCode) {
      // Fetch business date with branch code filter
      const fetchBusinessDate = async () => {
        try {
          const headers = { Authorization: `Bearer ${token}` };
          const response = await axios.get(`${FORM_SERVICE_LOAD_DATA}?f=BRD&branchId=1&filterBy=branch_code&filterValue=${branchCode}&operation=EQUAL&viewOnly=YES`, { headers });
          setCurrentBusinessDate(response.data.data[0].bussines_date);
          console.log('Business date:', response.data.data[0].bussines_date);
        } catch (error) {
          console.error('Error fetching business date:', error);
          // Fallback to system date if API call fails
          const systemDate = formatDateToYYYYMMDD(new Date());
          setCurrentBusinessDate(systemDate);
        }
      };

      fetchBusinessDate();
    }
  }, [branchCode]);

  const handleLogout = () => {
    // Remove login information from session
    sessionStorage.clear();
    // Redirect to the login page after logout
    navigate('/login');
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  const logoutUser = async () => {
    try {
      // Use Axios to perform POST request to logout API
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(`${AUTH_SERVICE_LOGOUT}`, {
        userId: sessionStorage.getItem('userId')
      }, { headers });

      // Check response status to determine if logout was successful
      if (response.status === 200) {
        setResponseMessage(response.data.message);
        handleLogout(); // Call handleLogout if logout was successful
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error if logout request fails
    }
  };

  const showLogoutConfirmation = () => {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'warning',
      cancelButtonColor: 'grey',
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser();
      }
    });
  };

  return (
    <Fragment>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#" role="button">
              <i className="fas fa-bars"></i>
            </a>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <span className="nav-link">
              {userName ? `${userName}` : ''} | Date: {currentBusinessDate}
            </span>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" role="button" onClick={showLogoutConfirmation}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </a>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
}