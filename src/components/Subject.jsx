import React from "react";
import { usePensum } from "../context/PensumContext";
import { SUBJECT_STATES, STATE_STYLES } from "../constants/subjectStates";

export function Subject({ subjectData }) {
  const { getSubjectState, setSubjectState } = usePensum();

  const currentState = getSubjectState(subjectData["codigo"]);
  const styles = STATE_STYLES[currentState];

  const handleClick = () => {
    const stateOrder = ["available", "in_progress", "passed"];
    const currentIndex = stateOrder.indexOf(currentState);
    const nextState = stateOrder[(currentIndex + 1) % stateOrder.length];
    setSubjectState(subjectData["codigo"], nextState);
  };

  return (
    <div
      className={`rounded-lg w-64 p-3 border-2 cursor-pointer inline-block 
        ${styles.bg} ${styles.border} ${styles.text}
      `}
      onClick={handleClick}
    >
      <span className="text-sm text-gray-500">{subjectData["UC"]} UC</span>
      <span className="h-[3em] my-2 flex items-center justify-center font-semibold">
        {subjectData["nombre"]
          .replace("LABORATORIO DE ", "LAB. ")
          .replace("PROBLEMÁTICA ", "PROB. ")}
      </span>
      <span className="text-sm text-gray-500">({subjectData["codigo"]})</span>
    </div>
  );
}
