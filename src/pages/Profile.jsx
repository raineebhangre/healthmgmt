import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { usePrivy } from "@privy-io/react-auth";
import { IconEdit, IconMapPin, IconUser, IconMail, IconCalendar, IconCheck, IconX } from "@tabler/icons-react";

const Profile = () => {
  const { currentUser, fetchUserByEmail, updateUser } = useStateContext();
  const { user } = usePrivy();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: "",
    age: "",
    location: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  // Initialize editedUser when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setEditedUser({
        username: currentUser.username,
        age: currentUser.age.toString(),
        location: currentUser.location
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser && user?.email?.address) {
      fetchUserByEmail(user.email.address);
    }
  }, [currentUser, user, fetchUserByEmail]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const updatedData = {
        username: editedUser.username,
        age: parseInt(editedUser.age, 10),
        location: editedUser.location
      };
      
      // Optimistically update the UI
      const optimisticUpdate = {
        ...currentUser,
        ...updatedData
      };
      
      // Update context state immediately
      updateUser({
        id: currentUser.id,
        ...updatedData
      }, optimisticUpdate);
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedUser({
      username: currentUser.username,
      age: currentUser.age.toString(),
      location: currentUser.location
    });
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#0f0f15] to-[#1a1a25]">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <div className="mt-4 h-4 w-48 animate-pulse rounded-full bg-gray-700"></div>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return "😊";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f15] to-[#1a1a25] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-2xl bg-[#1e1e2a] shadow-xl">
          {/* Profile Header */}
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 transform">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#1e1e2a] bg-gradient-to-r from-amber-400 to-pink-500 text-3xl font-bold text-white shadow-lg">
                {getInitials(currentUser.username)}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 pt-16 pb-8">
            <div className="text-center">
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={editedUser.username}
                  onChange={handleInputChange}
                  className="mb-2 w-full rounded-lg bg-[#252535] p-2 text-center text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <h1 className="text-2xl font-bold text-white">{currentUser.username || "Anonymous User"}</h1>
              )}
              <p className="text-gray-400">{currentUser.createdBy}</p>
            </div>

            {/* Profile Details */}
            <div className="mt-8 space-y-6">
              {/* Email (non-editable) */}
              <div className="flex items-start rounded-lg bg-[#252535] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                  <IconMail size={20} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Email</p>
                  <p className="mt-1 text-white">{currentUser.createdBy}</p>
                </div>
              </div>

              {/* Username */}
              <div className="flex items-start rounded-lg bg-[#252535] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                  <IconUser size={20} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-400">Username</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={editedUser.username}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg bg-[#1e1e2a] p-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="mt-1 text-white">{currentUser.username || "Not set"}</p>
                  )}
                </div>
              </div>

              {/* Age */}
              <div className="flex items-start rounded-lg bg-[#252535] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                  <IconCalendar size={20} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-400">Age</p>
                  {isEditing ? (
                    <input
                      type="number"
                      name="age"
                      value={editedUser.age}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg bg-[#1e1e2a] p-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  ) : (
                    <p className="mt-1 text-white">{currentUser.age || "Not specified"}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start rounded-lg bg-[#252535] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                  <IconMapPin size={20} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-400">Location</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={editedUser.location}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg bg-[#1e1e2a] p-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="mt-1 text-white">{currentUser.location || "Unknown"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Edit/Save Buttons */}
            <div className="mt-8 flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className={`flex-1 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 py-3 px-4 font-medium text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg ${isSaving ? 'opacity-70' : ''}`}
                    >
                      {isSaving ? (
                        'Saving...'
                      ) : (
                        <>
                          <IconCheck size={18} className="mr-2 inline" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className={`flex-1 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 py-3 px-4 font-medium text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg ${isSaving ? 'opacity-70' : ''}`}
                    >
                      <IconX size={18} className="mr-2 inline" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 py-3 px-4 font-medium text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg"
                  >
                    <IconEdit size={18} className="mr-2 inline" />
                    Edit Profile
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;