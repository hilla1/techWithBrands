import {
  FiUpload,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import { useState, useRef } from "react";
import ManageFile from "../../ManageFile";

export default function FileUpload({
  uploadedFiles,
  setUploadedFiles,
  prevStep,
  nextStep,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef(null);

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map((file) => {
      const id = Date.now() + Math.random();
      const fileData = {
        id,
        name: file.name,
        size: file.size,
        raw: file,
      };
      setUploadedFiles((prev) => [...prev, fileData]);
      return fileData;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  const removeFile = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Upload Files</h2>

      {/* Dropzone */}
      <div
        ref={dropRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-md p-6 sm:p-8 cursor-pointer transition
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-[#2E3191]'}
        `}
        onClick={() => dropRef.current.querySelector("input").click()}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <FiUpload className="text-gray-400 mb-2 w-8 h-8" />
          <p className="text-sm sm:text-base text-gray-600">
            Click or drag files here to upload
          </p>
        </div>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Uploaded File List */}
      <div className="space-y-2">
        {uploadedFiles.map((file) => (
          <ManageFile key={file.id} file={file} onRemove={removeFile} />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>
        <button
          onClick={nextStep}
          className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-[#2E3191] to-[#F89F2D] text-white rounded-md hover:opacity-90 transition font-medium"
        >
          Next
          <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
}
