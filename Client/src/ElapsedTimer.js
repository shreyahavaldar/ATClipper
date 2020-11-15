import React from "react";
import Timer from "react-compound-timer";

export default function ElapsedTimer() {
  return (
    <div className="flex-row">
      <label className="form-label">Time Elapsed:</label>
      <Timer>
        <Timer.Hours formatValue={(value) => `${value} hour(s), `} />
        <Timer.Minutes formatValue={(value) => `${value} minute(s), `} />
        <Timer.Seconds formatValue={(value) => `and ${value} second(s) `} />
      </Timer>
    </div>
  );
}
