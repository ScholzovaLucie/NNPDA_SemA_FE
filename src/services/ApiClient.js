import axios from "axios";
import Cookies from "js-cookie";

class ApiClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true // Umožňuje posílat cookies s každým požadavkem
    });

    // Interceptor pro přidání tokenu u každého požadavku kromě autentizace
    this.client.interceptors.request.use(
      (config) => {
        const authEndpoints = ['/auth/login', '/auth/signup', '/auth/forgot-password'];
        const isAuthEndpoint = authEndpoints.some(endpoint => config.url.includes(endpoint));

        if (!isAuthEndpoint) {
          const token = this.getTokenFromCookies();
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  getTokenFromCookies() {
    return Cookies.get("authToken");
  }

  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers["Authorization"] = `Bearer ${token}`;
      Cookies.set("authToken", token, {
        expires: 1, // Platnost 1 den
        sameSite: "None", // Explicitně nastaví SameSite na 'None'
        secure: true, // Vyžaduje HTTPS
      });
    } else {
      delete this.client.defaults.headers["Authorization"];
      Cookies.remove("authToken");
    }
  }

  // GET požadavek
  async get(url, params = {}) {
    try {
      const response = await this.client.get(url, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // POST požadavek
  async post(url, data) {
    try {
      const response = await this.client.post(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // PUT požadavek
  async put(url, data) {
    try {
      const response = await this.client.put(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // DELETE požadavek
  async delete(url) {
    try {
      const response = await this.client.delete(url);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Chybové zpracování
  handleError(error) {
    if (error.response) {
      console.error("Response data:", error.response);
    } else if (error.request) {
      console.error("Request data:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
}

export default new ApiClient("http://localhost:2024");
