import { FiArrowLeft } from "react-icons/fi";

export default function ReviewStep({
  projectData,
  featuresData,
  uploadedFiles,
  prevStep,
  nextStep,
}) {
  return (
    <div className="space-y-6 text-sm sm:text-base break-words">
      {/* Section Heading */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
        Review & Submit
      </h2>

      {/* Project Summary */}
      <div className="rounded-lg border border-gray-200 p-5 bg-gradient-to-br from-blue-50 to-orange-50">
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          📝 Project Details
        </h3>
        <p className="text-gray-700"><strong>• Name:</strong> {projectData.projectName}</p>
        <p className="text-gray-700"><strong>• Type:</strong> {projectData.projectType}</p>
        <p className="text-gray-700"><strong>• Timeline:</strong> {projectData.timeline}</p>
        <p className="text-gray-700"><strong>• Budget:</strong> {projectData.budget}</p>
        <p className="text-gray-700 mt-2">
          <strong>• Description:</strong> {projectData.description}
        </p>
      </div>

      {/* Feature Summary */}
      <div className="rounded-lg border border-gray-200 p-5 bg-gradient-to-br from-blue-50 to-orange-50">
        <h3 className="text-lg font-medium text-gray-700 mb-2">⚙️ Features</h3>
        <ul className="list-disc list-inside text-gray-700">
          {featuresData.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
        <p className="text-gray-700 mt-2">
          <strong>• Priority:</strong> {featuresData.priority}
        </p>

        {/* Optional Integrations */}
        {featuresData.integrations?.length > 0 && (
          <div className="mt-4">
            <p className="text-gray-700 font-medium mb-1">• Required Integrations:</p>
            <ul className="list-disc list-inside text-gray-700">
              {featuresData.integrations.map((integration, idx) => (
                <li key={idx}>{integration}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Files Summary */}
      <div className="rounded-lg border border-gray-200 p-5 bg-gradient-to-br from-blue-50 to-orange-50">
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          📎 Files Uploaded ({uploadedFiles.length})
        </h3>
        <ul className="list-disc list-inside text-gray-700 break-words">
          {uploadedFiles.map((f) => (
            <li key={f.id}>{f.name}</li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
        <button
          onClick={prevStep}
          className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition w-full sm:w-auto"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <button
          onClick={nextStep}
          className="px-6 py-2 bg-gradient-to-r from-blue-400 to-orange-300 text-white rounded-md hover:opacity-90 transition font-medium w-full sm:w-auto"
        >
          Confirm & Proceed
        </button>
      </div>
    </div>
  );
}
