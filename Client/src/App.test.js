import React from "react";
import {shallow, configure} from "enzyme";
import {expect} from "chai";
import Adapter from 'enzyme-adapter-react-16';
import DatabaseAddition from "./DatabaseAddition";
import DatabaseQuery from "./DatabaseQuery";
import FileInputRow from "./FileInputRow";
import SettingsUploadInputRow from "./SettingsUploadInputRow";
import JurisdictionInputRow from "./JurisdictionInputRow";
import DateInputRow from "./DateInputRow";
import QueryTypeInputRow from "./QueryTypeInputRow";
import ExportFieldRenderer from "./ExportFieldRenderer";
import TimeframeInput from "./TimeframeInput";
import { render, waitFor, fireEvent } from "@testing-library/react";

configure({ adapter: new Adapter() });

const jurisdiction_list = [
    "AL",
    "AK",
    "AS",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "DC",
    "FM",
    "FL",
    "GA",
    "GU",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MH",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "MP",
    "OH",
    "OK",
    "OR",
    "PW",
    "PA",
    "PR",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VI",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
];

describe('Database Addition Tests', () => {
    it('renders file input row', () => {
        const firTest = shallow(<DatabaseAddition jurisdiction_list={jurisdiction_list}/>);
        expect(firTest.find(FileInputRow)).to.have.lengthOf(1);
    });

    it('renders settings upload input row', () => {
        const suirTest = shallow(<DatabaseAddition jurisdiction_list={jurisdiction_list}/>);
        expect(suirTest.find(SettingsUploadInputRow)).to.have.lengthOf(1);
    });

    it('renders jurisdiction input row', () => {
        const jirTest = shallow(<DatabaseAddition jurisdiction_list={jurisdiction_list}/>);
        expect(jirTest.find(JurisdictionInputRow)).to.have.lengthOf(1);
    });

    it('renders date input row', () => {
        const dirTest = shallow(<DatabaseAddition jurisdiction_list={jurisdiction_list}/>);
        expect(dirTest.find(DateInputRow)).to.have.lengthOf(1);
    });
});

describe('Database Query Tests', () => {
    it('renders file input row', () => {
        const firTest = shallow(<DatabaseQuery jurisdiction_list={jurisdiction_list}/>);
        expect(firTest.find(FileInputRow)).to.have.lengthOf(1);
    });

    it('renders timeframe input ', () => {
        const tiTest = shallow(<DatabaseQuery jurisdiction_list={jurisdiction_list}/>);
        expect(tiTest.find(TimeframeInput)).to.have.lengthOf(1);
    });

    it('renders query type input row', () => {
        const qtirTest = shallow(<DatabaseQuery jurisdiction_list={jurisdiction_list}/>);
        expect(qtirTest.find(QueryTypeInputRow)).to.have.lengthOf(1);
    });

    it('renders jurisdiction input row', () => {
        const jirTest = shallow(<DatabaseQuery jurisdiction_list={jurisdiction_list}/>);
        expect(jirTest.find(JurisdictionInputRow)).to.have.lengthOf(1);
    });

    it('renders export field renderer', () => {
        const efrTest = shallow(<DatabaseQuery jurisdiction_list={jurisdiction_list}/>);
        expect(efrTest.find(ExportFieldRenderer)).to.have.lengthOf(1);
    });
});