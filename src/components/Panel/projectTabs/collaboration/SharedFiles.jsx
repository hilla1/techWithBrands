// components/collaboration/SharedFiles.jsx
import React from 'react';
import { FiDownload } from 'react-icons/fi';

export default function SharedFiles({ sharedFiles, downloadFile }) {
  return (
    <div className="space-y-2 h-[400px] overflow-y-auto">
      {sharedFiles.map((file, index) => (
        <div key={index} className="flex justify-between items-center p-2 border rounded bg-gray-50">
          <div>
            <p className="font-medium">{file.fileName}</p>
            <p className="text-xs text-gray-500">
              Shared by {file.sharedBy} on {file.date} at {file.time}
            </p>
          </div>
          <button onClick={() => downloadFile(file)} className="text-blue-500 hover:text-blue-700">
            <FiDownload size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
