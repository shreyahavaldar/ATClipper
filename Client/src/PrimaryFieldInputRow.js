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
  function onSelect(list, item) {
    if (
      column === undefined ||
      column[0] === undefined ||
      column[0].value === -2
    ) {
      list = [item];
    }
    setColumn(list);
  }

  function onRemove(list, item) {
    console.log(list);
    console.log(item);
    setColumn(list);
  }

  return (
    <div className="flex-row-pf">
      <label className="form-label" htmlFor={fieldId}>
        {fieldName}:
      </label>
      <div className="multiselect">
        <Multiselect
          options={options}
          onSelect={(list, item) => onSelect(list, item)}
          onRemove={(list, item) => onRemove(list, item)}
          selectedValues={column}
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
