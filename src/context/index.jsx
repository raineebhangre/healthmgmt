import React, { createContext, useContext, useState, useCallback } from "react";
import { db } from "../utils/dbConfig"; // Adjust the path to your dbConfig
import { Users, Records } from "../utils/schema"; // Adjust the path to your schema definitions
import { eq } from "drizzle-orm";

// Create a context
const StateContext = createContext();

// Provider component
export const StateContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);
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
      return newUser[0]; // Ensure the new user is returned
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
      return newRecord[0]; // Ensure the new record is returned
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

  return (
    <StateContext.Provider
      value={{
        users,
        records,
        fetchUsers,
        fetchUserByEmail,
        createUser,
        fetchUserRecords,
        createRecord,
        currentUser,
        updateRecord,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Custom hook to use the context
export const useStateContext = () => useContext(StateContext);
