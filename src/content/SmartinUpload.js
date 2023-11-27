import React, { Fragment, Link,useState } from 'react';
import Users from '../tables/Users';
import RegisterModal from '../modal/RegistrasiModal';
import ModulesTable from '../tables/ModulesTable';
import AddModuleModal from '../modal/administration/AddModuleModal';
import {  useRecoilValue } from 'recoil';
import { permissionsState } from '../store/Permission';
import UploadSmartinModal from '../modal/administration/UploadSmartinModal';
import SmartinTable from '../tables/SmartinTable';

const SmartinUpload = () => {
    const [showModal, setShowModal] = useState(false);
    const [refreshTable, setRefreshTable] = useState(false); // State to trigger data reload
    const permissions = useRecoilValue(permissionsState);

    const canCreateSmartin = permissions["Administration"]["Smartin Upload"]["create"];


    const handleCloseModal = () => {
      setShowModal(false);
    };
    return (
        <Fragment>
            <section className="content-header">
                <div className="container-fluid">

                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Smartin Upload</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/user">Home</a></li>
                                <li className="breadcrumb-item active">Smartin Upload</li>
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
                                <h2 className="card-title">Uploads</h2>
                                {canCreateSmartin && (
                                <a className="btn btn-success  btn-sm float-right" onClick={() => setShowModal(true)}> 
                                    <i className="fas fa-users"></i> New
                                </a>
                                )}
                            </div>
                            <div className="card-body">
                            <SmartinTable 
                                refreshTableStatus={refreshTable} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
      
            <UploadSmartinModal show={showModal} handleClose={handleCloseModal} reloadData={() => setRefreshTable(!refreshTable)} />

        </Fragment>
    );
};

export default SmartinUpload;
