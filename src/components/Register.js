import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import { Link } from "react-router-dom";
import apiService from '../ApiService';
import {
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      var userData = {
        username: username,
        password: password,
        email: email
      }
      const response = await apiService.post('/auth/signup', userData);
      if (response) navigate('/login');
      
    } catch (err) {
      setError("Došlo k chybě: " + err.message);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Grid item xs={12} sm={8} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" align="center">Registrace</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}
            <form onSubmit={handleRegister} style={{with: "100%", margin: "0"}}>
              <TextField
                label="Uživatelské jméno"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                margin="normal"
                style={{width: "100%", margin: "0"}}
              />
              <TextField
                label="Heslo"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                  margin="normal"
                  style={{width: "100%", margin: "0"}}
              />
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                margin="normal"
                style={{with: "100%", margin: "0"}}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "16px", width: "100%", margin: "0" }}
              >
                Registrace
              </Button>
              <Link to="/login" color="primary" style={{ display: "flex", width: "100%", margin: "0"  }}>
                <Button variant="outlined" style={{ width: "100%", margin: "0"  }}>
                  Login
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Register;