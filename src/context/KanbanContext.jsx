// KanbanContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const KanbanContext = createContext();

export const KanbanProvider = ({ children }) => {
  const [kanbanData, setKanbanData] = useState({});

  // Function to get Kanban data for a specific record
  const getKanbanData = (recordId) => {
    return kanbanData[recordId] || { columns: [], tasks: [] };
  };

  // Function to set Kanban data for a specific record
  const setKanbanDataForRecord = (recordId, { columns, tasks }) => {
    setKanbanData(prev => ({
      ...prev,
      [recordId]: { columns, tasks }
    }));
    localStorage.setItem(`kanbanData-${recordId}`, JSON.stringify({ columns, tasks }));
  };

  // Function to reset the Kanban board for a specific record
  const resetKanbanBoard = (recordId) => {
    setKanbanData(prev => {
      const newData = { ...prev };
      delete newData[recordId];
      return newData;
    });
    localStorage.removeItem(`kanbanData-${recordId}`);
  };

  // Load initial data from localStorage
  useEffect(() => {
    const storedData = {};
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('kanbanData-')) {
        const recordId = key.replace('kanbanData-', '');
        try {
          storedData[recordId] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          console.error('Error parsing kanban data for', recordId, e);
        }
      }
    });
    setKanbanData(storedData);
  }, []);

  return (
    <KanbanContext.Provider value={{ 
      getKanbanData, 
      setKanbanDataForRecord, 
      resetKanbanBoard 
    }}>
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => useContext(KanbanContext);