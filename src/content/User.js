import React, { Fragment, Link,useState } from 'react';
import Users from '../tables/Users';
import RegisterModal from '../modal/RegistrasiModal';
import {  useRecoilValue } from 'recoil';
import { permissionsState } from '../store/Permission';

const User = () => {
    const [showModal, setShowModal] = useState(false);
    const permissions = useRecoilValue(permissionsState);
    const [refreshTable, setRefreshTable] = useState(false); 
    console.log('permissions ',permissions);

    const canCreateUsers = permissions["Administration"]["Maintenance Users"]["create"];
    const canUpdateUsers = permissions["Administration"]["Maintenance Users"]["update"];
    const canDeleteUsers = permissions["Administration"]["Maintenance Users"]["delete"];
    const canVeriyUsers = permissions["Administration"]["Maintenance Users"]["verify"];
    const canAuthUsers = permissions["Administration"]["Maintenance Users"]["auth"];

    console.log('Create User ',canCreateUsers);
    console.log('Edit User ',canUpdateUsers);
    console.log('Del User ',canDeleteUsers);
    console.log('AUT User ',canAuthUsers);

    const handleCloseModal = () => {
      setShowModal(false);
    };
    return (
        <Fragment>
            <section className="content-header">
                <div className="container-fluid">

                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>User Management</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/user">Home</a></li>
                                <li className="breadcrumb-item active">User Management</li>
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
                                <h2 className="card-title">Users</h2>
                                {canCreateUsers && (
                                <a className="btn btn-success  btn-sm float-right" onClick={() => setShowModal(true)}> 
                                    <i className="fas fa-users"></i> New
                                </a>
                                )}
                            </div>
                            <div className="card-body">
                                <Users 
                                    editPermission={canUpdateUsers} 
                                    delPermission={canDeleteUsers} 
                                    authPermission={canAuthUsers} 
                                    refreshTableStatus={refreshTable} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
      
            <RegisterModal show={showModal} handleClose={handleCloseModal} reloadData={() => setRefreshTable(!refreshTable)}/>

        </Fragment>
    );
};

export default User;
