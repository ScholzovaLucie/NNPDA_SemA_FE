import ApiClient from "./ApiClient";
import AuthService from "./AuthService";

class DeviceService {
  // Načtení zařízení uživatele
  async getUserDevices() {
    return await ApiClient.get("/devices/me");
  }

  // Načtení všech dostupných zařízení
  async getAllDevices() {
    return await ApiClient.get("/devices/all");
  }

  // Vytvoření nového zařízení (CreateDeviceDTO)
  async createDevice(name, description) {
    const createDeviceDTO = {
      name: name,
      description: description, // přidává popis, pokud je součástí CreateDeviceDTO
    };
    return await ApiClient.post("/devices/create", createDeviceDTO);
  }

  // Aktualizace zařízení (UpdateDeviceDTO)
  async updateDevice(id, name, description) {
    const updateDeviceDTO = {
      id: id,
      name: name,
      description: description, // aktualizace popisu, pokud je součástí UpdateDeviceDTO
    };
    return await ApiClient.put("/devices", updateDeviceDTO);
  }

  // Odstranění zařízení podle ID
  async deleteDevice(id) {
    const getByIdDTO = { id: id };
    return await ApiClient.delete("/devices/", getByIdDTO);
  }

  // Přiřazení existujícího zařízení k uživateli (AssignDeviceDTO)
  async assignDeviceToUser(deviceId) {
    // Získání ID uživatele z AuthService
    const userId = AuthService.getCurrentUserId();

    const assignDeviceDTO = {
      deviceId: deviceId,
      userId: userId,
    };

    return await ApiClient.post("/devices/assign", assignDeviceDTO);
  }

  // Odebrání zařízení od uživatele
  async removeDeviceFromUser(deviceId) {
    const assignDeviceDTO = { deviceId: deviceId };
    return await ApiClient.delete("/devices/remove", assignDeviceDTO); // Předání dat
  }

  // Načtení všech senzorů
  async getAllSensors() {
    return await ApiClient.get("/sensors/all");
  }

  // Načtení senzorů připojených k danému zařízení
  async getSensorsForDevice(deviceId) {
    return await ApiClient.get("/sensors/device/", { device_id: deviceId });
  }

  async getSensorData(sensorId, page, size) {
    const response = await ApiClient.get(`/sensor/data/all`, {
      sensor_id: sensorId,
      page: page,
      size: size,
    });
    return response.content;
  }

  // Vytvoření nového senzoru (CreateSensorDTO)
  async createSensor(name, description, latitude, longitude) {
    const createSensorDTO = {
      name: name,
      description: description,
      latitude: latitude,
      longitude: longitude,
    };
    return await ApiClient.post("/sensors/", createSensorDTO);
  }

  // Aktualizace senzoru (UpdateSensorDTO)
  async updateSensor(id, name, description, latitude, longitude) {
    const updateSensorDTO = {
      id: id,
      name: name,
      description: description,
      latitude: latitude,
      longitude: longitude,
    };
    return await ApiClient.put("/sensors/", updateSensorDTO);
  }

  // Aktualizace senzoru (UpdateSensorDTO)
  async deleteSensor(id) {
    const deleteSensorDTO = {
      id: id,
    };
    return await ApiClient.delete("/sensors/", deleteSensorDTO);
  }

  // Přiřazení senzoru k zařízení (AssignSensorDTO)
  async assignSensorToDevice(sensorId, deviceId) {
    const assignSensorDTO = {
      sensorId: sensorId,
      deviceId: deviceId,
    };
    return await ApiClient.post("/sensors/assign", assignSensorDTO);
  }

  // Odebrání senzoru z zařízení
  async removeSensorFromDevice(sensorId, deviceId) {
    const assignSensorDTO = {
      sensorId: sensorId,
      deviceId: deviceId,
    };
    return await ApiClient.delete("/sensors/remove", assignSensorDTO);
  }
}

export default new DeviceService();
