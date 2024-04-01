import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import GroupManagementTable from '../tables/GroupManagementTable';
import RoleMapping from '../tables/RoleMapping';
import { Modal, Button } from 'react-bootstrap';
import { USER_SERVICE_BRANCH_ADD, USER_SERVICE_BRANCH_LIST, USER_SERVICE_GROUP_ADD, USER_SERVICE_GROUP_LIST, USER_SERVICE_GROUP_ROLE_LIST, USER_SERVICE_ROLE_LIST } from '../config/ConfigApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import {  useRecoilValue } from 'recoil';
import { permissionsState } from '../store/Permission';
import { showDynamicSweetAlert } from '../toast/Swal';
import BranchTable from '../tables/BranchTable';

const { userLoggin, getToken,getBranch } = require('../config/Constants');

const CoreBranch = () => {
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [branchData, setBranchData] = useState([]);
    const [showNewBranchModal, setShowNewBranchModal] = useState(false);
    const [newBranchName, setNewBranchName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const permissions = useRecoilValue(permissionsState);
    const token = getToken();
    const branchId = getBranch();

    console.log('permissions ',permissions);

    const canCreateGroup = permissions["Administration"]["Group Management"]["create"];
    
    const canUpdateGroup = permissions["Administration"]["Group Management"]["update"];
    const canDeleteGroup = permissions["Administration"]["Group Management"]["delete"];

    const headers = { Authorization: `Bearer ${token}` };
    console.log("Read Token: ", headers);

    const loadGroupsData = () => {
        setIsLoadingTable(true);
        axios.get(`${USER_SERVICE_BRANCH_LIST}`, { headers })
            .then(response => {
                setTimeout(() => {
                    setBranchData(response.data);
                    setIsLoadingTable(false); // Stop loading
                }, 1000);

            })
            .catch(error => {
                console.error('Error fetching group data:', error);
                showDynamicSweetAlert('Error!',error, 'error');
            });
    };


    //Load group and role data when the component mounts
    useEffect(() => {
        loadGroupsData();
        // loadRolesData();
        // loadGroupsRoleData();
    }, []);

    const handleCrateBranch = async () => {
        try {
            setIsLoading(true);
            const postData = {
                branchName: newBranchName,
            };

            const response = await axios.post(`${USER_SERVICE_BRANCH_ADD}`, postData, { headers });
            // console.log(response.data);
            setTimeout(() => {
                setShowNewBranchModal(false);
                setNewBranchName("");
                setIsLoading(false); // Stop loading
                loadGroupsData();
                showDynamicSweetAlert('Success!', 'New branch created successfully.', 'success');
            }, 1000);
        } catch (error) {
            console.error('Error creating group:', error);
            setNewBranchName("");
            showDynamicSweetAlert('Error!',error, 'error');

        }
    };

    const handleBranchSelect = (group) => {
        setSelectedBranch(group);
    };

    return (
        <Fragment>

            <section className="content-header">
                <div className="container-fluid">

                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Group Management</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/">Home</a></li>
                                <li className="breadcrumb-item active">Maintenace Branch</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">
                <div className="card">
                    <div class="row">
                        <div class="col-12">
                            <div className="card-header">
                                <h2 className="card-title">Maintenace Branch</h2>
                                {canCreateGroup && (
                                    <a className="btn btn-success btn-sm float-right" onClick={() => setShowNewBranchModal(true)}>
                                        <i className="fas fa-users"></i> New
                                    </a>
                                )}
                            </div>
                            <div className="card-body">
                                {/* Render the group management table */}
                                <BranchTable
                                    groups={branchData}
                                    selectedBranch={selectedBranch}
                                    handleBranchSelect={handleBranchSelect}
                                    isLoadingTable={isLoadingTable}
                                    refetchCallback={() => loadGroupsData()}
                                    editPermission = {canUpdateGroup}
                                    deletePermission = {canDeleteGroup}
                                />
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
            <Modal show={showNewBranchModal} onHide={() => setShowNewBranchModal(false)}>
                <Modal.Header>
                    <Modal.Title>Add New Group</Modal.Title>
                    {/* Ganti ikon tombol close (X) */}
                    <Button variant="link default" onClick={() => setShowNewBranchModal(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="branchName">Branch Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="branchName"
                                placeholder="Enter branch name"
                                value={newBranchName}
                                onChange={(e) => setNewBranchName(e.target.value)}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowNewBranchModal(false)}>
                        <FontAwesomeIcon icon={faTimes} />    Cancel
                    </button>
                    <button className="btn btn-primary" onClick={() => handleCrateBranch()}>
                        <FontAwesomeIcon icon={faSave} />   Submit
                    </button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default CoreBranch;
