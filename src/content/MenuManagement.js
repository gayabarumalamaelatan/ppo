import React,{ Fragment, useState } from 'react';
import MenuListTable from '../tables/MenuListTable';
import NewMenuModal from '../modal/NewMenuModal';
import {  useRecoilValue } from 'recoil';
import { permissionsState } from '../store/Permission';

const MenuManagement = () => {

    const [showNewMenuModal, setShowNewMenuModal] = useState(false);
    const [refreshTable, setRefreshTable] = useState(false);
    const permissions = useRecoilValue(permissionsState);

    const canCreateMenus = permissions["Administration"]["Maintenance Menus"]["create"];
    
    const canUpdateMenus = permissions["Administration"]["Maintenance Menus"]["update"];
    const canDeleteMenus = permissions["Administration"]["Maintenance Menus"]["delete"];

    const handleCloseModal = () => {
        setShowNewMenuModal(false);
    }

    return (
        <Fragment>
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Menu Management</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/user">Home</a></li>
                                <li className="breadcrumb-item active">Menu Management</li>
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
                                <h2 className="card-title">Menu Management</h2>
                                {canCreateMenus && ( 
                                    <a className="btn btn-success btn-sm float-right" onClick={() => setShowNewMenuModal(true)}>
                                        <i className="fas fa-users"></i> New
                                    </a>
                                )}
                            </div>
                            <div className="card-body">
                                <MenuListTable 
                                    refreshTableStatus={refreshTable}
                                    editPermission={canUpdateMenus}
                                    deletePermission={canDeleteMenus}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <NewMenuModal 
                isOpen={showNewMenuModal}
                onClose={handleCloseModal}
                handleSubmit={() => setRefreshTable(!refreshTable)}
            />
        </Fragment>
    )

}

export default MenuManagement