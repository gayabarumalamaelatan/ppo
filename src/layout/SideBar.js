/* eslint-disable no-undef */
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MENU_SERVICE_MODULES } from "../config/ConfigApi";
import { useDispatch } from "react-redux";
import { updateFormData } from "../store/actions/FormAction";
import { useRecoilState } from "recoil";
import { permissionsState } from "../store/Permission";
import { menusState } from "../store/RecoilFormTemplate";
import { menusIdState } from "../store/MenuId";
import { updateMenuData } from "../store/actions/MenuAction";

const { getToken } = require("../config/Constants");

export default function SideBar() {
  const [menuData, setMenuData] = useState([]);
  const [permissions, setPermissions] = useRecoilState(permissionsState);
  const [menuForm, setMenuForm] = useRecoilState(menusState);
  const [menuId, setMenuId] = useRecoilState(menusIdState);
  const [activeItem, setActiveItem] = useState({
    moduleName: null,
    menuName: null,
    subMenuName: null,
  });

  const dispatch = useDispatch();

  const userId = sessionStorage.id;
  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };
  console.log("Current menuId:", menuId);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${MENU_SERVICE_MODULES}?userId=${userId}`,
        { headers }
      );
      setMenuData(response.data);

      const newPermissions = {};
      response.data.forEach((module) => {
        newPermissions[module.moduleName] = {};
        module.menu.forEach((menuItem) => {
          newPermissions[module.moduleName][menuItem.menuName] = {
            create: menuItem.create,
            update: menuItem.update,
            delete: menuItem.delete,
            verify: menuItem.verify,
            auth: menuItem.auth,
          };
          if (menuItem.subMenu && menuItem.subMenu.length > 0) {
            menuItem.subMenu.forEach((subMenuItem) => {
              newPermissions[module.moduleName][subMenuItem.menuName] = {
                create: subMenuItem.create,
                update: subMenuItem.update,
                delete: subMenuItem.delete,
                verify: subMenuItem.verify,
                auth: subMenuItem.auth,
              };
            });
          }
        });
      });
      const accessPermissions = JSON.stringify(newPermissions);

      setPermissions(newPermissions);
      sessionStorage.setItem("permisions", accessPermissions);

      loadTreeview();
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const loadTreeview = () => {
    window.$('[data-widget="treeview"]').each(function () {
      if ($(this).data("treeview-init") === undefined) {
        $(this).Treeview("init");
        $(this).data("treeview-init", true);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMenuItemClick = (
    event,
    menuItem,
    moduleItem,
    subMenuItem = null
  ) => {
    setActiveItem({
      moduleName: moduleItem.moduleName,
      menuName: menuItem.menuName,
      subMenuName: subMenuItem ? subMenuItem.menuName : null,
    });
    console.log(menuItem.menuId);
    setMenuId(menuItem);
    dispatch(
      updateMenuData(menuItem.menuId, menuItem.menuName, menuItem.formCode || "")
    );
    sessionStorage.setItem("idForm", subMenuItem ? subMenuItem.idForm : menuItem.idForm);
    const itemWithForm =
      subMenuItem && subMenuItem.idForm
        ? subMenuItem
        : menuItem.idForm
          ? menuItem
          : null;
      console.log("itemWithForm:", itemWithForm);
    if (itemWithForm) {
      setMenuForm(itemWithForm); // Assuming setMenuForm can accept either menuItem or subMenuItem
      dispatch(
        updateFormData(
          itemWithForm.idForm,
          itemWithForm.prefixTable,
          itemWithForm.menuName,
          itemWithForm.formCode || ""
        )
      );
    }
  };

  const renderModule = (module) => {
    return (
      <li className="nav-item" key={module.moduleName}>
        <Link
          to={module.url}
          className={`nav-link ${activeItem.moduleName === module.moduleName ? "menu-open active" : ""}`}
        >
          <i className={module.icon}></i>
          {module.moduleName && (
            <p>
              {module.moduleName}
              {module.menu && module.menu.length > 0 && (
                <i className="right fas fa-angle-left"></i>
              )}
            </p>
          )}
        </Link>
        {module.menu && module.menu.length > 0 && (
          <ul className="nav nav-treeview" key={module.moduleName}>
            {renderMenuItems(module.menu, module)}
          </ul>
        )}
      </li>
    );
  };

  const renderMenuItems = (menuItems, moduleItem) => {
    return menuItems.map((menuItem) => {
      const shouldRenderMenuItem =
        menuItem.menuName &&
        (menuItem.create ||
          menuItem.update ||
          menuItem.delete ||
          menuItem.verify ||
          menuItem.auth);

      return shouldRenderMenuItem ? (
        <li className="nav-item" key={menuItem.menuName}>
          <Link
            to={menuItem.url}
            className={`nav-link ${activeItem.menuName === menuItem.menuName ? "active" : ""}`}
            onClick={(event) =>
              handleMenuItemClick(event, menuItem, moduleItem)
            }
          >
            <i className={menuItem.icon}></i>
            {menuItem.menuName && (
              <p>
                {menuItem.menuName}
                {menuItem.subMenu && menuItem.subMenu.length > 0 && (
                  <i className="right fas fa-angle-left"></i>
                )}
              </p>
            )}
          </Link>
          {menuItem.subMenu && menuItem.subMenu.length > 0 && (
            <ul className="nav nav-treeview" key={menuItem.menuName}>
              {renderSubMenuItems(menuItem.subMenu, menuItem, moduleItem)}
            </ul>
          )}
        </li>
      ) : null;
    });
  };

  const renderSubMenuItems = (subMenuItems, menuItem, moduleItem) => {
    return subMenuItems.map((subMenuItem) => {
      const shouldRenderSubMenuItem =
        subMenuItem.menuName &&
        (subMenuItem.create ||
          subMenuItem.update ||
          subMenuItem.delete ||
          subMenuItem.verify ||
          subMenuItem.auth);

      return shouldRenderSubMenuItem ? (
        <li className="nav-item" key={subMenuItem.menuName}>
          <Link
            to={subMenuItem.url}
            className={`nav-link ${activeItem.subMenuName === subMenuItem.menuName ? "active" : ""}`}
            onClick={(event) =>
              handleMenuItemClick(event, menuItem, moduleItem, subMenuItem)
            }
          >
            <i className={subMenuItem.icon}></i>
            {subMenuItem.menuName && <p>{subMenuItem.menuName}</p>}
          </Link>
        </li>
      ) : null;
    });
  };

  const renderModuleItems = (data) => {
    return data.map((module) => {
      return module.menu && module.menu.length > 0
        ? renderModule(module)
        : null;
    });
  };

  const username = sessionStorage.userId;

  return (
    <Fragment>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src="../dist/img/logoptap.jpg"
                // className="img-circle elevation-2"
                className="img-logonew"
                alt="User Image"
              />
            </div>
            {/* <div className="info">
              <a href="#" className="d-block">
                {username}
              </a>
            </div> */}
          </div>

          <div className="form-inline">
            <div className="input-group" data-widget="sidebar-search">
              <input
                className="form-control form-control-sidebar"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw"></i>
                </button>
              </div>
            </div>
          </div>
          {/* Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
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
