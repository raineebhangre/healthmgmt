// ScreeningSchedule.jsx
import React from "react";
import { useStateContext } from "../context";
import { useKanban } from "../context/KanbanContext";
import KanbanBoard from "../components/KanbanBoard";
import { useParams, useLocation } from "react-router-dom";

const ScreeningSchedule = ({ isPersonalBoard }) => {
  const { currentUser } = useStateContext();
  const { recordId } = useParams();
  const location = useLocation();
  const { getRecordKanban } = useKanban();

  // Get data from location state or kanban context
  const boardData = location.state || getRecordKanban(recordId) || {};

  return (
    <KanbanBoard 
      isPersonalBoard={isPersonalBoard}
      userId={currentUser?.id}
      state={{
        id: recordId,
        columns: boardData.columns,
        tasks: boardData.tasks
      }}
    />
  );
};

export default ScreeningSchedule;