import React, { createContext, useContext, useState, useEffect } from "react";

const KanbanContext = createContext();

export const KanbanProvider = ({ children }) => {
  const [kanbanData, setKanbanData] = useState({
    records: {},    // For medical record-specific boards
    users: {}       // For personal user boards
  });

  // Load initial data from localStorage
  useEffect(() => {
    const storedData = { records: {}, users: {} };
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('kanbanRecord-')) {
        const recordId = key.replace('kanbanRecord-', '');
        try {
          storedData.records[recordId] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          console.error('Error parsing kanban data for record', recordId, e);
        }
      }
      else if (key.startsWith('kanbanUser-')) {
        const userId = key.replace('kanbanUser-', '');
        try {
          storedData.users[userId] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          console.error('Error parsing kanban data for user', userId, e);
        }
      }
    });
    
    setKanbanData(storedData);
  }, []);

  // Record-specific functions
  const getRecordKanban = (recordId) => {
    return kanbanData.records[recordId] || { columns: [], tasks: [] };
  };

  const setRecordKanban = (recordId, { columns, tasks }) => {
    if (!recordId) {
      console.error('Attempted to set record kanban without recordId');
      return;
    }
  
    const newData = {
      columns: Array.isArray(columns) ? [...columns] : [],
      tasks: Array.isArray(tasks) ? [...tasks] : [],
      updatedAt: Date.now()
    };
  
    // Force update by creating new objects
    setKanbanData(prev => ({
      ...prev,
      records: {
        ...prev.records,
        [recordId]: {
          columns: [...newData.columns],
          tasks: [...newData.tasks]
        }
      }
    }));
  
    // Update localStorage
    try {
      localStorage.setItem(`kanbanRecord-${recordId}`, JSON.stringify(newData));
      console.log('Saved record kanban:', { recordId, newData });
    } catch (error) {
      console.error('LocalStorage error:', error);
    }
  };

  // User-specific functions
  const getUserKanban = (userId) => {
    return kanbanData.users[userId] || { columns: [], tasks: [] };
  };

  const setUserKanban = (userId, { columns, tasks }) => {
    const newData = {
      columns: Array.isArray(columns) ? columns : [],
      tasks: Array.isArray(tasks) ? tasks : []
    };
    
    setKanbanData(prev => ({
      ...prev,
      users: {
        ...prev.users,
        [userId]: newData
      }
    }));
    localStorage.setItem(`kanbanUser-${userId}`, JSON.stringify(newData));
  };

  // Add this to the context provider value
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