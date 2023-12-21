// AUTH-SERVICE
export const AUTH_SERVICE_BASE = process.env.REACT_APP_API_AUTH_SERVICE_BASE;
    // AUTH CONTROLLER
    export const AUTH_SERVICE_LOGIN = `${AUTH_SERVICE_BASE}/auth-service/login`;
    export const AUTH_SERVICE_LOGOUT =`${AUTH_SERVICE_BASE}/auth-service/user-logout`;
    export const AUTH_SERVICE_REFRESH_TOKEN = `${AUTH_SERVICE_BASE}/auth-service/token/refreshtoken`;
    export const AUTH_SERVICE_VALIDATE_TOKEN = `${AUTH_SERVICE_BASE}/auth-service/token/validate-token`;
    export const AUTH_SERVICE_VALIDATE_LOGIN = `${AUTH_SERVICE_BASE}/auth-service/test-login`;
   
    // USER CONTROLLER
    
    export const AUTH_SERVICE_CHECK_USER = `${AUTH_SERVICE_BASE}/auth-service/core-user/check-username`;
    export const AUTH_SERVICE_LIST_USER = `${AUTH_SERVICE_BASE}/auth-service/core-user/list`;
    export const AUTH_SERVICE_UPDATE_STATUS_USER = `${AUTH_SERVICE_BASE}/auth-service/core-user/update-status`;
    export const AUTH_SERVICE_FORCE_RESET_PASSWORD = `${AUTH_SERVICE_BASE}/auth-service/core-user/force-update-password`;
    export const AUTH_SERVICE_CHANGE_PASSWORD =`${AUTH_SERVICE_BASE}/auth-service/core-user/change-password`;



// USER-SERVICE
export const USER_SERVICE_BASE = process.env.REACT_APP_API_USER_SERVICE_BASE;
    //USER CONTROLLER
    export const USER_SERVICE_ADD_USER = `${USER_SERVICE_BASE}/user-service/user/add`;
    export const USER_SERVICE_UPDATE_USER = `${USER_SERVICE_BASE}/user-service/user/update`;
    export const USER_SERVICE_USER_DETAIL =`${USER_SERVICE_BASE}/user-service/user/detail`;

    //AUDIT TRAIL CONTROLLER
    export const USER_SERVICE_AUDITTRAIL_LIST = `${USER_SERVICE_BASE}/user-service/core-audit-trail/list`;

    //GROUP CONTROLLER LIST
    
    //export const USER_SERVICE_GROUP_ADD = `${USER_SERVICE_BASE}​/user-service​/core-group​/add`;
    export const USER_SERVICE_GROUP_ADD = `${USER_SERVICE_BASE}/user-service/core-group/add`;
    export const USER_SERVICE_GROUP_LIST = `${USER_SERVICE_BASE}/user-service/core-group/list`;
    export const USER_SERVICE_GROUP_ROLE_LIST = `${USER_SERVICE_BASE}/user-service/core-group/list-group-role`;
    export const USER_SERVICE_GROUP_ROLE_UPDATE = `${USER_SERVICE_BASE}/user-service/core-group/update`;
    export const USER_SERVICE_GROUP_ROLE_UPDATE_STATUS = `${USER_SERVICE_BASE}/user-service/core-group/update-status`;

    //ROLE CONTROLLER

    export const USER_SERVICE_ROLE_LIST = `${USER_SERVICE_BASE}/user-service/core-role/list`;
    export const USER_SERVICE_ADD_ROLE = `${USER_SERVICE_BASE}/user-service/core-role/add`;
    export const USER_SERVICE_EDIT_ROLE = `${USER_SERVICE_BASE}/user-service/core-role/update`;
    export const USER_SERVICE_UPDATE_STATUS_ROLE = `${USER_SERVICE_BASE}/user-service/core-role/update-status`;
     //Core role group mapping 

    export const USER_SERVICE_MAPPING_ROLE_GROUP_ADD = `${USER_SERVICE_BASE}/user-service/core-role-group/add`;
// MENU-SERVICE
export const MENU_SERVICE_BASE = process.env.REACT_APP_API_MENU_SERVICE_BASE;
    // MODULE CONTROLLER
    export const MENU_SERVICE_MODULES = `${MENU_SERVICE_BASE}/menu-service/core-module/module-with-menu`;
    export const MENU_SERVICE_ALL_MODULES = `${MENU_SERVICE_BASE}/menu-service/core-modules/list-all-modules`;
    export const MENU_SERVICE_ALL_MENU = `${MENU_SERVICE_BASE}/menu-service/core-menu/menus`;
    export const MENU_SERVICE_ADD_MENU_PERMISSION = `${MENU_SERVICE_BASE}/menu-service/core-permission/add`;
    export const MENU_SERVICE_MENU_PERMISSION = `${MENU_SERVICE_BASE}/menu-service/menu-permission`;
    export const MENU_SERVICE_CORE_MODULE = `${MENU_SERVICE_BASE}/menu-service/core-module/modules`;
    export const MENU_SERVICE_CORE_MODULE_GET_ID = `${MENU_SERVICE_BASE}/menu-service/core-module/module`;
    export const MENU_SERVICE_CORE_MODULE_ADD = `${MENU_SERVICE_BASE}/menu-service/core-module/add`;
    export const MENU_SERVICE_CORE_MODULE_UPDATE = `${MENU_SERVICE_BASE}/menu-service/core-module/update`;
    export const MENU_SERVICE_CORE_MODULE_DELETE = `${MENU_SERVICE_BASE}/menu-service/core-module/update-status-module`;
    export const MENU_SERVICE_LIST_MENU_PERMISSION = `${MENU_SERVICE_BASE}/menu-service/core-menu/list-all-menus`;
    
    export const MENU_SERVICE_DETAIL = `${MENU_SERVICE_BASE}/menu-service/core-menu/menu`;
    export const MENU_SERVICE_UPDATE_MENU = `${MENU_SERVICE_BASE}/menu-service/core-menu/update`;
    export const MENU_SERVICE_ADD_MENU = `${MENU_SERVICE_BASE}/menu-service/core-menu/add`;
    export const MENU_SERVICE_DELETE_MENU = `${MENU_SERVICE_BASE}/menu-service/core-menu/update-status-menu`;

// FORM-SERVICE
export const FORM_SERVICE_BASE = process.env.REACT_APP_API_FORM_SERVICE_BASE;
    // FORM CONTROLLER
    export const FORM_SERVICE_LOAD_FIELD = `${FORM_SERVICE_BASE}/form-service/form-field`;
    export const FORM_SERVICE_LOAD_DATA = `${FORM_SERVICE_BASE}/form-service/get-data`;
    export const FORM_SERVICE_INSERT_DATA = `${FORM_SERVICE_BASE}/form-service/insert-data`;
    export const FORM_SERVICE_UPDATE_DATA = `${FORM_SERVICE_BASE}/form-service/update-data`;
    export const FORM_SERVICE_DELETE_DATA = `${FORM_SERVICE_BASE}/form-service/delete-data`;
    export const FORM_SERVICE_VIEW_DATA = `${FORM_SERVICE_BASE}/form-service/get-detail-data`;

    // REPORT CONTROLLER
    export const FORM_SERVICE_REPORT_DATA_EXCEL = `${FORM_SERVICE_BASE}/form-service/generate/excel`;
    export const FORM_SERVICE_REPORT_DATA_CSV = `${FORM_SERVICE_BASE}/form-service/generate/csv`;

// SMARTIN-SERVICE
export const SMARTIN_SERVICE_BASE = process.env.REACT_APP_API_SMARTIN_SERVICE_BASE;
    //integration-controller
    export const SMARTIN_SERVICE_UPLOAD_FILE = `${SMARTIN_SERVICE_BASE}/integration-service/upload`;
    export const SMARTIN_SERVICE_UPLOAD_FILE_LIST = `${SMARTIN_SERVICE_BASE}/integration-service/uploaded-files`;
    export const INTEGRATION_SERVICE_GET_GRAPHIC = `${SMARTIN_SERVICE_BASE}/integration-service/graphics`;
    export const INTEGRATION_SERVICE_GET_GRAPHIC_POSITION = `${SMARTIN_SERVICE_BASE}/integration-service/graphic-position`;
    export const INTEGRATION_SERVICE_WSO_SOCKET = `${SMARTIN_SERVICE_BASE}/integration-service/wso/socket-manager`;

// LICENSE-SERVICE
export const LICENSE_SERVICE_BASE = process.env.REACT_APP_API_LICENSE_SERVICE_BASE;
    //LICESE-CONTROLLER
    export const LICENSE_SERVICE_CHECK = `${LICENSE_SERVICE_BASE}/license-service/check-license`;
