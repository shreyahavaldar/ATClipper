import React from "react";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export default function PrimaryFieldInputRow({
  fieldName,
  fieldId,
  column,
  setColumn,
  options,
}) {
  return (
    <div className="flex-row">
      <label className="form-label" htmlFor={fieldId}>
        {fieldName}:
      </label>
      <Dropdown
        options={options}
        onChange={(event) => setColumn(event)}
        value={column.label}
        id={fieldId}
      />
    </div>
  );
}
