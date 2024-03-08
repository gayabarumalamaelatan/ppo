import axios from 'axios';
import { FORM_SERVICE_LOAD_DATA } from '../config/ConfigApi';

const LookupService = {
    
  // Fungsi untuk mengambil data lookup dari server
  fetchLookupData: async (lookupTable, headers) => {
    try {
      const response = await axios.get(`${FORM_SERVICE_LOAD_DATA}?t=${lookupTable}&lookup=YES&page=1&size=500`, {
        headers: {
          Authorization: `Bearer ${headers}` // Tambahkan token otorisasi di sini
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching lookup data:', error);
      throw new Error('Failed to fetch lookup data');
    }
  }
};

export default LookupService;
