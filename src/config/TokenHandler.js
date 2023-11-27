// TokenHandler.js
import React, { useState } from 'react';
import axios from 'axios';
import { AUTH_SERVICE_LOGOUT, AUTH_SERVICE_REFRESH_TOKEN, AUTH_SERVICE_VALIDATE_TOKEN } from './ConfigApi';
import { token } from './Constants';

const tokenRefreshInterval = 2 * 60 * 1000; // 4 minutes in milliseconds
let tokenRefreshTimer;


const isTokenExpired = async () => {
  try {
    // Lakukan permintaan API dengan token saat ini untuk memverifikasi apakah token masih berlaku
    await axios.get(`${AUTH_SERVICE_VALIDATE_TOKEN}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Jika permintaan berhasil (kode status 200), artinya token masih berlaku
    return false;
  } catch (error) {
    // Jika permintaan menghasilkan error dan kode status respons adalah 401 (Unauthorized),
    // artinya token telah kadaluwarsa
    if (error.response && error.response.status === 401) {
      return true;
    } else {
      // Jika terjadi kesalahan lain selain kode status 401, kita anggap token masih berlaku
      return false;
    }
  }
};

const handleLogout = () => {
  // Remove login information from session
  sessionStorage.clear();
  // Redirect to the login page after logout
  window.location.href = '/login';
};

const logoutUser = async () => {
  try {
    // Menggunakan Axios untuk melakukan permintaan POST ke API logout
    const response = await axios.post(`${AUTH_SERVICE_LOGOUT}`, {
      // Jika Anda memerlukan data tambahan untuk logout, tambahkan di sini
      userId: sessionStorage.getItem('userId')
    });
    // Cek status respons untuk menentukan apakah logout berhasil
    handleLogout(); // Panggil fungsi handleLogout jika logout berhasil

    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
    // Handle error jika permintaan logout gagal
  }
};

const refreshToken = async () => {
  if (!token) {
    console.log('Login');
  } else {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${AUTH_SERVICE_REFRESH_TOKEN}`, {
        headers,
      });

      const newAccessToken = response.data;
      //console.log(newAccessToken);

      sessionStorage.setItem('accessToken', newAccessToken);

      setTimeout(refreshToken, tokenRefreshInterval);
    } catch (error) {
      console.error('Error refreshing token:', error);

      if (error.response && error.response.status === 401) {
        // Jika respons memiliki status 401, panggil logoutUser()
        logoutUser();
      }
      // Handle token refresh error, e.g., logout user, show error message, etc.
      //logoutUser();
    }
  }
};



const startTokenRefresh = () => {
  if (!isTokenExpired()) {
    // If token is not expired, schedule next token refresh
    tokenRefreshTimer = setTimeout(refreshToken, tokenRefreshInterval);
  }
};

export { isTokenExpired, refreshToken, startTokenRefresh, logoutUser };
