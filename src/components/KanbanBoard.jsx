import React, { useMemo, useState, useEffect } from "react";
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

function KanbanBoard({ state }) {
  // Use the context to access columns, tasks, and resetKanbanBoard
  const { getKanbanData, setKanbanDataForRecord } = useKanban();
  const recordId = state?.state?.id;

  // Get initial data from context (persisted data)
  const persistedData = getKanbanData(recordId);
  
  // Get default data from props (newly generated plan)
  const defaultCols = state?.state?.columns || [];
  const defaultTasks = state?.state?.tasks || [];

  // Initialize state - use persisted data if available, otherwise use default data
  const [columns, setColumns] = useState(
    persistedData?.columns?.length ? persistedData.columns : defaultCols
  );
  const [tasks, setTasks] = useState(
    persistedData?.tasks?.length ? persistedData.tasks : defaultTasks
  );

  // Default columns and tasks from props (initial state)
 /* const defaultCols =
    state?.state?.columns?.map((col) => ({
      id: col?.id,
      title: col?.title,
    })) || [];

  const defaultTasks =
    state?.state?.tasks?.map((task) => ({
      id: task?.id,
      columnId: task?.columnId,
      content: task?.content,
    })) || [];
    
   

  // Load initial state from localStorage or use default state
  useEffect(() => {
    const savedColumns = localStorage.getItem("kanbanColumns");
    const savedTasks = localStorage.getItem("kanbanTasks");
    setColumns(savedColumns ? JSON.parse(savedColumns) : defaultCols);
    setTasks(savedTasks ? JSON.parse(savedTasks) : defaultTasks);
  }, [setColumns, setTasks]);

  // Save columns and tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("kanbanColumns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }, [tasks]); */

  // Save data whenever columns or tasks change
  useEffect(() => {
    if (recordId) {
      setKanbanDataForRecord(recordId, { columns, tasks });
    }
  }, [columns, tasks, recordId, setKanbanDataForRecord]);

  // If we get new data from props (like when switching records), update our state
  useEffect(() => {
    if (state?.state?.columns && state?.state?.tasks && !persistedData) {
      setColumns(state.state.columns);
      setTasks(state.state.tasks);
    }
  }, [state, persistedData]);

  // Rest of your component remains the same...
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
  );

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

  // Function to create a new task
  function createTask(columnId) {
    const newTask = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  }

  // Function to delete a task
  function deleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  // Function to update a task
  function updateTask(id, content) {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, content } : task,
    );
    setTasks(newTasks);
  }

  // Function to create a new column
  function createNewColumn() {
    const newColumn = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, newColumn]);
  }

  // Function to delete a column
  function deleteColumn(id) {
    setColumns(columns.filter((col) => col.id !== id));
    setTasks(tasks.filter((task) => task.columnId !== id));
  }

  // Function to update a column title
  function updateColumn(id, title) {
    setColumns(columns.map((col) => (col.id === id ? { ...col, title } : col)));
  }

  // Drag and drop handlers
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
        return arrayMove(columns, activeIndex, overIndex);
      });
    } else {
      const isActiveATask = active.data.current?.type === "Task";
      const isOverATask = over.data.current?.type === "Task";
      if (isActiveATask && isOverATask) {
        setTasks((tasks) => {
          const activeIndex = tasks.findIndex((t) => t.id === active.id);
          const overIndex = tasks.findIndex((t) => t.id === over.id);
          if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
            tasks[activeIndex].columnId = tasks[overIndex].columnId;
            return arrayMove(tasks, activeIndex, overIndex - 1);
          }
          return arrayMove(tasks, activeIndex, overIndex);
        });
      } else if (isActiveATask) {
        setTasks((tasks) => {
          const activeIndex = tasks.findIndex((t) => t.id === active.id);
          tasks[activeIndex].columnId = over.id;
          return arrayMove(tasks, activeIndex, activeIndex);
        });
      }
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
        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    } else if (isActiveATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        tasks[activeIndex].columnId = over.id;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

// Function to generate a random ID
function generateId() {
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;