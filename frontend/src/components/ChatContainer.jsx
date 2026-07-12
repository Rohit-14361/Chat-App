import React, { useRef, useEffect } from "react";
import { FiSend, FiImage, FiX, FiMessageSquare } from "react-icons/fi";

function ChatContainer({
  currentUser,
  selectedUser,
  messages,
  onlineUsers,
  typingUsers,
  inputText,
  onInputChange,
  imagePreview,
  onImageSelect,
  onRemoveImage,
  onSubmitMessage,
}) {
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages load or change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // Helper to format timestamps
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isOnline = onlineUsers.includes(selectedUser?._id);
  const isTyping = typingUsers[selectedUser?._id];

  return (
    <div className="flex-1 flex flex-col bg-slate-950/40 relative">
      
      {/* Chat Header */}
      <div className="h-16 border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            {selectedUser.profilePic ? (
              <img
                src={selectedUser.profilePic}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-750"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-750 flex items-center justify-center text-slate-300 font-semibold">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
            )}
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-slate-900 rounded-full"></span>
            )}
          </div>
          
          <div>
            <h4 className="font-bold text-slate-100 text-sm leading-tight">
              {selectedUser.name}
            </h4>
            <div className="text-xs">
              {isTyping ? (
                <span className="text-amber-400 font-semibold animate-pulse">typing...</span>
              ) : isOnline ? (
                <span className="text-green-400 font-medium">Online</span>
              ) : (
                <span className="text-slate-500">Offline</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/20">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isOwnMessage = msg.senderId === currentUser?._id;
            
            return (
              <div
                key={msg._id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div className="flex items-end gap-2 max-w-[70%]">
                  {!isOwnMessage && (
                    <div className="shrink-0 mb-1">
                      {selectedUser.profilePic ? (
                        <img
                          src={selectedUser.profilePic}
                          alt="avatar"
                          className="w-7 h-7 rounded-full object-cover border border-slate-800"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 text-xs font-semibold">
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-col">
                    <div
                      className={`px-4 py-2.5 rounded-2xl shadow-md text-sm break-words ${
                        isOwnMessage
                          ? "bg-amber-400 text-gray-900 rounded-br-none"
                          : "bg-slate-850 text-slate-200 border border-slate-800 rounded-bl-none"
                      }`}
                    >
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Shared"
                          className="rounded-lg max-w-full max-h-60 mb-2 object-contain"
                        />
                      )}
                      {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                    </div>
                    
                    <span
                      className={`text-[10px] text-slate-500 mt-1 px-1 ${
                        isOwnMessage ? "text-right" : "text-left"
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <FiMessageSquare className="w-12 h-12 mb-3 text-slate-600" />
            <p className="text-sm">No messages yet. Send a message to start the conversation!</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Image Attachment Preview Above Input Bar */}
      {imagePreview && (
        <div className="px-6 py-3 border-t border-slate-850 bg-slate-900/60 backdrop-blur-md flex items-center gap-4 animate-fade-in z-10">
          <div className="relative border border-slate-700 rounded-lg p-1 bg-slate-800">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-16 w-16 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={onRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow-md transition"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs text-slate-400">
            <p className="font-semibold text-slate-350">Image attachment ready</p>
          </div>
        </div>
      )}

      {/* Message Input Bar */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-900/40 backdrop-blur-md z-10">
        <form onSubmit={onSubmitMessage} className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach Image"
            className="p-2.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 rounded-lg transition"
          >
            <FiImage className="w-5 h-5" />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={onImageSelect}
          />

          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={onInputChange}
            className="flex-1 p-3 bg-slate-800/60 border border-slate-750 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
          />

          <button
            type="submit"
            disabled={!inputText.trim() && !imagePreview}
            className="p-3 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-xl transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatContainer;
