// Import statements
import React, { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { CSVLink } from 'react-csv'; 
import { useNavigate } from 'react-router-dom';
import HomeLayout from '../components/HomePage/HomeLayout'; 
import useApiRequestWithReactQuery from '../hooks/useApiRequestWithReactQuery';
import ClipLoader from 'react-spinners/ClipLoader'; 
import ProjectTable from '../components/Projects/ProjectTable';
import ProjectCard from '../components/Projects/ProjectCard';
import Pagination from '../components/Projects/Pagination';
import EditProjectModal from '../components/Projects/EditProjectModal';
import ConfirmActionModal from '../components/reusable/ConfirmActionModal'; 

const Projects = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const { useApiQuery, useApiMutation } = useApiRequestWithReactQuery();

  const { data: projects, isLoading, error, refetch } = useApiQuery('/projects'); 

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); 

  const handleRowClick = (id) => {
    navigate(`/breakdown/${id}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, projectId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProjectId(projectId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action) => {
    if (action === 'delete' && selectedProjectId) {
      setConfirmDeleteOpen(true); 
    }
    handleMenuClose(); 
  };

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setOpenEditModal(true);
  };

  const handleSave = async (updatedProject) => {
    await updateProject.mutateAsync(updatedProject);
    setOpenEditModal(false);
    setSelectedProject(null);
  };

  const updateProject = useApiMutation(`/projects/${selectedProject?._id}`, 'PUT', {
    onSuccess: () => {
      console.log("Project updated successfully.");
      refetch();
    }
  });

  const deleteProject = useApiMutation(`/projects/${selectedProjectId}`, 'DELETE', {
    onSuccess: () => {
      console.log("Project deleted successfully.");
      refetch();
    }
  });

  const handleDeleteConfirm = async () => {
    await deleteProject.mutateAsync();
    setConfirmDeleteOpen(false); 
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader />
      </div>
    );
  }

  if (error) return <p>Error loading projects</p>;

  const paginatedProjects = projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <HomeLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Projects</h1>
          <CSVLink data={projects} filename={"projects.csv"}>
            <button className="bg-blue-900 text-white px-4 py-2 rounded">Export to CSV</button>
          </CSVLink>
        </div>

        <ProjectTable
          projects={paginatedProjects}
          onRowClick={handleRowClick}
          onMenuClick={handleMenuClick}
          onEditClick={handleEditClick}
        />

        <div className="md:hidden grid grid-cols-1 gap-4 mt-4">
          {paginatedProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onRowClick={handleRowClick}
              onMenuClick={handleMenuClick}
              onEditClick={handleEditClick}
            />
          ))}
        </div>

        <Pagination
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          totalItems={projects.length}
        />

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { handleEditClick(projects.find(p => p._id === selectedProjectId)); handleMenuClose(); }}>Update</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('markAsViewed')}>Mark as Viewed</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('delete')}>Delete</MenuItem>
        </Menu>

        {/* Edit Project Modal */}
        <EditProjectModal 
          open={openEditModal} 
          onClose={() => setOpenEditModal(false)} 
          selectedProject={selectedProject}
          onSave={handleSave} 
        />

        {/* Confirm Delete Modal */}
        <ConfirmActionModal
          open={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          title="Confirm Deletion"
          message="Are you sure you want to delete this project? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </HomeLayout>
  );
};

export default Projects;
