import React, { useState } from "react";
import FileInputRow from "./FileInputRow";
import DateInputRow from "./DateInputRow";
import JurisdictionInputRow from "./JurisdictionInputRow";
import PrimaryFieldRenderer from "./PrimaryFieldRenderer";
import SettingsDownloadRow from "./SettingsDownloadRow";
import SettingsUploadInputRow from "./SettingsUploadInputRow";
import Table from "./Table";
import XLSX from "xlsx";

import ElapsedTimer from "./ElapsedTimer";

import primary_default from "./default";

export default function DatabaseAddition({ jurisdiction_list }) {
  const [jurisdiction, setJurisdiction] = useState(
    primary_default.jurisdiction
  );
  const [buttonString, setButtonString] = useState("Upload a file");
  const [file, setFile] = useState();
  const [date, setDate] = useState(new Date());

  const [lastColumn, setLastColumn] = useState(0);
  const [tableData, setTableData] = useState();
  const [validInput, setValidInput] = useState(false);

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

  const [inputting, setInputting] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const [newSettings, setNewSettings] = useState();

  function updateSettings(settings) {
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

  function next() {
    if (file === undefined) {
      console.log("Missing file");
      return;
    }

    parseFile(file).then((result) => {
      console.log(result);
      setLastColumn(result[0].length);
      setTableData(result);
      setValidInput(true);
    });
  }

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

  function submit() {
    let valid = true;
    // if (barNumber[0].value === -2) {
    //   valid = false;
    // }
    //
    // if (firstName[0].value === -2) {
    //   valid = false;
    // }
    //
    // if (lastName[0].value === -2) {
    //   valid = false;
    // }
    //
    // if (fullName[0].value === -2) {
    //   valid = false;
    // }
    //
    // if (phoneNumber1[0].value === -2) {
    //   valid = false;
    // }
    //
    // if (phoneNumber2[0].value === -2) {
    //   valid = false;
    // }
    //
    // if (email1[0].value === -2) {
    //   valid = false;
    // }
    //
    // if (email2[0].value === -2) {
    //   valid = false;
    // }
    //
    // if (address1[0].value === -2) {
    //   valid = false;
    // }
    //
    // if (address2[0].value === -2) {
    //   valid = false;
    // }
    //
    // if (dateOfAdmission[0].value === -2) {
    //   valid = false;
    // }
    //
    // if (firm[0].value === -2) {
    //   valid = false;
    // }
    //
    // if (fax[0].value === -2) {
    //   valid = false;
    // }
    //
    // if (license[0].value === -2) {
    //   valid = false;
    // }
    //
    // if (status[0].value === -2) {
    //   valid = false;
    // }
    //
    if (!valid) {
      console.log("Missing primary field mapping");
      return;
    }

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
    setNewSettings(new_settings);

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

    let mapping = {
      barNum: _bar_number,
      firstName: _first_name,
      lastName: _last_name,
      fullName: _full_name,
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

    let formData = new FormData();
    formData.append("data", file);
    formData.append("settings", new_settings);
    formData.append("fileName", file.name);
    formData.append("jurisdiction", jurisdiction);
    formData.append("reportDate", date.toJSON().slice(0, 10));
    formData.append("mapping", JSON.stringify(mapping));

    setInputting(false);
    setProcessing(true);

    fetch("http://localhost:5000/add", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setProcessing(false);
        setProcessed(true);

        console.log(data);
      });
  }

  function mapColumnToValue(objects) {
    let returnValue = [];
    objects.forEach((object) => {
      returnValue.push(object.value);
    });
    return returnValue;
  }

  if (inputting) {
    return (
      <div className="flex-center">
        <h3>Database Addition</h3>
        <hr className="small-hr" />
        <FileInputRow
          setFile={setFile}
          buttonString={buttonString}
          setButtonString={setButtonString}
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
            <div className="button-link">Next</div>
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
              <div>BAD TABLE DATA</div>
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
            <div className="button" onClick={submit}>
              <div className="button-link">Process</div>
            </div>
          </div>
        )}
      </div>
    );
  } else if (processing) {
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
    return (
      <div className="flex-center">
        <h3>Database Addition</h3>
        <hr className="small-hr" />
        <h4>Processed</h4>
      </div>
    );
  } else {
    return <></>;
  }
}
