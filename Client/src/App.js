import React from "react";
import "./App.css";

import Header from "./Header";
import LinkButton from "./LinkButton";

import DatabaseQuery from "./DatabaseQuery";
import DatabaseAddition from "./DatabaseAddition";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
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

  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact={true}>
          <div className="flex-center">
            <LinkButton link="/query" text="Query Database" />
            <LinkButton link="/add" text="Add to Database" />
          </div>
        </Route>
        <Route path="/query" exact={true}>
          <DatabaseQuery jurisdiction_list={jurisdiction_list} />
        </Route>
        <Route path="/add" exact={true}>
          <DatabaseAddition jurisdiction_list={jurisdiction_list} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
