import React, { useState } from "react";
import FileInputRow from "./FileInputRow";
import JurisdictionInputRow from "./JurisdictionInputRow";
import QueryTypeInputRow from "./QueryTypeInputRow";
import TimeframeInput from "./TimeframeInput";
import ElapsedTimer from "./ElapsedTimer";
import ExportFieldRenderer from "./ExportFieldRenderer";

export default function DatabaseQuery({ jurisdiction_list }) {
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

  const [file, setFile] = useState();
  const [buttonString, setButtonString] = useState("Upload a file");
  const [jurisdiction, setJurisdiction] = useState(jurisdiction_list[0]);
  const [query, setQuery] = useState(query_list[0].value);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [inputting, setInputting] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const [barNumber, setBarNumber] = useState(true);
  const [firstName, setFirstName] = useState(true);
  const [lastName, setLastName] = useState(true);
  const [fullName, setFullName] = useState(true);
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

  function search() {
    let export_settings = {
      barNumber: barNumber,
      firstName: firstName,
      lastName: lastName,
      fullName: fullName,
      phoneNumber1: phoneNumber1,
      phoneNumber2: phoneNumber2,
      email1: email1,
      email2: email2,
      address1: address1,
      address2: address2,
      dateOfAdmission: dateOfAdmission,
      firm: firm,
      fax: fax,
      license: license,
      status: status,
      secondaryInfo: secondaryInfo,
    };

    let obj = {
      data: file,
      query: query,
      jurisdiction: jurisdiction,
      startDate: startDate.toJSON().slice(0, 10),
      endDate: endDate.toJSON().slice(0, 10),
      exportSettings: export_settings,
    };
    console.log(obj);

    setInputting(false);
    setProcessing(true);

    fetch("http://localhost:5000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProcessing(false);
        setProcessed(true);
      });
  }

  if (inputting) {
    return (
      <div className="flex-center">
        <h3>Database Query</h3>
        <hr className="small-hr" />
        <FileInputRow
          setFile={setFile}
          buttonString={buttonString}
          setButtonString={setButtonString}
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
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          fullName={fullName}
          setFullName={setFullName}
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
    return (
      <div className="flex-center">
        <h3>Database Query (Processing Data...)</h3>
        <hr className="small-hr" />
        <ElapsedTimer />
      </div>
    );
  } else if (processed) {
    return (
      <div className="flex-center">
        <h3>Database Query</h3>
        <hr className="small-hr" />
        <h4>Processed</h4>
      </div>
    );
  } else {
    return <></>;
  }
}
