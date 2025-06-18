import React, { useState } from 'react';
import {
  FiDownload,
  FiCornerDownRight,
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiCornerUpRight,
} from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import ConfirmActionModal from '../../../reusable/ConfirmActionModal';

export default function MessageItem({
  message,
  isReplying,
  onReply,
  sharedFiles,
  downloadFile,
  onDelete,
  onEdit,
  onReplyEdit,
  onReplyDelete,
}) {
  // Separate state for dropdowns
  const [isMessageMenuOpen, setIsMessageMenuOpen] = useState(false);
  const [openReplyMenuIndex, setOpenReplyMenuIndex] = useState(null);

  // State for confirmation modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'message'|'reply', id, parentId }

  const openDeleteModal = (type, id, parentId = null) => {
    setDeleteTarget({ type, id, parentId });
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget.type === 'message') {
      onDelete(deleteTarget.id);
    } else if (deleteTarget.type === 'reply') {
      onReplyDelete(deleteTarget.parentId, deleteTarget.id);
    }
    setConfirmModalOpen(false);
  };

  const renderMarkdown = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const modified = text.replace(urlRegex, (url) => `[${url}](${url})`);
    return (
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 underline hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
        }}
      >
        {modified}
      </ReactMarkdown>
    );
  };

  return (
    <div className="relative border rounded-lg p-3 bg-white shadow-sm space-y-2">
      {/* Main Message Dropdown */}
      <div className="absolute top-2 right-2">
        <div className="relative">
          <button onClick={() => setIsMessageMenuOpen(!isMessageMenuOpen)}>
            <FiMoreVertical className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>

          {isMessageMenuOpen && (
            <div className="absolute right-0 mt-1 bg-white border rounded shadow z-10 w-32 text-sm">
              <button
                className="w-full px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-left"
                onClick={() => {
                  setIsMessageMenuOpen(false);
                  onReply();
                }}
              >
                <FiCornerUpRight className="w-4 h-4" />
                Reply
              </button>
              <button
                className="w-full px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-left"
                onClick={() => {
                  setIsMessageMenuOpen(false);
                  onEdit(message);
                }}
              >
                <FiEdit className="w-4 h-4" />
                Edit
              </button>
              <button
                className="w-full px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-left text-red-500"
                onClick={() => {
                  setIsMessageMenuOpen(false);
                  openDeleteModal('message', message.id);
                }}
              >
                <FiTrash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className="flex gap-3 items-start">
        <img
          src={message.avatar}
          className="rounded-full w-9 h-9 object-cover border"
          alt="avatar"
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <p className="font-bold text-gray-800">{message.user}</p>
            <span className="text-xs text-gray-400">
              {message.time} | {message.date}
            </span>
          </div>

          <div className="text-sm text-gray-700 whitespace-pre-wrap">
            {renderMarkdown(message.content)}
          </div>

          {/* Attachments */}
          {message.attachments?.length > 0 && (
            <div className="mt-1 space-y-1">
              {message.attachments.map((file, idx) => {
                const fileData = sharedFiles.find((f) => f.name === file.name);
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-1 text-sm text-blue-600 cursor-pointer hover:underline"
                    onClick={() => downloadFile(fileData)}
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>{file.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {message.replies?.length > 0 && (
        <div className="ml-11 mt-2 border-l-2 pl-4 space-y-3">
          {message.replies.map((reply, idx) => (
            <div
              key={idx}
              className="flex gap-2 items-start text-sm bg-gray-50 border rounded p-2 relative"
            >
              <FiCornerDownRight className="text-gray-400 mt-1 w-4 h-4" />
              <div className="flex-1 space-y-0.5">
                <p className="font-semibold text-gray-800">{reply.user}</p>
                <p className="text-xs text-gray-400">
                  {reply.time} | {reply.date}
                </p>
                <p className="text-gray-700 whitespace-pre-wrap">{renderMarkdown(reply.content)}</p>

                {/* Reply Attachments */}
                {reply.attachments?.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {reply.attachments.map((file, i) => {
                      const fileData = sharedFiles.find((f) => f.name === file.name);
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-1 text-sm text-blue-600 cursor-pointer hover:underline"
                          onClick={() => downloadFile(fileData)}
                        >
                          <FiDownload className="w-4 h-4" />
                          <span>{file.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Reply Dropdown */}
              <div className="absolute top-2 right-2">
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenReplyMenuIndex(openReplyMenuIndex === idx ? null : idx)
                    }
                  >
                    <FiMoreVertical className="w-4 h-4 text-gray-500 hover:text-black" />
                  </button>

                  {openReplyMenuIndex === idx && (
                    <div className="absolute right-0 mt-1 bg-white border rounded shadow z-10 w-28 text-sm">
                      <button
                        className="w-full px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-left"
                        onClick={() => {
                          setOpenReplyMenuIndex(null);
                          onReplyEdit(message.id, reply);
                        }}
                      >
                        <FiEdit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        className="w-full px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-left text-red-500"
                        onClick={() => {
                          setOpenReplyMenuIndex(null);
                          openDeleteModal('reply', reply.id, message.id);
                        }}
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmActionModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this?"
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
