import React from "react";
import { useStateContext } from "../context";
import { useKanban } from "../context/KanbanContext";
import KanbanBoard from "../components/KanbanBoard";
import { useParams, useLocation } from "react-router-dom";

const ScreeningSchedule = ({ isPersonalBoard }) => {
    const { currentUser } = useStateContext();
    const { recordId } = useParams();
    const location = useLocation();
  
    console.log('ScreeningSchedule props:', {
      isPersonalBoard,
      recordId,
      locationState: location.state
    });
  
    return (
      <KanbanBoard 
        isPersonalBoard={isPersonalBoard}
        userId={currentUser?.id}
        state={{
          id: recordId,
          ...location.state,
          columns: location.state?.columns || [
            { id: "todo", title: "Todo" },
            { id: "doing", title: "Work in Progress" },
            { id: "done", title: "Done" }
          ],
          tasks: location.state?.tasks || []
        }}
      />
    );
};

export default ScreeningSchedule;