// RoleManagement.js
import React, { Fragment, useState, useEffect } from 'react';
import 'admin-lte/dist/css/adminlte.min.css';
import RoleListTable from '../tables/RoleListTable';
import MenuAccessTable from '../tables/MenuAccessTable';
import axios from 'axios';
import { USER_SERVICE_ADD_ROLE, USER_SERVICE_ROLE_LIST, MENU_SERVICE_MENU_PERMISSION, MENU_SERVICE_LIST_MENU_PERMISSION, USER_SERVICE_BRANCH_LIST } from '../config/ConfigApi';
import { Modal } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { permissionsState } from '../store/Permission';
import { showDynamicSweetAlert } from '../toast/Swal';
import ReactSelect from 'react-select';

const { getToken, getBranch } = require('../config/Constants');

const RoleManagement = () => {
  const token = getToken();
  const branchId = getBranch();
  const headers = { Authorization: `Bearer ${token}` };
  const [selectedRole, setSelectedRole] = useState(null);
  const [mappingVisible, setMappingVisible] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [menuRolesData, setMenuRolesData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const permissions = useRecoilValue(permissionsState);
  const [branchOptions, setBranchOptions] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);


  const canCreateRoles = permissions["Administration"]["Role Management"]["create"];
  const canUpdateRoles = permissions["Administration"]["Role Management"]["update"];
  const canDeleteRoles = permissions["Administration"]["Role Management"]["delete"];

  const fetchData = () => {
    setIsLoadingTable(true)
    axios.get(`${USER_SERVICE_ROLE_LIST}?branch=${branchId}`, { headers })
      .then(response => {
        setTimeout(() => {
          setRoleData(response.data);
          setIsLoadingTable(false);
        }, 1000);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        showDynamicSweetAlert('Error!', error, 'error');
      })
  }

  const fetchDataRole = async (roleId) => {
    try {
      const response = await axios.get(`${MENU_SERVICE_MENU_PERMISSION}?roleId=${roleId}`, { headers });
      console.log('Response data:', response.data);
      setMenuRolesData(response.data);
    } catch (error) {
      console.error('Error fetching role menu data:', error);
      setMenuRolesData([]);
    }
  };

  const fetchMenuData = async () => {
    try {
      const response = await axios.get(`${MENU_SERVICE_LIST_MENU_PERMISSION}`, { headers });
      setMenuData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setMappingVisible(false); // Hide mapping when a new group is selected
  };

  const handleCreateRole = async () => {
    // Create new role
    const newRoleData = {
      roleName: roleName,
      branchId: selectedBranch ? selectedBranch.value : null
    };

    try {
      setIsLoading(true);

      const response = await axios.post(`${USER_SERVICE_ADD_ROLE}`, newRoleData, { headers });
      console.log('New Role API Response:', response.data);
      setTimeout(() => {
        setRoleName('');
        setShowNewRoleModal(false);
        setIsLoading(false); // Stop loading
        fetchData();
        showDynamicSweetAlert('Success!', 'Success Create New Role, Please Edit New Permission.', 'success');
      }, 1000);

    } catch (error) {
      console.log('Error creating new role:', error);
      setRoleName('');
      showDynamicSweetAlert('Error!', error, 'error');
    }
  };

  const handleLoadMapping = (role) => {
    // Implement the logic to load mapping data based on the selected group
    console.log('Load mapping for group:', role);
    setSelectedRole(role);
    if (!selectedRole) {
      showDynamicSweetAlert('Warning!', 'Please select a group first!', 'warning');
    } else {
      setIsLoading(true);
      setTimeout(() => {
        fetchDataRole(role.id);
        fetchMenuData();
        setIsLoading(false)
        setMappingVisible(true); // Show the mapping table
      }, 1000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    <Fragment>
      <section className="content-header">
        {/* ... (content header section) ... */}
      </section>
      <section className="content">
        <div className="card">
          <div className="row">
            <div className="col-12">
              <div className="card-header">
                <h2 className="card-title">Role Management</h2>
                {canCreateRoles && (
                  <a className="btn btn-success  btn-sm float-right" onClick={() => setShowNewRoleModal(true)}>
                    <i className="fas fa-users"></i> New
                  </a>
                )}
              </div>
              <div className="card-body">
                <RoleListTable
                  roles={roleData}
                  handleRoleSelect={handleRoleSelect}
                  handleLoadMapping={handleLoadMapping}
                  selectedGroup={selectedRole}
                  isLoadingTable={isLoadingTable}
                  refetchCallback={() => fetchData()}
                  editPermission={canUpdateRoles}
                  deletePermission={canDeleteRoles}
                  branchOptions={branchOptions}
                />
                {selectedRole && mappingVisible && (
                  <MenuAccessTable
                    selectedRole={selectedRole}
                    menuRolesData={menuRolesData}
                    menuData={menuData}
                    editPermission={canUpdateRoles}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {isLoading && (
        <div className="full-screen-overlay">
          <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
        </div>
      )}
      <Modal show={showNewRoleModal} onHide={() => setShowNewRoleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="groupName">Role Name:</label>
              <input
                type="text"
                className="form-control"
                id="roleName"
                placeholder="Enter Role name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="selectBranch">Select Branch:</label>
              <ReactSelect
                id="selectBranch"
                options={branchOptions}
                value={selectedBranch}
                onChange={setSelectedBranch}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowNewRoleModal(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => handleCreateRole()}>
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default RoleManagement;
