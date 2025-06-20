import {
  FiUpload,
  FiFile,
  FiX,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

export default function FileUpload({
  uploadedFiles,
  setUploadedFiles,
  prevStep,
  nextStep,
}) {
  const onChange = (e) => {
    const added = Array.from(e.target.files).map((f) => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: f.size,
    }));
    setUploadedFiles([...uploadedFiles, ...added]);
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
        Upload Files
      </h2>

      {/* Dropzone */}
      <label className="block cursor-pointer">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 sm:p-8 hover:border-[#2E3191] transition">
          <FiUpload className="text-gray-400 mb-2 w-8 h-8" />
          <p className="text-sm sm:text-base text-gray-600 text-center">
            Click or drag files here to upload
          </p>
        </div>
        <input type="file" multiple onChange={onChange} className="hidden" />
      </label>

      {/* Uploaded File List */}
      <div className="space-y-2">
        {uploadedFiles.map((file) => (
          <div
            key={file.id}
            className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-md px-4 py-2 overflow-auto"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <FiFile className="text-gray-400 shrink-0" />
              <div className="truncate">
                <p className="text-sm text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                setUploadedFiles(uploadedFiles.filter((x) => x.id !== file.id))
              }
              className="text-red-500 hover:text-red-700"
              aria-label="Remove file"
            >
              <FiX />
            </button>
          </div>
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
