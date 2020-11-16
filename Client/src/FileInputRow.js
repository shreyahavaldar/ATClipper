import React from "react";
import info from "./images/info.png";
import ReactTooltip from "react-tooltip";

export default function FileInputRow({
  buttonString,
  setFile,
  setButtonString,
  errorButtonClass,
  tooltipString,
}) {
  const hiddenInput = React.useRef(null);

  //Function to update the file and its button string
  function onChange(event) {
    setFile(event.target.files[0]);
    console.log(event.target.files[0]);
    setButtonString(event.target.files[0].name);
  }

  //Set the input button class
  let classType = `input-button ${errorButtonClass}`;

  //Return the input row for the file input
  return (
    <div className="flex-row" id="file-input-row">
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
          {tooltipString}
        </ReactTooltip>
      </div>
      <button
        className={classType}
        onClick={(event) => hiddenInput.current.click()}
      >
        {buttonString}
      </button>
      <input
        id="file"
        type="file"
        ref={hiddenInput}
        style={{ display: "none" }}
        onChange={onChange}
      />
    </div>
  );
}
