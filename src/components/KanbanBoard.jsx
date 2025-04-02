import React, { useState, useEffect, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import ColumnContainer from "./ColumnContainer";
import TaskCard from "./TaskCard";
import { IconPlus } from "@tabler/icons-react";
import { useKanban } from "../context/KanbanContext";

function KanbanBoard({ state, isPersonalBoard = false, userId }) {
  const { 
    getRecordKanban, 
    setRecordKanban,
    getUserKanban,
    setUserKanban 
  } = useKanban();

  const recordId = state?.id;

  // Enhanced state initialization
  const [columns, setColumns] = useState(() => {
    if (isPersonalBoard) {
      return getUserKanban(userId)?.columns || [];
    }
    // Prefer state prop over stored data
    return state?.columns || getRecordKanban(recordId)?.columns || [];
  });
  
  const [tasks, setTasks] = useState(() => {
    if (isPersonalBoard) {
      return getUserKanban(userId)?.tasks || [];
    }
    return state?.tasks || getRecordKanban(recordId)?.tasks || [];
  });

  // Enhanced update function
  const updateBoard = (newColumns, newTasks) => {
    const columnsToUpdate = newColumns || columns;
    const tasksToUpdate = newTasks || tasks;

    if (isPersonalBoard) {
      setUserKanban(userId, {
        columns: columnsToUpdate,
        tasks: tasksToUpdate
      });
    } else {
      // Force update with new references
      setRecordKanban(recordId, {
        columns: [...columnsToUpdate],
        tasks: [...tasksToUpdate]
      });
    }
  };

  // Add this effect to handle recordId changes
  useEffect(() => {
    if (!isPersonalBoard && recordId) {
      const storedData = getRecordKanban(recordId);
      console.log('Stored data from effect:', storedData);
      
      // Only update if storedData has actual content
      if (storedData && (storedData.columns?.length > 0 || storedData.tasks?.length > 0)) {
        setColumns(prev => storedData.columns || prev);
        setTasks(prev => storedData.tasks || prev);
      }
    }
  }, [recordId, isPersonalBoard]);

  // Enhanced task creation with better ID generation
  const createTask = (columnId) => {
    const newTask = {
      id: `task-${Date.now()}`,
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    
    console.log('Creating new task:', newTask);
    
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    updateBoard(columns, newTasks);
  };

  const deleteTask = (id) => {
    console.log('Deleting task:', id);
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    updateBoard(columns, newTasks);
  };

  const updateTask = (id, content) => {
    console.log('Updating task:', id, content);
    const newTasks = tasks.map(task => 
      task.id === id ? {...task, content} : task
    );
    setTasks(newTasks);
    updateBoard(columns, newTasks);
  };

  const createNewColumn = () => {
    const newColumn = {
      id: `column-${Date.now()}`,
      title: `Column ${columns.length + 1}`,
    };
    
    console.log('Creating new column:', newColumn);
    
    const newColumns = [...columns, newColumn];
    setColumns(newColumns);
    updateBoard(newColumns, tasks);
  };

  const deleteColumn = (id) => {
    console.log('Deleting column:', id);
    const newColumns = columns.filter(col => col.id !== id);
    const newTasks = tasks.filter(task => task.columnId !== id);
    setColumns(newColumns);
    setTasks(newTasks);
    updateBoard(newColumns, newTasks);
  };

  const updateColumn = (id, title) => {
    console.log('Updating column:', id, title);
    const newColumns = columns.map(col => 
      col.id === id ? {...col, title} : col
    );
    setColumns(newColumns);
    updateBoard(newColumns, tasks);
  };

  // DND Kit setup
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
  );

  // Debug effect for state changes
  useEffect(() => {
    console.log('Board state updated:', {
      columns,
      tasks,
      isPersonalBoard,
      recordId
    });
  }, [columns, tasks]);

  // Handle drag and drop
  function onDragStart(event) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    } else if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (isActiveAColumn) {
      setColumns((columns) => {
        const activeIndex = columns.findIndex((col) => col.id === active.id);
        const overIndex = columns.findIndex((col) => col.id === over.id);
        const newColumns = arrayMove(columns, activeIndex, overIndex);
        updateBoard(newColumns, tasks);
        return newColumns;
      });
    } else {
      const isActiveATask = active.data.current?.type === "Task";
      const isOverATask = over.data.current?.type === "Task";
      
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        const overIndex = tasks.findIndex((t) => t.id === over.id);
        
        let newTasks = [...tasks];
        
        if (isActiveATask && isOverATask) {
          if (newTasks[activeIndex].columnId !== newTasks[overIndex].columnId) {
            newTasks[activeIndex].columnId = newTasks[overIndex].columnId;
            newTasks = arrayMove(newTasks, activeIndex, overIndex - 1);
          } else {
            newTasks = arrayMove(newTasks, activeIndex, overIndex);
          }
        } else if (isActiveATask) {
          newTasks[activeIndex].columnId = over.id;
          newTasks = arrayMove(newTasks, activeIndex, activeIndex);
        }
        
        updateBoard(columns, newTasks);
        return newTasks;
      });
    }
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        const overIndex = tasks.findIndex((t) => t.id === over.id);
        const newTasks = [...tasks];
        
        if (newTasks[activeIndex].columnId !== newTasks[overIndex].columnId) {
          newTasks[activeIndex].columnId = newTasks[overIndex].columnId;
          updateBoard(columns, arrayMove(newTasks, activeIndex, overIndex - 1));
          return arrayMove(newTasks, activeIndex, overIndex - 1);
        }
        
        updateBoard(columns, arrayMove(newTasks, activeIndex, overIndex));
        return arrayMove(newTasks, activeIndex, overIndex);
      });
    } else if (isActiveATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        const newTasks = [...tasks];
        newTasks[activeIndex].columnId = over.id;
        updateBoard(columns, newTasks);
        return newTasks;
      });
    }
  }

  return (
    <div className="mt-5 min-h-screen w-72 text-white">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => createNewColumn()}
            className="flex h-[60px] w-[350px] min-w-[350px] cursor-pointer gap-2 rounded-lg border-2 border-columnBackgroundColor bg-mainBackgroundColor p-4 ring-green-500 hover:ring-2"
          >
            <IconPlus />
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
}

export default KanbanBoard;