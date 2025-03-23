// KanbanContext.jsx
import React, { createContext, useContext, useState } from "react";

const KanbanContext = createContext();

export const KanbanProvider = ({ children }) => {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Function to reset the Kanban board
  const resetKanbanBoard = () => {
    localStorage.removeItem("kanbanColumns");
    localStorage.removeItem("kanbanTasks");
    setColumns([]);
    setTasks([]);
  };

  return (
    <KanbanContext.Provider value={{ columns, tasks, setColumns, setTasks, resetKanbanBoard }}>
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => useContext(KanbanContext);