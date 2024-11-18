import ApiClient from "./ApiClient";

class AuthService {
  getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.id : null;
  }

  // Registrace nového uživatele
  async registerUser(username, password, email) {
    return await ApiClient.post("/auth/signup", { username, password, email });
  }

  // Přihlášení uživatele
  async loginUser(username, password) {
    const user = await ApiClient.post("/auth/login", { username, password });

    if (!user) {
      throw new Error("Neplatné přihlašovací údaje");
    }

    ApiClient.setAuthToken(user.token);
    localStorage.setItem("user", JSON.stringify(user));
    return { user, token: user.token };
  }

  // Odhlášení uživatele
  logoutUser() {
    ApiClient.setAuthToken(null);
  }

  async updateUserProfile(userData) {
    try {
      const response = await ApiClient.put(`/users/${userData.id}`, userData); // Endpoint `/users/me` by měl aktualizovat údaje o uživateli
      return response;
    } catch (error) {
      console.error("Chyba při aktualizaci profilu uživatele:", error);
      throw error;
    }
  }

  // Forgotten hesla
  async forgottenPassword(username) {
    try {
      return await ApiClient.post("/auth/reset-password", { username });
    } catch (error) {
      console.error("Chyba při resetování hesla:", error);
      throw error;
    }
  }

  async setPassword(token, password) {
    try {
      return await ApiClient.post("/auth/set-password", { token, password });
    } catch (error) {
      console.error("Chyba při nastavování hesla:", error);
      throw error;
    }
  }

  async getUserData() {
    try {
      const response = await ApiClient.get(`/users/me`);
      return response;
    } catch (error) {
      console.error("Chyba při získávání uživatele:", error);
      throw error;
    }
  }

  async changePassword({ username, oldPassword, newPassword }) {
    try {
      const response = await ApiClient.post("/auth/change-password", {
        username,
        oldPassword,
        newPassword,
      });
      return response;
    } catch (error) {
      console.error("Chyba při změně hesla:", error);
      throw error;
    }
  }
}

export default new AuthService();
