import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useInView } from 'react-intersection-observer';
import { ToastContainer, toast } from 'react-toastify';
import HomeLayout from '../components/HomePage/HomeLayout';
import useApiRequestWithReactQuery from '../hooks/useApiRequestWithReactQuery';
import LoadingSpinner from '../components/ProjectBreakdown/LoadingSpinner';
import ErrorMessage from '../components/ProjectBreakdown/ErrorMessage';
import ProjectTable from '../components/ProjectBreakdown/ProjectTable';
import MilestoneSection from '../components/ProjectBreakdown/MilestoneSection';
import ExportButton from '../components/ProjectBreakdown/ExportButton';
import EditModuleModal from '../components/ProjectBreakdown/EditModuleModal';
import AddModuleModal from '../components/ProjectBreakdown/AddModuleModal';
import { FaPlus, FaArrowLeft } from 'react-icons/fa'; 
import 'react-toastify/dist/ReactToastify.css';

const ProjectBreakdown = () => {
  const { projectId } = useParams();
  const navigate = useNavigate(); 
  const { useApiQuery, useApiUpdate, useApiDelete, useApiCreate } = useApiRequestWithReactQuery();
  const { ref, inView } = useInView({ threshold: 0.1 });

  const [selectedModule, setSelectedModule] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const { data: projectData, isLoading, error, refetch } = useApiQuery(`/projects/${projectId}`);
  const { mutate: updateModule } = useApiUpdate(`/projects/${projectId}/modules/${selectedModule?._id}`);
  const { mutate: deleteModule } = useApiDelete(`/projects/${projectId}/modules/${selectedModule?._id}`);
  const { mutate: addModule } = useApiCreate(`/projects/${projectId}/modules`);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  if (!projectData) {
    return <div>No project data found.</div>;
  }

  const handleEdit = (module) => {
    setSelectedModule(module);
    setModalOpen(true);
  };

  const handleSave = (updatedModule) => {
    updateModule(updatedModule, {
      onSuccess: () => {
        setModalOpen(false);
        toast.success('Module updated successfully');
        refetch();
      },
      onError: () => {
        toast.error('Failed to update module');
      },
    });
  };

  const handleDelete = (moduleId) => {
    deleteModule(moduleId, {
      onSuccess: () => {
        toast.success('Module deleted successfully');
        refetch();
      },
      onError: () => {
        toast.error('Failed to delete module');
      },
    });
  };

  const handleAddModule = (newModule) => {
    addModule(newModule, {
      onSuccess: () => {
        toast.success('Module added successfully');
        refetch();
        setAddModalOpen(false);
      },
      onError: () => {
        toast.error('Failed to add module');
      },
    });
  };

  return (
    <HomeLayout>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 md:top-30 left-4 lg:left-72 text-blue-900 rounded-full p-3 shadow-lg transition-opacity duration-200 hover:opacity-80 focus:outline-none"
      >
        <FaArrowLeft className="text-lg" />
      </button>

      <div ref={ref}>
        <h1 className="text-2xl lg:text-3xl font-bold text-center text-blue-900">
          {projectData.title} - Status Report
        </h1>
        <ExportButton 
          projectTitle={projectData.title} 
          modules={projectData.modules} 
        />
        <ProjectTable 
          modules={projectData.modules}
          onUpdate={handleEdit}
          onDelete={handleDelete}
        />
        <MilestoneSection modules={projectData.modules} />
      </div>

      {modalOpen && (
        <EditModuleModal 
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedModule={selectedModule}
          onSave={handleSave}
        />
      )}

      {addModalOpen && (
        <AddModuleModal 
          open={addModalOpen} 
          onClose={() => setAddModalOpen(false)} 
          onSave={handleAddModule} 
        />
      )}

      <button
        onClick={() => setAddModalOpen(true)}
        className="fixed bottom-6 right-6 text-blue-900 rounded-full p-4 shadow-lg transition-opacity duration-200 hover:opacity-80 focus:outline-none"
      >
        <FaPlus className="text-xl" />
      </button>

      <ToastContainer />
    </HomeLayout>
  );
};

export default ProjectBreakdown;
