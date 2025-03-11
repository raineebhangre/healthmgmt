/*import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";
import { IconMessageCircle, IconTrash, IconEdit } from "@tabler/icons-react";

const DisplayInfo = () => {
  const { posts = [], fetchPosts, createPost, editPost, deletePost } = useStateContext();
  const { user } = usePrivy();
  const [newPost, setNewPost] = useState("");
  const [category, setCategory] = useState("pcod");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    await createPost({ text: newPost, category, createdBy: user.email.address });
    setNewPost("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-[#13131a] rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Community Hub</h2>
      <div className="mb-6 p-4 border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-[#1c1c24]">
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
          <button onClick={handleCreatePost} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Post</button>
        </div>
      </div>
      <div className="space-y-4">
        {!posts.length ? (
  <p className="text-center text-gray-500">Loading posts...</p>
) : (
  posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg shadow-sm dark:border-gray-700 dark:bg-[#1c1c24]">
            <p className="text-lg font-medium text-gray-900 dark:text-white">{post.text}</p>
            <div className="flex justify-between items-center mt-2 text-gray-500 dark:text-gray-400">
              <span className="text-sm">{post.category.toUpperCase()} - {post.createdBy}</span>
              {user.email.address === post.createdBy && (
                <div className="flex space-x-2">
                  <button onClick={() => editPost(post.id)} className="text-blue-500 hover:text-blue-700"><IconEdit size={18} /></button>
                  <button onClick={() => deletePost(post.id)} className="text-red-500 hover:text-red-700"><IconTrash size={18} /></button>
                </div>
              )}
            </div>
          </div>
        ))
      )};
      </div>
    </div>
  );
};

export default DisplayInfo; 
*/

import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { usePrivy } from "@privy-io/react-auth";
import { IconMessageCircle, IconTrash, IconEdit } from "@tabler/icons-react";

const DisplayInfo = () => {
  const { posts, fetchPosts, createPost, editPost, deletePost } = useStateContext();
  const { user } = usePrivy();
  const [newPost, setNewPost] = useState("");
  const [category, setCategory] = useState("pcod");

  useEffect(() => {
    fetchPosts(); // ✅ Fetch posts on page load
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;  // Prevent empty posts
  
    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newPost,
          category,
          createdBy: user.email.address,  // Assuming user is logged in
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
  
      const newPostData = await response.json();
  
      // ✅ Update UI instantly
      setPosts((prevPosts) => [newPostData, ...prevPosts]);  
  
      setNewPost("");  // Clear input after posting
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
    
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-[#13131a] rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Community Hub</h2>
      <div className="mb-6 p-4 border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-[#1c1c24]">
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
          <button onClick={handleCreatePost} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Post</button>
        </div>
      </div>

      {/* Display Posts */}
      <div className="space-y-4">
          {!posts.length ? (
            <p className="text-center text-gray-500">No posts yet. Be the first to share!</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="p-4 border rounded-lg shadow-sm dark:border-gray-700 dark:bg-[#1c1c24]">
                <p className="text-lg font-medium text-gray-900 dark:text-white">{post.text}</p>
                <div className="flex justify-between items-center mt-2 text-gray-500 dark:text-gray-400">
                  <span className="text-sm">{post.category.toUpperCase()} - {post.createdBy}</span>
                </div>
              </div>
            ))
          )}
        </div>
    </div>
  );
};

export default DisplayInfo;
