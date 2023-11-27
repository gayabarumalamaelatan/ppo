import React, { useState } from 'react';
import axios from 'axios';
import { MENU_SERVICE_CORE_MODULE_ADD, MENU_SERVICE_CORE_MODULE_GET_ID, MENU_SERVICE_CORE_MODULE_UPDATE, MENU_SERVICE_CORE_MODULE_update } from '../../config/ConfigApi';
import { showSuccessToast, showErrorToast } from '../../toast/toast';
import { Button, Form, Modal } from 'react-bootstrap';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const { userLoggin, token, active } = require('../../config/Constants');

const EditModuleModal = ({ showEdit, handleClose, dataModule ,reloadData}) => {

   // console.log('module',dataModule);
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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint to fetch user details
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get(`${MENU_SERVICE_CORE_MODULE_GET_ID}?moduleId=${dataModule.id}`, { headers });
                const moduleData = response.data;

                console.log('moduleData',moduleData);
                // Update the form data with fetched user details
                setFormData({
                    moduleId: moduleData.id,
                    moduleName: moduleData.moduleName,
                    moduleIcon: moduleData.icon,
                    moduleUrl: moduleData.url,
                    moduleElement: moduleData.element,
                    moduleCode: moduleData.moduleCode,
                    modulePrefix: moduleData.prefixTable
                });
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        // Fetch user details when the modal is opened
        if (showEdit) {
            fetchUserData();
        }
    }, [showEdit]);

    const handleSubmit = async () => {
        //console.log('prifix ',formData.modulePrefix);
        const postData = {
            id: formData.moduleId,
            moduleName: formData.moduleName,
            element: formData.moduleElement,
            icon: formData.moduleIcon,
            moduleCode: formData.moduleCode,
            prefixTable: formData.modulePrefix,
            url: formData.moduleUrl,
            status: active,
        };

        try {
            setIsLoading(true);
            console.log('POST DATA', postData);

            // Send a POST request to the API
            const response = await axios.put(MENU_SERVICE_CORE_MODULE_UPDATE, postData, { headers });
            console.log('API Response:', response.data);
            setTimeout(() => {
                handleClose();
                setFormData(initialUserData);
                setIsLoading(false);
                showSuccessToast('Module Edited successfully!');
                reloadData();
                reloadData();
            }, 1000);

            
        } catch (error) {
            console.error('Error edit module:', error);
            setIsLoading(false);
            showErrorToast('An error occurred. Please try again later.');
        }
    };

    const handleReset = () => {
        setFormData(initialUserData);
    };

    

    return (
        <Modal show={showEdit} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Core Modules</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                <Form.Group>
                        <Form.Label>Module ID</Form.Label>
                        <Form.Control 
                            type="text"
                            name="moduleId"
                            value={formData.moduleId}
                            readOnly
                        />
                    </Form.Group>
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
                            name="moduleElement"
                            value={formData.moduleElement}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="icon">
                        <Form.Label>Icon</Form.Label>
                        <Form.Control
                            type="text"
                            name="moduleIcon"
                            value={formData.moduleIcon}
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
                            name="modulePrefix"
                            value={formData.modulePrefix}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="url">
                        <Form.Label>URL</Form.Label>
                        <Form.Control
                            type="text"
                            name="moduleUrl"
                            value={formData.moduleUrl}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    <FontAwesomeIcon icon={faTimes} /> Batal
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    <FontAwesomeIcon icon={faSave} /> Simpan Perubahan
                </Button>
            </Modal.Footer>
            </Modal.Footer>
            {isLoading && (
                <div className="full-screen-overlay">
                    <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
                </div>
            )}
        </Modal>
    );
};

export default EditModuleModal;
