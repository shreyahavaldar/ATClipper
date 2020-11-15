import React from "react";

export default function ExportInputRow({ variable, setVariable, name }) {
  return (
    <div className="export-item">
      <div className="flex-center-vert">
        <input
          type="checkbox"
          name="test"
          checked={variable}
          onChange={() => setVariable(!variable)}
        />
      </div>
      <div>{name}</div>
    </div>
  );
}
