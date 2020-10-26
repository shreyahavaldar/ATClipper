import React from "react";
import PrimaryFieldInputRow from "./PrimaryFieldInputRow";

export default function PrimaryFieldRenderer({
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
  lastColumn,
}) {
  let options = [{ value: -1, label: "N/A" }];
  for (let i = 0; i < lastColumn; i++) {
    let obj = {
      label: "Column " + i,
      value: i,
    };
    options.push(obj);
  }

  return (
    <div className="primary-field-container">
      <PrimaryFieldInputRow
        fieldName={"Bar Number"}
        fieldId={1}
        column={barNumber}
        setColumn={setBarNumber}
        options={options}
      />
      <PrimaryFieldInputRow
        fieldName={"First Name"}
        fieldId={2}
        column={firstName}
        setColumn={setFirstName}
        options={options}
      />
      <PrimaryFieldInputRow
        fieldName={"Last Name"}
        fieldId={3}
        column={lastName}
        setColumn={setLastName}
        options={options}
      />
      <PrimaryFieldInputRow
        fieldName={"Full Name"}
        fieldId={4}
        column={fullName}
        setColumn={setFullName}
        options={options}
      />
      <PrimaryFieldInputRow
        fieldName={"Primary Phone Number"}
        fieldId={5}
        column={phoneNumber1}
        setColumn={setPhoneNumber1}
        options={options}
      />
      <PrimaryFieldInputRow
        fieldName={"Secondary Phone Number"}
        fieldId={6}
        column={phoneNumber2}
        setColumn={setPhoneNumber2}
        options={options}
      />
      <PrimaryFieldInputRow
        fieldName={"Primary Email"}
        fieldId={7}
        column={email1}
        setColumn={setEmail1}
        options={options}
      />
      <PrimaryFieldInputRow
        fieldName={"Secondary Email"}
        fieldId={8}
        column={email2}
        setColumn={setEmail2}
        options={options}
      />
      <PrimaryFieldInputRow
        fieldName={"Primary Address"}
        fieldId={9}
        column={address1}
        setColumn={setAddress1}
        options={options}
      />
      <PrimaryFieldInputRow
        fieldName={"Secondary Address"}
        fieldId={10}
        column={address2}
        setColumn={setAddress2}
        options={options}
      />
      <PrimaryFieldInputRow
        fieldName={"Date of Admission"}
        fieldId={11}
        column={dateOfAdmission}
        setColumn={setDateOfAdmission}
        options={options}
      />
      <PrimaryFieldInputRow
        fieldName={"Law Firm"}
        fieldId={12}
        column={firm}
        setColumn={setFirm}
        options={options}
      />
      <PrimaryFieldInputRow
        fieldName={"Fax Number"}
        fieldId={13}
        column={fax}
        setColumn={setFax}
        options={options}
      />
      <PrimaryFieldInputRow
        fieldName={"License Type"}
        fieldId={14}
        column={license}
        setColumn={setLicense}
        options={options}
      />
      <PrimaryFieldInputRow
        fieldName={"Bar Status"}
        fieldId={15}
        column={status}
        setColumn={setStatus}
        options={options}
      />
    </div>
  );
}
