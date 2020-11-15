function short_to_long(settings) {
  settings.barNumber = settings.barNumber.map(json_to_js_map);
  settings.firstName = settings.firstName.map(json_to_js_map);
  settings.lastName = settings.lastName.map(json_to_js_map);
  settings.fullName = settings.fullName.map(json_to_js_map);
  settings.phoneNumber1 = settings.phoneNumber1.map(json_to_js_map);
  settings.phoneNumber2 = settings.phoneNumber2.map(json_to_js_map);
  settings.email1 = settings.email1.map(json_to_js_map);
  settings.email2 = settings.email2.map(json_to_js_map);
  settings.address1 = settings.address1.map(json_to_js_map);
  settings.address2 = settings.address2.map(json_to_js_map);
  settings.dateOfAdmission = settings.dateOfAdmission.map(json_to_js_map);
  settings.firm = settings.firm.map(json_to_js_map);
  settings.fax = settings.fax.map(json_to_js_map);
  settings.license = settings.license.map(json_to_js_map);
  settings.status = settings.status.map(json_to_js_map);
  return settings;
}

function json_to_js_map(n) {
  let label = "Column " + n;
  if (n === -1) {
    label = "N/A";
  }
  let rv = {
    label: label,
    value: n,
  };
  return rv;
}

function long_to_short(settings) {
  settings.barNumber = settings.barNumber.map(js_to_json_map);
  settings.firstName = settings.firstName.map(js_to_json_map);
  settings.lastName = settings.lastName.map(js_to_json_map);
  settings.fullName = settings.fullName.map(js_to_json_map);
  settings.phoneNumber1 = settings.phoneNumber1.map(js_to_json_map);
  settings.phoneNumber2 = settings.phoneNumber2.map(js_to_json_map);
  settings.email1 = settings.email1.map(js_to_json_map);
  settings.email2 = settings.email2.map(js_to_json_map);
  settings.address1 = settings.address1.map(js_to_json_map);
  settings.address2 = settings.address2.map(js_to_json_map);
  settings.dateOfAdmission = settings.dateOfAdmission.map(js_to_json_map);
  settings.firm = settings.firm.map(js_to_json_map);
  settings.fax = settings.fax.map(js_to_json_map);
  settings.license = settings.license.map(js_to_json_map);
  settings.status = settings.status.map(js_to_json_map);
  return settings;
}

function js_to_json_map(obj) {
  return obj.value;
}

export { short_to_long, long_to_short };
