import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { usePrivy } from "@privy-io/react-auth";
import { IconMessageCircle, IconTrash, IconEdit, IconArrowBackUp } from "@tabler/icons-react";

const DisplayInfo = () => {
  const { posts, fetchPosts, createPost, editPost, deletePost } = useStateContext();
  const { user, ready } = usePrivy();
  const [newPost, setNewPost] = useState("");
  const [category, setCategory] = useState("pcod");
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    if (!user || !user.email) {
      console.error("User is not logged in or email is not available.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newPost,
          category,
          createdBy: user.email.address,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const newPostData = await response.json();
      setPosts((prevPosts) => [newPostData, ...prevPosts]);
      setNewPost("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleCreateReply = async (postId) => {
    const replyText = replyInputs[postId];
    if (!replyText?.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: replyText,
          createdBy: user.email.address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create reply");
      }

      const newReply = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, replies: [...(post.replies || []), newReply] }
            : post
        )
      );
      setReplyInputs((prev) => ({ ...prev, [postId]: "" }));
      setShowReplyInput((prev) => ({ ...prev, [postId]: false }));
    } catch (error) {
      console.error("Error creating reply:", error);
    }
  };

  if (!ready || !user) {
    return <p className="text-center text-gray-500">Loading user data...</p>;
  }

  const sortedPosts = [...posts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#13131a]">
      {/* Header */}
      <div className="p-6 bg-white dark:bg-[#13131a] shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Community Hub</h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
        {/* Post Input Section */}
        <div className="p-4 border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-[#1c1c24]">
          <textarea
            className="w-full p-3 border rounded-md text-gray-900 dark:text-white dark:bg-[#1c1c24] border-gray-300 dark:border-gray-700"
            placeholder="Share your thoughts..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="flex justify-between mt-2">
            <select
              className="p-2 border rounded-md bg-white dark:bg-[#1c1c24] dark:text-white border-gray-300 dark:border-gray-700"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="pcod">PCOD</option>
              <option value="diabetes">Diabetes</option>
            </select>
            <button onClick={handleCreatePost} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Post
            </button>
          </div>
        </div>

        {/* Chat-like Posts Section */}
        <div className="flex-1 flex flex-col space-y-4 overflow-y-auto">
          {sortedPosts.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet. Be the first to share!</p>
          ) : (
            sortedPosts.map((post) => (
              <div key={post.id} className="space-y-4">
                {/* Post */}
                <div
                  className={`flex ${
                    post.createdBy === user.email.address ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-4 rounded-xl shadow-lg ${
                      post.createdBy === user.email.address
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white w-[45%]"
                        : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-[#1c1c24] dark:to-[#2c2c3a] text-gray-900 dark:text-white w-[45%]"
                    }`}
                  >
                    <p className="text-lg font-medium break-words">{post.text}</p>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span>{post.category.toUpperCase()}</span>
                      <span>{new Date(post.createdAt).toLocaleTimeString()}</span>
                    </div>
                    {post.createdBy === user.email.address && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => editPost(post.id)}
                          className="text-white hover:text-blue-200"
                        >
                          <IconEdit size={18} />
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-white hover:text-red-200"
                        >
                          <IconTrash size={18} />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => setShowReplyInput((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                      className="mt-2 text-sm text-blue-500 hover:text-blue-700 flex items-center"
                    >
                      <IconArrowBackUp size={16} className="mr-1" /> Reply
                    </button>
                  </div>
                </div>

                {/* Reply Input */}
                {showReplyInput[post.id] && (
                  <div className="flex justify-end">
                    <div className="w-[80%] p-4 bg-gray-50 dark:bg-[#1c1c24] rounded-lg">
                      <textarea
                        className="w-full p-2 border rounded-md text-gray-900 dark:text-white dark:bg-[#1c1c24] border-gray-300 dark:border-gray-700"
                        placeholder="Write a reply..."
                        value={replyInputs[post.id] || ""}
                        onChange={(e) =>
                          setReplyInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                      />
                      <button
                        onClick={() => handleCreateReply(post.id)}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {post.replies?.map((reply) => (
                  <div key={reply.id} className="flex justify-end">
                    <div className="w-[70%] p-3 ml-10 bg-gray-100 dark:bg-[#2c2c3a] rounded-lg">
                      <p className="text-sm break-words">{reply.text}</p>
                      <div className="flex justify-between items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{reply.createdBy}</span>
                        <span>{new Date(reply.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayInfo;