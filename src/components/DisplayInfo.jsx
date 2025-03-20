import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { usePrivy } from "@privy-io/react-auth";
import { IconMessageCircle, IconTrash, IconEdit, IconArrowBackUp, IconChevronDown, IconChevronUp } from "@tabler/icons-react";

const DisplayInfo = () => {
  const { posts, fetchPosts, createPost, editPost, deletePost } = useStateContext();
  const { user, ready } = usePrivy();
  const [newPost, setNewPost] = useState("");
  const [category, setCategory] = useState("pcod");
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [showReplies, setShowReplies] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

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
          post.id === postId ? { ...post, replies: [...(post.replies || []), newReply] } : post
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
      <div className="p-6 bg-white dark:bg-[#13131a] shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Community Hub</h2>
      </div>

      <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
        <div className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#1c1c24] dark:to-[#2c2c3a]">
          <textarea
            className="w-full p-3 border rounded-md text-gray-900 dark:text-white bg-transparent"
            placeholder="Share your thoughts..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="flex justify-between mt-2">
            <select
              className="p-2 border rounded-md bg-white dark:bg-[#1c1c24] dark:text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="pcod">PCOD</option>
              <option value="diabetes">Diabetes</option>
            </select>
            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Post
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-4 overflow-y-auto">
          {sortedPosts.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet. Be the first to share!</p>
          ) : (
            sortedPosts.map((post) => (
              <div key={post.id} className="space-y-4">
                <div className={`flex ${post.createdBy === user.email.address ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`p-4 rounded-xl shadow-lg w-[45%] text-gray-900 dark:text-white ${
                      post.createdBy === user.email.address
                        ? "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-blue-600 dark:to-blue-900"
                        : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
                    }`}
                  >
                    <p className="text-lg font-medium break-words">{post.text}</p>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span>{post.category.toUpperCase()}</span>
                      <span>{new Date(post.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <button
                      onClick={() => setShowReplyInput((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                      className={`mt-2 text-sm flex items-center px-3 py-1 rounded-md ${
                        post.createdBy === user.email.address
                          ? "bg-black text-white hover:bg-gray-900" // Black button for right-side posts
                          : "bg-blue-500 text-white hover:bg-blue-600" // Blue button for left-side posts
                      }`}
                    >
                      <IconArrowBackUp size={16} className="mr-1" /> Reply
                    </button>
                  </div>
                </div>

                {showReplyInput[post.id] && (
                  <div className="flex justify-end">
                    <div className="w-[80%] p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#1c1c24] dark:to-[#2c2c3a] rounded-lg">
                      <textarea className="w-full p-2 border rounded-md bg-transparent" placeholder="Write a reply..." value={replyInputs[post.id] || ""} onChange={(e) => setReplyInputs((prev) => ({ ...prev, [post.id]: e.target.value }))} />
                      <button onClick={() => handleCreateReply(post.id)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Reply</button>
                    </div>
                  </div>
                )}

                {post.replies?.length > 0 && (
                  <div className={`flex ${post.createdBy === user.email.address ? "justify-end" : "justify-start"}`}>
                    <button onClick={() => setShowReplies((prev) => ({ ...prev, [post.id]: !prev[post.id] }))} className="text-sm text-gray-700 dark:text-gray-400 flex items-center mt-2">
                      {showReplies[post.id] ? <IconChevronUp size={16} className="mr-1" /> : <IconChevronDown size={16} className="mr-1" />} View Replies ({post.replies.length})
                    </button>
                  </div>
                )}

                {showReplies[post.id] && post.replies?.map((reply) => (
                  <div key={reply.id} className={`flex ${post.createdBy === user.email.address ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`w-[70%] p-3 rounded-lg bg-gradient-to-r from-violet-100 to-violet-200 dark:from-violet-800 dark:to-violet-900`}
                    >
                      <p className="text-sm break-words">{reply.text}</p>
                      <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
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