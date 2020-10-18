import React from "react";

import DatePicker from "react-date-picker";

export default function DateInputRow({ date, setDate }) {
  return (
    <div className="flex-row">
      <label className="form-label" htmlFor="dropdown">
        Report Generation Date:
      </label>
      <DatePicker onChange={setDate} value={date} />
    </div>
  );
}
