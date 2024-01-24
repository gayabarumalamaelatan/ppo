import React, { Fragment } from 'react';
import AuditTable from '../tables/AuditTable'

const AuditTrail = () => {
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
                                <li className="breadcrumb-item active">Audit Trail</li>
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
                                <h3 className="card-title">Audit Trail</h3>                                
                            </div>


                            <div className="card-body">
                                <AuditTable />
                            </div>


                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    );
};

export default AuditTrail;