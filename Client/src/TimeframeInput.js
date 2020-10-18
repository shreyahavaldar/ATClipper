import React from "react";

import DatePicker from "react-date-picker";

export default function TimeframeInput({ startDate, setStartDate, endDate, setEndDate }) {
  return (
    <div className="flex-row">
      <label className="form-label" htmlFor="dropdown">
        Timeframe:
      </label>
      <div className="flex-row-right">
        <DatePicker onChange={setStartDate} value={startDate} />
        <div>to</div>
        <DatePicker onChange={setEndDate} value={endDate} />
      </div>
    </div>
  );
}
