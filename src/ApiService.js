// apiService.js
import axios from 'axios';
import Cookies from 'js-cookie';

class ApiService {
    constructor(baseURL) {
      this.api = axios.create({
        baseURL: baseURL || 'http://localhost:2024', // Hlavní URL serveru
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Přidání tokenu k neautentizačním endpointům
      this.api.interceptors.request.use(
        (config) => {
          const authEndpoints = ['/auth/signup', '/auth/login', '/auth/reset-password'];
          
          if (!authEndpoints.some(endpoint => config.url.includes(endpoint))) {
            const token = Cookies.get('authToken'); // Načítání tokenu z cookies
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          }
          return config;
        },
        (error) => Promise.reject(error)
      );
    }

    async login(data) {
        try {
          const response = await this.api.post('/auth/login', data);
          Cookies.set('authToken', response.token, { expires: 7 }); // Uložení tokenu do cookies na 7 dní
          return response.data;
        } catch (error) {
          this.handleError(error);
        }
      }
  
    // Metoda pro GET
    async get(url, params = {}) {
      try {
        const response = await this.api.get(url, { params });
        return response.data;
      } catch (error) {
        this.handleError(error);
      }
    }
  
    // Metoda pro POST
    async post(url, data) {
      try {
        const response = await this.api.post(url, data);
        return response.data;
      } catch (error) {
        this.handleError(error);
      }
    }
  
    // Zpracování chyb
    handleError(error) {
      console.error('API Error:', error);
    }
  }
  
  export default new ApiService('http://localhost:2024');
  
  