import { useEffect, useState, useRef } from "react";
import {
  FiFile,
  FiX,
  FiEdit2,
  FiCheck,
} from "react-icons/fi";
import {
  AiFillFilePdf,
  AiFillFileWord,
  AiFillFileZip,
  AiFillFileExcel,
} from "react-icons/ai";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ResponseModal from "./ResponseModal";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const getFileIcon = (filename) => {
  if (!filename) return <FiFile className="text-gray-400 shrink-0" />;
  const ext = filename.split(".").pop().toLowerCase();

  switch (ext) {
    case "pdf":
      return <AiFillFilePdf className="text-red-500 text-xl shrink-0" />;
    case "doc":
    case "docx":
      return <AiFillFileWord className="text-blue-500 text-xl shrink-0" />;
    case "xls":
    case "xlsx":
    case "csv":
      return <AiFillFileExcel className="text-green-500 text-xl shrink-0" />;
    case "zip":
    case "rar":
      return <AiFillFileZip className="text-yellow-600 text-xl shrink-0" />;
    default:
      return <FiFile className="text-gray-400 shrink-0 text-lg" />;
  }
};

const isImagePreviewable = (filename) => {
  const ext = filename?.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "webp", "gif"].includes(ext);
};

const ManageFile = ({ file, onRemove }) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState(null);
  const [tooLarge, setTooLarge] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fileName, setFileName] = useState(file.name || file.raw?.name || "unknown");
  const [isRenaming, setIsRenaming] = useState(false);
  const enterPressedRef = useRef(false);
  const { backend } = useAuth();

  useEffect(() => {
    if (!file.url && file.raw) {
      if (file.raw.size > MAX_FILE_SIZE) {
        setTooLarge(true);
        return;
      }

      const upload = async () => {
        setUploading(true);
        try {
          const formData = new FormData();
          formData.append("file", file.raw, file.raw.name);

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
          file.publicId = data.publicId || null;
          file.name = file.raw.name;
          setFileName(file.raw.name);
          setUploading(false);
        } catch (err) {
          setUploading(false);
          showResponse(false, err.response?.data?.message || err.message || "Upload failed");
        }
      };

      upload();
    }
  }, [file, backend]);

  const showResponse = (success, message) => {
    setResponse({ success, message });
  };

  const handleRemove = async () => {
    try {
      if (file.publicId) {
        const res = await axios.post(
          `${backend}/file/delete`,
          {
            publicId: file.publicId,
            resourceType: "raw",
          },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = res.data;
        if (!data.success) {
          showResponse(false, data.message);
          return;
        }

        showResponse(true, "File removed successfully.");
      }

      onRemove(file.id);
    } catch (err) {
      showResponse(false, err.response?.data?.message || err.message || "Failed to delete file");
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleRename = async () => {
    if (isRenaming) return;
    setIsRenaming(true);

    const oldName = file.name;
    const ext = oldName.split(".").pop();
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    const newFileName = `${baseName}.${ext}`;

    if (!file.publicId || newFileName === oldName) {
      setIsRenaming(false);
      setEditing(false);
      return;
    }

    try {
      const res = await axios.post(`${backend}/file/rename`, {
        publicId: file.publicId,
        newName: newFileName,
        resourceType: "raw",
      }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      const data = res.data;

      if (!data.success) {
        showResponse(false, data.message || "Rename failed");
      } else {
        file.url = data.url;
        file.publicId = data.publicId;
        file.name = newFileName;
        setFileName(newFileName);
        showResponse(true, "Filename updated.");
      }
    } catch (err) {
      showResponse(false, err.response?.data?.message || err.message || "Rename failed");
    }

    setIsRenaming(false);
    setEditing(false);
  };

  const handleInputKey = (e) => {
    if (e.key === "Enter") {
      enterPressedRef.current = true;
      handleRename();
    }
  };

  const handleBlur = () => {
    if (enterPressedRef.current) {
      enterPressedRef.current = false; // prevent duplicate
      return;
    }
    handleRename();
  };

  const isPreviewable = isImagePreviewable(fileName);
  const isUploaded = Boolean(file.url);

  return (
    <>
      <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-md px-4 py-2 overflow-auto relative">
        <div className="flex items-center gap-3 overflow-hidden w-full">
          {isPreviewable && isUploaded ? (
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              <img
                src={file.url}
                alt="preview"
                className="w-8 h-8 rounded border object-cover shrink-0"
              />
            </a>
          ) : (
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              {getFileIcon(fileName)}
            </a>
          )}

          <div className="truncate w-full">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  className="text-sm text-gray-800 border px-1 py-0.5 rounded w-full"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  onKeyDown={handleInputKey}
                  onBlur={handleBlur}
                  autoFocus
                />
                <FiCheck
                  onClick={handleRename}
                  className="text-green-500 cursor-pointer"
                  title="Save"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p
                  className="text-sm text-gray-800 truncate"
                  title={fileName}
                >
                  {fileName}
                </p>
                {isUploaded && (
                  <FiEdit2
                    className="text-gray-400 hover:text-blue-500 cursor-pointer"
                    title="Edit name"
                    onClick={handleEdit}
                  />
                )}
              </div>
            )}

            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(2)} KB
            </p>

            {tooLarge && (
              <p className="text-xs text-red-600 mt-1">
                ❌ File exceeds the 20MB limit.
              </p>
            )}

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
