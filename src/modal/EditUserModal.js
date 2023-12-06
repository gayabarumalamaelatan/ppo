
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AUTH_SERVICE_UPDATE_USER, { USER_SERVICE_UPDATE_USER, USER_SERVICE_USER_DETAIL } from '../config/ConfigApi';
import { showSuccessToast, showErrorToast } from '../toast/toast';
import { showDynamicSweetAlert } from '../toast/Swal';


const { userLoggin, token } = require('../config/Constants');

const EditFormModal = ({ showEdit, handleClose, username, handleSubmit }) => {
  const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch user details for editing
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint to fetch user details
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${USER_SERVICE_USER_DETAIL}?userId=${username}`, { headers });
        const userData = response.data;
        // Update the form data with fetched user details
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          id: userData.id,
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    // Fetch user details when the modal is opened
    if (showEdit) {
      fetchUserData();
    }
  }, [showEdit, username]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Buat body permintaan berdasarkan format yang Anda berikan
      const requestBody = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        id: formData.id,
      };

      setIsLoading(true);

      // Kirim permintaan PUT untuk memperbarui data pengguna
      const response = await axios.put(`${USER_SERVICE_UPDATE_USER}`, requestBody, { headers });

      setTimeout(() => {
        setIsLoading(false);
        // Panggil fungsi handleSubmit yang dilewatkan sebagai prop untuk memberi tahu komponen induk jika diperlukan
        handleSubmit(formData);

        // Tutup modal dan reset formulir
        handleModalClose();
        //showSuccessToast('User updated successfully!');
        showDynamicSweetAlert('Success!', 'User updated successfully!', 'success');
      }, 1000);

    } catch (error) {
      console.error('Error updating user:', error);
      showDynamicSweetAlert('Error!',error, 'error');
      setIsLoading(false);
      // Tangani kesalahan yang terjadi selama panggilan API
    }
  };

  const handleModalClose = () => {
    // Tutup modal dan reset form ke nilai awal
    handleClose();
    setFormData(initialFormData);
  };

  return (
    <div className={`modal ${showEdit ? 'd-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: showEdit ? 'block' : 'none' }}>
      <div className="modal-dialog modal-dialog-scrollable= modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Edit User</h4>
            <button type="button" className="close" onClick={handleModalClose}>
              &times;
            </button>
          </div>
          {isLoading && (
                        <div className="full-screen-overlay">
                            <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
                        </div>
                    )}
          <form onSubmit={handleFormSubmit}>
            <div className="modal-body">
              {/* Render your form fields here */}
              <div className="form-group">
                <label>ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.id}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={handleModalClose}>
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFormModal;
