// components/FinalApproval/ProjectDeliverables.jsx
import {
  FiDownload,
  FiEye,
  FiFile,
  FiImage,
  FiVideo,
  FiCode,
} from "react-icons/fi"

export default function ProjectDeliverables({ deliverables, setPreview }) {
  const getFileIcon = (type) => {
    const baseClass = "h-6 w-6"
    switch (type) {
      case "application":
        return <FiEye className={`${baseClass} text-blue-600`} />
      case "code":
        return <FiCode className={`${baseClass} text-green-600`} />
      case "design":
        return <FiImage className={`${baseClass} text-purple-600`} />
      case "documentation":
        return <FiFile className={`${baseClass} text-orange-600`} />
      case "video":
        return <FiVideo className={`${baseClass} text-red-600`} />
      default:
        return <FiFile className={`${baseClass} text-gray-500`} />
    }
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 border border-gray-100">
      <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-orange-500 to-yellow-500 mb-6">
        Project Deliverables
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        Preview or download your final project files below.
      </p>

      <div className="space-y-5">
        {deliverables.map((d) => (
          <div
            key={d.id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-white transition-shadow hover:shadow-sm"
          >
            {/* Left: Icon + Info */}
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                {getFileIcon(d.type)}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  {d.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{d.description}</p>
                {d.size && (
                  <p className="text-xs text-gray-400 mt-1">Size: {d.size}</p>
                )}
              </div>
            </div>

            {/* Right: Actions Row (mobile: split left/right) */}
            <div className="w-full md:w-auto flex justify-between md:justify-end items-center gap-3 mt-4 md:mt-0 md:ml-6">
              {/* Left Side on Mobile: Status Badge */}
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold whitespace-nowrap">
                {d.status}
              </span>

              {/* Right Side: Icons */}
              <div className="flex gap-2">
                {d.url ? (
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Preview"
                    className="p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                  >
                    <FiEye className="h-5 w-5" />
                  </a>
                ) : (
                  <button
                    onClick={() => setPreview(d)}
                    title="Preview"
                    className="p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                  >
                    <FiEye className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => alert("Downloading...")}
                  title="Download"
                  className="p-2 rounded-md bg-orange-50 hover:bg-orange-100 text-orange-600 transition"
                >
                  <FiDownload className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
