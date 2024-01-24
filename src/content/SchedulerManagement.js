import { useRecoilValue } from "recoil";
import { permissionsState } from "../store/Permission";
import React, {  Fragment, useState } from "react";
import SchedulerTable from "../tables/SchedulerTable";
import NewSchedulerModal from "../modal/scheduler/NewSchedulerModal";


const SchedulerManagement = () => {
    
    const permissions = useRecoilValue(permissionsState);
    const [showNewSchedulerModal, setShowNewSchedulerModal] = useState(false);
    const [refreshTableStatus, setRefreshTableStatus] = useState(false);

    const canCreateSchedule = permissions["Integration"]["Scheduler"]["create"];
    const canDeleteSchedule = permissions["Integration"]["Scheduler"]["delete"];
    const canUpdateSchedule = permissions["Integration"]["Scheduler"]["update"];

    const handleCloseModal = () => {
        setShowNewSchedulerModal(false);
    }

    return (
        <Fragment>
            <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Scheduler</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                                    <li className="breadcrumb-item"><a href="">Integration</a></li>
                                    <li className="breadcrumb-item active">Scheduler</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content">
                    <div className="card">
                        <div className="row">
                            <div class="col-12">
                                <div className="card-header">
                                    <h2 className="card-title">Scheduler Management</h2>
                                    {canCreateSchedule && ( 
                                        <a className="btn btn-success btn-sm float-right" onClick={() => setShowNewSchedulerModal(true)}>
                                            <i className="fas fa-users"></i> New
                                        </a>
                                    )}
                                </div>
                                <div className="card-body">
                                        <SchedulerTable
                                            updatePermission={canUpdateSchedule}
                                            deletePermission={canDeleteSchedule}
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <NewSchedulerModal
                    isOpenModal={showNewSchedulerModal}
                    onClose={handleCloseModal}
                    onSubmit={() => setRefreshTableStatus(!refreshTableStatus)}
                />
        </Fragment>
    )

}

export default SchedulerManagement;