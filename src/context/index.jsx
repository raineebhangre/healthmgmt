import React, { createContext, useContext, useState, useCallback } from "react";
import { db } from "../utils/dbConfig.js"; // Adjust the path to your dbConfig
import { Users, Records } from "../utils/schema.js"; // Adjust the path to your schema definitions
import { eq } from "drizzle-orm";

// Create a context
const StateContext = createContext();

// Provider component
export const StateContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Function to fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      const result = await db.select().from(Users).execute();
      setUsers(result);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  // Function to fetch user details by email
  const fetchUserByEmail = useCallback(async (email) => {
    try {
      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.createdBy, email))
        .execute();

      if (result.length > 0) {
        setCurrentUser(result[0]);
      }
    } catch (error) {
      console.error("Error fetching user by email:", error);
    }
  }, []);

  // Function to create a new user
  const createUser = useCallback(async (userData) => {
    try {
      const newUser = await db
        .insert(Users)
        .values(userData)
        .returning({ id: Users.id, createdBy: Users.createdBy })
        .execute();

      setUsers((prevUsers) => [...prevUsers, newUser[0]]);
      return newUser[0];
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }, []);

  // Function to fetch all records for a specific user
  const fetchUserRecords = useCallback(async (userEmail) => {
    try {
      const result = await db
        .select()
        .from(Records)
        .where(eq(Records.createdBy, userEmail))
        .execute();
      setRecords(result);
    } catch (error) {
      console.error("Error fetching user records:", error);
    }
  }, []);

  // Function to create a new record
  const createRecord = useCallback(async (recordData) => {
    try {
      const newRecord = await db
        .insert(Records)
        .values(recordData)
        .returning({ id: Records.id })
        .execute();

      setRecords((prevRecords) => [...prevRecords, newRecord[0]]);
      return newRecord[0];
    } catch (error) {
      console.error("Error creating record:", error);
      return null;
    }
  }, []);

  // Function to update an existing record
  const updateRecord = useCallback(async (recordData) => {
    try {
      const { documentID, ...dataToUpdate } = recordData;
      const updatedRecords = await db
        .update(Records)
        .set(dataToUpdate)
        .where(eq(Records.id, documentID))
        .returning()
        .execute();

      if (updatedRecords.length > 0) {
        setRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === documentID ? updatedRecords[0] : record
          )
        );
      }
    } catch (error) {
      console.error("Error updating record:", error);
      return null;
    }
  }, []);

  // Function to fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/posts"); // ✅ Fetch from backend
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, []);
  

  // Function to create a post
  const createPost = useCallback(async (postData) => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      const newPost = await response.json();
      setPosts((prevPosts) => [...prevPosts, newPost]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }, []);

  // Function to edit a post
  const editPost = useCallback(async (postId, updatedText) => {
    try {
      await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: updatedText }),
      });
      fetchPosts();
    } catch (error) {
      console.error("Error editing post:", error);
    }
  }, [fetchPosts]);

  // Function to delete a post
  const deletePost = useCallback(async (postId) => {
    try {
      await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }, []);

  return (
    <StateContext.Provider
      value={{
        users,
        records,
        posts,
        fetchUsers,
        fetchUserByEmail,
        createUser,
        fetchUserRecords,
        createRecord,
        currentUser,
        updateRecord,
        fetchPosts,
        createPost,
        editPost,
        deletePost,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Custom hook to use the context
export const useStateContext = () => useContext(StateContext);