import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Footer from "./Footer";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/onlinejobportal/api/candidates/login",
        { email, password }
      );

      if (response.status === 200) {
        const { candidateId } = response.data;
        localStorage.setItem("userEmail", email);
        localStorage.setItem("candidateId", candidateId);

        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      {/* Header */}
      <header
        style={{ width: "100%", backgroundColor: "#275df5", padding: "15px 0" }}
      >
        <Container
          maxWidth="lg"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Satoshi",
          }}
        >
          <Typography
            variant="h5"
            color="white"
            component="a"
            href="/"
            style={{ textDecoration: "none" }}
          >
            Job Portal
          </Typography>
          <Typography color="white">
            Don't have an account?{" "}
            <Button
              variant="outlined"
              color="inherit"
              href="/register"
              sx={{
                borderRadius: "10px",
                borderColor: "white",
                color: "white",
              }}
            >
              REGISTER
            </Button>
          </Typography>
        </Container>
      </header>

      {/* Main Content */}
      <Container maxWidth="sm">
        <Grid container spacing={3} style={{ marginTop: "50px" }}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Typography variant="h4" color="#275df5">
              Login
            </Typography>
          </Grid>

          {error && (
            <Grid item xs={12} style={{ textAlign: "center", color: "red" }}>
              {error}
            </Grid>
          )}

          <Grid item xs={12}>
            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ borderRadius: "10px" }}
              />
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ borderRadius: "10px" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                type="submit"
                fullWidth
                style={{ marginTop: "20px", backgroundColor: "#275df5", color: "white", borderRadius: "10px" }}
              >
                Login
              </Button>
            </form>
          </Grid>

          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Typography variant="body2">
              Don't have an account? <a href="/register">Register here</a>
            </Typography>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </>
  );
}

export default LoginPage;
