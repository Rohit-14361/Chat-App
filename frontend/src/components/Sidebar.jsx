import React, { useRef } from "react";
import { FiLogOut, FiSearch, FiUser, FiCamera } from "react-icons/fi";

function Sidebar({
  currentUser,
  users,
  selectedUser,
  onlineUsers,
  searchQuery,
  setSearchQuery,
  onSelectUser,
  onLogout,
  onAvatarChange,
}) {
  const avatarInputRef = useRef(null);

  // Filter users by search query
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 flex flex-col border-r border-slate-700/50 bg-slate-900/60 backdrop-blur-md shrink-0">
      
      {/* Sidebar Header: Current User Profile & Actions */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="relative group cursor-pointer"
            onClick={() => avatarInputRef.current?.click()}
          >
            {currentUser?.profilePic ? (
              <img
                src={currentUser.profilePic}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border border-amber-400/30 group-hover:opacity-85 transition"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-750 flex items-center justify-center border border-amber-400/30 group-hover:opacity-85 transition text-amber-300 font-semibold text-lg">
                {currentUser?.name?.charAt(0).toUpperCase() || <FiUser />}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <FiCamera className="text-white text-xs" />
            </div>
            <input
              type="file"
              ref={avatarInputRef}
              className="hidden"
              accept="image/*"
              onChange={onAvatarChange}
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-slate-200 text-sm truncate max-w-[120px]">
              {currentUser?.name}
            </h4>
            <span className="text-xs text-amber-400/90 font-medium">My Account</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          title="Log Out"
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition"
        >
          <FiLogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Search User */}
      <div className="p-3">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-750 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
          />
        </div>
      </div>

      {/* Sidebar Users List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/30">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((item) => {
            const isOnline = onlineUsers.includes(item._id);
            const isSelected = selectedUser?._id === item._id;

            return (
              <div
                key={item._id}
                onClick={() => onSelectUser(item)}
                className={`flex items-center gap-3 p-3.5 cursor-pointer hover:bg-slate-800/50 transition-colors ${
                  isSelected ? "bg-amber-400/10 border-l-2 border-amber-400" : ""
                }`}
              >
                <div className="relative">
                  {item.profilePic ? (
                    <img
                      src={item.profilePic}
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-700"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-450 font-semibold">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Online status badge */}
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-sm text-slate-200 truncate">
                      {item.name}
                    </h5>
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {isOnline ? (
                      <span className="text-green-400 font-medium">Online</span>
                    ) : (
                      "Offline"
                    )}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
