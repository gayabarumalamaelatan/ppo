import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Fungsi untuk menampilkan toast sukses
export const showSuccessToast = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

// Fungsi untuk menampilkan toast error
export const showErrorToast = (message) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
