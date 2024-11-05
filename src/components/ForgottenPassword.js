import React, { useState } from 'react';
import {
    Avatar, Container, TextField, Button, Typography, Alert, Box,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

function ForgottenPassword() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await AuthService.forgottenPassword(username);
            setSuccess('Reset token byl úspěšně odeslán na váš email.');
            setTimeout(() => navigate('/set-new-password'), 3000);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError('Uživatel nebyl nalezen.');
            } else {
                setError('Nastala chyba při odesílání požadavku.');
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockResetIcon />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                    Zapomenuté heslo
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Uživatelské jméno"
                        variant="outlined"
                        margin="normal"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Odeslat
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default ForgottenPassword;
