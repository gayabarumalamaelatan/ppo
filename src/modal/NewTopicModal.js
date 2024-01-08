import axios from "axios";
import React, { useState } from "react";
import { INTEGRATION_SERVICE_KAFKA_TOPIC_CREATE } from "../config/ConfigApi";
import { showDynamicSweetAlert } from "../toast/Swal";
import { Button, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

const { token, active } = require('../config/Constants');

const NewTopicModal = ({isOpen, onClose, handleSubmit}) => {
    // Const statement
    const headers = { Authorization: `Bearer ${token}` };
    const [isLoading, setIsLoading] = useState(false);

    // Set Initial Form Data
    const initialFormData = {
        topicName: '',
        partitionSize: '',
        replicationFactor: '',
        retentionPeriod: '',
        cleanupPolicy: '',
    }
    const [formData, setFormData] = useState(initialFormData);
    
    // Handle Logic
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        const postData = {
            topicName: formData.topicName,
            partitionSize: formData.partitionSize,
            replicationFactor: formData.replicationFactor,
            retentionPeriod: formData.retentionPeriod,
            cleanupPolicy: formData.cleanupPolicy,
        };
        try {
            setIsLoading(true);

            const response = await axios.post(INTEGRATION_SERVICE_KAFKA_TOPIC_CREATE, postData, {headers});
            console.log('API Response: ', response.data);
            setTimeout(() => {
                onClose();
                setIsLoading(false);
                setFormData(initialFormData);
                showDynamicSweetAlert('Success!','Topic created successfully!', 'success');
                handleSubmit();
            }, 1000)
        } catch (error) {
            console.error('Error create topic:', error);
            setIsLoading(false);
            showDynamicSweetAlert('Error!',error,'error');
        }
    };

    const handleCloseModal = () => {
        setFormData(initialFormData);
        onClose();
    }

    return (
        <Modal show={isOpen} onHide={onClose}>
            {isLoading && 
                (
                    <div className="full-screen-overlay">
                                <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
                    </div>
                )
            }
            <Modal.Header closeButton>
                <Modal.Title>Create New Topic</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Topic Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="topicName"
                            value={formData.topicName}
                            onChange={(e) => handleFormChange(e)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Partition Size</Form.Label>
                        <Form.Control
                            type="text"
                            name="partitionSize"
                            value={formData.partitionSize}
                            onChange={(e) => handleFormChange(e)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Replication Factor</Form.Label>
                        <Form.Control
                            type="text"
                            name="replicationFactor"
                            value={formData.replicationFactor}
                            onChange={(e) => handleFormChange(e)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Retention Period</Form.Label>
                        <Form.Control
                            type="text"
                            name="retentionPeriod"
                            value={formData.retentionPeriod}
                            onChange={(e) => handleFormChange(e)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Cleanup Policy</Form.Label>
                        <Form.Control
                            type="select"
                            name="cleanupPolicy"
                            value={formData.cleanupPolicy}
                            onChange={(e) => handleFormChange(e)}
                        >
                            <option>Select Cleanup Policy</option>
                            <option value="compact">Compact</option>
                            <option value="delete">Delete</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    <FontAwesomeIcon icon={faTimes} /> Batal
                </Button>
                <Button variant="secondary" onClick={handleSubmit}>
                    <FontAwesomeIcon icon={faSave} /> Create
                </Button>
            </Modal.Footer>
        </Modal>
    )

    // API Call Logic
}

export default NewTopicModal