
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AUTH_SERVICE_UPDATE_USER, { USER_SERVICE_GROUP_LIST, USER_SERVICE_UPDATE_USER, USER_SERVICE_USER_DETAIL } from '../config/ConfigApi';
import { showSuccessToast, showErrorToast } from '../toast/toast';
import { showDynamicSweetAlert } from '../toast/Swal';
import { Button, Modal } from 'react-bootstrap';


const { userLoggin, getToken } = require('../config/Constants');

const EditFormModal = ({ showEdit, handleClose, username, handleSubmit, reloadData }) => {
  const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    authBy: '',
    group:[],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const token = getToken();

  // Function to fetch user details for editing
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint to fetch user details
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${USER_SERVICE_USER_DETAIL}?userId=${username}`, { headers });
        const userData = response.data;
        console.log(userData);
        // Update the form data with fetched user details

        const groupName = userData.group.map(groupItem => groupItem.id);

        console.log('group', groupName);
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          id: userData.id,
          authBy: userData.authBy,
          group: groupName,
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    const fetchGroups = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(USER_SERVICE_GROUP_LIST, { headers });
        setGroupList(response.data);
        console.log(groupList); // Assuming the API response directly provides the list of groups
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    // Fetch user details when the modal is opened
    if (showEdit) {
      fetchUserData();
      fetchGroups();
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
        authBy: formData.authBy,
        groupId: parseInt(formData.group, 10),
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
        reloadData();
      }, 1000);

    } catch (error) {
      console.error('Error updating user:', error);
      showDynamicSweetAlert('Error!', error, 'error');
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
    <Modal show={showEdit} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      {isLoading && (
        <div className="full-screen-overlay">
          <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
        </div>
      )}
      <form onSubmit={handleFormSubmit}>
        <Modal.Body>
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
            <label>Authentication Method</label>
            <select
              className="form-control"
              name="authBy"
              value={formData.authBy}
              onChange={handleFormChange}
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
               className="form-control"
              name="group"
              value={formData.group}
              onChange={handleFormChange}
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default EditFormModal;
