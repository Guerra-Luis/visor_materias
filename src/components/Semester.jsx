import React from "react";
import { Subject } from "./Subject";

export function Semester({ semesterData }) {
  const semesterText = semesterData[0];
  const subjects = semesterData[1]["materias"];
  return (
    <div>
      <h3 className="my-8">{semesterText.replace("_", " ").toUpperCase()}</h3>
      <div className="flex flex-wrap gap-4 justify-center">
        {subjects.map((subject, index) => (
          <Subject subjectData={subject} key={index} />
        ))}
      </div>
    </div>
  );
}
