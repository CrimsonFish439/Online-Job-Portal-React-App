import React, { useState } from "react";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChangeEmailPasswordPage() {
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = async () => {
    try {
      const currentEmail = localStorage.getItem("userEmail");

      // Call backend API to change email
      const response = await axios.post(
        "http://localhost:8080/onlinejobportal/api/candidates/changeEmail",
        { currentEmail, newEmail }
      );

      // Handle successful email change
      localStorage.setItem("userEmail", newEmail);
      alert("Email updated. Please log in again.");
      navigate("/login");
    } catch (error) {
      console.error("Error changing email:", error);
      setError("An error occurred while changing the email.");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const email = localStorage.getItem("userEmail");

      // Call backend API to change password
      const response = await axios.post(
        "http://localhost:8080/onlinejobportal/api/candidates/changePassword",
        { email, currentPassword, newPassword }
      );

      // Handle successful password change
      alert("Password updated successfully.");
    } catch (error) {
      console.error("Error changing password:", error);
      setError("An error occurred while changing the password.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" style={{ marginTop: "20px" }}>
        Change Email and Password
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      {/* Change Email Section */}
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={12}>
          <TextField
            label="New Email"
            variant="outlined"
            fullWidth
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={handleEmailChange}>
            Change Email
          </Button>
        </Grid>
      </Grid>

      {/* Change Password Section */}
      <Typography variant="h6" style={{ marginTop: "40px" }}>
        Change Password
      </Typography>
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={12}>
          <TextField
            label="Current Password"
            variant="outlined"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="New Password"
            variant="outlined"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Confirm New Password"
            variant="outlined"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={newPassword !== confirmPassword}
            helperText={newPassword !== confirmPassword ? "Passwords do not match" : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={handlePasswordChange}>
            Change Password
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ChangeEmailPasswordPage;
