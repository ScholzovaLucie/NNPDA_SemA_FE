import ApiClient from './ApiClient';

class DeviceService {
    // Načtení zařízení uživatele
    async getUserDevices() {
        return await ApiClient.get('/devices/me');
    }

    // Načtení všech dostupných zařízení
    async getAllDevices() {
        return await ApiClient.get('/devices/all');
    }

    // Vytvoření nového zařízení (CreateDeviceDTO)
    async createDevice(name, description) {
        const createDeviceDTO = {
            name: name,
            description: description // přidává popis, pokud je součástí CreateDeviceDTO
        };
        return await ApiClient.post('/devices/create', createDeviceDTO);
    }

    // Aktualizace zařízení (UpdateDeviceDTO)
    async updateDevice(id, name, description) {
        const updateDeviceDTO = {
            id: id,
            name: name,
            description: description // aktualizace popisu, pokud je součástí UpdateDeviceDTO
        };
        return await ApiClient.put('/devices', updateDeviceDTO);
    }

    // Odstranění zařízení podle ID
    async deleteDevice(id) {
        const getByIdDTO = { id };
        return await ApiClient.delete('/devices', { data: getByIdDTO });
    }

    // Přiřazení existujícího zařízení k uživateli (AssignDeviceDTO)
    async assignDeviceToUser(deviceId, userId) {
        const assignDeviceDTO = {
            deviceId: deviceId,
            userId: userId
        };
        return await ApiClient.post('/devices/assign', assignDeviceDTO);
    }

    // Odebrání zařízení od uživatele
    async removeDeviceFromUser(deviceId, userId) {
        const assignDeviceDTO = {
            deviceId: deviceId,
            userId: userId
        };
        return await ApiClient.delete('/devices/remove', { data: assignDeviceDTO });
    }

    // Načtení všech senzorů
    async getAllSensors() {
        return await ApiClient.get('/sensors/all');
    }

    // Načtení senzorů připojených k danému zařízení
    async getSensorsForDevice(deviceId) {
        return await ApiClient.get('/sensors/device', { device_id: deviceId });
    }

    // Vytvoření nového senzoru (CreateSensorDTO)
    async createSensor(name, type, unit) {
        const createSensorDTO = {
            name: name,
            type: type,
            unit: unit
        };
        return await ApiClient.post('/sensors', createSensorDTO);
    }

    // Aktualizace senzoru (UpdateSensorDTO)
    async updateSensor(id, name, type, unit) {
        const updateSensorDTO = {
            id: id,
            name: name,
            type: type,
            unit: unit
        };
        return await ApiClient.put('/sensors', updateSensorDTO);
    }

    // Přiřazení senzoru k zařízení (AssignSensorDTO)
    async assignSensorToDevice(sensorId, deviceId) {
        const assignSensorDTO = {
            sensorId: sensorId,
            deviceId: deviceId
        };
        return await ApiClient.post('/sensors/assign', assignSensorDTO);
    }

    // Odebrání senzoru z zařízení
    async removeSensorFromDevice(sensorId, deviceId) {
        const assignSensorDTO = {
            sensorId: sensorId,
            deviceId: deviceId
        };
        return await ApiClient.delete('/sensors/remove', { data: assignSensorDTO });
    }
}

export default new DeviceService();
