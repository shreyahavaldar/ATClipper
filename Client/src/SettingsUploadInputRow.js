import React, { useState } from "react";
import info from "./images/info.png";
import ReactTooltip from "react-tooltip";

export default function SettingsUploadInputRow({ updateSettings }) {
  const hiddenInput = React.useRef(null);
  const [buttonString, setButtonString] = useState("Upload a file (optional)");

  //On settings file upload, parse the settings file and update the settubgs
  function onChange(event) {
    let settings = event.target.files[0];
    setButtonString(settings.name);

    let fr = new FileReader();
    fr.readAsText(settings, "UTF-8");
    console.log(settings);
    fr.onload = (e) => {
      let json = JSON.parse(e.target.result);
      console.log(json);
      updateSettings(json);
    };
  }

  //Return the settings upload component
  return (
    <div className="flex-row">
      <div className="flex-row-left">
        <label className="form-label" htmlFor="file">
          <div>
            Settings <i>(optional)</i>
          </div>
        </label>
        <img
          alt="i"
          src={info}
          className="infoIcon"
          data-tip
          data-for="settingsTip"
        ></img>
        <ReactTooltip id="settingsTip" place="right" effect="solid">
          Upload a file to pre-load the column mappings
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
