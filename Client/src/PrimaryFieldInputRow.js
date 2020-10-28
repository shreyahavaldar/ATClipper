// import React, { useState } from "react";
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
  // const [cols, setCols] = useState(0);

  function onSelect(list) {
    setColumn(list);
    // setCols(cols + 1);
  }

  function onRemove(list) {
    setColumn(list);
    // setCols(cols - 1);
  }

  return (
    <div className="flex-row-pf">
      <label className="form-label" htmlFor={fieldId}>
        {fieldName}:
      </label>
      <div className="multiselect">
        <Multiselect
          options={options}
          onSelect={(list, item) => onSelect(list)}
          onRemove={(list, item) => onRemove(list)}
          value={column.label}
          id={fieldId}
          displayValue="label"
          className="multiselect"
          placeholder="Select columns"
          hidePlaceholder={true}
        />
      </div>
    </div>
  );
}
