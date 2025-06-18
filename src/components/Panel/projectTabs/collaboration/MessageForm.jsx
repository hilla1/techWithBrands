import React, { useEffect } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function MessageForm({
  register,
  handleSubmit,
  onSubmit,
  uploadedFiles,
  setUploadOpen,
  replyTo,
  removeFile,
  isOpen,
  setIsOpen,
  setReplyTo,
  editingMessage,
  editingReply,
  setUploadedFiles,
  cancelEdit,
}) {
  // Populate uploadedFiles if editing a message or reply with attachments
  useEffect(() => {
    const source = editingReply || editingMessage;

    // Only set uploaded files if there are attachments and none currently loaded
    if (source?.attachments?.length && uploadedFiles.length === 0) {
      const convertedFiles = source.attachments.map((att) => {
        const byteArray = new Uint8Array(att.blob?.data || []);
        const blob = new Blob([byteArray], { type: att.blob?.type || 'application/octet-stream' });
        return new File([blob], att.name, {
          type: att.blob?.type || 'application/octet-stream',
        });
      });

      setUploadedFiles(convertedFiles);
    }
  }, [editingMessage, editingReply, uploadedFiles, setUploadedFiles]);

  // Toggle form open/close and clear state
  const toggleForm = () => {
    setReplyTo?.(null);
    cancelEdit?.();
    setIsOpen(!isOpen);
    setUploadedFiles([]);
  };

  // Handle form submit
  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    setIsOpen(false);
    setReplyTo?.(null);
    cancelEdit?.();
    setUploadedFiles([]);
  };

  // Remove a file from uploadedFiles by index
  const handleRemoveFile = (index) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    removeFile?.(index); // optional: inform parent
  };

  return (
    <div className="relative w-full">
      <AnimatePresence>
        {isOpen && (
          <motion.form
            onSubmit={handleSubmit(handleFormSubmit)}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 right-0 w-full max-w-md bg-white border p-4 rounded-lg shadow-xl z-20"
          >
            {/* Reply Info */}
            {replyTo && !editingMessage && !editingReply && (
              <p className="text-sm text-green-600 font-medium mb-1">
                Replying to message #{replyTo}
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="ml-2 text-red-500 hover:text-red-700 text-xs"
                >
                  Cancel
                </button>
              </p>
            )}

            {/* Edit Message Info */}
            {editingMessage && !editingReply && (
              <p className="text-sm text-yellow-600 font-medium mb-1">
                Editing message #{editingMessage.id}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="ml-2 text-red-500 hover:text-red-700 text-xs"
                >
                  Cancel
                </button>
              </p>
            )}

            {/* Edit Reply Info */}
            {editingReply && (
              <p className="text-sm text-yellow-600 font-medium mb-1">
                Editing reply #{editingReply.id}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="ml-2 text-red-500 hover:text-red-700 text-xs"
                >
                  Cancel
                </button>
              </p>
            )}

            {/* Textarea Input */}
            <textarea
              {...register('message')}
              placeholder="Type a message..."
              defaultValue={
                editingReply?.content ||
                editingMessage?.content ||
                ''
              }
              className="border rounded p-2 resize-none text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
              required
            />

            {/* Attachment List */}
            {uploadedFiles?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center bg-blue-50 text-blue-700 text-sm px-2 py-1 rounded shadow-sm"
                  >
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      title="Remove file"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between items-center mt-3">
              {/* Upload is now allowed for all cases */}
              <button
                type="button"
                onClick={() => setUploadOpen(true)}
                className="text-blue-600 text-sm hover:underline"
              >
                Upload File
              </button>

              <button
                type="submit"
                className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                {editingReply || editingMessage ? 'Update' : 'Send'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <div className="flex justify-end mt-4 relative z-10">
        <button
          type="button"
          onClick={toggleForm}
          className="bg-blue-600 text-white rounded-full p-3 shadow-md hover:bg-blue-700 transition-all"
          aria-label={isOpen ? 'Close form' : 'Open form'}
        >
          {isOpen ? <FiX className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
