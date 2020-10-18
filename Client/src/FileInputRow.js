import React from "react";
import info from "./images/info.png";
import ReactTooltip from "react-tooltip";

export default function FileInputRow({ setFile }) {
  return (
    <div className="flex-row">
      <div className="flex-row-left">
        <label className="form-label" htmlFor="file">
          Input
        </label>
        <img
          alt="i"
          src={info}
          className="infoIcon"
          data-tip
          data-for="inputTip"
        ></img>
        <ReactTooltip id="inputTip" place="right" effect="solid">
          Choose an excel or csv file to be parsed
        </ReactTooltip>
      </div>
      <input
        id="file"
        type="file"
        onChange={(event) => setFile(event.target.files[0])}
      />
    </div>
  );
}
