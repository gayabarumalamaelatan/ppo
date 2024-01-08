import React, { Fragment, useState } from "react";
import { useRecoilValue } from "recoil";
import { permissionsState } from "../store/Permission";
import NewTopicModal from "../modal/NewTopicModal";


const KafkaTopic = () => {
    // Const declarement
    const [showNewTopicModal, setShowNewTopicModal] = useState(false);
    const [refreshTable, setRefreshTable] = useState(false);
    const permissions = useRecoilValue(permissionsState);

    // Permission call
    const canCreateTopic = permissions["Integration"]["Kakfa Manager"]["Topics"]["create"];
    const canDeleteTopic = permissions["Integration"]["Kakfa Manager"]["Topics"]["delete"];

    const handleCloseModal = () => {
        setShowNewTopicModal(false);
    }

    return (
        <Fragment>
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Topic</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/user">Home</a></li>
                                <li className="breadcrumb-item"><a href="/user">Integration</a></li>
                                <li className="breadcrumb-item active">Kafka Topic</li>
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
                                <h2 className="card-title">Topic</h2>
                                {canCreateTopic && ( 
                                    <a className="btn btn-success btn-sm float-right" onClick={() => setShowNewTopicModal(true)}>
                                        <i className="fas fa-users"></i> New
                                    </a>
                                )}
                            </div>
                            <div className="card-body">
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        <NewTopicModal 
            isOpen={showNewTopicModal}
            onClose={handleCloseModal}

        />
        </Fragment>
        
    )
}

export default KafkaTopic;