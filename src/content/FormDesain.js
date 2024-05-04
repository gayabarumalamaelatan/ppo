import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const FormDesain = () => {
    const [formData, setFormData] = useState({
        branch: '',
        module: '',
        formCode: '',
        formName: '',
        description: '',
        needApproval: 0
    });

    const [detailData, setDetailData] = useState([{
        ID_FORM: '',
        FORM_CODE: '',
        FIELD_NAME: '',
        DESCRIPTION: '',
        LOOKUP_TABLE: '',
        DATA_TYPE: '',
        MIN_LENGTH: '',
        MAX_LENGTH: '',
        STATUS: '',
        CREATED_AT: '',
        UPDATED_AT: '',
        PRIMARY_KEY_COLUMN: '',
        IS_PRIMARY_KEY: '',
        DISPLAY_FORMAT: '',
        IS_DETAIL: '',
        IS_MANDATORY: ''
    }]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        console.log(detailData);
        // Handle form submission
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
        setFormData(prevState => ({
            ...prevState,
            [name]: newValue
        }));
    };

    const handleDetailChange = (index, e) => {
        const { name, value } = e.target;
        const newDetailData = [...detailData];
        newDetailData[index][name] = value;
        setDetailData(newDetailData);
    };

    const addDetailRow = () => {
        setDetailData([...detailData, {
            ID_FORM: '',
            FORM_CODE: '',
            FIELD_NAME: '',
            DESCRIPTION: '',
            LOOKUP_TABLE: '',
            DATA_TYPE: '',
            MIN_LENGTH: '',
            MAX_LENGTH: '',
            STATUS: '',
            CREATED_AT: '',
            UPDATED_AT: '',
            PRIMARY_KEY_COLUMN: '',
            IS_PRIMARY_KEY: '',
            DISPLAY_FORMAT: '',
            IS_DETAIL: '',
            IS_MANDATORY: ''
        }]);
    };

    const removeDetailRow = (index) => {
        const newDetailData = [...detailData];
        newDetailData.splice(index, 1);
        setDetailData(newDetailData);
    };

    useEffect(() => {
        if (detailData.length === 0) {
            addDetailRow();
        }
    }, []); // Empty dependency array to run this effect only once when component mounts

    return (
        <Fragment>
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Module</h1>
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">
                <div className="card card-default">
                    <div className="card-header">
                        <h3 className="card-title">Form Builder</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="container">
                                <div className="form-group row">
                                    <label htmlFor="branch" className="col-sm-2 col-form-label">Departemen</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="branch"
                                            name="branch"
                                            value={formData.module}
                                            onChange={handleChange}
                                            placeholder="Enter Departemen"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="module" className="col-sm-2 col-form-label">Module</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="module"
                                            name="module"
                                            value={formData.module}
                                            onChange={handleChange}
                                            placeholder="Enter Module"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="formCode" className="col-sm-2 col-form-label">Form Code</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="formCode"
                                            name="formCode"
                                            value={formData.formCode}
                                            onChange={handleChange}
                                            placeholder="Enter Form Code"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="formName" className="col-sm-2 col-form-label">Form Name</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="formName"
                                            name="formName"
                                            value={formData.formName}
                                            onChange={handleChange}
                                            placeholder="Enter Form Name"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="description" className="col-sm-2 col-form-label">Description</label>
                                    <div className="col-sm-10">
                                        <textarea
                                            rows={3}
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Enter Description"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                <label htmlFor="description" className="col-sm-2 col-form-label">Workflow</label>
                                    <div className="col-sm-10">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="defaultWorkflow"
                                                name="workflowOption"
                                                value="default"
                                                checked={formData.workflowOption === 'default'}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="defaultWorkflow">
                                                Default
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="customWorkflow"
                                                name="workflowOption"
                                                value="custom"
                                                checked={formData.workflowOption === 'custom'}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="customWorkflow">
                                                Custom
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </form>
                    </div>
                </div>
                <div className="card card-default">
                    <div className="card-header">
                        <h3 className="card-title">Form Detail</h3>
                    </div>
                    <div className="card-body">
                        {detailData.map((detail, index) => (
                            <div key={index}>
                                <div className="row">
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="ID Form"
                                            name="ID_FORM"
                                            value={detail.ID_FORM}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Form Code"
                                            name="FORM_CODE"
                                            value={detail.FORM_CODE}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Field Name"
                                            name="FIELD_NAME"
                                            value={detail.FIELD_NAME}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Description"
                                            name="DESCRIPTION"
                                            value={detail.DESCRIPTION}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Lookup Table"
                                            name="LOOKUP_TABLE"
                                            value={detail.LOOKUP_TABLE}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Data Type"
                                            name="DATA_TYPE"
                                            value={detail.DATA_TYPE}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Min Length"
                                            name="MIN_LENGTH"
                                            value={detail.MIN_LENGTH}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Max Length"
                                            name="MAX_LENGTH"
                                            value={detail.MAX_LENGTH}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Status"
                                            name="STATUS"
                                            value={detail.STATUS}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>

                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Primary Key Column"
                                            name="PRIMARY_KEY_COLUMN"
                                            value={detail.PRIMARY_KEY_COLUMN}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Is Primary Key"
                                            name="IS_PRIMARY_KEY"
                                            value={detail.IS_PRIMARY_KEY}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Display Format"
                                            name="DISPLAY_FORMAT"
                                            value={detail.DISPLAY_FORMAT}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Is Detail"
                                            name="IS_DETAIL"
                                            value={detail.IS_DETAIL}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Is Mandatory"
                                            name="IS_MANDATORY"
                                            value={detail.IS_MANDATORY}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    {/* Add other input fields */}

                                    <div className="col">
                                        <button type="button" className="btn btn-danger" onClick={() => removeDetailRow(index)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary" onClick={addDetailRow}>Add Row</button>
                    </div>


                </div>
                <div className="card-footer">
                    <button type="submit" className="btn btn-primary float-right">Submit</button>
                </div>
            </section>
        </Fragment>
    );
};

export default FormDesain;
