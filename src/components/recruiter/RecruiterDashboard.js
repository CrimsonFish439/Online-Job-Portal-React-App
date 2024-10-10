import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
} from "@mui/material";
import RecruiterDashboardHeader from "./RecruiterDashboardHeader";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../home/Footer";

function RecruiterDashboard() {
  const [recruiter, setRecruiter] = useState({
    fullName: "",
    companyLogoUrl: "",
    companyName: "",
  });

  useEffect(() => {
    const fetchRecruiterDetails = async () => {
      const email = localStorage.getItem("userEmail");
      try {
        const response = await axios.get(
          `http://localhost:8080/onlinejobportal/api/recruiter/details`,
          { params: { email: email } }
        );
        setRecruiter(response.data);
        localStorage.setItem("recruiterDetails", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching recruiter details:", error);
      }
    };

    fetchRecruiterDetails();
  }, []);

  return (
    <>
      <RecruiterDashboardHeader />

      <Container maxWidth="lg" sx={{ marginTop: "40px", marginBottom: "40px" }}>
        <Paper
          elevation={6}
          sx={{
            padding: "30px",
            borderRadius: "15px",
            backgroundColor: "#f0f4ff",
            textAlign: "center",
          }}
        >
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#275df5" }}>
                Welcome, {recruiter.fullName}!
              </Typography>
              <Typography variant="h6" color="textSecondary">
                from {recruiter.companyName}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              {recruiter.companyLogoUrl ? (
                <Box
                  component="img"
                  src={`http://localhost:8080/onlinejobportal/${recruiter.companyLogoUrl}`}
                  alt={`${recruiter.companyName} Logo`}
                  sx={{
                    width: 180, // Adjust the width of the logo
                    height: 100, // Adjust the height of the logo
                    border: "2px solid #275df5",
                    borderRadius: "8px", // To give a slight corner radius for a rectangular effect
                    margin: "0 auto",
                    objectFit: "cover", // Ensures the image covers the box without distortion
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 180,
                    height: 100,
                    border: "2px solid #275df5",
                    borderRadius: "8px",
                    backgroundColor: "#e0e0e0",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                    color: "#275df5",
                    fontSize: "16px",
                  }}
                >
                  No Logo
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={4} sx={{ marginTop: "40px" }}>
          {/* Post a Job Card */}
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                borderRadius: "15px",
                backgroundColor: "#e3f2fd",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: "#1565c0" }}>
                  Post a Job
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Create and publish new job listings to find the best talent.
                </Typography>
                <Box marginTop={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/recruiter/post-job"
                    sx={{
                      padding: "10px 20px",
                      borderRadius: "20px",
                      textTransform: "none",
                      backgroundColor: "#1565c0",
                      "&:hover": {
                        backgroundColor: "#0d47a1",
                      },
                    }}
                  >
                    Post a Job
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* View Jobs Card */}
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                borderRadius: "15px",
                backgroundColor: "#fff3e0",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: "#ff6f00" }}>
                  View Jobs Posted
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Manage and review the jobs you’ve posted.
                </Typography>
                <Box marginTop={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/recruiter/jobs-list"
                    sx={{
                      padding: "10px 20px",
                      borderRadius: "20px",
                      textTransform: "none",
                      backgroundColor: "#ff6f00",
                      "&:hover": {
                        backgroundColor: "#e65100",
                      },
                    }}
                  >
                    View Jobs Posted
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default RecruiterDashboard;
