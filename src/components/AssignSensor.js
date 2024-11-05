import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import DeviceService from './../services/DeviceService';
import { useParams, useNavigate } from 'react-router-dom';

function AssignSensor() {
    const { deviceId } = useParams();
    const [sensors, setSensors] = useState([]);
    const [selectedSensorId, setSelectedSensorId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvailableSensors = async () => {
            try {
                const response = await DeviceService.getAllSensors();
                setSensors(response);
            } catch (error) {
                console.error("Chyba při načítání senzorů:", error);
            }
        };

        fetchAvailableSensors();
    }, []);

    const handleAssign = async () => {
        try {
            await DeviceService.assignSensorToDevice(selectedSensorId, deviceId);
            navigate(`/device/${deviceId}`);
        } catch (error) {
            console.error("Chyba při přiřazování senzoru:", error);
        }
    };

    return (
        <Container>
            <Box mt={5} textAlign="center">
                <Typography variant="h4">Přiřaďte senzor k zařízení</Typography>
                <TextField
                    select
                    label="Vyberte senzor"
                    value={selectedSensorId}
                    onChange={(e) => setSelectedSensorId(e.target.value)}
                    SelectProps={{
                        native: true,
                    }}
                    fullWidth
                >
                    <option value="">Vyberte...</option>
                    {sensors.map((sensor) => (
                        <option key={sensor.id} value={sensor.id}>
                            {sensor.name}
                        </option>
                    ))}
                </TextField>
                <Button variant="contained" color="primary" onClick={handleAssign}>
                    Přiřadit
                </Button>
            </Box>
        </Container>
    );
}

export default AssignSensor;
