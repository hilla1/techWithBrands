import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import ReusableModal from '../../reusable/ReusableModal';

import {
  schema,
  initialMessages,
  initialSharedFiles,
  teamMembers,
} from './collaboration/constants';

import TeamChat from './collaboration/TeamChat';
import SharedFiles from './collaboration/SharedFiles';
import TeamMembers from './collaboration/TeamMembers';
import MessageForm from './collaboration/MessageForm';
import InviteModal from './collaboration/InviteModal';
import UploadModal from './collaboration/UploadModal';

export default function CollaborationHub() {
  const [messages, setMessages] = useState(initialMessages);
  const [sharedFiles, setSharedFiles] = useState(initialSharedFiles);
  const [activeTab, setActiveTab] = useState('chat');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [messageBeingEdited, setMessageBeingEdited] = useState(null);
  const [replyBeingEdited, setReplyBeingEdited] = useState(null);
  const [newChatCount, setNewChatCount] = useState(0);
  const [newFilesCount, setNewFilesCount] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const maxSize = 10 * 1024 * 1024;
      const valid = acceptedFiles.filter((f) => f.size <= maxSize);
      if (valid.length) {
        setUploadedFiles((prev) => [...prev, ...valid]);
        setUploadOpen(true);
      } else {
        setAlertMessage('Files must be under 10MB in size.');
        setAlertOpen(true);
      }
    },
  });

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setAlertOpen(true);
  };

  const onSubmit = (data) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toISOString().split('T')[0];
    const attachments = uploadedFiles.map((f) => ({ name: f.name, blob: f }));

    if (replyBeingEdited) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === replyBeingEdited.parentId
            ? {
                ...msg,
                replies: msg.replies.map((r) =>
                  r.id === replyBeingEdited.id
                    ? { ...r, content: data.message, attachments, edited: true }
                    : r
                ),
              }
            : msg
        )
      );
    } else if (messageBeingEdited) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageBeingEdited.id
            ? { ...msg, content: data.message, attachments, edited: true }
            : msg
        )
      );
    } else {
      const newMsg = {
        id: messages.length + 1,
        user: 'You',
        avatar: 'https://i.pravatar.cc/40?img=4',
        time,
        date,
        content: data.message,
        attachments,
        replies: [],
      };

      if (replyTo) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === replyTo ? { ...msg, replies: [...msg.replies, newMsg] } : msg
          )
        );
      } else {
        setMessages((prev) => [...prev, newMsg]);
      }
    }

    if (attachments.length) {
      const newFiles = attachments.map((f) => ({
        fileName: f.name,
        sharedBy: 'You',
        date,
        time,
        blob: f.blob,
      }));
      setSharedFiles((prev) => [...prev, ...newFiles]);
    }

    reset();
    setUploadedFiles([]);
    setReplyTo(null);
    setMessageBeingEdited(null);
    setReplyBeingEdited(null);
  };

  const downloadFile = (file) => {
    if (file?.blob) {
      const url = URL.createObjectURL(file.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } else {
      showAlert('This file cannot be downloaded.');
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'chat') setNewChatCount(0);
    if (tab === 'files') setNewFilesCount(0);
  };

  const handleRemoveFile = (i) => setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleRenameFile = (i, name) =>
    setUploadedFiles((prev) => {
      const cp = [...prev];
      const old = cp[i];
      cp[i] = new File([old], name, { type: old.type, lastModified: old.lastModified });
      return cp;
    });

  const handleDeleteMessage = (id, payload = null) => {
    if (id === 'update-replies' && Array.isArray(payload)) {
      setMessages(payload);
    } else if (id) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleEditRequest = (message, parentId = null) => {
    setValue('message', message.content);
    const existingFiles =
      message.attachments?.map((att) =>
        att.blob instanceof File
          ? att.blob
          : new File([att.blob], att.name, {
              type: att.blob?.type || 'application/octet-stream',
            })
      ) || [];
    setUploadedFiles(existingFiles);

    if (parentId) {
      setReplyBeingEdited({ ...message, parentId });
    } else {
      setMessageBeingEdited({ id: message.id });
    }
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4 border rounded shadow p-4 bg-white">
          {/* Tab navigation */}
          <div className="flex space-x-2 border-b pb-2 shadow-sm">
            <button
              onClick={() => handleTabClick('chat')}
              className={`relative flex items-center gap-1 px-4 py-2 rounded font-semibold ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-blue-500 to-orange-400 text-white'
                  : 'bg-gray-100 text-blue-700 hover:bg-blue-50'
              }`}
            >
              Team Chat
              {newChatCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1.5">
                  {newChatCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabClick('files')}
              className={`relative flex items-center gap-1 px-4 py-2 rounded font-semibold ${
                activeTab === 'files'
                  ? 'bg-gradient-to-r from-blue-500 to-orange-400 text-white'
                  : 'bg-gray-100 text-blue-700 hover:bg-blue-50'
              }`}
            >
              Shared Files
              {newFilesCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1.5">
                  {newFilesCount}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'chat' ? (
            <TeamChat
              messages={messages}
              replyTo={replyTo}
              setReplyTo={(id) => {
                setReplyTo(id);
                setMessageBeingEdited(null);
                setReplyBeingEdited(null);
                setIsFormOpen(true);
              }}
              sharedFiles={sharedFiles}
              downloadFile={downloadFile}
              setIsFormOpen={setIsFormOpen}
              onDeleteMessage={handleDeleteMessage}
              onEditRequest={handleEditRequest}
            />
          ) : (
            <SharedFiles sharedFiles={sharedFiles} downloadFile={downloadFile} />
          )}

          <MessageForm
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            uploadedFiles={uploadedFiles}
            setUploadOpen={setUploadOpen}
            replyTo={replyTo}
            removeFile={handleRemoveFile}
            isOpen={isFormOpen}
            setIsOpen={(open) => {
              setIsFormOpen(open);
              if (!open) {
                setReplyTo(null);
                setMessageBeingEdited(null);
                setReplyBeingEdited(null);
                setUploadedFiles([]);
              }
            }}
            setReplyTo={setReplyTo}
            editingMessage={messageBeingEdited}
            editingReply={replyBeingEdited}
            setUploadedFiles={setUploadedFiles}
          />
        </div>

        <div className="w-full self-start h-auto">
          <TeamMembers
            teamMembers={teamMembers}
            setInviteOpen={setInviteOpen}
            setUploadOpen={setUploadOpen}
          />
        </div>
      </div>

      <InviteModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} register={register} />

      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        uploadedFiles={uploadedFiles}
        onRemoveFile={handleRemoveFile}
        onUpdateFileName={handleRenameFile}
      />

      <ReusableModal isOpen={alertOpen} onClose={() => setAlertOpen(false)} title="Notification">
        <div className="p-4">
          <p className="text-gray-700">{alertMessage}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setAlertOpen(false)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-orange-400 text-white rounded hover:opacity-90"
            >
              OK
            </button>
          </div>
        </div>
      </ReusableModal>
    </div>
  );
}
