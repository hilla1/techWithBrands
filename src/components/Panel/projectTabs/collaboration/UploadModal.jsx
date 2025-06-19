import React, { useState } from 'react';
import ReusableModal from '../../../reusable/ReusableModal';
import { FiX, FiEdit, FiCheck } from 'react-icons/fi';

export default function UploadModal({
  isOpen,
  onClose,
  getRootProps,
  getInputProps,
  uploadedFiles,
  onRemoveFile,
  onUpdateFileName,
}) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState('');

  const handleEdit = (index, name) => {
    setEditingIndex(index);
    setEditedName(name);
  };

  const handleSaveName = () => {
    if (editedName.trim()) {
      onUpdateFileName(editingIndex, editedName.trim());
    }
    setEditingIndex(null);
    setEditedName('');
  };

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title="Upload Files">
      <div className="pt-4 space-y-4 sm:pt-6 sm:space-y-6 w-full">

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-blue-400 p-4 sm:p-8 rounded-md cursor-pointer text-center bg-blue-50 hover:bg-gradient-to-r hover:from-blue-100 hover:to-orange-100 transition-colors"
        >
          <input {...getInputProps()} />
          <p className="text-sm text-gray-700">
            📂 Drag & drop files here or click to browse<br />
            <span className="text-xs text-gray-500">(All file types, max 10MB)</span>
          </p>
        </div>

        {/* Uploaded file list */}
        {uploadedFiles.length > 0 && (
          <div className="text-sm text-gray-800 space-y-2 max-h-60 overflow-y-auto">
            <h4 className="font-semibold text-blue-700">Selected Files:</h4>

            {uploadedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white px-3 py-2 rounded shadow-sm border border-gray-200"
              >
                {editingIndex === idx ? (
                  <div className="w-full sm:flex-1 sm:mr-2 mb-2 sm:mb-0">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                ) : (
                  <p className="w-full sm:flex-1 truncate text-gray-700">{file.name}</p>
                )}

                <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-2">
                  {editingIndex === idx ? (
                    <button
                      onClick={handleSaveName}
                      className="text-green-600 hover:text-green-800"
                      title="Save"
                    >
                      <FiCheck />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(idx, file.name)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Rename"
                    >
                      <FiEdit />
                    </button>
                  )}

                  <button
                    onClick={() => onRemoveFile(idx)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Attach button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded hover:opacity-90 text-sm font-medium"
          >
            Attach
          </button>
        </div>
      </div>
    </ReusableModal>
  );
}
