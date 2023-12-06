import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { token } from '../../config/Constants';
import { FORM_SERVICE_INSERT_DATA, FORM_SERVICE_LOAD_DATA, FORM_SERVICE_UPDATE_DATA, FORM_SERVICE_VIEW_DATA } from '../../config/ConfigApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSyncAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { showSuccessToast } from '../../toast/toast';
import axios from 'axios';
import { showDynamicSweetAlert } from '../../toast/Swal';

const FormEdit = ({ isOpen, onClose, columns, menuName, getFormCode, data, keyCol, refecthCallBack }) => {
    const headers = { Authorization: `Bearer ${token}` };
    const [lookupTableData, setLookupTableData] = useState({});
    const [formDataEdit, setFormDataEdit] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    console.log('formcode', getFormCode);
    console.log('data Edit', data);



    const initialFormValues = {};
    columns.forEach((column) => {
        initialFormValues[column.accessor] = '';
        //console.log('init', initialFormValues);
    });

    const fetchData = async () => {
        console.log('Fetch DATA');

        if (data !== null) {
            console.log('masuk');
            const firstValue = Object.values(data)[0];
            const firstObject = columns[0].accessor;
            try {
                const response = await axios.get(`${FORM_SERVICE_VIEW_DATA}?f=${getFormCode}&column=${keyCol}&value=${firstValue}`, { headers })
                console.log('Data Edit:', response.data);
                setFormDataEdit(response.data);

            } catch (error) {
                console.error('Error View data:', error);
            }
        } else {
            //console.log("gak masuk datanya null");
        }

    }



    useEffect(() => {
        const columnsWithLookupTable = columns.filter((column) => column.lookupTable !== null);

        if (columnsWithLookupTable.length > 0) {
            // Create an array of promises for fetching data
            const fetchPromises = columnsWithLookupTable.map((column) =>
                fetch(`${FORM_SERVICE_LOAD_DATA}?t=${column.lookupTable}`, { headers })
                    .then((response) => response.json())
                    .then((data) => {
                       // console.log('API Response for', column.accessor, ':', data.data);
                        return data; // Return data to preserve it in the promise chain
                    })
            );

            // Execute all fetch promises in parallel
            Promise.all(fetchPromises)
                .then((dataArray) => {
                    //console.log('dataArray:', dataArray);
                    const lookupData = {};

                    // Ensure that dataArray matches the order of columnsWithLookupTable
                    columnsWithLookupTable.forEach((column, index) => {
                        if (dataArray[index].data && Array.isArray(dataArray[index].data)) {
                            // Ensure dataArray[index].data is an array before using it
                            lookupData[column.accessor] = dataArray[index].data;
                        }
                    });

                   // console.log('lookupTableData:', lookupData);
                    setLookupTableData(lookupData);
                })
                .catch((error) => {
                    console.error('Error loading data from API:', error);
                });
        }
        fetchData();
    }, [data]);

    const sendDataToAPI = (formDataEdit, successCallback) => {
        //console.log('form data Edit ', formDataEdit);

        // for (const key in formDataEdit) {
        //     if (typeof formDataEdit[key] === 'string') {
        //         formDataEdit[key] = formDataEdit[key].trim();
        //     }
        // }

        const firstValue = Object.values(data)[0];

        if (formDataEdit[keyCol] !== undefined) {
            delete formDataEdit[keyCol];
        }


        // Define the API endpoint URL for your POST request
        const apiUrl = `${FORM_SERVICE_UPDATE_DATA}?f=${getFormCode}&column=${keyCol}&value=${firstValue}`;

        // Create the request options, including method, headers, and body
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formDataEdit), // Convert the form data to JSON format
        };

        // Send the POST request to the API endpoint
        fetch(apiUrl, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Handle the API response data as needed
                //console.log('API Response:', data);

                if (data.message === "Update Data Successfully") {
                    setTimeout(() => {
                        // Call the successCallback function to close the modal
                        successCallback();
                        // Show a success toast with the API response message
                        //showSuccessToast(data.message);
                        showDynamicSweetAlert('Success!', data.message, 'success');

                        refecthCallBack();
                        const resetData = { ...initialFormValues };
                        // Update the form data state to trigger a re-render with the reset values
                        setFormDataEdit(resetData);
                        setIsLoading(false);
                    }, 1000);



                }


            })
            .catch((error) => {
                // Handle any errors that occurred during the fetch
                console.error('Error sending data to API:', error);
                showDynamicSweetAlert('Error!', error.message, 'error');
            });
    };


    const handleEditSave = () => {
        setIsLoading(true);
        // Call the sendDataToAPI function with the formData
        sendDataToAPI(formDataEdit, () => {
            // This function is called when the API request is successful
            // You can close the modal or perform other actions here
            onClose(); // Close the modal
        });
    };

    const handleReset = () => {
        // Create a copy of the initial form values
        const resetData = { ...initialFormValues };

        // Update the form data state to trigger a re-render with the reset values
        setFormDataEdit(resetData);
    };

    //console.log('lookupTableData ', lookupTableData);
    return (
        <Modal show={isOpen} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit {menuName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Form untuk mengedit data */}
                    <div className="row">
                        {columns.map((column) => (
                            <div className="col-md-6" key={column.accessor}>
                                <Form.Group>
                                    <Form.Label htmlFor={column.accessor}>{column.Header}</Form.Label>
                                    {column.lookupTable !== null ? (
                                        <Form.Control as="select" id={column.accessor} name={column.accessor} value={formDataEdit[column.accessor] || ''} onChange={(e) => setFormDataEdit({ ...formDataEdit, [column.accessor]: e.target.value })}>
                                            <option value="">Select an option: {column.accessor}</option>
                                            {Array.isArray(lookupTableData[column.accessor]) &&
                                                lookupTableData[column.accessor].map((option) => (
                                                    <option
                                                        key={Object.values(option)[3]}
                                                        value={Object.values(option)[0]}
                                                    >
                                                        {Object.values(option)[1]}
                                                    </option>
                                                ))}
                                        </Form.Control>
                                    ) : (
                                        <Form.Control
                                            type="text"
                                            id={column.accessor}
                                            name={column.accessor}
                                            value={formDataEdit[column.accessor] || ''}
                                            onChange={(e) =>
                                                setFormDataEdit({
                                                    ...formDataEdit,
                                                    [column.accessor]: e.target.value,
                                                })
                                            }
                                            disabled={column.accessor === keyCol}
                                        />
                                    )}
                                </Form.Group>
                            </div>
                        ))}
                    </div>
                </Form>
                {isLoading && (
                    <div className="full-screen-overlay">
                        <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} /> Batal
                </Button>
                <Button variant="primary" onClick={handleEditSave}>
                    <FontAwesomeIcon icon={faSave} /> Simpan Perubahan
                </Button>
            </Modal.Footer>
        </Modal>

    );
};

export default FormEdit;
