import ApiClient from './ApiClient';

class AuthService {
    // Registrace nového uživatele
    async registerUser(username, password, email) {
        return await ApiClient.post('/auth/signup', { username, password, email});
    }

    // Přihlášení uživatele
    async loginUser(username, password) {
        const user = await ApiClient.post('/auth/login', {username, password});
        console.log(user)

        if (!user) {
            throw new Error('Neplatné přihlašovací údaje');
        }

        ApiClient.setAuthToken(user.token);
        return { user, token: user.token };
    }

    // Odhlášení uživatele
    logoutUser() {
        ApiClient.setAuthToken(null);
    }

    async updateUserProfile(userData) {
        try {
            console.log(userData)
            const response = await ApiClient.put(`/users/${userData.id}`, userData); // Endpoint `/users/me` by měl aktualizovat údaje o uživateli
            return response;
        } catch (error) {
            console.error('Chyba při aktualizaci profilu uživatele:', error);
            throw error;
        }
    }
}

export default new AuthService();