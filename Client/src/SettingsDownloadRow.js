import React from "react";

export default function SettingsDownloadRow({ settings, date, jurisdiction }) {
  //Download the js file
  function download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  //onDownload function to call the download file function with the correct parameters
  function onDownload() {
    let name = `settings_${jurisdiction}_${date}.json`;
    download(JSON.stringify(settings), name, "text/plain");
  }

  return (
    <div className="flex-row">
      <label className="form-label">Download Settings:</label>
      <button className="input-button" onClick={onDownload}>
        Download
      </button>
    </div>
  );
}
