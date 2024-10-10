import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Avatar, Button, Grid, Card, CardContent } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import RecruiterDashboardHeader from './RecruiterDashboardHeader';

const CandidateProfilePage = () => {
  const { candidateId, jobId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidateStatus, setCandidateStatus] = useState('');

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/onlinejobportal/api/candidates/${candidateId}/job/${jobId}`);
        setCandidate(response.data.candidate);
        setCandidateStatus(response.data.status);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching candidate details and status', error);
        setError('Failed to load candidate details.');
        setLoading(false);
      }
    };

    fetchCandidateDetails();
  }, [candidateId, jobId]);

  const handleShortlist = async () => {
    try {
      await axios.post(`http://localhost:8080/onlinejobportal/api/job-applications/${candidateId}/job/${jobId}/shortlist`);
      setCandidateStatus('Shortlisted');
    } catch (error) {
      console.error('Error shortlisting candidate', error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.post(`http://localhost:8080/onlinejobportal/api/job-applications/${candidateId}/job/${jobId}/reject`);
      setCandidateStatus('Rejected');
    } catch (error) {
      console.error('Error rejecting candidate', error);
    }
  };

  const handleAccept = async () => {
    try {
      await axios.post(`http://localhost:8080/onlinejobportal/api/job-applications/${candidateId}/job/${jobId}/accept`);
      setCandidateStatus('Accepted');
    } catch (error) {
      console.error('Error accepting candidate', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (!candidate) {
    return <Typography>No candidate data found.</Typography>;
  }

  return (
    <>
      <RecruiterDashboardHeader />

      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Card sx={{ boxShadow: 5, borderRadius: 3, p: 3 }}>
          <CardContent>
            <Box sx={{ textAlign: 'center' }}>
              {/* Candidate Profile Picture */}
              {candidate.profilePictureUrl ? (
                <Avatar
                  alt={candidate.fullName}
                  src={`http://localhost:8080/onlinejobportal/${candidate.profilePictureUrl}`}
                  sx={{ width: 120, height: 120, marginBottom: 2 }}
                />
              ) : (
                <Avatar sx={{ width: 120, height: 120, marginBottom: 2 }}>
                  {candidate.fullName.charAt(0)}
                </Avatar>
              )}
              <Typography variant="h4" gutterBottom>{candidate.fullName || 'N/A'}</Typography>
            </Box>

            {/* Candidate Info */}
            <Grid container spacing={2} sx={{ textAlign: 'left' }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">
                  <EmailIcon sx={{ mr: 1 }} />
                  {candidate.email || 'N/A'}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  <PhoneIcon sx={{ mr: 1 }} />
                  {candidate.mobileNumber || 'N/A'}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  <LocationOnIcon sx={{ mr: 1 }} />
                  Location: {candidate.currentLocation || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  <WorkIcon sx={{ mr: 1 }} />
                  Work Status: {candidate.workStatus || 'N/A'}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  <SchoolIcon sx={{ mr: 1 }} />
                  Qualification: {candidate.highestQualification || 'N/A'}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  Experience: {candidate.workExperienceYears || 0} Years
                </Typography>
              </Grid>

              {/* Detailed Info */}
              <Grid item xs={12}>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  Gender: {candidate.gender || 'N/A'}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  Date of Birth: {candidate.dateOfBirth || 'N/A'}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  Annual Salary: ₹{candidate.annualSalary || 'N/A'}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  Profile Summary: {candidate.profileSummary || 'No summary provided'}
                </Typography>
              </Grid>
            </Grid>

            {/* Resume Download */}
            {candidate.resumeUrl && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  href={`http://localhost:8080/onlinejobportal/${candidate.resumeUrl}`}
                  target="_blank"
                  startIcon={<DownloadIcon />}
                >
                  Download Resume
                </Button>
              </Box>
            )}

            {/* Status and Actions */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Grid container spacing={2} justifyContent="center">
                {!candidateStatus && (
                  <>
                    <Grid item>
                      <Button variant="contained" color="primary" onClick={handleShortlist}>
                        Shortlist
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" color="error" onClick={handleReject}>
                        Reject
                      </Button>
                    </Grid>
                  </>
                )}

                {candidateStatus === 'Shortlisted' && (
                  <>
                    <Grid item>
                      <Button variant="contained" color="success" onClick={handleAccept}>
                        Accept
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" color="error" onClick={handleReject}>
                        Reject
                      </Button>
                    </Grid>
                  </>
                )}

                {candidateStatus && (
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Candidate Status: {candidateStatus}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default CandidateProfilePage;
