import { useEffect, useState } from "react";
import { FiFile, FiX } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ResponseModal from "./ResponseModal";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const ManageFile = ({ file, onRemove }) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState(null);
  const [tooLarge, setTooLarge] = useState(false);
  const { backend } = useAuth();

  useEffect(() => {
    // Only upload if file is newly selected (has raw and no url yet)
    if (!file.url && file.raw) {
      if (file.raw.size > MAX_FILE_SIZE) {
        setTooLarge(true);
        return;
      }

      const upload = async () => {
        setUploading(true);
        try {
          const formData = new FormData();
          formData.append("file", file.raw);

          const res = await axios.post(`${backend}/file/upload`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (event) => {
              if (event.lengthComputable) {
                const percent = Math.round((event.loaded * 100) / event.total);
                setProgress(percent);
              }
            },
          });

          const data = res.data;

          if (!data.success) throw new Error(data.message || "Upload failed");

          file.url = data.url;
          file.publicId = data.publicId;
          setUploading(false);
        } catch (err) {
          setUploading(false);
          setResponse({
            success: false,
            message:
              err.response?.data?.message ||
              err.message ||
              "Upload failed",
          });
        }
      };

      upload();
    }
  }, [file, backend]);

  const handleRemove = async () => {
    try {
      if (file.publicId) {
        const res = await axios.post(
          `${backend}/file/delete`,
          { publicId: file.publicId },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = res.data;
        if (!data.success) {
          setResponse({ success: false, message: data.message });
          return;
        }

        setResponse({ success: true, message: "File removed successfully." });
      }
    } catch (err) {
      setResponse({
        success: false,
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to delete file",
      });
    }

    onRemove(file.id);
  };

  return (
    <>
      <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-md px-4 py-2 overflow-auto relative">
        <div className="flex items-center gap-3 overflow-hidden w-full">
          <FiFile className="text-gray-400 shrink-0" />
          <div className="truncate w-full">
            <p className="text-sm text-gray-800 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(2)} KB
            </p>

            {/* Too large error */}
            {tooLarge && (
              <p className="text-xs text-red-600 mt-1">
                ❌ File exceeds the 20MB limit.
              </p>
            )}

            {/* Upload progress bar */}
            {uploading && !tooLarge && (
              <div className="mt-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-blue-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-blue-500 mt-1">
                  Uploading... {progress}%
                </p>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 ml-4 shrink-0"
          aria-label="Remove file"
        >
          <FiX />
        </button>
      </div>

      <ResponseModal response={response} onClose={() => setResponse(null)} />
    </>
  );
};

export default ManageFile;
