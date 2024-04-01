// RoleListTable.js
import React, {useState} from 'react';
import { useTable } from 'react-table';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { USER_SERVICE_EDIT_ROLE, USER_SERVICE_UPDATE_STATUS_ROLE } from '../config/ConfigApi';
import axios from 'axios';
import { showDynamicSweetAlert } from '../toast/Swal';
import ReactSelect from 'react-select';

const { getToken } = require('../config/Constants');

const RoleListTable = ({ roles,  handleRoleSelect,branchOptions, handleLoadMapping, selectedGroup, isLoadingTable, refetchCallback,editPermission,deletePermission }) => {

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };
  
  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Role Name', accessor: 'roleName' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
            <div>
                {editPermission && ( 
                <Button variant="outline-primary" style={{ marginRight: '5px' }} onClick={() => handleEditClick(row.original)}>
                    <i className="fas fa-edit"></i> 
                </Button> 
                )}
                {deletePermission && (
                <Button variant="outline-danger" onClick={() => handleDeleteClick(row.original)}>
                    <i className="fas fa-trash"></i>
                </Button>
                )}
                
            </div>
        ),
    },
    ],
    []
  );
  
  const handleEditClick = (role) => {
    setEditingRole(role);
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // Create a data object with the updated roleName
      const data = {
        id: editingRole.id,
        roleName: editingRole.roleName,
        branchId: editingRole ? editingRole.branchId : null
      };
      
      setIsLoading(true);
      // Send a PUT request to your API endpoint
      const response = await axios.put(`${USER_SERVICE_EDIT_ROLE}`, data, { headers });
      setTimeout(() => {
        setEditModalVisible(false);
        setIsLoading(false);
        refetchCallback();
        showDynamicSweetAlert('Success!', 'Role name updated successfully!', 'success');
      }, 1000)
    } catch (error) {
      console.error('Error updating role:', error);
      showDynamicSweetAlert('Error!',error, 'error');
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (role) => {
    setEditingRole(role);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      const data = {
        id: editingRole.id,
        roleName: editingRole.roleName,
        status: "INACTIVE"
      };
      
      const response = await axios.put(`${USER_SERVICE_UPDATE_STATUS_ROLE}`, data, { headers });
      setTimeout(() => {
        setDeleteModalVisible(false);
        setIsLoading(false);
        refetchCallback();
        showDynamicSweetAlert('Success!', 'Role deleted successfully!', 'success');
      }, 1000)
      console.log('Role deleted successfully', response.data);
    } catch (error) {
      console.error('Error deleting role:', error);
      showDynamicSweetAlert('Error!',error, 'error');
      setIsLoading(false);
    }
    
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: roles });

  return (
    <div className="table-container">
      <table className="table table-bordered">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoadingTable ? (
                      <tr>
                      <td colSpan={columns.length}>
                          <div className="text-center">
                              <div className="spinner-border text-primary" role="status">
                                  <span className="sr-only">Loading...</span>
                              </div>
                          </div>
                      </td>
                  </tr>
          ) : (
            rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={`${selectedGroup === row.original ? 'table-success' : ''}`}
                  onClick={() => handleRoleSelect(row.original)}
                >
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })
          ) } 
        </tbody>
      </table>
      <div className="mt-2">
        <button className="btn btn-primary btn-sm" onClick={() => handleLoadMapping(selectedGroup)}>
          Load Mapping
        </button>
        <hr />
      </div>
      {isLoading && (
                <div className="full-screen-overlay">
                    <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
                </div>
      )}

      {/* Edit Role Modal */}
      <Modal show={editModalVisible} onHide={() => {setEditModalVisible(false); handleRoleSelect(null);}}>
            <Modal.Header>
                <Modal.Title>Edit Group</Modal.Title>
                {/* Ganti ikon tombol close (X) */}
                <Button variant="link default" onClick={() => {setEditModalVisible(false); handleRoleSelect(null);}}>
                    <FontAwesomeIcon icon={faTimes} />
                </Button>
            </Modal.Header>
                <Modal.Body>
                    <form onSubmit={(event) => handleEditSubmit(event)}>
                        <div className="form-group">
                            <label htmlFor="groupName">Role Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="groupName"
                                value={editingRole ? editingRole.roleName : ''}
                                onChange={(e) => setEditingRole({ ...editingRole, roleName: e.target.value })}
                            />
                        </div>
                        <ReactSelect
                                id="selectBranch"
                                options={branchOptions}
                                value={branchOptions.find(option => option.value === editingRole?.branchId)}
                                onChange={(selectedOption) => setEditingRole({ ...editingRole, branchId: selectedOption.value })}
                            />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => {setEditModalVisible(false); handleRoleSelect(null);}}>
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                    <button className="btn btn-primary" onClick={(event) => handleEditSubmit(event)}>
                    <FontAwesomeIcon icon={faSave} /> Save Changes
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteModalVisible} onHide={() => {setDeleteModalVisible(false); handleRoleSelect(null);}}>
            <Modal.Header>
                <Modal.Title>Confirmation</Modal.Title>
                {/* Ganti ikon tombol close (X) */}
                <Button variant="link default" onClick={() => {setDeleteModalVisible(false); handleRoleSelect(null);}}>
                    <FontAwesomeIcon icon={faTimes} />
                </Button>
            </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the group: {editingRole && editingRole.roleName}?
                </Modal.Body>

                
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteModalVisible(false)}>
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                    <FontAwesomeIcon icon={faTrash} />  Delete
                    </Button>
                </Modal.Footer>
            </Modal>

    </div>
  );
};

export default RoleListTable;
