import React from "react";
import { FiMessageSquare } from "react-icons/fi";

function WelcomeContainer() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-955/10">
      <div className="w-20 h-20 rounded-3xl bg-amber-400/10 flex items-center justify-center text-amber-300 border border-amber-400/20 mb-6 shadow-lg shadow-amber-500/5 animate-pulse">
        <FiMessageSquare className="w-10 h-10" />
      </div>
      
      <h2 className="text-2xl font-extrabold text-slate-200 mb-2">
        Select a chat to start messaging
      </h2>
      
      <p className="text-slate-500 text-sm max-w-sm">
        Choose a contact from the sidebar list on the left to begin a real-time conversation.
      </p>
    </div>
  );
}

export default WelcomeContainer;
