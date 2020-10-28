import React from "react";
import info from "./images/info.png";
import ReactTooltip from "react-tooltip";

export default function FileInputRow({
  buttonString,
  setFile,
  setButtonString,
}) {
  const hiddenInput = React.useRef(null);

  function onChange(event) {
    setFile(event.target.files[0]);
    console.log(event.target.files[0]);
    setButtonString(event.target.files[0].name);
  }

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
      <button
        className="input-button"
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
