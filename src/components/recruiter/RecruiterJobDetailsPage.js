import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Grid, Box, Chip, Card, CardContent, Avatar, Button } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import RecruiterDashboardHeader from './RecruiterDashboardHeader';

const RecruiterJobDetailsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobResponse = await axios.get(`http://localhost:8080/onlinejobportal/api/job/job-details`, {
          params: { jobId }
        });
        setJob(jobResponse.data);

        const candidatesResponse = await axios.get(`http://localhost:8080/onlinejobportal/api/job/candidates`, {
          params: { jobId }
        });
        setCandidates(candidatesResponse.data);
      } catch (error) {
        console.error('Error fetching job details or candidates', error);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleCandidateClick = (candidateId) => {
    navigate(`/candidate/profile/${candidateId}/job/${jobId}`);
  };

  if (!job) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
    <RecruiterDashboardHeader />

    <Container maxWidth="lg" sx={{ mt: 5 }}>
      {/* Job Title Section */}
      <Box sx={{ mb: 4, p: 3, backgroundColor: '#275df5', borderRadius: 3, color: 'white', textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          {job.jobTitle}
        </Typography>
        <Typography variant="h6">
          <BusinessIcon sx={{ mr: 1 }} />
          {job.recruiter.companyName || 'Unknown Company'}
        </Typography>
        <Typography variant="body1">
          <LocationOnIcon sx={{ mr: 1 }} />
          {job.recruiter.companyLocation || 'Unknown Location'}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Job Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Job Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  <WorkIcon sx={{ mr: 1 }} />
                  Experience: {job.minExperience} - {job.maxExperience} Years
                </Typography>
                <Typography variant="body1">
                  <MonetizationOnIcon sx={{ mr: 1 }} />
                  Salary: ₹ {job.minSalary} - ₹ {job.maxSalary} PA
                </Typography>
                <Typography variant="body1">
                  <LocationOnIcon sx={{ mr: 1 }} />
                  Locations: {job.jobLocationIds.join(', ')}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, color: '#275df5', fontWeight: 'bold' }}>
                  Vacancies: {job.vacancies}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Candidates Applied */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Candidates Applied <PeopleIcon />
              </Typography>
              <Box sx={{ mt: 2 }}>
                {candidates.length > 0 ? (
                  candidates.map((candidate, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: '#f0f4ff',
                        '&:hover': {
                          backgroundColor: '#e0e8ff',
                        },
                      }}
                      onClick={() => handleCandidateClick(candidate.candidateId)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }}>
                          {candidate.fullName.charAt(0)}
                        </Avatar>
                        <Typography variant="body1">
                          {candidate.fullName} - {candidate.email}
                        </Typography>
                      </Box>
                      <Button size="small" variant="contained" color="primary">
                        View Profile
                      </Button>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2">No candidates have applied yet.</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
    </>
  );
};

export default RecruiterJobDetailsPage;
