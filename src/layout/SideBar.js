/* eslint-disable no-undef */
import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MENU_SERVICE_MODULES } from '../config/ConfigApi';
import { useDispatch } from 'react-redux';
import { updateFormData } from '../store/actions/FormAction';
import { useRecoilState } from 'recoil';
import { permissionsState } from '../store/Permission'; 
import { menusState }from '../store/RecoilFormTemplate';

const { getToken } = require('../config/Constants');

export default function SideBar() {
  const [menuData, setMenuData] = useState([]);
  const [permissions, setPermissions] = useRecoilState(permissionsState);
  const[menuForm, setMenuForm] = useRecoilState(menusState);

  const dispatch = useDispatch();

  const userId = sessionStorage.id;
  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${MENU_SERVICE_MODULES}?userId=${userId}`, { headers });
      setMenuData(response.data);
     // console.log(response.data);

      const newPermissions = {};
      response.data.forEach(module => {
        newPermissions[module.moduleName] = {};
        module.menu.forEach(menuItem => {
          newPermissions[module.moduleName][menuItem.menuName] = {
            create: menuItem.create,
            update: menuItem.update,
            delete: menuItem.delete,
            verify: menuItem.verify,
            auth: menuItem.auth,
          };
          if (menuItem.subMenu && menuItem.subMenu.length > 0) {
            menuItem.subMenu.forEach(subMenuItem => {
              newPermissions[module.moduleName][subMenuItem.menuName] = {
                create: subMenuItem.create,
                update: subMenuItem.update,
                delete: subMenuItem.delete,
                verify: subMenuItem.verify,
                auth: subMenuItem.auth,
              };
            })
          };
        });
      });
      //console.log('Permissions:', newPermissions);
      const accessPermissions = JSON.stringify(newPermissions);

      setPermissions(newPermissions);
      sessionStorage.setItem('permisions', accessPermissions);

      loadTreeview();

    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const loadTreeview = () => {
   // console.log("Load Treeview")
    window.$('[data-widget="treeview"]').each(function () {
        if ($(this).data('treeview-init') === undefined) {
            $(this).Treeview('init');
            $(this).data('treeview-init', true);
        }
    });
  }
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleMenuItemClick = (event, menuItem) => {
    //console.log('menu Item', menuItem);
    setMenuForm(menuItem);
    if (menuItem.idForm) {
      dispatch(updateFormData(menuItem.idForm, menuItem.prefixTable,menuItem.menuName,menuItem.formCode || ''));
    }
  };

  const renderModule = (module) => {
    return (
      <li className="nav-item" key={module.moduleName}>
        <Link to={module.url} className="nav-link">
          <i className={module.icon}></i>
          {module.moduleName && <p>{module.moduleName} {module.menu && module.menu.length > 0 && <i className="right fas fa-angle-left"></i>}</p>}
          
        </Link>
        {module.menu && module.menu.length > 0 && (
          <ul className="nav nav-treeview">
            {renderMenuItems(module.menu)}
          </ul>
        )}
      </li>
    );
  };

  const renderMenuItems = (menuItems) => {
    return menuItems.map((menuItem) => {
      const shouldRenderMenuItem =
        menuItem.menuName &&
        (menuItem.create || menuItem.update || menuItem.delete || menuItem.verify || menuItem.auth);

      return shouldRenderMenuItem ? (
        <li className="nav-item" key={menuItem.menuName}>
          <Link
            to={menuItem.url}
            className="nav-link"
            onClick={(event) => handleMenuItemClick(event, menuItem)}
          >
          <i className={menuItem.icon}></i>
          {menuItem.menuName && <p>{menuItem.menuName}  
            {menuItem.subMenu && menuItem.subMenu.length > 0 && <i className="right fas fa-angle-left"></i>} </p>}
          </Link>
          {menuItem.subMenu && menuItem.subMenu.length > 0 && (
          <ul className="nav nav-treeview">
            {renderSubMenuItems(menuItem.subMenu)}
          </ul>
        )}
        </li>
      ) : null;
    });
  };

  

  const renderSubMenuItems = (menuItems) => {
    return menuItems.map((menuItem) => {
      const shouldRenderMenuItem =
        menuItem.menuName &&
        (menuItem.create || menuItem.update || menuItem.delete || menuItem.verify || menuItem.auth);
        const isFormMenu = menuItem.url === '/form';

      return shouldRenderMenuItem ? (
        <li className="nav-item" key={menuItem.menuName}>
          <Link
            to={menuItem.url}
            className="nav-link"
            onClick={(event) => handleMenuItemClick(event, menuItem)}
          >
            <i className={menuItem.icon}></i>
            {menuItem.menuName && <p>{menuItem.menuName}</p>}
          </Link>
        </li>
      ) : null;
    });
  };
  
  const renderModuleItems = (data) => {
    return data.map((module) => {
      return module.menu && module.menu.length > 0 ? renderModule(module) : null;
    });
  };

  const username = sessionStorage.userId;

  return (
    <Fragment>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img src="../dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
            </div>
            <div className="info">
              <a href="#" className="d-block">{username}</a>
            </div>
          </div>


          <div className="form-inline">
            <div className="input-group" data-widget="sidebar-search">
              <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw"></i>
                </button>
              </div>
            </div>
          </div>
          {/* Menu */}
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <li className="nav-header">MENU</li>
              <li className="nav-item" key="home">
                <a href="/" className="nav-link">
                  <i className="nav-icon fas fa-home"></i>
                  <p>Home</p>
                </a>
              </li>
              {renderModuleItems(menuData)}
            </ul>
          </nav>
        </div>
      </aside>
    </Fragment>
  );
}