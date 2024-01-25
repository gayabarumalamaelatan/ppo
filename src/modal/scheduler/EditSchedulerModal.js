import React, { useEffect, useState } from "react";
import { getToken } from "../../config/Constants";
import { showDynamicSweetAlert } from "../../toast/Swal";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { SCHEDULER_SERVICE_UPDATE } from "../../config/ConfigApi";

const EditSchedulerModal = ({isOpenModal, onClose, onSubmit, dataScheduler}) => {
    
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };
    const [isLoading, setIsLoading] = useState(false);

    const initialFormData = {
        name: '',
        description: '',
        minute: '',
        hour: '',
        day: '',
        month: '',
        week: '',
        status: '',
    }

    const [formData, setFormData] = useState(initialFormData);

    const parseCronExpression = (cronExpression) => {
        const parts = cronExpression.split(' ');

        return {
            minute: parts[1],
            hour: parts[2],
            day: parts[3],
            month: parts[4],
            week: parts[5],
        }
    };

    const setDataForm = () => {
        if (dataScheduler) {
            const cronData = parseCronExpression(dataScheduler.scheduled)
            setFormData({
                name: dataScheduler.name,
                description: dataScheduler.description,
                minute: cronData.minute,
                hour: cronData.hour,
                day: cronData.day,
                month: cronData.month,
                week: cronData.week,
                status: dataScheduler.status
            })
        }
    };

    useEffect(() => {
        setDataForm();
    }, [dataScheduler])

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async () => {

        const cronExpression = `${formData.minute} ${formData.hour} ${formData.day} ${formData.month} ${formData.week}`

        const postData = {
            id: dataScheduler.id,
            name: formData.name,
            description: formData.description,
            scheduled: cronExpression,
            status: formData.status,
        };
        try {
            setIsLoading(true);

            const response = await axios.put(`${SCHEDULER_SERVICE_UPDATE}`, postData, {headers});
            console.log('API Response: ', response.data);
            
            setTimeout(() => {
                onClose();
                setIsLoading(false);
                setFormData(initialFormData);
                showDynamicSweetAlert('Success!','Schedule edited successfully!', 'success');
                onSubmit();
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
        <Modal show={isOpenModal} onHide={onClose}>
            {isLoading && 
                (
                    <div className="full-screen-overlay">
                        <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
                    </div>
                )
            }
            <Modal.Header closeButton>
                    <Modal.Title>Create New Scheduler</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                    {/* Add your form fields here */}
                    {/* Name */}
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                        />
                    </Form.Group>
                    {/* Description */}
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                        />
                    </Form.Group>
                    {/* Cron Expression Fields */}
                    <Form.Group>
                        <div className="row">
                            {/* Minute */}
                            <div className="col">
                                <Form.Label>Minute</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="minute"
                                    value={formData.minute}
                                    onChange={handleFormChange}
                                />
                            </div>
                            {/* Hour */}
                            <div className="col">
                                <Form.Label>Hour</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="hour"
                                    value={formData.hour}
                                    onChange={handleFormChange}
                                />
                            </div>
                            {/* Day */}
                            <div className="col">
                                <Form.Label>Day</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="day"
                                    value={formData.day}
                                    onChange={handleFormChange}
                                />
                            </div>
                            {/* Month */}
                            <div className="col">
                                <Form.Label>Month</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="month"
                                    value={formData.month}
                                    onChange={handleFormChange}
                                />
                            </div>
                            {/* Week */}
                            <div className="col">
                                <Form.Label>Week</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="week"
                                    value={formData.week}
                                    onChange={handleFormChange}
                                />
                            </div>
                        </div>
                    </Form.Group>
                    {/* Status */}
                    <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            as="select"
                            name="status"
                            value={formData.status}
                            onChange={handleFormChange}
                        >   
                            <option>Status of Scheduler</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    <FontAwesomeIcon icon={faSave} /> Save
                </Button>
            </Modal.Footer>
        </Modal>

    )
}

export default EditSchedulerModal