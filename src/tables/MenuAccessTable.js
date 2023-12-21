// MenuAccessTable.js
import React from 'react';
import { useState, useEffect } from 'react';
import { showErrorToast, showSuccessToast } from '../toast/toast';
import axios from 'axios';
import { MENU_SERVICE_ADD_MENU_PERMISSION } from '../config/ConfigApi';
import { Modal, Button } from 'react-bootstrap';
import { showDynamicSweetAlert } from '../toast/Swal';

const { token } = require('../config/Constants');

const MenuAccessTable = ({ selectedRole, menuRolesData, menuData,editPermission }) => {
  const headers = { Authorization: `Bearer ${token}` };
  const [editMode, setEditMode] = useState(false);
  const [updatedMenuRolesData, setUpdatedMenuRolesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false); // State for the modal

  console.log('menuRolesData',menuRolesData);
  const loadDataMapping = () => {
    if (selectedRole) {
      const updatedData = menuData.map((menu) => {
        const rolePermission = menuRolesData.find((roleMenu) => roleMenu.menuName === menu.menuName);
        return {
          id: menu.id,
          menuName: menu.menuName,
          create: rolePermission ? rolePermission.create : false,
          update: rolePermission ? rolePermission.update : false,
          delete: rolePermission ? rolePermission.delete : false,
          verify: rolePermission ? rolePermission.verify : false,
          auth: rolePermission ? rolePermission.auth : false,
        };
      });
      setUpdatedMenuRolesData(updatedData);
    }
  }

  useEffect(() => {
    loadDataMapping();
  }, [selectedRole, menuRolesData, menuData]);

  const handlePermissionChange = (menuId, permissionType, value) => {
    const updatedData = updatedMenuRolesData.map((item) =>
      item.id === menuId
        ? {
            ...item,
            [permissionType]: value,
          }
        : item
    );
    setUpdatedMenuRolesData(updatedData);
  };

  const handleRowPermissionChange = (menuId, value) => {
    const updatedData = updatedMenuRolesData.map((item) =>
      item.id === menuId
        ? {
            ...item,
            create: value,
            update: value,
            delete: value,
            verify: value,
            auth: value,
          }
        : item
    );
    setUpdatedMenuRolesData(updatedData);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    loadDataMapping();

  }

  const handleSendToApproval = async () => {
    if (!editMode) {
      return;
    }

    setShowSubmitModal(true); // Open the confirmation modal
  };

  const handleSavePermissions = async () => {
    try {
      const menuPermissionData = {
        roleId: selectedRole.id,
        corePermission: updatedMenuRolesData.filter((data) => {
          return (
            Object.values(data).some((value) => value === true)
          )
        }).map(menuPermission => ({
          menuId: menuPermission.id,
          permissionCreate: menuPermission.create,
          permissionUpdate: menuPermission.update,
          permissionDelete: menuPermission.delete,
          permissionVerify: menuPermission.verify,
          permissionAuth: menuPermission.auth,
          roleId: selectedRole.id,
        })),
      }
      setIsLoading(true);
      console.log('Updated permissions:', menuPermissionData);
      const response = await axios.post(`${MENU_SERVICE_ADD_MENU_PERMISSION}`, menuPermissionData, { headers });
      console.log('Permission Data Updated:', response.data);
      setTimeout(() => {
        setEditMode(false);
        setIsLoading(false);
        //showSuccessToast('Roles Permission Updated.');
        showDynamicSweetAlert('Success!', 'Roles Permission Updated.', 'success');
        
      }, 1000);
    } catch (error) {
      console.log('Error creating new role or permissions:', error);
      showDynamicSweetAlert('Error!',error, 'error');
    } finally {
      setShowSubmitModal(false);
    }
    
  };

  return (
    <div className="card">
      <div className="card card-primary">
        <div className="card-header">
          <h3 className="card-title">Menu Access for Role: {selectedRole.roleName}</h3>
        </div>
	    </div>
      <div className="card-body">
        <div className="table-container">
        <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Menu Name</th>
            <th>
              <input
                type='checkbox'
                disabled='true'
              />
            </th>
            <th>Create</th>
            <th>Update</th>
            <th>Delete</th>
            <th>Verify</th>
            <th>Auth</th>
          </tr>
        </thead>
        <tbody>
          {updatedMenuRolesData.map((menu) => (
            <tr key={menu.id}>
              <td>{menu.menuName}</td>
              <td>
                <input
                    type="checkbox"
                    checked={menu.create && menu.update && menu.delete && menu.verify && menu.auth}
                    onChange={(e) => handleRowPermissionChange(menu.id, e.target.checked)}
                    disabled={!editMode}
                  />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={menu.create}
                  onChange={(e) => handlePermissionChange(menu.id, 'create', e.target.checked)}
                  disabled={!editMode}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={menu.update}
                  onChange={(e) => handlePermissionChange(menu.id, 'update', e.target.checked)}
                  disabled={!editMode}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={menu.delete}
                  onChange={(e) => handlePermissionChange(menu.id, 'delete', e.target.checked)}
                  disabled={!editMode}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={menu.verify}
                  onChange={(e) => handlePermissionChange(menu.id, 'verify', e.target.checked)}
                  disabled={!editMode}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={menu.auth}
                  onChange={(e) => handlePermissionChange(menu.id, 'auth', e.target.checked)}
                  disabled={!editMode}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancel Edit
              </button>
              <button
                type="button"
                className="btn btn-primary ml-2"
                disabled={!editMode}
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
      <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to submit the mapped roles for approval?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSavePermissions}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MenuAccessTable;
