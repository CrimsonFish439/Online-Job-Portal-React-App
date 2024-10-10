import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Box, Chip } from '@mui/material';

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const recruiter = job.recruiter || {};
  const jobLocations = job.jobLocationIds || [];
  const keySkills = job.keySkillsIds || [];

  const handleCardClick = () => {
    if (job.vacancies === 0) {
      alert("No vacancies available. This job is no longer accepting applications.");
    } else if (job.jobId) {
      navigate(`/recruiter/job-details/${job.jobId}`);
    } else {
      console.error('Job ID is missing!');
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        cursor: job.vacancies === 0 ? 'not-allowed' : 'pointer',
        mb: 3,
        height: '100%',
        borderRadius: 3,
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#275df5' }}>{job.jobTitle}</Typography>
            <Typography variant="body1" color="textSecondary">
              {recruiter.companyName || 'Unknown Company'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {recruiter.companyLocation || 'Unknown Location'}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Box
              component="img"
              src={`http://localhost:8080/onlinejobportal/${recruiter.companyLogoUrl}`}
              alt={recruiter.companyName || 'Company Logo'}
              sx={{ width: 70, height: 70, borderRadius: 2, float: 'right', border: '2px solid #275df5' }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2">
              Experience: {job.minExperience} - {job.maxExperience} Yrs
            </Typography>
            <Typography variant="body2">
              Salary: ₹ {job.minSalary} - ₹ {job.maxSalary} PA
            </Typography>
            <Typography variant="body2">
              Locations: {jobLocations.length > 0 ? jobLocations.join(', ') : 'Not specified'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Core Competency: {job.qualificationName || 'N/A'}, {job.courseName || 'N/A'}, {job.specializationName || 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">Skills:</Typography>
            {keySkills.length > 0 ? (
              keySkills.map((skill, index) => (
                <Chip key={index} label={skill} sx={{ mr: 1, mb: 1, backgroundColor: '#e0f2ff', color: '#275df5' }} />
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">No skills specified</Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color={job.vacancies === 0 ? "error" : "textSecondary"}>
              {job.vacancies === 0 ? "No Vacancies Available" : `Vacancies: ${job.vacancies}`}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default JobCard;
