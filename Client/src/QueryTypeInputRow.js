import React from "react";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export default function QueryTypeInputRow({ query, setQuery, queryList }) {
  //Render the query type input row
  return (
    <div className="flex-row">
      <label className="form-label" htmlFor="dropdown">
        Query Type:
      </label>
      <Dropdown
        options={queryList}
        onChange={(event) => setQuery(event.value)}
        value={query}
        id="dropdown"
      />
    </div>
  );
}
