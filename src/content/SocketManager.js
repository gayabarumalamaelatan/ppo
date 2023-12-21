import React, { Fragment, useState } from "react";
import { useRecoilValue } from "recoil";
import { permissionsState } from "../store/Permission";
import SocketTable from "../tables/SocketTable";

const SocketManager = () => {

    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false); 
    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const permissions = useRecoilValue(permissionsState);

    console.log('permissions ',permissions);

    const canCreateSocket = permissions["Administration"]["Socket Manager"]["create"];
    const canUpdateSocket = permissions["Administration"]["Socket Manager"]["update"];
    const canDeleteSocket = permissions["Administration"]["Socket Manager"]["delete"];
    const canVeriySocket = permissions["Administration"]["Socket Manager"]["verify"];
    const canAuthSocket = permissions["Administration"]["Socket Manager"]["auth"];

    const handleCloseModal = () => {
        setShowModal(false);
    };
    return (
        <Fragment>
            <section className="content-header">
                <div className="container-fluid">

                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Socket Manager</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/user">Home</a></li>
                                <li className="breadcrumb-item active">Socket Manager</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
                <div className="card">
                    <div class="row">
                        <div class="col-12">
                            {/* <div className="card-header">
                                <h2 className="card-title">Socket</h2>
                                {canCreateSocket && (
                                <a className="btn btn-success  btn-sm float-right" onClick={() => setShowModal(true)}> 
                                    <i className="fas fa-users"></i> New
                                </a>
                                )}
                            </div> */}
                            <div className="card-body">
                                <SocketTable
                                isLoadingTable={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
      

        </Fragment>
    );
}

export default SocketManager;