import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/home/HomePage";
import LoginPage from "./components/home/LoginPage";
import CandidateRegistrationForm from "./components/candidate/CandidateRegistrationForm";
import CandidateDashboard from "./components/candidate/CandidateDashboard";
import ProfilePage from "./components/candidate/ProfilePage";
import ChangeEmailPasswordPage from "./components/candidate/ChangeEmailPasswordPage";
import RecruiterRegistration from "./components/recruiter/RecruiterRegistrationPage";
import RecruiterLoginPage from "./components/recruiter/RecruiterLoginPage";
import RecruiterDashboard from "./components/recruiter/RecruiterDashboard";
import PostJobForm from "./components/recruiter/JobPosting";
import JobsListPage from "./components/recruiter/JobsListPage";
import JobDetailsPage from "./components/candidate/JobDetailsPage";
import RecruiterJobDetailsPage from "./components/recruiter/RecruiterJobDetailsPage";
import CandidateProfilePage from "./components/recruiter/CandidateProfilePage";
import CandidateApplicationStatusPage from "./components/candidate/CandidateApplicationStatusPage";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Satoshi, sans-serif',
  },
});

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<CandidateRegistrationForm />} />
        <Route path="/dashboard" element={<CandidateDashboard />} /> 
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/change-email" element={<ChangeEmailPasswordPage />} />
        <Route path="/recruiter-registration" element={<RecruiterRegistration />} />
        <Route path="/recruiter-login" element={<RecruiterLoginPage />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/post-job" element={<PostJobForm />}/>
        <Route path="/recruiter/jobs-list" element={<JobsListPage />} />
        <Route path="/job-details/:jobId" element={<JobDetailsPage />} />
        <Route path="/recruiter/job-details/:jobId" element={<RecruiterJobDetailsPage />} />
        <Route path="/candidate/profile/:candidateId/job/:jobId" element={<CandidateProfilePage />} />
        <Route path="/application-status" element={<CandidateApplicationStatusPage />} />
      </Routes>
    </Router>
  );
}

export default App;
