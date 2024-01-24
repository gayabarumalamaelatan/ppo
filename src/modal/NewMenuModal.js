import React,{ useState } from "react"
import { MENU_SERVICE_ALL_MODULES,  MENU_SERVICE_ADD_MENU } from "../config/ConfigApi";
import axios from "axios";
import { useEffect } from "react";
import { Button, Form, Modal, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { showErrorToast, showSuccessToast } from "../toast/toast";
import { showDynamicSweetAlert } from "../toast/Swal";

const { active, getToken } = require('../config/Constants');

const NewMenuModal = ({isOpenModal, handleClose, handleSubmit}) => {
    //API Call Variable
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };

    // Set Initial Form Data
    const initialFormData = {
        moduleId: '',
        menuName: '',
        icon: '',
        url: '',
        element: '',
        menuCode: '',
        parentCode: '',
        formId: '',
        parent: '',    
    }
    const [formData, setFormData] = useState(initialFormData);
    const [moduleInfo, setModuleInfo] = useState(null);
    const [formInfo, setFormInfo] = useState(null);

    // Kosmetik
    const [isLoading, setIsLoading] = useState(false);

    //API Call Logic
    const fetchModuleInfo = async () => {
        try {
            const response = await axios.get(`${MENU_SERVICE_ALL_MODULES}`, {headers})
            setModuleInfo(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching menu details:', error);
        }
    }

    // Handle Logic
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (value === "true") {
            setFormData((prevData) => ({ ...prevData, [name]: true }));
        } else if (value === 'false') {
            setFormData((prevData) => ({ ...prevData, [name]: false }));
        } else if (value === '') {
            setFormData((prevData) => ({ ...prevData, [name]: null }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
        
    }; 

    const handleSaveData = async () => {
        console.log('Request', formData)

        try {
            const requestBody = {
                moduleId: formData.moduleId === '' ? null : formData.moduleId,
                menuName: formData.menuName === '' ? null : formData.menuName,
                icon: formData.icon === '' ? null : formData.icon,
                url: formData.url === '' ? null : formData.url,
                element: formData.element === '' ? null : formData.element,
                menuCode: formData.menuCode === '' ? null : formData.menuCode,
                parentCode: formData.parentCode === '' ? null : formData.parentCode,
                formId: formData.formId === '' ? null : formData.formId, 
                parent: formData.parent === '' ? null : formData.parent,
                status: active,
            }

            setIsLoading(true);

            const response = await axios.post(`${MENU_SERVICE_ADD_MENU}`, requestBody, { headers })

            setTimeout(() => {
                console.log('Response', response.data);
                setIsLoading(false);
                handleClose();
                handleSubmit();
                //showSuccessToast('Menu updated successfully')
                showDynamicSweetAlert('Success!', 'Menu updated successfully.', 'success');
                setFormData(initialFormData);
            }, 500)

        } catch (error) {
            console.error('Error Update Menu Data', error)
            if (formData.parent === false && formData.parentCode === '' ) {
                //showErrorToast('Please Fill Parent Code!')
                showDynamicSweetAlert('Warning!', 'Please Fill Parent Code!.', 'warning')
            } else (
                //showErrorToast('Error creating new menu!')
                showDynamicSweetAlert('Error!', error, 'error')
            )
            setIsLoading(false);
        }
    }

    // Handle Modal
    const handleCloseModal = () => {
        setFormData(initialFormData);
        handleClose()
    }

    // API Call 
    useEffect(() => {
        fetchModuleInfo();
    }, []);

    return (
        <Modal show={isOpenModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Menu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Menu Code</Form.Label>
                        <Form.Control 
                            type="text"
                            name="menuCode"
                            value={formData.menuCode}
                            onChange={(e) => handleFormChange(e)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Module ID</Form.Label>
                        <Form.Control
                            as="select"
                            name="moduleId"
                            value={formData.moduleId}
                            onChange={(e) => handleFormChange(e)}
                        >  
                            <option>Select Module ID</option>
                            {moduleInfo && moduleInfo.map((option) => (
                                <option value={option.id}>{option.moduleName}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Menu Name</Form.Label>
                        <Form.Control 
                            type="text"
                            name="menuName"
                            value={formData.menuName}
                            onChange={(e) => handleFormChange(e)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Icon</Form.Label>
                        <Form.Control 
                            type="text"
                            name="icon"
                            value={formData.icon}
                            onChange={(e) => handleFormChange(e)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>URL</Form.Label>
                        <Form.Control 
                            type="text"
                            name="url"
                            value={formData.url}
                            onChange={(e) => handleFormChange(e)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Element</Form.Label>
                        <Form.Control 
                            type="text"
                            name="element"
                            value={formData.element}
                            onChange={(e) => handleFormChange(e)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Parent Code</Form.Label>
                        <Form.Control 
                            type="text"
                            name="parentCode"
                            value={formData.parentCode}
                            onChange={(e) => handleFormChange(e)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Form ID</Form.Label>
                        <Form.Control 
                            type="text"
                            name="formId"
                            value={formData.formId}
                            onChange={(e) => handleFormChange(e)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Is Parent</Form.Label>
                        <Form.Control
                            as="select"
                            name="parent"
                            value={formData.parent.toString()}
                            onChange={(e) => handleFormChange(e)}
                        >   
                            <option>Select Parent Status</option>
                            <option value="true">true</option>
                            <option value="false">false</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
                {isLoading && 
                    (
                        <div className="full-screen-overlay">
                                    <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
                        </div>
                    )
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    <FontAwesomeIcon icon={faTimes} /> Batal
                </Button>
                <Button variant="primary" onClick={handleSaveData}>
                    <FontAwesomeIcon icon={faSave} /> Simpan Perubahan
                </Button>
            </Modal.Footer>
        </Modal>
    )

}

export default NewMenuModal