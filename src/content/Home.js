import React, { Fragment, useState } from 'react';
//import { WidthProvider, Responsive } from 'react-grid-layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
// import { INTEGRATION_SERVICE_GET_GRAPHIC, INTEGRATION_SERVICE_GET_GRAPHIC_POSITION } from '../config/ConfigApi';
// import axios from 'axios';
// import { useEffect } from 'react';

// const ResponsiveGridLayout = WidthProvider(Responsive);
// const { token } = require('../config/Constants');

// const initialLayout = [
//     {
//         "w": 6,
//         "h": 7,
//         "x": 0,
//         "y": 0,
//         "i": "1",
//         "moved": false,
//         "static": false
//     },
//     {
//         "w": 4,
//         "h": 7,
//         "x": 6,
//         "y": 0,
//         "i": "2",
//         "moved": false,
//         "static": false
//     },
//     {
//         "w": 10,
//         "h": 7,
//         "x": 0,
//         "y": 7,
//         "i": "3",
//         "moved": false,
//         "static": false
//     }
// ];

const Home = () => {
    //     const [iframeItems, setIframeItems] = useState([]);
    //     const [loadLayout, setLoadLayout] = useState([]);

    //     const fetchLayout = async () => {
    //         try {

    //             const headers = { Authorization: `Bearer ${token}` };
    //             const response = await axios.get(`${INTEGRATION_SERVICE_GET_GRAPHIC_POSITION}`, { headers });


    //             const transformedLayout = response.data.map(item => ({
    //                 w: item.w,
    //                 h: item.h,
    //                 x: item.x,
    //                 y: item.y,
    //                 i: item.idGraphic.toString(),
    //                 moved: item.moved,
    //                 static: item.static
    //             }));
    //             console.log(transformedLayout);
    //             setLoadLayout(transformedLayout);

    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };



    //     const fetchData = async () => {
    //         try {

    //             const headers = { Authorization: `Bearer ${token}` };
    //             const response = await axios.get(`${INTEGRATION_SERVICE_GET_GRAPHIC}`, { headers });


    //             const transformedData = response.data.map(item => ({
    //                 id: item.id.toString(),
    //                 url: item.url
    //             }));
    //             console.log('url',transformedData);
    //             setIframeItems(transformedData);

    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     useEffect(() => {
    //         fetchLayout();
    //         fetchData();
    //     }, []);


    //     // Extracting layouts from iframeItems for ResponsiveGridLayout
    //     const layouts = {
    //         lg: loadLayout
    //     };

    //     const addIframe = (url) => {
    //         const id = Math.random().toString(36).substr(2, 9);
    //         setIframeItems([...iframeItems, { id, url }]);
    //     };

    //     const removeIframe = (id) => {
    //         setIframeItems(iframeItems.filter(item => item.id !== id));
    //     };

    //     const [lastLayout, setLastLayout] = useState(null);

    //     // Handler untuk mendeteksi perubahan layout
    //     const handleLayoutChange = (layout) => {
    //         setLastLayout(layout);
    //     };

    //     // Fungsi untuk mencatat layout terakhir ke console
    //     const saveLayout = () => {
    //         if (lastLayout) {
    //             console.log(lastLayout);
    //         } else {
    //             console.log("Tidak ada perubahan layout.");
    //         }
    //     };

    return (
        <Fragment>
            {/* <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Enter New URL" id="newIframeUrl" />
                                <div className="input-group-append">
                                    <button type="button" className="btn btn-primary" onClick={() => addIframe(document.getElementById('newIframeUrl').value)}>
                                        <i className="fas fa-plus mr-1"></i> Add
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <nav aria-label="breadcrumb" className="float-sm-right">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item active ">
                                        <button className="btn btn-info" onClick={saveLayout}><i className="fas fa-save mr-1"></i> Save</button>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>


            </section>

            <section className="content">
                <ResponsiveGridLayout className="layout" layouts={layouts}
                    onLayoutChange={handleLayoutChange}
                    rowHeight={30}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}>
                    {iframeItems.map(item => (
                        <div key={item.id} className="card">
                            <div className="card-body">
                                <iframe style={{ width: '100%', height: '100%' }}
                                    src={item.url}
                                    title={`iframe-${item.id}`}
                                    frameBorder="0"></iframe>
                            </div>
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </section> */}
            <section className="content-header">
                <div className="container my-5">
                    <div className="text-center mb-4">
                        <h1>Welcome to Your Dashboard</h1>
                        <p>Get a quick overview of your activity and discover insights.</p>
                    </div>

                    <div className="row">
                        <div className="col-lg-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h3 className="card-title">BiFast Payment Monitoring</h3>
                                    <p className="card-text">Perform an important action related to BiFast Payment.</p>
                                    <a href="/bifast-txn" className="btn btn-primary">Go</a>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h3 className="card-title">SWIFT Payment Monitoring</h3>
                                    <p className="card-text">Perform an important action related to SWIFT Payment.</p>
                                    <a href="/swift-txn" className="btn btn-primary">Go</a>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h3 className="card-title">RTGS Payment Monitoring</h3>
                                    <p className="card-text">Perform an important action related to RTGS Payment.</p>
                                    <a href="/rtgs-txn" className="btn btn-primary">Go</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    );
};

export default Home;
