// apiService.js
import axios from "axios";
import Cookies from "js-cookie";

class ApiClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
      }); // Uložení tokenu do cookies
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
    console.error("API Error:", error);
    if (error.response) {
      // Server odpověděl s jiným stavovým kódem než 2xx
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    } else if (error.request) {
      // Žádost byla odeslána, ale nedošla žádná odpověď
      console.error("Request data:", error.request);
    } else {
      // Chyba při nastavení požadavku
      console.error("Error message:", error.message);
    }
    throw error;
  }
}

export default new ApiClient("http://localhost:2024");
