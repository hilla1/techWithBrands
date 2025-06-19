// components/FinalApproval/FilePreviewModal.jsx
import { FiX, FiDownload, FiEye, FiFile, FiImage, FiVideo } from "react-icons/fi"

export default function FilePreviewModal({ file, onClose }) {
  const getFileIcon = (type) => {
    const icons = {
      application: <FiEye className="h-6 w-6 text-blue-600" />,
      code: <FiFile className="h-6 w-6 text-green-600" />,
      design: <FiImage className="h-6 w-6 text-purple-600" />,
      documentation: <FiFile className="h-6 w-6 text-orange-600" />,
      video: <FiVideo className="h-6 w-6 text-red-600" />,
    }
    return icons[type] || <FiFile className="h-6 w-6 text-gray-600" />
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">{file.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh] text-center">
          <div className="p-8 bg-gray-50 rounded-lg">
            {getFileIcon(file.type)}
            <p className="mt-4 text-gray-600">{file.description}</p>
            <button className="btn btn-primary mt-4">
              <FiDownload className="h-4 w-4 mr-2" />
              Download {file.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
