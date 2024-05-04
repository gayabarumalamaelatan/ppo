import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Fragment, useEffect, useState } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { MENU_SERVICE_MODULES } from '../config/ConfigApi';
import CardCarousel from './CardCarousel';
import ShowTime from './DateTimeShow';
const { getToken } = require("../config/Constants");

const Home = () => {
    // Data from the response
    const [menuData, setMenuData] = useState([]);
    const userId = sessionStorage.id;
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${MENU_SERVICE_MODULES}?userId=${userId}`,
                { headers }
            );
            setMenuData(response.data);
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }
    useEffect(() => {
        fetchData();
        setActiveParentMenu(true);
    }, []);

    const [activeSubMenu, setActiveSubMenu] = useState(null);
    const [activeParentMenu, setActiveParentMenu] = useState(null);

    // Function to handle clicking on a card
    const handleCardClick = (subMenu) => {
        setActiveSubMenu(subMenu);
        setActiveParentMenu(null); // Hide parent menu
    };

    // Function to handle going back to the root menu
    const handleBackToRoot = () => {
        setActiveSubMenu(null);
        setActiveParentMenu(true);
    };

    return (
        <Fragment>
                <div class="jumbotron jumbotron-fluid">
                    <div class="container">
                        <h1 class="display-4">Welcome Aboard!</h1>
                        <p class="lead">
                            Now, it's <ShowTime/>.
                        </p>
                    </div>
                </div>
            <section className="content-header">
                {activeSubMenu && (
                    <div className="row mt-4">
                        <div className="col-lg-12">
                            <button className="btn btn-primary" onClick={handleBackToRoot}><i class="fa fa-arrow-left" aria-hidden="true"></i></button>
                        </div>
                    </div>
                )}
                <div className="container menu d-flex">
                    {/* Displaying active parent menu or root menu */}
                    {activeParentMenu && (
                    <div className="row">
                        {(activeParentMenu && activeParentMenu.subMenu ? activeParentMenu.subMenu : menuData).map((menu, index) => (
                            <div className="col-lg-3 mb-2" key={index}>
                                <div className="card" onClick={() => handleCardClick(menu.menu)}>
                                    <div className="card-body text-center">
                                        <i className={menu.icon} style={{ fontSize: '48px' }}></i>
                                        
                                    </div>
                                </div>
                                <p>{menu.moduleName}</p>{/* Module Name */}
                            </div>
                        ))}
                    </div>
                    )}

                    {/* Displaying submenu items if activeSubMenu is not null */}
                    {activeSubMenu && (
                        <div className="row">
                            {activeSubMenu.map((subMenuItem, subIndex) => (
                                <div className="col-lg-3 mb-2" key={subIndex}>
                                    <div className="card">
                                        <div className="card-body text-center">
                                            <i className={subMenuItem.icon} style={{ fontSize: '48px' }}></i>
                                             {/* Submenu Name */}
                                        </div>
                                    </div>
                                    <p>{subMenuItem.menuName}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Button to go back to root menu */}
                    <div className="container carousel" id='carousel'>
                        <CardCarousel/>
                    </div>
                </div>
            </section>
        </Fragment>
    );
};

export default Home;
