// KanbanContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const KanbanContext = createContext();

export const KanbanProvider = ({ children }) => {
  const [kanbanData, setKanbanData] = useState({
    records: {},
    users: {}
  });

  // Enhanced localStorage handling
  useEffect(() => {
    const loadFromStorage = () => {
      const storedData = { records: {}, users: {} };
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
          if (key.startsWith('kanbanRecord-')) {
            const recordId = key.replace('kanbanRecord-', '');
            storedData.records[recordId] = JSON.parse(localStorage.getItem(key));
          } else if (key.startsWith('kanbanUser-')) {
            const userId = key.replace('kanbanUser-', '');
            storedData.users[userId] = JSON.parse(localStorage.getItem(key));
          }
        } catch (error) {
          console.error(`Error parsing ${key}:`, error);
        }
      }
      
      setKanbanData(storedData);
      console.log('Loaded kanban data from localStorage:', storedData);
    };

    loadFromStorage();
  }, []);

  const getRecordKanban = (recordId) => {
    return kanbanData.records[recordId] || null;
  };

  const setRecordKanban = async (recordId, data) => {
    if (!recordId) {
      console.error('Cannot save without recordId');
      return;
    }

    const newData = {
      columns: Array.isArray(data.columns) ? [...data.columns] : [],
      tasks: Array.isArray(data.tasks) ? [...data.tasks] : [],
      updatedAt: Date.now()
    };

    // Update state
    setKanbanData(prev => ({
      ...prev,
      records: {
        ...prev.records,
        [recordId]: newData
      }
    }));

    // Persist to localStorage
    try {
      localStorage.setItem(`kanbanRecord-${recordId}`, JSON.stringify(newData));
      console.log('Successfully saved record kanban:', { recordId, data: newData });
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  };

  const getUserKanban = (userId) => {
    return kanbanData.users[userId] || null;
  };

  const setUserKanban = async (userId, data) => {
    const newData = {
      columns: Array.isArray(data.columns) ? [...data.columns] : [],
      tasks: Array.isArray(data.tasks) ? [...data.tasks] : [],
      updatedAt: Date.now()
    };

    setKanbanData(prev => ({
      ...prev,
      users: {
        ...prev.users,
        [userId]: newData
      }
    }));

    try {
      localStorage.setItem(`kanbanUser-${userId}`, JSON.stringify(newData));
      return true;
    } catch (error) {
      console.error('Failed to save user kanban:', error);
      return false;
    }
  };

  return (
    <KanbanContext.Provider value={{
      getRecordKanban,
      setRecordKanban,
      getUserKanban,
      setUserKanban,
      resetKanbanBoard: (recordId) => {
        const emptyData = { columns: [], tasks: [] };
        setKanbanData(prev => ({
          ...prev,
          records: {
            ...prev.records,
            [recordId]: emptyData
          }
        }));
        localStorage.setItem(`kanbanRecord-${recordId}`, JSON.stringify(emptyData));
      }
    }}>
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => useContext(KanbanContext);