import React, { Fragment, useState, useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../content/Home'
import NotFound from '../content/NotFound';
import axios from 'axios';
import { MENU_SERVICE_MODULES } from '../config/ConfigApi';
import FormTemplate from '../content/FormTemplate';
import PageDown from '../content/PageDown';
import { DynamicLazyImport } from '../config/DynamicImport';
const { getToken } = require('../config/Constants');

// const BifastDashboard = React.lazy(() => import("gritbifastmodule/BifastDashboard"));
//  const Smendpoint = React.lazy(() => import("gritsmartinmodule/SmartinEndpoints"));

export default function Content() {
  const userId = sessionStorage.id;
  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };
  // const [routeRoles, setRouteRoles] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${MENU_SERVICE_MODULES}?userId=${userId}`, { headers }) // Replace with your API endpoint
      .then((response) => {
        setMenuData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching menu data:', error);
        setIsLoading(false);
      });
  }, []);


  // const parseElement = (elementString) => {
  //     if (/^[A-Z][A-Za-z0-9]*$/.test(elementString)) {
  //       const Component =  require(`../content/${elementString}`).default
  //       return <Component />;
  //     } else {
  //       console.error(`Invalid React component name: ${elementString}`);
  //       return null;
  //     }
  // };



  // const parseElement = (elementString) => {
  //   console.log(elementString);
  //   if (/^[A-Z][A-Za-z0-9]*$/.test(elementString)) {
  //     // Attempt to dynamically import the component if it's a remote component
  //     if (elementString.startsWith('MOD')) {
  //       const LazyComponent = React.lazy(() => 
  //         import('megamodule/MicroFrontendComponent')
  //           .catch(() => {
  //             console.error('Remote module is not available');
  //             return { default: PageDown };
  //           })
  //       );
  //       return (
  //         <Suspense fallback={<div>Loading Remote Component...</div>}>
  //           <LazyComponent />
  //         </Suspense>
  //       );
  //     } else {
  //       // Require the component locally if it's not a remote component
  //       const Component = require(`../content/${elementString}`).default;
  //       return <Component />;
  //     }
  //   } else {
  //     console.error(`Invalid React component name: ${elementString}`);
  //     return <PageDown />;
  //   }
  // };

  const componentConfig = {
    components: [
      // Array of objects mapping component names to their dynamic import paths
      {
        moduleName: 'gritbifastmodule',
        componentName: 'BifastDashboard'
      },
      {
        moduleName: 'gritbifastmodule',
        componentName: 'RtgsDashboard'
      },
      {
        moduleName: 'gritswiftmodule',
        componentName: 'MicroFrontendComponent'
      },
      {
        moduleName: 'gritsmartinmodule',
        componentName: 'AllServerDashboard'
      },
      {
        moduleName: 'gritsmartinmodule',
        componentName: 'SmartinEndpoints'
      },
      {
        moduleName: 'gritsmartinmodule',
        componentName: 'SmartinUpload'
      },
      {
        moduleName: 'gritsmartinmodule',
        componentName: 'SocketManager'
      },
      // ... other components SmartinEndpoints
    ]
  };
  
  // Parse and load the component dynamically
  const parseElement = (elementString) => {
    const configEntry = componentConfig.components.find(config => config.componentName === elementString);
  
    if (configEntry) {
      // If found, use dynamic import with React.lazy
      const LazyComponent = DynamicLazyImport(configEntry.moduleName, configEntry.componentName);
      return (
        <Suspense fallback={<div>Loading {elementString}...</div>}>
          <LazyComponent />
        </Suspense>
      );
    } else {
      // If not found, attempt to require the component locally
      try {
        const Component = require(`../content/${elementString}`).default;
        return <Component />;
      } catch (error) {
        // If local require fails, log the error and render a fallback
        console.error(`Cannot load local component: ${elementString}`, error);
        return <PageDown />;
      }
    }
  };

  const generateRoutesModules = (menuData) => {
    //console.log(menuData);
    return menuData.map((module) => {
      return (
        <Fragment key={module.url}>
          <Route
            path={module.url}
            element={module.element ? parseElement(module.element) : null}
          />
          {module.menu &&
            module.menu.length > 0 &&
            generateRoutesMenu(module.menu)}
        </Fragment>
      );
    });
  };

  const generateRoutesMenu = (menuItems) => {
    return menuItems.map((menuItem) => {
      const shouldRenderMenuItem =
        menuItem.menuName &&
        (menuItem.create ||
          menuItem.update ||
          menuItem.delete ||
          menuItem.verify ||
          menuItem.auth);
      return shouldRenderMenuItem ? (
        <Fragment key={menuItem.url}>
          <Route
          key={menuItem.url}
          path={menuItem.url}
          element={menuItem.element ? parseElement(menuItem.element) : null}
        />
          {menuItem.subMenu && menuItem.subMenu.length > 0 && (
          generateRoutesSubMenu(menuItem.subMenu)
          )}
        </Fragment>

      ) : null;
    });
  };

  const generateRoutesSubMenu = (menuItems) => {
    return menuItems.map((menuItem) => {
      const shouldRenderMenuItem =
        menuItem.menuName &&
        (menuItem.create ||
          menuItem.update ||
          menuItem.delete ||
          menuItem.verify ||
          menuItem.auth);
      return shouldRenderMenuItem ? (
        <Route
          key={menuItem.url}
          path={menuItem.url}
          element={menuItem.element ? parseElement(menuItem.element) : null}
        />
      ) : null;
    });
  };

  if (isLoading) {
    // Show a loading indicator while the data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='*' element={<NotFound />} />
          {menuData && generateRoutesModules(menuData)}
          {/* {generateRoutesModules(menuData)}  */}
          {/* <Route path="/mfe" element={<Smendpoint />} /> */}
          {/* <Route path="/swift" element={<SwiftDashboard />} /> */}
        </Routes>
      </div>
    </Fragment>
  )
}