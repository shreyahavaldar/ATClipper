import React, { useState } from "react";
import FileInputRow from "./FileInputRow";
import JurisdictionInputRow from "./JurisdictionInputRow";
import QueryTypeInputRow from "./QueryTypeInputRow";
import TimeframeInput from "./TimeframeInput";
import ElapsedTimer from "./ElapsedTimer";
import ExportFieldRenderer from "./ExportFieldRenderer";

import dateFormat from "dateformat";

export default function DatabaseQuery({ jurisdiction_list }) {
  //Default query list options
  let query_list = [
    {
      value: "phone",
      label: "Phone Number",
    },
    {
      value: "email",
      label: "Email Address",
    },
  ];

  //State to store the user uploaded variables
  const [file, setFile] = useState();
  const [jurisdiction, setJurisdiction] = useState(jurisdiction_list[0]);
  const [query, setQuery] = useState(query_list[0].value);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  //State to store the file name to use as the button string
  const [buttonString, setButtonString] = useState("Upload a file");

  //State variables for the current step
  const [inputting, setInputting] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  //State to store the value of each primary field (true if we want to export that field)
  const [barNumber, setBarNumber] = useState(true);
  const [phoneNumber1, setPhoneNumber1] = useState(true);
  const [phoneNumber2, setPhoneNumber2] = useState(true);
  const [email1, setEmail1] = useState(true);
  const [email2, setEmail2] = useState(true);
  const [address1, setAddress1] = useState(true);
  const [address2, setAddress2] = useState(true);
  const [dateOfAdmission, setDateOfAdmission] = useState(true);
  const [firm, setFirm] = useState(true);
  const [fax, setFax] = useState(true);
  const [license, setLicense] = useState(true);
  const [status, setStatus] = useState(true);
  const [secondaryInfo, setSecondaryInfo] = useState(true);

  //State to store the error button class
  const [errorButtonClass, setErrorButtonClass] = useState("");

  //Result of query string message
  const [resultString, setResultString] = useState("");

  //Download the js file
  function download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  //Once the user clicks search process their request
  function search() {
    //If the file is not defined, add a button error class
    if (file === undefined) {
      setErrorButtonClass("button-error");
      return;
    }
    setErrorButtonClass("");

    //Generate the export settings json object
    let export_settings = {
      bar_number: barNumber,
      name: true,
      phone1: phoneNumber1,
      phone2: phoneNumber2,
      email1: email1,
      email2: email2,
      address1: address1,
      address2: address2,
      doa: dateOfAdmission,
      firm: firm,
      fax: fax,
      license: license,
      status: status,
      secondary_info: secondaryInfo,
      state: true,
      time_inserted: true,
      time_superseded: true,
    };

    //Create the form data object
    let formData = new FormData();
    formData.append("data", file);
    formData.append("exportSettings", JSON.stringify(export_settings));
    formData.append("jurisdiction", jurisdiction);
    formData.append("query", query);
    formData.append("startDate", dateFormat(startDate, "yyyy-mm-dd"));
    formData.append("endDate", dateFormat(endDate, "yyyy-mm-dd"));

    //Step to the next page
    setInputting(false);
    setProcessing(true);

    //Call the query API route on the backend and pass the formdata
    fetch("http://localhost:5000/query", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setProcessing(false);
        setProcessed(true);
        //Wait for the response and step to the final page
        if (data.response === "success") {
          setResultString("Query was successful");
          download(JSON.stringify(data.result), "result.json", "text/plain");
        } else {
          setResultString("Query was not successful. Please try again");
        }
      });
  }

  //Load the inputting page if on that step
  if (inputting) {
    return (
      <div className="flex-center">
        <h3>Database Query</h3>
        <hr className="small-hr" />
        <FileInputRow
          setFile={setFile}
          buttonString={buttonString}
          setButtonString={setButtonString}
          errorButtonClass={errorButtonClass}
          tooltipString={
            "Upload a CSV file containing phone numbers or emails to query by"
          }
        />
        <JurisdictionInputRow
          jurisdiction={jurisdiction}
          setJurisdiction={setJurisdiction}
          jurisdiction_list={jurisdiction_list}
        />
        <TimeframeInput
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <QueryTypeInputRow
          query={query}
          setQuery={setQuery}
          queryList={query_list}
        />
        <ExportFieldRenderer
          barNumber={barNumber}
          setBarNumber={setBarNumber}
          phoneNumber1={phoneNumber1}
          setPhoneNumber1={setPhoneNumber1}
          phoneNumber2={phoneNumber2}
          setPhoneNumber2={setPhoneNumber2}
          email1={email1}
          setEmail1={setEmail1}
          email2={email2}
          setEmail2={setEmail2}
          address1={address1}
          setAddress1={setAddress1}
          address2={address2}
          setAddress2={setAddress2}
          dateOfAdmission={dateOfAdmission}
          setDateOfAdmission={setDateOfAdmission}
          firm={firm}
          setFirm={setFirm}
          fax={fax}
          setFax={setFax}
          license={license}
          setLicense={setLicense}
          status={status}
          setStatus={setStatus}
          secondaryInfo={secondaryInfo}
          setSecondaryInfo={setSecondaryInfo}
        />
        <div className="button">
          <div className="button-link" onClick={search}>
            Search
          </div>
        </div>
      </div>
    );
  } else if (processing) {
    //Load the processing page if on that step
    return (
      <div className="flex-center">
        <h3>Database Query (Processing Data...)</h3>
        <hr className="small-hr" />
        <ElapsedTimer />
      </div>
    );
  } else if (processed) {
    //Load the final page if on that step
    return (
      <div className="flex-center">
        <h3>Database Query</h3>
        <hr className="small-hr" />
        <h4>Processed</h4>
        <div>{resultString}</div>
      </div>
    );
  } else {
    return <></>;
  }
}
