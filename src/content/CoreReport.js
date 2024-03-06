import React, { Fragment, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRecoilValue } from "recoil";
import { getToken } from "../config/Constants";
import { REPORT_SERVICE_DOWNLOAD_REPORT, REPORT_SERVICE_GENERATE_REPORT, REPORT_SERVICE_GET_PARAM } from "../config/ConfigApi";
import { showDynamicSweetAlert } from "../toast/Swal";
import axios from "axios";
import { menusIdState } from "../store/MenuId";

const CoreReport = () => {
    const initialFormState = {};
    const menus = useRecoilValue(menusIdState);
    const menuId = menus["menuId"];
    const menuName = menus["menuName"];
    const [formData, setFormData] = useState(initialFormState);
    const [reportHtml, setReportHtml] = useState(""); // Tambahkan state baru untuk menyimpan respons HTML
    const [exportType, setExportType] = useState("PDF"); // State untuk jenis ekspor
    const [getParam, setGetParam] = useState([]);
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };

    console.log("menuId", menuId);
    console.log("menuName", menuName);

    const fetchParam = async () => {
        try {
            const response = await axios.get(`${REPORT_SERVICE_GET_PARAM}?menuId=${menuId}`, { headers });
            setGetParam(response.data);
        } catch (error) {
            showDynamicSweetAlert('Error!', "Error Fetching Data", 'error');
        }
    };

    useEffect(() => {
        fetchParam();
    }, [menuId]);

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => { // Ubah menjadi async function untuk melakukan request ke backend
        e.preventDefault();
        // Di sini Anda bisa menambahkan logika untuk mengirim data ke backend untuk menghasilkan laporan
        console.log(formData);
        const urlParams = new URLSearchParams(formData);
        const urlString = urlParams.toString();
        console.log("urlString", urlString);
        try {
            const response = await axios.get(`${REPORT_SERVICE_GENERATE_REPORT}?${urlString}&menuId=${menuId}`, { headers });
            setReportHtml(response.data);
        } catch (error) {
            showDynamicSweetAlert('Error!', "Error Fetching Data", 'error');
        }

    };

    const handleExport = async () => {
        // Implementasi logika ekspor sesuai dengan jenis yang dipilih
        const urlParams = new URLSearchParams(formData);
        const urlString = urlParams.toString();
        console.log("urlString", urlString);
        try {
            const response = await axios.get(`${REPORT_SERVICE_DOWNLOAD_REPORT}?${urlString}&menuId=${menuId}&format=${exportType}`, { headers });
        
            // Create a Blob object from the PDF response
            const blob = new Blob([response.data]);
        
            // Create a temporary URL for the Blob
            const url = window.URL.createObjectURL(blob);
        
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            link.download = 'report.pdf'; // Set the download attribute
            document.body.appendChild(link);
        
            // Trigger the click event on the link to start the download
            link.click();
        
            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error fetching or saving PDF:', error);
            showDynamicSweetAlert('Error!', "Error Fetching Data", 'error');
        }
        


        // if (exportType === "PDF") {
        //     // Logika ekspor PDF
        // } else if (exportType === "XLSX") {
        //     // Logika ekspor XLSX
        // } else if (exportType === "HTML") {
        //     // Logika ekspor HTML
        //     const element = document.createElement("a");
        //     const file = new Blob([reportHtml], { type: 'text/html' });
        //     element.href = URL.createObjectURL(file);
        //     element.download = "report.html";
        //     document.body.appendChild(element); // Required for this to work in FireFox
        //     element.click();
        // }
    };
    return (
        <Fragment>
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Report</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/">Home</a></li>
                                <li className="breadcrumb-item active">Report</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
                <div className="card">
                    <div class="row">
                        <div class="col-12">
                            <div className="card-header">
                                <h2 className="card-title">Generate Report</h2>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <form onSubmit={handleSubmit} className="row">
                                        {getParam.map((field, index) => (
                                            <div className="form-group col-md-4" key={index}>
                                                <label htmlFor={field.parameter}>{field.parameter}</label>
                                                <div className={"input-group"}>
                                                    {field.typeData === "date" ? (
                                                        <div className="input-group">
                                                            <DatePicker
                                                                className="form-control"
                                                                selected={formData[field.parameter] ? new Date(formData[field.parameter]) : null}
                                                                onChange={(date) => handleChange(field.parameter, date ? date.toISOString().split('T')[0] : null)}
                                                                dateFormat="yyyy-MM-dd"
                                                            />
                                                            <div className="input-group-append">
                                                                <div className="input-group-text">
                                                                    <i className="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type={field.typeData}
                                                            className="form-control"
                                                            id={field.parameter}
                                                            name={field.parameter}
                                                            value={formData[field.parameter] || ''}
                                                            onChange={(e) => handleChange(field.parameter, e.target.value)}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="form-group col-md-12 text-right">
                                            <button type="submit" className="btn btn-primary">Load Report</button>
                                        </div>
                                    </form>

                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {reportHtml && ( // Tampilkan card baru jika respons HTML tersedia
                <section className="content">
                    <div className="row mt-4">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body" >
                                    <iframe title="Report" srcDoc={reportHtml} style={{ width: '100%', height: '500px', border: 'none' }} />
                                </div>
                                <div className="card-footer">
                                    <div className="row">
                                        <div className="col-md-2">
                                            <select className="form-control" value={exportType} onChange={(e) => setExportType(e.target.value)}>
                                                <option value="PDF">PDF</option>
                                                <option value="XLSX">XLSX</option>
                                                <option value="HTML">HTML</option>
                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <button className="btn btn-success" onClick={handleExport}>Export</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </Fragment>
    )
}
export default CoreReport;
