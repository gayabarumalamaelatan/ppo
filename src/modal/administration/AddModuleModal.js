import React, { useState } from 'react';
import axios from 'axios';
import { MENU_SERVICE_CORE_MODULE_ADD } from '../../config/ConfigApi';
import { showSuccessToast, showErrorToast } from '../../toast/toast';
import { Button, Form, Modal } from 'react-bootstrap';

const { userLoggin, token, active } = require('../../config/Constants');

const AddModuleModal = ({ show, handleClose, reloadData}) => {
    const [isLoading, setIsLoading] = useState(false);
    const headers = { Authorization: `Bearer ${token}` };
    const initialUserData = {
        element: '',
        icon: '',
        moduleCode: '',
        moduleName: '',
        prefixTable: '',
        status: 'ACTIVE',
        url: '',
    };

    const [formData, setFormData] = useState(initialUserData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        const postData = {
            
            moduleName: formData.moduleName,
            element: formData.element,
            icon: formData.icon,
            moduleCode: formData.moduleCode,
            prefixTable: formData.prefixTable,
            status: active,
            url: formData.url,
        };

        try {
            setIsLoading(true);
            console.log('POST DATA', postData);

            // Send a POST request to the API
            const response = await axios.post(MENU_SERVICE_CORE_MODULE_ADD, postData, { headers });
            console.log('API Response:', response.data);
            setTimeout(() => {
                handleClose();
                setFormData(initialUserData);
                setIsLoading(false);
                showSuccessToast('Module Update successfully!');
                reloadData();
            }, 1000);
            
        } catch (error) {
            console.error('Error adding module:', error);
            setIsLoading(false);
            showErrorToast('An error occurred. Please try again later.');
        }
    };

    const handleReset = () => {
        setFormData(initialUserData);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Entry</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="moduleName">
                        <Form.Label>Module Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="moduleName"
                            value={formData.moduleName}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="element">
                        <Form.Label>Element</Form.Label>
                        <Form.Control
                            type="text"
                            name="element"
                            value={formData.element}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="icon">
                        <Form.Label>Icon</Form.Label>
                        <Form.Control
                            type="text"
                            name="icon"
                            value={formData.icon}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="moduleCode">
                        <Form.Label>Module Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="moduleCode"
                            value={formData.moduleCode}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="prefixTable">
                        <Form.Label>Prefix Table</Form.Label>
                        <Form.Control
                            type="text"
                            name="prefixTable"
                            value={formData.prefixTable}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="url">
                        <Form.Label>URL</Form.Label>
                        <Form.Control
                            type="text"
                            name="url"
                            value={formData.url}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="secondary" onClick={handleReset}>
                    Reset
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save
                </Button>
            </Modal.Footer>
            {isLoading && (
                <div className="full-screen-overlay">
                    <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
                </div>
            )}
        </Modal>
        
    );
};

export default AddModuleModal;
