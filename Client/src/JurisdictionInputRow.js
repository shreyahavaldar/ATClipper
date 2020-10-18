import React from "react";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export default function JurisdictionInputRow({
  jurisdiction,
  setJurisdiction,
  jurisdiction_list,
}) {
  return (
    <div className="flex-row">
      <label className="form-label" htmlFor="dropdown">
        Report Jurisdiction:
      </label>
      <Dropdown
        options={jurisdiction_list}
        onChange={(event) => setJurisdiction(event.value)}
        value={jurisdiction}
        id="dropdown"
      />
    </div>
  );
}
