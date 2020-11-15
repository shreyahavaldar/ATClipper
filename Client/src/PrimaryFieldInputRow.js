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
  //When the user selects a new column for primary field, set the update the list of items
  function onSelect(list, item) {
    //Check to see if there are any previous values and overwrit ethe whole list if not
    if (
      column === undefined ||
      column[0] === undefined ||
      column[0].value === -2
    ) {
      list = [item];
    }
    //Updat the list
    setColumn(list);
  }

  //Remove the item and update the list
  function onRemove(list, item) {
    setColumn(list);
  }

  //Return the primary field input row
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
