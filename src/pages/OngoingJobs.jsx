import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  TextField,
  TablePagination,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox
} from '@mui/material';
import { CSVLink } from 'react-csv'; 
import { useNavigate } from 'react-router-dom';
import HomeLayout from '../components/HomePage/HomeLayout';

// Dummy data
const mockJobs = [
  {
    id: '1',
    jobName: 'Fix User Authentication Bug',
    projectName: 'Project Alpha',
    assignedExpert: 'John Doe',
    expertAccepted: false,
    progress: 0 // Set to 0 if not accepted
  },
  {
    id: '2',
    jobName: 'Update UI for Mobile App',
    projectName: 'Standalone',
    assignedExpert: 'Jane Smith',
    expertAccepted: true,
    progress: 40
  },
  {
    id: '3',
    jobName: 'Design New Landing Page',
    projectName: 'Project Beta',
    assignedExpert: 'Alice Brown',
    expertAccepted: true,
    progress: 70
  },
  {
    id: '4',
    jobName: 'Optimize Database Queries',
    projectName: 'Project Gamma',
    assignedExpert: 'Bob White',
    expertAccepted: false,
    progress: 20
  }
];

const OngoingJobs = () => {
  const [jobs, setJobs] = useState(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [reassignTo, setReassignTo] = useState('');
  const [adminApproval, setAdminApproval] = useState(false);
  const [updateJobName, setUpdateJobName] = useState('');
  const [updateProjectName, setUpdateProjectName] = useState('');
  const [updateProgress, setUpdateProgress] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [progressFilter, setProgressFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const navigate = useNavigate(); // Updated to useNavigate

  // Search and filter logic
  const handleSearch = () => {
    setFilteredJobs(
      jobs.filter(job =>
        job.jobName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (progressFilter ? job.progress === parseInt(progressFilter) : true) &&
        (projectFilter ? job.projectName === projectFilter : true)
      )
    );
  };

  const handleReassign = () => {
    if (adminApproval) {
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.id === selectedJob.id ? { ...job, assignedExpert: reassignTo } : job
        )
      );
      handleCloseModal();
    } else {
      setAdminApproval(true);
    }
  };

  const handleUpdate = () => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === selectedJob.id
          ? { ...job, jobName: updateJobName, projectName: updateProjectName, progress: updateProgress }
          : job
      )
    );
    handleCloseModal();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (action, job) => {
    setModalAction(action);
    setSelectedJob(job);
    setUpdateJobName(job.jobName);
    setUpdateProjectName(job.projectName);
    setUpdateProgress(job.progress);
    setReassignTo('');
    setAdminApproval(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalAction('');
    setSelectedJob(null);
  };

  const getProgressColor = (progress) => {
    if (progress === 0) return 'bg-gray-300 text-gray-700'; // Not accepted
    if (progress < 50) return 'bg-yellow-300 text-yellow-800'; // Warning
    if (progress < 100) return 'bg-orange-300 text-orange-800'; // Danger
    return 'bg-green-300 text-green-800'; // Complete
  };

  return (
    <HomeLayout>
        <div className="min-h-screen bg-gray-100 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4 lg:mb-0">Ongoing Jobs</h2>
              <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <TextField
                  label="Search Jobs"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full lg:w-auto"
                />
                <FormControl variant="outlined" className="w-full lg:w-auto">
                  <InputLabel>Progress</InputLabel>
                  <Select
                    value={progressFilter}
                    onChange={(e) => setProgressFilter(e.target.value)}
                    label="Progress"
                  >
                    <MenuItem value="">All Progress</MenuItem>
                    <MenuItem value="0">0%</MenuItem>
                    <MenuItem value="20">20%</MenuItem>
                    <MenuItem value="40">40%</MenuItem>
                    <MenuItem value="60">60%</MenuItem>
                    <MenuItem value="80">80%</MenuItem>
                    <MenuItem value="100">100%</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="outlined" className="w-full lg:w-auto">
                  <InputLabel>Project</InputLabel>
                  <Select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    label="Project"
                  >
                    <MenuItem value="">All Projects</MenuItem>
                    <MenuItem value="Project Alpha">Project Alpha</MenuItem>
                    <MenuItem value="Standalone">Standalone</MenuItem>
                    <MenuItem value="Project Beta">Project Beta</MenuItem>
                    <MenuItem value="Project Gamma">Project Gamma</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                >
                  Search
                </Button>
                <CSVLink
                  data={filteredJobs.map(job => ({
                    'Job Name': job.jobName,
                    'Project Name': job.projectName,
                    'Assigned Expert': job.assignedExpert,
                    'Expert Accepted': job.expertAccepted ? 'Yes' : 'No',
                    'Progress (%)': job.progress
                  }))}
                  filename="ongoing_jobs.csv"
                  className="text-blue-600 underline"
                >
                  Download CSV
                </CSVLink>
              </div>
            </div>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Job Name</TableCell>
                    <TableCell>Project Name</TableCell>
                    <TableCell>Assigned Expert</TableCell>
                    <TableCell>Expert Accepted</TableCell>
                    <TableCell>Progress (%)</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredJobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <Button
                          onClick={() => navigate(`/job/${job.id}`)}
                          className="text-blue-600 underline"
                        >
                          {job.jobName}
                        </Button>
                      </TableCell>
                      <TableCell>{job.projectName}</TableCell>
                      <TableCell>{job.assignedExpert}</TableCell>
                      <TableCell>{job.expertAccepted ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <div className={`py-1 px-3 rounded ${getProgressColor(job.progress)}`}>
                          {job.progress}%
                        </div>
                      </TableCell>
                      <TableCell>
                        {job.expertAccepted ? (
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleOpenModal('update', job)}
                          >
                            Update
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleOpenModal('reassign', job)}
                          >
                            Reassign
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredJobs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />

            {/* Modal for Reassigning or Updating Job */}
            <Modal
              open={isModalOpen}
              onClose={handleCloseModal}
              className="flex items-center justify-center"
            >
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  {modalAction === 'reassign' ? 'Reassign Job' : 'Update Job'}
                </h2>
                {modalAction === 'reassign' ? (
                  <>
                    {adminApproval ? (
                      <div>
                        <TextField
                          value={reassignTo}
                          onChange={(e) => setReassignTo(e.target.value)}
                          label="Reassign To"
                          fullWidth
                          className="mb-4"
                        />
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={handleReassign}
                          style={{ backgroundColor: '#F89F2D', color: '#fff' }}
                        >
                          Reassign
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-4 text-gray-700">
                          Reassignment requires admin approval. Do you want to proceed?
                        </p>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => setAdminApproval(true)}
                          style={{ backgroundColor: '#F89F2D', color: '#fff' }}
                        >
                          Request Admin Approval
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <TextField
                      label="Job Name"
                      value={updateJobName}
                      onChange={(e) => setUpdateJobName(e.target.value)}
                      fullWidth
                      className="mb-4"
                    />
                    <TextField
                      label="Project Name"
                      value={updateProjectName}
                      onChange={(e) => setUpdateProjectName(e.target.value)}
                      fullWidth
                      className="mb-4"
                    />
                    <TextField
                      label="Progress (%)"
                      type="number"
                      value={updateProgress}
                      onChange={(e) => setUpdateProgress(parseInt(e.target.value, 10))}
                      fullWidth
                      className="mb-4"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdate}
                      style={{ backgroundColor: '#2E3191', color: '#fff' }}
                    >
                      Update
                    </Button>
                  </div>
                )}
              </div>
            </Modal>
          </div>
        </div>
    </HomeLayout>
  );
};

export default OngoingJobs;
