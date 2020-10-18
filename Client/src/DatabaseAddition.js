import React, { useState } from "react";
import FileInputRow from "./FileInputRow";
import DateInputRow from "./DateInputRow";
import JurisdictionInputRow from "./JurisdictionInputRow";
import PrimaryFieldRenderer from "./PrimaryFieldRenderer";
import Table from "./Table";

import XLSX from "xlsx";

export default function DatabaseAddition({ jurisdiction_list }) {
  const [jurisdiction, setJurisdiction] = useState(jurisdiction_list[0]);
  const [file, setFile] = useState();
  const [date, setDate] = useState(new Date());

  const [lastColumn, setLastColumn] = useState(0);
  const [tableData, setTableData] = useState();
  const [validInput, setValidInput] = useState(false);

  let primary_default = { value: 2, label: "Select..." };
  const [barNumber, setBarNumber] = useState(primary_default);
  const [firstName, setFirstName] = useState(primary_default);
  const [lastName, setLastName] = useState(primary_default);
  const [fullName, setFullName] = useState(primary_default);
  const [phoneNumber1, setPhoneNumber1] = useState(primary_default);
  const [phoneNumber2, setPhoneNumber2] = useState(primary_default);
  const [email1, setEmail1] = useState(primary_default);
  const [email2, setEmail2] = useState(primary_default);
  const [address1, setAddress1] = useState(primary_default);
  const [address2, setAddress2] = useState(primary_default);
  const [dateOfAdmission, setDateOfAdmission] = useState(primary_default);
  const [firm, setFirm] = useState(primary_default);
  const [fax, setFax] = useState(primary_default);
  const [license, setLicense] = useState(primary_default);
  const [status, setStatus] = useState(primary_default);

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
    let _bar_number = barNumber.value;
    let _first_name = firstName.value;
    let _last_name = lastName.value;
    let _full_name = fullName.value;
    let _phone_number1 = phoneNumber1.value;
    let _phone_number2 = phoneNumber2.value;
    let _email1 = email1.value;
    let _email2 = email2.value;
    let _address1 = address1.value;
    let _address2 = address2.value;
    let _date_of_admission = dateOfAdmission.value;
    let _firm = firm.value;
    let _fax = fax.value;
    let _license = license.value;
    let _status = status.value;

    let valid = true;

    if (_bar_number === -2) {
      valid = false;
    }

    if (_first_name === -2) {
      valid = false;
    }

    if (_last_name === -2) {
      valid = false;
    }

    if (_full_name === -2) {
      valid = false;
    }

    if (_phone_number1 === -2) {
      valid = false;
    }

    if (_phone_number2 === -2) {
      valid = false;
    }

    if (_email1 === -2) {
      valid = false;
    }

    if (_email2 === -2) {
      valid = false;
    }

    if (_address1 === -2) {
      valid = false;
    }

    if (_address2 === -2) {
      valid = false;
    }

    if (_date_of_admission === -2) {
      valid = false;
    }

    if (_firm === -2) {
      valid = false;
    }

    if (_fax === -2) {
      valid = false;
    }

    if (_license === -2) {
      valid = false;
    }

    if (_status === -2) {
      valid = false;
    }

    if (!valid) {
      console.log("Missing primary field mapping");
      return;
    }

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
    formData.append("fileName", file.name);
    formData.append("jurisdiction", jurisdiction);
    formData.append("reportDate", date.toJSON().slice(0, 10));
    formData.append("mapping", JSON.stringify(mapping));

    fetch("http://localhost:5000/add", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }

  return (
    <div className="flex-center">
      <h3>Database Addition</h3>
      <hr className="small-hr" />

      <FileInputRow setFile={setFile} />
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
            <Table data={tableData} />
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
}
