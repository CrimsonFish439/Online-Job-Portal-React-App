import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import axios from "axios";

function CandidateSidebar() {
  const [candidate, setCandidate] = useState({ name: "", profilePicUrl: "" });

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        const response = await axios.get(
          "http://localhost:8080/onlinejobportal/api/candidates/details",
          {
            params: {
              email: email,
            },
          }
        );
        const { fullName, profilePictureUrl } = response.data;
        setCandidate({ name: fullName, profilePicUrl: profilePictureUrl });
      } catch (error) {
        console.error("Error fetching candidate details:", error);
      }
    };

    fetchCandidateDetails();
  }, []);

  return (
    <Card
      sx={{
        borderRadius: "15px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ffffff",
      }}
    >
      <CardContent style={{ textAlign: "center", padding: "20px" }}>
        {/* Profile Picture */}
        <Box
          sx={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            backgroundColor: "#e0e0e0",
            backgroundImage: `url(http://localhost:8080/onlinejobportal/${candidate.profilePicUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            margin: "auto",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        />

        {/* Candidate Name */}
        <Typography
          variant="h6"
          sx={{
            marginTop: "15px",
            fontWeight: "bold",
            fontSize: "18px",
            color: "#275df5",
          }}
        >
          {candidate.name}
        </Typography>

        {/* Static General Information */}
        <Box sx={{ marginTop: "20px" }}>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
            <b>Tip of the Day:</b> Keep your resume updated!
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
            <b>Fun Fact:</b> The first job board was launched in 1994.
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
            <b>Career Advice:</b> Networking is key to finding new opportunities.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CandidateSidebar;
