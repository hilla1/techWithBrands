import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';

export default function TeamChat({
  messages,
  replyTo,
  setReplyTo,
  sharedFiles,
  downloadFile,
  setIsFormOpen,
  onEditRequest,     // editing a message or reply
  onDeleteMessage,   // deleting a message or updating messages after reply delete
}) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle deleting a reply
  const handleDeleteReply = (parentId, replyId) => {
    const updatedMessages = messages.map((msg) => {
      if (msg.id === parentId) {
        return {
          ...msg,
          replies: msg.replies?.filter((r) => r.id !== replyId) || [],
        };
      }
      return msg;
    });

    // Pass a special action key to differentiate from single message deletion
    onDeleteMessage('update-replies', updatedMessages);
  };

  // Handle editing a reply
  const handleEditReply = (parentId, reply) => {
    onEditRequest(reply, parentId);
    setIsFormOpen(true);
  };

  return (
    <div className="h-[400px] overflow-y-auto space-y-4 bg-white">
      {messages.length === 0 ? (
        <div className="text-gray-500 text-center mt-10">No messages yet.</div>
      ) : (
        messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            isReplying={replyTo === msg.id}
            onReply={() => {
              setReplyTo(msg.id);
              setIsFormOpen(true);
            }}
            onEdit={() => {
              onEditRequest(msg);
              setIsFormOpen(true);
            }}
            onDelete={() => onDeleteMessage(msg.id)}
            onReplyEdit={handleEditReply}
            onReplyDelete={handleDeleteReply}
            sharedFiles={sharedFiles}
            downloadFile={downloadFile}
          />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
}
