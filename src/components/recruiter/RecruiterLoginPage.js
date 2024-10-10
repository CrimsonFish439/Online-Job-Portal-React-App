import React, { useState } from "react";
import { Container, Grid, Typography, TextField, Button, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../home/Footer";

function RecruiterLoginPage() {
  // State variables for email, password, and error handling
  const [email, setEmail] = useState(""); // To store the entered email
  const [password, setPassword] = useState(""); // To store the entered password
  const [error, setError] = useState(""); // To handle error messages
  const navigate = useNavigate();

  // Function to handle the login submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    setError(""); // Reset the error state before attempting login

    console.log("Login attempt:");
    console.log("Email:", email); // Check if the email state is set
    console.log("Password:", password); // Check if the password state is se

    try {
      const response = await axios.post(
        "http://localhost:8080/onlinejobportal/api/recruiter/login", // Recruiter login API endpoint
        { email, password } // Payload sent to the server
      );

      if (response.status === 200) {
        localStorage.setItem("userEmail", email);
        console.log("Email stored in localStorage: ", localStorage.getItem("userEmail"));
        // If login is successful, redirect to the recruiter dashboard
        navigate("/recruiter-dashboard");
      } else {
        setError("Invalid credentials. Please try again."); // Show error if login fails
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again later."); // Handle any error
    }
  };

  return (
    <>
      {/* Header */}
      <header
        style={{ width: "100%", backgroundColor: "#275df5", padding: "10px 0" }}
      >
        <Container
          maxWidth="lg"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Typography
            variant="h6"
            color="white"
            component={Link}
            to="/"
            style={{ textDecoration: "none", fontWeight: "bold", color: "white" }}
          >
            Job Portal
          </Typography>

          {/* Link to Candidate Login */}
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "white",
              marginRight: "20px",
              fontWeight: "bold",
            }}
          >
            Candidate Login
          </Link>
        </Container>
      </header>

      {/* Login Form */}
      <Container maxWidth="lg" style={{ marginTop: "30px" }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h5" gutterBottom>
              Login/Register
            </Typography>

            {error && (
              <Typography color="error" gutterBottom>
                {error} {/* Display error if present */}
              </Typography>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin}>
              {/* Email input */}
              <TextField
                label="Email ID"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Updates email state
                required
              />

              {/* Password input */}
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Updates password state
                required
              />

              {/* Submit button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                style={{ backgroundColor: "#275df5", color: "white" }}
              >
                Log in
              </Button>
            </form>

            <Typography style={{ marginTop: "20px", textAlign: "center" }}>
              Don’t have a registered email ID?{" "}
              <Link href="/recruiter-registration" style={{ color: "#275df5" }}>
                Create account
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default RecruiterLoginPage;
