import React from "react";
import { Provider } from 'react-redux'; // Import Provider
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from "recoil";
import { createStore } from 'redux'; // Import createStore
import './App.css';
import SessionTimeout from "./config/SessionTimeout";
import Login from "./pages/Login";
import ResetPasswordPage from "./pages/ResetPassword";
import Dashboard from './pages/dashboard';
import formDataReducer from "./store/reducers/FormReducer";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const store = createStore(formDataReducer); // Create Redux store

function App() {
  return (
    <Provider store={store}> {/* Wrap your app with Provider */}
    <RecoilRoot>
      <BrowserRouter>
        <SessionTimeout />
        <div className="wrapper">
          <Routes>
            <Route>
              <Route exact path="*" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/reset" element={<ResetPasswordPage />} />
              <Route path='*' element={<Dashboard />} />
            </Route>
          </Routes>
          <ToastContainer />
        </div>
      </BrowserRouter>
      </RecoilRoot>
    </Provider>
  );
}

export default App;