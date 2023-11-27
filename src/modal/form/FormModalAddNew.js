import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { token } from '../../config/Constants';
import { FORM_SERVICE_INSERT_DATA, FORM_SERVICE_LOAD_DATA } from '../../config/ConfigApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSyncAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { showSuccessToast } from '../../toast/toast';

const FormModalAddNew = ({ isOpen, onClose, columns, menuName, formCode, reFormfetchCallback }) => {
  const headers = { Authorization: `Bearer ${token}` };
  const [lookupTableData, setLookupTableData] = useState({});
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false); 

  //console.log('formcode', formCode);

  const initialFormValues = {};
  columns.forEach((column) => {
    initialFormValues[column.accessor] = '';
    //console.log('init', initialFormValues);
  });

  useEffect(() => {
    const columnsWithLookupTable = columns.filter((column) => column.lookupTable !== null);

    if (columnsWithLookupTable.length > 0) {
      // Create an array of promises for fetching data
      const fetchPromises = columnsWithLookupTable.map((column) =>
        fetch(`${FORM_SERVICE_LOAD_DATA}?t=${column.lookupTable}`, { headers })
          .then((response) => response.json())
          .then((data) => {
            //console.log('API Response for', column.accessor, ':', data.data);
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
  }, [columns]);

  const sendDataToAPI = (formData, successCallback) => {
    // Define the API endpoint URL for your POST request
    const apiUrl = `${FORM_SERVICE_INSERT_DATA}?f=${formCode}`;

    // Create the request options, including method, headers, and body
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData), // Convert the form data to JSON format
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

        if (data.message === "insert Data Successfully") {

          setTimeout(() => {
            // Call the successCallback function to close the modal
          successCallback();
          // Show a success toast with the API response message
          showSuccessToast(data.message);

          reFormfetchCallback();
          const resetData = { ...initialFormValues };
          // Update the form data state to trigger a re-render with the reset values
          setFormData(resetData);
            setIsLoading(false);
        }, 1000);
          


        }


      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error('Error sending data to API:', error);
      });
  };


  const handleSave = () => {
    setIsLoading(true);
    // Call the sendDataToAPI function with the formData
    sendDataToAPI(formData, () => {
      // This function is called when the API request is successful
      // You can close the modal or perform other actions here
      
      
      onClose(); // Close the modal
    });
  };

  const handleReset = () => {
    // Create a copy of the initial form values
    const resetData = { ...initialFormValues };

    // Update the form data state to trigger a re-render with the reset values
    setFormData(resetData);
  };

  //console.log('lookupTableData ', lookupTableData);
  return (
    <Modal show={isOpen} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New : {menuName} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="row">
            {columns.map((column) => (
              <div className="col-md-6" key={column.accessor}>
                <Form.Group>
                  <Form.Label htmlFor={column.accessor}>{column.Header}</Form.Label>
                  {column.lookupTable !== null ? (
                    <Form.Control as="select" id={column.accessor} name={column.accessor} value={formData[column.accessor] || ''} onChange={(e) => setFormData({ ...formData, [column.accessor]: e.target.value })}>
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
                      value={formData[column.accessor] || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [column.accessor]: e.target.value,
                        })
                      }
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
          <FontAwesomeIcon icon={faTimes} /> Close
        </Button>
        <Button variant="danger" onClick={handleReset}>
          <FontAwesomeIcon icon={faSyncAlt} /> Reset
        </Button>
        <Button variant="primary" onClick={handleSave}>
          <FontAwesomeIcon icon={faSave} /> Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormModalAddNew;
