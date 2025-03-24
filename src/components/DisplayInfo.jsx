import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { usePrivy } from "@privy-io/react-auth";
import { 
  IconMessageCircle, 
  IconTrash, 
  IconEdit, 
  IconArrowBackUp, 
  IconChevronDown, 
  IconChevronUp, 
  IconHeart, 
  IconHeartFilled 
} from "@tabler/icons-react";

const DisplayInfo = () => {
  const { posts, setPosts, fetchPosts, createPost, editPost, deletePost } = useStateContext();
  const { user, ready } = usePrivy();
  const [newPost, setNewPost] = useState("");
  const [category, setCategory] = useState("pcod");
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  // Function to handle creating a new post
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

  // Function to handle creating a reply
  // In your handleCreateReply function:
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
        createdAt: new Date().toISOString()
      }),
    });

    if (!response.ok) throw new Error("Failed to create reply");

    const newReply = await response.json();

    // Debug: Log the response to see what's actually coming from backend
    console.log("Reply created:", newReply);

    // Ensure the reply has the expected structure
    const formattedReply = {
      id: newReply.id || `temp-${Date.now()}`, // fallback ID
      text: newReply.text || replyText, // fallback to input text
      createdBy: newReply.createdBy || user.email.address,
      createdAt: newReply.createdAt || new Date().toISOString()
    };

    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId
          ? {
              ...post,
              replies: [...(post.replies || []), formattedReply]
            }
          : post
      )
    );

    setReplyInputs(prev => ({ ...prev, [postId]: "" }));
    setShowReplyInput(prev => ({ ...prev, [postId]: false }));
  } catch (error) {
    console.error("Error creating reply:", error);
  }
};

  const toggleLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  if (!ready || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-[#0f0f15] dark:to-[#1a1a25]">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Loading community...</p>
          </div>
        </div>
      </div>
    );
  }

  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-[#0f0f15] dark:to-[#1a1a25]">
      {/* Vibrant Header */}
      <div className="sticky top-0 z-10 p-6 bg-white/90 dark:bg-[#13131a]/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Community Hub
          </h2>
          <p className="text-center text-purple-500 dark:text-purple-400 mt-2 font-medium">
            Share your journey • Find support • Connect with others
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-4xl w-full mx-auto space-y-6">
        {/* Attractive Post Creation Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e1e2a] shadow-xl border border-gray-200/50 dark:border-gray-800/50 transform transition-all hover:shadow-2xl">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                {user.email.address.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              <textarea
                className="w-full p-4 rounded-xl text-gray-900 dark:text-white bg-gray-50/50 dark:bg-[#252535] focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400/80 dark:placeholder-gray-500 resize-none"
                placeholder="What's your story today?..."
                rows={3}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="flex justify-between items-center mt-4">
                <select
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#252535] dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent border border-gray-300/50 dark:border-gray-700"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="pcod" className="bg-white dark:bg-[#252535]">PCOD</option>
                  <option value="diabetes" className="bg-white dark:bg-[#252535]">Diabetes</option>
                </select>
                <button
                  onClick={handleCreatePost}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all shadow-md flex items-center gap-2 hover:scale-[1.02] transform transition-transform"
                >
                  <IconMessageCircle size={18} />
                  Share Your Story
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Container */}
        <div className="space-y-6">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block p-6 mb-6 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                <IconMessageCircle size={48} className="text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                The conversation starts here!
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Be the first to share your experiences and help build this supportive community.
              </p>
            </div>
          ) : (
            sortedPosts.map((post) => (
              <div key={post.id} className="space-y-4">
                {/* Main Post */}
                <div className={`flex ${post.createdBy === user.email.address ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`p-5 rounded-3xl shadow-lg max-w-[85%] relative overflow-hidden ${post.createdBy === user.email.address
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-white dark:bg-[#252535] border border-gray-200/50 dark:border-gray-700/50"
                      }`}
                  >
                    {post.createdBy === user.email.address && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-bl-full"></div>
                    )}
                    
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${post.createdBy === user.email.address
                          ? "bg-white/20"
                          : "bg-gradient-to-r from-blue-400 to-purple-500"}`}>
                          {post.createdBy.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold">
                            {post.createdBy === user.email.address ? "You" : post.createdBy.split("@")[0]}
                          </p>
                          <span className="text-xs px-2 py-1 rounded-full bg-black/10 dark:bg-white/10">
                            {post.category.toUpperCase()}
                          </span>
                        </div>
                        <p className="mt-2 break-words">{post.text}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs opacity-80">
                            {new Date(post.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => toggleLike(post.id)}
                              className="flex items-center space-x-1 text-xs"
                            >
                              {likedPosts[post.id] ? (
                                <IconHeartFilled size={16} className="text-pink-500" />
                              ) : (
                                <IconHeart size={16} className="opacity-70 hover:opacity-100" />
                              )}
                              <span>{likedPosts[post.id] ? 'Liked' : 'Like'}</span>
                            </button>
                            <button
                              onClick={() => setShowReplyInput((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                              className={`flex items-center space-x-1 text-xs ${post.createdBy === user.email.address
                                ? "text-white/80 hover:text-white"
                                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                            >
                              <IconArrowBackUp size={16} />
                              <span>Reply</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reply Input */}
                {showReplyInput[post.id] && (
                  <div className={`flex ${post.createdBy === user.email.address ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[75%] w-full p-4 bg-white dark:bg-[#252535] rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {user.email.address.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1">
                          <textarea
                            className="w-full p-3 rounded-xl bg-gray-50/50 dark:bg-[#1e1e2a] text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Write your thoughtful reply..."
                            rows={2}
                            value={replyInputs[post.id] || ""}
                            onChange={(e) => setReplyInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          />
                          <div className="flex justify-end gap-3 mt-3">
                            <button
                              onClick={() => setShowReplyInput((prev) => ({ ...prev, [post.id]: false }))}
                              className="px-4 py-2 text-sm rounded-xl border border-gray-300/50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleCreateReply(post.id)}
                              className="px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-md"
                            >
                              Post Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Replies Toggle */}
                {post.replies?.length > 0 && (
                  <div className={`flex ${post.createdBy === user.email.address ? "justify-end" : "justify-start"} mt-2`}>
                    <button
                      onClick={() => setShowReplies((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                      className="flex items-center text-xs px-3 py-1.5 rounded-full bg-gray-100/50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                      {showReplies[post.id] ? (
                        <>
                          <IconChevronUp size={14} className="mr-1" />
                          Hide {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                        </>
                      ) : (
                        <>
                          <IconChevronDown size={14} className="mr-1" />
                          Show {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Replies List */}
                {showReplies[post.id] && post.replies?.length > 0 && (
                  <div className={`space-y-3 ${post.createdBy === user.email.address ? "pl-24" : "pr-24"}`}>
                    {post.replies.map((reply) => {
                      // Skip if reply is malformed
                      if (!reply || !reply.text) return null;

                      const replyUser = reply.createdBy || 'anonymous';
                      const isCurrentUser = replyUser === user?.email?.address;

                      return (
                        <div key={reply.id} className="flex">
                          <div className={`p-4 rounded-2xl text-sm max-w-[85%] ${
                            post.createdBy === user.email.address
                              ? "bg-purple-100/70 dark:bg-purple-900/30"
                              : "bg-gray-100/70 dark:bg-gray-700/70"
                          }`}>
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                  {replyUser.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-xs text-purple-600 dark:text-purple-400 mb-1">
                                  {isCurrentUser ? "You" : replyUser.split("@")[0]}
                                </p>
                                <p className="break-words">{reply.text}</p>
                                <p className="text-xs opacity-70 mt-2">
                                  {reply.createdAt 
                                    ? new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                                    : 'Just now'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayInfo;