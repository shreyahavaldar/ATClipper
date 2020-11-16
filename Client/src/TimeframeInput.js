import React from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TimeframeInput({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  return (
    <div className="flex-row">
      <label className="form-label-time" htmlFor="dropdown">
        Timeframe:
      </label>
      <div className="flex-row-right-time">
        <DatePicker
          selected={startDate}
          onChange={(newDate) => setStartDate(newDate)}
          className="full-width"
        />

        <div className="to-field">to</div>
        <DatePicker
          selected={endDate}
          onChange={(newDate) => setEndDate(newDate)}
          className="full-width"
        />
      </div>
    </div>
  );
}
