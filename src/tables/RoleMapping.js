import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { showSuccessToast, showErrorToast } from '../toast/toast';
import { USER_SERVICE_MAPPING_ROLE_GROUP_ADD } from '../config/ConfigApi';
import { showDynamicSweetAlert } from '../toast/Swal';
const { token } = require('../config/Constants');

const RoleMapping = ({ selectedGroup, allRoles, setMappedRoles, groupRoleData,editPermission }) => {
  console.log("groupRoleData",groupRoleData);
  const [mappedRoles, setMappedRolesLocal] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false); // State for the modal

  console.log("selectedGroup",selectedGroup.id);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const mappedRolesForGroup = (groupRoleData.find(group => group.id === selectedGroup.id) || {}).mappedRoles || [];
    setMappedRolesLocal(mappedRolesForGroup);
  }, [selectedGroup, groupRoleData]);

  const availableRoles = allRoles.filter(role => !mappedRoles.includes(role.id));

  const handleMapRole = roleId => {
    if (editMode) {
      setMappedRolesLocal(prevMappedRoles => [...prevMappedRoles, roleId]);
      setMappedRoles(prevMappedRoles => [...prevMappedRoles, roleId]);
    }
  };

  const handleUnmapRole = roleId => {
    if (editMode) {
      setMappedRolesLocal(prevMappedRoles => prevMappedRoles.filter(id => id !== roleId));
      setMappedRoles(prevMappedRoles => prevMappedRoles.filter(id => id !== roleId));
    }
  };

  const handleSendToApproval = async () => {
    if (!editMode) {
      return;
    }

    setShowSubmitModal(true); // Open the confirmation modal
  };

  const handleSubmitConfirm = async () => {
    

    try {
      if (!selectedGroup) {
        showErrorToast('Please select a group first!');
        return;
      }
      setIsLoading(true);
      const requestData = {
        groupId: selectedGroup.id,
        role: mappedRoles.map(roleId => ({ roleId })),
      };

      const response = await axios.post(`${USER_SERVICE_MAPPING_ROLE_GROUP_ADD}`, requestData, { headers });

      console.log('Approval response:', response.data);
      
      setTimeout(() => {
        setEditMode(false);
        setIsLoading(false);
        // showSuccessToast('Mapped roles sent for approval.');
        showDynamicSweetAlert('Success', 'Mapped roles sent for approval.', 'success');

      }, 1000);

    } catch (error) {
      console.error('Error sending roles for approval:', error);
      // showErrorToast('An error occurred while sending roles for approval.');
      showDynamicSweetAlert('Error', error, 'error');
    } finally {
      setShowSubmitModal(false);
    }
  };

  return (
    <div className="card card-primary">
      {/* Rest of the component code... */}
	  <div className="card-header">
        <h3 className="card-title">Role Mapping for Group: {selectedGroup.groupName}</h3>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h4>All Roles</h4>
            <ul className="list-group">
              {availableRoles.map(role => (
                <li
                  key={role.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {role.roleName}
                  <button
                    type="button"
                    className={`btn btn-${editMode ? 'primary' : 'secondary'} btn-sm`}
                    onClick={() => handleMapRole(role.id)}
                    disabled={!editMode}
                  >
                    Map
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-6">
            <h4>Mapped Roles</h4>
            <ul className="list-group">
              {mappedRoles.map(roleId => {
                const mappedRole = allRoles.find(role => role.id === roleId);
                return (
                  <li
                    key={mappedRole.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {mappedRole.roleName}
                    <button
                      type="button"
                      className={`btn btn-${editMode ? 'danger' : 'secondary'} btn-sm`}
                      onClick={() => handleUnmapRole(mappedRole.id)}
                      disabled={!editMode}
                    >
                      Unmap
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="card-footer d-flex justify-content-end">
        {isLoading && (
          <div className="full-screen-overlay">
            <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
          </div>
        )}
        {editPermission ? (
        editMode ? (
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>
              Cancel Edit
            </button>
            <button
              type="button"
              className="btn btn-primary ml-2"
              onClick={handleSendToApproval}
            >
              Submit
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => setEditMode(true)}>
            Edit
          </button>
        )
      ) : null}
      </div>

      {/* Confirmation Modal */}
      <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to submit the mapped roles for approval?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitConfirm}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoleMapping;
