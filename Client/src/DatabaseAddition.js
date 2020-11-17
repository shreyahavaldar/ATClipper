import React, { useState } from "react";
import ElapsedTimer from "./ElapsedTimer";
import FileInputRow from "./FileInputRow";
import DateInputRow from "./DateInputRow";
import JurisdictionInputRow from "./JurisdictionInputRow";
import PrimaryFieldRenderer from "./PrimaryFieldRenderer";
import SettingsDownloadRow from "./SettingsDownloadRow";
import SettingsUploadInputRow from "./SettingsUploadInputRow";
import Table from "./Table";
import XLSX from "xlsx";

import dateFormat from "dateformat";
import primary_default from "./default";

import { short_to_long, long_to_short } from "./SettingsConverter";

export default function DatabaseAddition({ jurisdiction_list }) {
  //Define all the state variables for user input
  const [jurisdiction, setJurisdiction] = useState(
    primary_default.jurisdiction
  );
  const [file, setFile] = useState();
  const [date, setDate] = useState(new Date());

  //Button string for uploaded file
  const [buttonString, setButtonString] = useState("Upload a file");

  //Last column and table data states
  const [lastColumn, setLastColumn] = useState(0);
  const [tableData, setTableData] = useState();

  //Stae for valid table input
  const [validInput, setValidInput] = useState(false);

  //Primary field states
  const [barNumber, setBarNumber] = useState(primary_default.barNumber);
  const [firstName, setFirstName] = useState(primary_default.firstName);
  const [lastName, setLastName] = useState(primary_default.lastName);
  const [fullName, setFullName] = useState(primary_default.fullName);
  const [phoneNumber1, setPhoneNumber1] = useState(
    primary_default.phoneNumber1
  );
  const [phoneNumber2, setPhoneNumber2] = useState(
    primary_default.phoneNumber2
  );
  const [email1, setEmail1] = useState(primary_default.email1);
  const [email2, setEmail2] = useState(primary_default.email2);
  const [address1, setAddress1] = useState(primary_default.address1);
  const [address2, setAddress2] = useState(primary_default.address2);
  const [dateOfAdmission, setDateOfAdmission] = useState(
    primary_default.dateOfAdmission
  );
  const [firm, setFirm] = useState(primary_default.firm);
  const [fax, setFax] = useState(primary_default.fax);
  const [license, setLicense] = useState(primary_default.license);
  const [status, setStatus] = useState(primary_default.status);

  //State variables for the current step
  const [inputting, setInputting] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  //New settings mapping to download on user request
  const [newSettings, setNewSettings] = useState();

  //Error states
  const [errorButtonClass, setErrorButtonClass] = useState("");
  const [mappingError, setMappingError] = useState("");

  //Loading state
  const [loadingString, setLoadingString] = useState("Next");

  //Result of query string message
  const [resultString, setResultString] = useState("");

  //Update settings based on user uploaded settings file
  function updateSettings(settings) {
    //Convert short settings format to extended long settings format
    settings = short_to_long(settings);

    //Apply settings to mapping fields
    setJurisdiction(settings.jurisdiction);
    setBarNumber(settings.barNumber);
    setFirstName(settings.firstName);
    setLastName(settings.lastName);
    setFullName(settings.fullName);
    setPhoneNumber1(settings.phoneNumber1);
    setPhoneNumber2(settings.phoneNumber2);
    setEmail1(settings.email1);
    setEmail2(settings.email2);
    setAddress1(settings.address1);
    setAddress2(settings.address2);
    setDateOfAdmission(settings.dateOfAdmission);
    setFirm(settings.firm);
    setFax(settings.fax);
    setLicense(settings.license);
    setStatus(settings.status);
  }

  //Proceed to second set of database addition - loads table to preview the file
  function next() {
    //Ensure that the user has entered a file
    if (file === undefined) {
      setErrorButtonClass("button-error");
      return;
    }
    setErrorButtonClass("");

    setLoadingString("Loading...");

    //Parse the file and move onto the next section
    parseFile(file).then((result) => {
      console.log(result);
      setLoadingString("");
      setLastColumn(result[0].length);
      setTableData(result);
      setValidInput(true);
    });
  }

  //Parse the file and return the results
  function parseFile(file) {
    return new Promise(function (resolve, reject) {
      let name_arr = file.name.split(".");
      let file_type = name_arr[name_arr.length - 1];
      if (file_type === "xlsx" || file_type === "xls" || file_type === "csv") {
        reader(file).then((result) => {
          resolve(result);
        });
      } else {
        reject("bad_file_type");
      }
    });
  }

  //Function to read xlsx or csv file using the XLSX package
  function reader(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);

      reader.onload = ({ target: { result } }) => {
        const wb = XLSX.read(result, {
          type: rABS ? "binary" : "array",
          sheetRows: 4,
        });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
        resolve(data);
      };
    });
  }

  //Function that submits the database addition to the back
  function submit() {
    let valid = true;
    let errStr = "";

    //Check that there is a valid barNumber mapping
    if (barNumber[0].value === -2) {
      valid = false;
      errStr += "Bar Number, ";
    }

    //Check that there is a valid firstName mapping
    if (firstName[0].value === -2) {
      valid = false;
      errStr += "First Name, ";
    }

    //Check that there is a valid lastName mapping
    if (lastName[0].value === -2) {
      valid = false;
      errStr += "Last Name, ";
    }

    //Check that there is a valid fullName mapping
    if (fullName[0].value === -2) {
      valid = false;
      errStr += "Full Name, ";
    }

    //Check that there is a valid phoneNumber1 mapping
    if (phoneNumber1[0].value === -2) {
      valid = false;
      errStr += "Primary Phone Number, ";
    }

    //Check that there is a valid phoneNumber2 mapping
    if (phoneNumber2[0].value === -2) {
      valid = false;
      errStr += "Secondary Phone Number, ";
    }

    //Check that there is a valid email1 mapping
    if (email1[0].value === -2) {
      valid = false;
      errStr += "Primary Email, ";
    }

    //Check that there is a valid email2 mapping
    if (email2[0].value === -2) {
      valid = false;
      errStr += "Secondary Email, ";
    }

    //Check that there is a valid address1 mapping
    if (address1[0].value === -2) {
      valid = false;
      errStr += "Primary Address, ";
    }

    //Check that there is a valid address2 mapping
    if (address2[0].value === -2) {
      valid = false;
      errStr += "Secondary Address, ";
    }

    //Check that there is a valid dateOfAdmission mapping
    if (dateOfAdmission[0].value === -2) {
      valid = false;
      errStr += "Date of Admission, ";
    }

    //Check that there is a valid firm mapping
    if (firm[0].value === -2) {
      valid = false;
      errStr += "Law Firm, ";
    }

    //Check that there is a valid fax mapping
    if (fax[0].value === -2) {
      valid = false;
      errStr += "Fax Number, ";
    }

    //Check that there is a valid license mapping
    if (license[0].value === -2) {
      valid = false;
      errStr += "License Type, ";
    }

    //Check that there is a valid status mapping
    if (status[0].value === -2) {
      valid = false;
      errStr += "Bar Status, ";
    }

    //Check if there is a valid mapping
    if (!valid) {
      errStr =
        "ERROR: " +
        errStr.substring(0, errStr.length - 2) +
        " mapping not provided.";
      setMappingError(errStr);
      return;
    }

    //Create the new settings mapping
    let new_settings = {
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
      jurisdiction: jurisdiction,
    };
    //Convert the settings file to the correct version for download
    new_settings = long_to_short(new_settings);
    setNewSettings(new_settings);

    //Map the column to a value
    let _bar_number = mapColumnToValue(barNumber);
    let _first_name = mapColumnToValue(firstName);
    let _last_name = mapColumnToValue(lastName);
    let _full_name = mapColumnToValue(fullName);
    let _phone_number1 = mapColumnToValue(phoneNumber1);
    let _phone_number2 = mapColumnToValue(phoneNumber2);
    let _email1 = mapColumnToValue(email1);
    let _email2 = mapColumnToValue(email2);
    let _address1 = mapColumnToValue(address1);
    let _address2 = mapColumnToValue(address2);
    let _date_of_admission = mapColumnToValue(dateOfAdmission);
    let _firm = mapColumnToValue(firm);
    let _fax = mapColumnToValue(fax);
    let _license = mapColumnToValue(license);
    let _status = mapColumnToValue(status);

    //Create the mapping object
    let mapping = {
      barNum: _bar_number,
      firstName: _first_name,
      lastName: _last_name,
      name: _full_name,
      phone1: _phone_number1,
      phone2: _phone_number2,
      email1: _email1,
      email2: _email2,
      address1: _address1,
      address2: _address2,
      dateOfAdmission: _date_of_admission,
      firm: _firm,
      fax: _fax,
      license: _license,
      status: _status,
    };

    //create the form data to send to the backend
    let formData = new FormData();
    formData.append("data", file);
    formData.append("settings", JSON.stringify(new_settings));
    formData.append("jurisdiction", jurisdiction);
    formData.append("reportDate", dateFormat(date, "yyyy-mm-dd"));
    formData.append("mapping", JSON.stringify(mapping));

    //Proceed to uploading the file
    setInputting(false);
    setProcessing(true);

    //Upload addition to the backend
    fetch("http://localhost:5000/add", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        //Advance to processed page
        setProcessing(false);
        setProcessed(true);
        if (data.response === "success") {
          setResultString("Query was successful");
        } else {
          setResultString("Query was not successful. Please try again");
        }
      });
  }

  //Map each column mapping to a smaller value
  function mapColumnToValue(objects) {
    let returnValue = [];
    objects.forEach((object) => {
      returnValue.push(object.value);
    });
    return returnValue;
  }

  //Load the inputting page if still inputting info
  if (inputting) {
    return (
      <div className="flex-center">
        <h3>Database Addition</h3>
        <hr className="small-hr" />
        <FileInputRow
          setFile={setFile}
          buttonString={buttonString}
          setButtonString={setButtonString}
          errorButtonClass={errorButtonClass}
          tooltipString={"Choose an excel or csv file to be parsed"}
        />
        <SettingsUploadInputRow updateSettings={updateSettings} />
        <JurisdictionInputRow
          jurisdiction={jurisdiction}
          setJurisdiction={setJurisdiction}
          jurisdiction_list={jurisdiction_list}
        />
        <DateInputRow date={date} setDate={setDate} />

        {!validInput ? (
          <div className="button" onClick={next}>
            <div className="button-link">{loadingString}</div>
          </div>
        ) : (
          <div>
            <hr className="small-hr" />
            {tableData !== undefined ? (
              <>
                <h3 className="text-left">File Preview:</h3>
                <div className="table-container">
                  <Table data={tableData} />
                </div>
              </>
            ) : (
              <div>
                Invalid table data, please reload the page and try again
              </div>
            )}

            <PrimaryFieldRenderer
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
              lastColumn={lastColumn}
            />
            <div className="error-text">{mappingError}</div>
            <div className="button" onClick={submit}>
              <div className="button-link">Process</div>
            </div>
          </div>
        )}
      </div>
    );
  } else if (processing) {
    //Once the user submits load the processing page
    return (
      <div className="flex-center">
        <h3>Database Addition (Processing Data...)</h3>
        <hr className="small-hr" />
        <ElapsedTimer />
        <SettingsDownloadRow
          settings={newSettings}
          date={date.toJSON().slice(0, 10)}
          jurisdiction={jurisdiction}
        />
      </div>
    );
  } else if (processed) {
    //Once the backend responds load the processing page
    return (
      <div className="flex-center">
        <h3>Database Addition</h3>
        <hr className="small-hr" />
        <h4>Processed</h4>
        <div>{resultString}</div>
        <SettingsDownloadRow
          settings={newSettings}
          date={date.toJSON().slice(0, 10)}
          jurisdiction={jurisdiction}
        />
      </div>
    );
  } else {
    return <></>;
  }
}
