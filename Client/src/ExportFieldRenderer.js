import React from "react";
import ExportInputRow from "./ExportInputRow";

export default function ExportFieldRenderer({
  barNumber,
  setBarNumber,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  fullName,
  setFullName,
  phoneNumber1,
  setPhoneNumber1,
  phoneNumber2,
  setPhoneNumber2,
  email1,
  setEmail1,
  email2,
  setEmail2,
  address1,
  setAddress1,
  address2,
  setAddress2,
  dateOfAdmission,
  setDateOfAdmission,
  firm,
  setFirm,
  fax,
  setFax,
  license,
  setLicense,
  status,
  setStatus,
  secondaryInfo,
  setSecondaryInfo,
}) {
  return (
    //Render all of the export settings rows
    <div className="flex-row">
      <div className="form-label-export">Exported Fields:</div>
      <div className="flex-row-export">
        <ExportInputRow
          variable={barNumber}
          setVariable={setBarNumber}
          name={"Bar Number"}
        />
        <ExportInputRow
          variable={firstName}
          setVariable={setFirstName}
          name={"First Name"}
        />
        <ExportInputRow
          variable={lastName}
          setVariable={setLastName}
          name={"Last Name"}
        />
        <ExportInputRow
          variable={fullName}
          setVariable={setFullName}
          name={"Full Name"}
        />
        <ExportInputRow
          variable={phoneNumber1}
          setVariable={setPhoneNumber2}
          name={"Primary Phone Number"}
        />
        <ExportInputRow
          variable={phoneNumber2}
          setVariable={setPhoneNumber2}
          name={"Secondary Phone Number"}
        />
        <ExportInputRow
          variable={email1}
          setVariable={setEmail1}
          name={"Primary Email"}
        />
        <ExportInputRow
          variable={email2}
          setVariable={setEmail2}
          name={"Secondary Email"}
        />
        <ExportInputRow
          variable={address1}
          setVariable={setAddress1}
          name={"Primary Address"}
        />
        <ExportInputRow
          variable={address2}
          setVariable={setAddress2}
          name={"Secondary Address"}
        />
        <ExportInputRow
          variable={dateOfAdmission}
          setVariable={setDateOfAdmission}
          name={"Date of Admission"}
        />
        <ExportInputRow
          variable={firm}
          setVariable={setFirm}
          name={"Law Firm"}
        />
        <ExportInputRow
          variable={fax}
          setVariable={setFax}
          name={"Fax Number"}
        />
        <ExportInputRow
          variable={license}
          setVariable={setLicense}
          name={"License Type"}
        />
        <ExportInputRow
          variable={status}
          setVariable={setStatus}
          name={"Bar Status"}
        />
        <ExportInputRow
          variable={secondaryInfo}
          setVariable={setSecondaryInfo}
          name={"Secondary Info"}
        />
      </div>
    </div>
  );
}
