import React, { useState } from "react";
import FileInputRow from "./FileInputRow";
import JurisdictionInputRow from "./JurisdictionInputRow";
import TimeframeInput from "./TimeframeInput";

export default function DatabaseQuery({ jurisdiction_list }) {
  const [file, setFile] = useState();
  const [jurisdiction, setJurisdiction] = useState(jurisdiction_list[0]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  function search() {
    //console.table([file, jurisdiction, startDate, endDate]);

    let obj = {
      data: file,
      jurisdiction: jurisdiction,
      startDate: startDate.toJSON().slice(0, 10),
      endDate: endDate.toJSON().slice(0, 10),
    };

    fetch("http://localhost:5000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }

  return (
    <div className="flex-center">
      <h3>Database Query</h3>
      <hr className="small-hr" />
      <FileInputRow setFile={setFile} />
      <JurisdictionInputRow
        jurisdiction={jurisdiction}
        setJurisdiction={setJurisdiction}
        jurisdiction_list={jurisdiction_list}
      />
      <TimeframeInput
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <div className="button">
        <div className="button-link" onClick={search}>
          Search
        </div>
      </div>
    </div>
  );
}
