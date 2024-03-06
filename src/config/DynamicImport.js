import React from 'react';
import PageDown from '../content/PageDown';

const dynamicImportMap = {
  BifastDashboard: () => import('gritbifastmodule/BifastDashboard'),
  RtgsDashboard: () => import('gritbifastmodule/RtgsDashboard'),
  MicroFrontendComponent: () => import('gritswiftmodule/MicroFrontendComponent'),
  AllServerDashboard: () => import('gritsmartinmodule/AllServerDashboard'),
  SmartinEndpoints: () => import('gritsmartinmodule/SmartinEndpoints'),
  SmartinUpload: () => import('gritsmartinmodule/SmartinUpload'),
  SocketManager: () => import('gritsmartinmodule/SocketManager'),
  Customers: () => import('gritmoneymarketmodule/Customers'),
  MoneyMarketTransaction: () => import('gritmoneymarketmodule/MoneyMarketTransaction'),
  CreateTransaction: () => import('grittrademodule/CreateTransaction'),
  // Tambahkan lebih banyak mapping sesuai kebutuhan
};

export const DynamicLazyImport = (moduleName, componentName) => {
  const importFn = dynamicImportMap[componentName];
  if (!importFn) {
    console.warn(`No dynamic import found for: ${componentName}`);
    return PageDown;
  }
  return React.lazy(() =>
    importFn().catch(() => {
      console.error(`Error loading the component: ${componentName}`);
      return { default: PageDown };
    })
  );
};
