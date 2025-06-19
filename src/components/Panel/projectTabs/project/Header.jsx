// components/ProjectDashboard/Header.jsx
import React, { useState } from "react";
import { FiArrowLeft, FiPlus, FiUpload } from "react-icons/fi";
import NotificationButton from "./NotificationButton";
import UploadModal from "../collaboration/UploadModal"; // Update the path if necessary
import { useDropzone } from "react-dropzone";

export default function Header({
  project,
  onBackToProjects,
  showNotifications,
  toggleNotifications,
  notifications,
}) {
  // Upload modal state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Dropzone config
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const maxSize = 10 * 1024 * 1024;
      const valid = acceptedFiles.filter((f) => f.size <= maxSize);
      if (valid.length) {
        setUploadedFiles((prev) => [...prev, ...valid]);
        setUploadOpen(true);
      } else {
        alert("Files must be under 10MB.");
      }
    },
  });

  // Remove a file from the list
  const handleRemoveFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Rename a file
  const handleRenameFile = (index, name) => {
    setUploadedFiles((prev) => {
      const updated = [...prev];
      const old = updated[index];
      updated[index] = new File([old], name, {
        type: old.type,
        lastModified: old.lastModified,
      });
      return updated;
    });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Back and Project Title */}
        <div className="flex items-center gap-4">
          {onBackToProjects && (
            <button
              onClick={onBackToProjects}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {project.title}
            </h1>
            <p className="text-gray-500 mt-1">Client: {project.client}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full md:w-auto">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition text-sm flex items-center gap-2 shadow-sm">
            <FiPlus className="h-4 w-4" />
            Add Task
          </button>

          <button
            onClick={() => setUploadOpen(true)}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition text-sm flex items-center gap-2 shadow-sm"
          >
            <FiUpload className="h-4 w-4" />
            Upload File
          </button>

          <NotificationButton
            notifications={notifications}
            show={showNotifications}
            toggle={toggleNotifications}
          />
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        uploadedFiles={uploadedFiles}
        onRemoveFile={handleRemoveFile}
        onUpdateFileName={handleRenameFile}
      />
    </>
  );
}
