import React, { Fragment, useState } from 'react'
import axios from 'axios'; // Import axios
import { AUTH_SERVICE_LOGOUT } from '../config/ConfigApi';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faSyncAlt, faTimes, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


export default function Nav() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  

  const handleLogout = () => {
    // Remove login information from session
    sessionStorage.clear();
    // Redirect to the login page after logout
    navigate('/login');
  };

  const handleCloseModal = () => {

    setShowLogoutModal(false);
  };

  const logoutUser = async () => {
    try {
      // Menggunakan Axios untuk melakukan permintaan POST ke API logout
      const response = await axios.post(`${AUTH_SERVICE_LOGOUT}`, {
        // Jika Anda memerlukan data tambahan untuk logout, tambahkan di sini
        userId: sessionStorage.getItem('userId')
      });

      // Cek status respons untuk menentukan apakah logout berhasil
      console.log(response.status);
      if (response.status === 200) {
        setResponseMessage(response.data.message);
        handleLogout(); // Panggil fungsi handleLogout jika logout berhasil
      }

      console.log('Response:', response);
    } catch (error) {
      console.error('Error:', error);
      // Handle error jika permintaan logout gagal
    }
  };

  return (
    <Fragment>

      <nav className="main-header navbar navbar-expand navbar-white navbar-light">

        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
          </li>

        </ul>


        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="#" role="button" onClick={() => setShowLogoutModal(true)}>
              <i className="fa-solid fa-right-from-bracket"></i>
            </a>
          </li>
        </ul>
      </nav>
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
        <Modal.Header>
          <Modal.Title>Confirmation</Modal.Title>
          {/* Ganti ikon tombol close (X) */}
          <Button variant="link default" onClick={handleCloseModal}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
          <FontAwesomeIcon icon={faTimes} /> Cancel
          </Button>
          <Button variant="danger" onClick={() => {
            logoutUser();
            setShowLogoutModal(false);
          }}>
           <FontAwesomeIcon icon={faLock} /> Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  )
}
