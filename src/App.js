import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createStore } from 'redux'; // Import createStore
import { Provider } from 'react-redux'; // Import Provider
import './App.css';
import Login from "./pages/Login";
import Dashboard from './pages/dashboard';
import SessionTimeout from "./config/SessionTimeout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPasswordPage from "./pages/ResetPassword";
import formDataReducer from "./store/reducers/FormReducer";
import { RecoilRoot } from "recoil";
import NotFound from "./content/NotFound";
import Home from "./content/Home";

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