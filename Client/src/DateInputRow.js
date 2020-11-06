import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateInputRow({ date, setDate }) {
  return (
    <div className="flex-row">
      <label className="form-label" htmlFor="dropdown">
        Report Generation Date:
      </label>
      <div>
        <DatePicker selected={date} onChange={(newDate) => setDate(newDate)} />
      </div>
    </div>
  );
}
