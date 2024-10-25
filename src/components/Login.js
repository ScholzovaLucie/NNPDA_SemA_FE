import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import bcrypt from 'bcryptjs';  // Importujeme bcrypt pro porovnání hesla
import apiService from '../ApiService';
import { useAuth } from '../AuthContext';
import { TextField, Button, Typography, Alert, Card, CardContent, Grid } from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const userData = {
            username: username,
            password: password,
        };
        const response = await apiService.post('/auth/login', userData);
        console.log(response);

        if (response.token) {
            login(response.token);
            console.log('User logged in successfully');
            navigate('/');
        }
    

    } catch (err) {
      setError('Došlo k chybě: ' + err);
    }
  };

 
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item xs={12} sm={8} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" align="center">Přihlášení</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}
            <form onSubmit={handleLogin}>
              <TextField
                label="Uživatelské jméno"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                margin="normal"
              />
              <TextField
                label="Heslo"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
                Přihlásit se
              </Button>
              <Link to="/register" color="primary" style={{ marginTop: '16px' }}>
                <Button variant="outlined" style={{ marginBottom: '16px', marginTop: '16px' }}>Registrace</Button>
                </Link>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;