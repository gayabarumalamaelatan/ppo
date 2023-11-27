import React, { useState } from 'react';
import axios from 'axios';
import { SMARTIN_SERVICE_UPLOAD_FILE } from '../../config/ConfigApi';
import { showSuccessToast, showErrorToast } from '../../toast/toast';
import { Button, Form, Modal } from 'react-bootstrap';
import { upload } from '@testing-library/user-event/dist/upload';

const { userLoggin, token, active } = require('../../config/Constants');

const UploadSmartinModal = ({ show, handleClose : handleCloseModal, reloadData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [text, setText] = useState('');
    const [textError, setTextError] = useState('');
    const [fileError, setFileError] = useState('');

    const headers = { Authorization: `Bearer ${token}` };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };


    const handleSubmit = async () => {

        
        setTextError('');
        setFileError('');
        if (!text) {
            setTextError('Description is required.');
            return;
        }
    
        if (!file) {
            setFileError('File upload is required.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('text', text);

        try {
            setIsLoading(true);
            console.log('POST DATA', formData);

            // Send a POST request to the API
            const response = await axios.post(SMARTIN_SERVICE_UPLOAD_FILE, formData,
                {
                    'Content-Type': 'multipart/form-data',
                    headers
                });
            console.log('API Response:', response.data);
            if (response.status === 200) {
                setTimeout(() => {
                    handleClose();
                    setText('');
                    setFile(null);
                    setIsLoading(false);
                    showSuccessToast('File berhasil diunggah!');
                    reloadData();
                }, 1000);
                console.log('File berhasil diunggah!');
            } else {
                console.error('Terjadi kesalahan saat mengunggah file.');
            }


        } catch (error) {
            console.error('Error adding module:', error);
            setIsLoading(false);
            showErrorToast('An error occurred. Please try again later.');
        }
    };

    const handleReset = () => {
        setText('');
        setFile(null);
        setTextError('');
        setFileError('');
    };

    const handleClose = () => {
        handleReset(); // Mengatur ulang formulir saat menutup modal
        handleCloseModal(); // Menutup modal
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Upload File Smartin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="moduleName">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                        />
                        {textError && <div className="text-danger">{textError}</div>}
                    </Form.Group>
                    <Form.Group controlId="moduleName">
                        <Form.Label>File Upload</Form.Label>
                        <Form.Control
                            type="file"
                            name="file"
                            onChange={handleFileChange}
                            required
                        />
                        {fileError && <div className="text-danger">{fileError}</div>}
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
                    Upload
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

export default UploadSmartinModal;
