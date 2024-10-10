import React, { useState, useEffect } from "react";
import { Container, Typography, Box, CircularProgress, Grid, Card, CardContent, Chip, Avatar } from "@mui/material";
import axios from "axios";
import WorkIcon from "@mui/icons-material/Work";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import CandidateDashboardHeader from "./CandidateDashboardHeader"; // Import the header

function CandidateApplicationStatusPage() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState({}); // State to store job details by jobId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch job details based on jobId
  const fetchJobDetails = async (jobId) => {
    try {
      const response = await axios.get(`http://localhost:8080/onlinejobportal/api/job/job-details`, {
        params: { jobId },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching job details for job ID: ${jobId}`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchApplicationsAndJobs = async () => {
      try {
        const candidateId = localStorage.getItem("candidateId"); // Assuming candidateId is stored in localStorage
        const response = await axios.get(
          `http://localhost:8080/onlinejobportal/api/job-applications/candidate/${candidateId}/applications`
        );
        setApplications(response.data);

        // Fetch job details for each application
        const jobDetailsPromises = response.data.map((application) =>
          fetchJobDetails(application.jobId)
        );

        const jobDetails = await Promise.all(jobDetailsPromises);
        const jobDetailsMap = jobDetails.reduce((acc, job, index) => {
          if (job) acc[response.data[index].jobId] = job; // Map jobId to its details
          return acc;
        }, {});

        setJobs(jobDetailsMap); // Save job details in state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applications or job details", error);
        setError("Failed to load application history.");
        setLoading(false);
      }
    };

    fetchApplicationsAndJobs();
  }, []);

  const getStatusChip = (status) => {
    switch (status) {
      case "APPLIED":
        return <Chip icon={<HourglassEmptyIcon />} label="Applied" color="primary" />;
      case "INTERVIEW":
        return <Chip icon={<CheckCircleIcon />} label="Interview Scheduled" color="info" />;
      case "REJECTED":
        return <Chip icon={<CancelIcon />} label="Rejected" color="error" />;
      case "SELECTED":
        return <Chip icon={<CheckCircleIcon />} label="Selected" color="success" />;
      default:
        return <Chip label={status} />;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <>
      <CandidateDashboardHeader /> {/* Include the consistent header */}

      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#275df5", textAlign: "center" }}>
          Your Application History
        </Typography>

        {applications.length > 0 ? (
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {applications.map((application) => {
              const job = jobs[application.jobId]; // Get the job details for the application

              return (
                <Grid item xs={12} sm={6} md={4} key={application.jobId}>
                  <Card sx={{ borderRadius: 3, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Avatar sx={{ bgcolor: "#275df5", marginRight: 2 }}>
                          <WorkIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {job ? job.jobTitle : `Job ID: ${application.jobId}`}
                        </Typography>
                      </Box>

                      <Typography variant="body1" color="textSecondary">
                        {job ? job.recruiter.companyName : "Unknown Company"}
                      </Typography>
                      

                      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                        {getStatusChip(application.status)}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography variant="h6" align="center" sx={{ mt: 5 }}>
            No applications found.
          </Typography>
        )}
      </Container>
    </>
  );
}

export default CandidateApplicationStatusPage;
