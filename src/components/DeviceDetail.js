import React, { useState, useEffect } from 'react';
import { Container, List, ListItem, ListItemText, Button, Typography, Box } from '@mui/material';
import DeviceService from './../services/DeviceService';
import { useParams, useNavigate } from 'react-router-dom';

function DeviceDetail() {
    const { deviceId } = useParams();
    const [sensors, setSensors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSensors = async () => {
            try {
                const response = await DeviceService.getSensorsForDevice(deviceId);
                setSensors(response);
            } catch (error) {
                console.error("Chyba při načítání senzorů:", error);
            }
        };

        fetchSensors();
    }, [deviceId]);

    return (
        <Container>
            <Box mt={5} textAlign="center">
                <Typography variant="h4">Detaily zařízení</Typography>
                <List>
                    {sensors.map((sensor) => (
                        <ListItem button={true} key={sensor.id}>
                            <ListItemText primary={sensor.name} />
                        </ListItem>
                    ))}
                </List>
                <Button variant="contained" color="primary" onClick={() => navigate(`/assign-sensor/${deviceId}`)}>
                    Přiřadit senzor
                </Button>
            </Box>
        </Container>
    );
}

export default DeviceDetail
