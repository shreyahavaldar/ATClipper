import React from "react";

import { Multiselect } from "multiselect-react-dropdown";
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
      <Multiselect
        options={options}
        onSelect={(list, item) => setColumn(list)}
        onRemove={(list, item) => setColumn(list)}
        value={column.label}
        id={fieldId}
        displayValue="label"
      />
    </div>
  );
}
