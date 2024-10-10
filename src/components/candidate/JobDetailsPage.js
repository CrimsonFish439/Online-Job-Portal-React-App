import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import CandidateDashboardHeader from "./CandidateDashboardHeader";

const JobDetailsPage = () => {
  const { jobId } = useParams(); // Get the job ID from the route
  const location = useLocation();
  const candidateId =
    localStorage.getItem("candidateId") || location.state?.candidateId; // Get candidateId from state or local storage

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [hasApplied, setHasApplied] = useState(false); // Track application status

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/onlinejobportal/api/job/job-details`,
          {
            params: { jobId },
          }
        );
        setJob(response.data); // Assuming response contains the job details
        setLoading(false);

        // Check if the candidate has already applied for the job
        const applicationResponse = await axios.get(
          `http://localhost:8080/onlinejobportal/api/job-applications/check-application-status`,
          {
            params: { jobId, candidateId },
          }
        );
        setHasApplied(applicationResponse.data.hasApplied); // Set hasApplied based on the API response
      } catch (error) {
        console.error("Error fetching job details", error);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, candidateId]);

  const handleApplyNow = async () => {
    if (!candidateId) {
      alert("You need to log in as a candidate to apply for this job.");
      return;
    }

    const jobApplicationDTO = {
      jobId: jobId,
      candidateId: candidateId,
      status: "APPLIED",
    };

    try {
      await axios.post(
        "http://localhost:8080/onlinejobportal/api/job-applications/apply",
        jobApplicationDTO
      );
      alert("Job application submitted successfully");
      setHasApplied(true); // Set the applied status to true after successful application
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert(error.response.data.message); // Show "You have already applied for this job."
        setHasApplied(true); // If already applied, update the state
      } else {
        alert("Error applying for the job. Please try again.");
      }
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

  if (!job) {
    return <Typography>Job details not available.</Typography>;
  }

  return (
    <>
      <CandidateDashboardHeader /> {/* Consistent header */}
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: "12px", backgroundColor: "#f9f9f9" }}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#275df5" }}>
              {job.jobTitle}
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ mt: 1 }}>
              {job.recruiter.companyName} - {job.recruiter.companyLocation}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Experience: {job.minExperience} - {job.maxExperience} Years
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Salary: ₹ {job.minSalary} - ₹ {job.maxSalary} PA
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Locations: {job.jobLocationIds.join(", ")}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#275df5" }}>
              Job Description
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {job.jobDescription}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#275df5" }}>
              Core Competency
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {job.qualificationName || "N/A"}, {job.courseName || "N/A"},{" "}
              {job.specializationName || "N/A"}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#275df5" }}>
              Skills Required
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {job.keySkillsIds.map((skill, index) => (
                <Grid item key={index}>
                  <Chip label={skill} color="primary" variant="outlined" />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              color={hasApplied ? "success" : "primary"} // Change color based on application status
              sx={{
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "25px",
                textTransform: "none",
              }}
              onClick={handleApplyNow}
              disabled={hasApplied} // Disable the button if already applied
            >
              {hasApplied ? "Applied" : "Apply Now"} {/* Change button text based on status */}
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default JobDetailsPage;
