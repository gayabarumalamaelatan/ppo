import React,{ useState } from "react";
import { MENU_SERVICE_ALL_MODULES, MENU_SERVICE_DETAIL, MENU_SERVICE_UPDATE_MENU } from "../config/ConfigApi";
import axios from "axios";
import { useEffect } from "react";
import { Button, Form, Modal, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { showErrorToast, showSuccessToast } from "../toast/toast";
import { showDynamicSweetAlert } from "../toast/Swal";

const { getToken, active } = require('../config/Constants');

const UpdateMenuModal = ({isOpen, menu, handleSubmit, onClose}) => {
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

    const fetchMenuData = async () => {
        try {
            const response = await axios.get(`${MENU_SERVICE_DETAIL}?id=${menu}`, { headers });
            const menuData = response.data;
            setFormData({
                id: menuData.id,
                moduleId: menuData.moduleId,
                menuName: menuData.menuName,
                icon: menuData.icon,
                url: menuData.url,
                element: menuData.element,
                menuCode: menuData.menuCode,
                parentCode: menuData.parentCode,
                formId: menuData.formId, 
                parent: menuData.parent,
            });
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
        } 
        else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
        
    }; 

    const handleSaveData = async () => {
        console.log('Request', formData)
        try {
            const requestBody = {
                id:formData.id,
                moduleId: formData.moduleId,
                menuName: formData.menuName,
                icon: formData.icon,
                url: formData.url,
                element: formData.element,
                menuCode: formData.menuCode,
                parentCode: formData.parentCode,
                formId: formData.formId, 
                parent: formData.parent,
                status: active
            }

            setIsLoading(true);

            const response = await axios.put(`${MENU_SERVICE_UPDATE_MENU}`, requestBody, { headers })

            setTimeout(() => {
                console.log('Response', response.data);
                setIsLoading(false);
                onClose();
                // showSuccessToast('Menu updated successfully');
                showDynamicSweetAlert('Success!', 'Menu updated successfully.', 'success');
                handleSubmit();
                setFormData(initialFormData);
            }, 500)

        } catch (error) {
            console.error('Error Update Menu Data', error)
            showDynamicSweetAlert('Error!', error, 'error');
            setIsLoading(false);
        }
    }

    // Handle Modal
    const handleCloseModal = () => {
        setFormData(initialFormData);
        onClose()
    }

    // API Call 
    useEffect(() => {
        fetchMenuData();
        fetchModuleInfo();
    }, [menu, isOpen]);

    return (
        <Modal show={isOpen} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Menu</Modal.Title>
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
                            readOnly
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
                            <option>Select Parent</option>
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

export default UpdateMenuModal