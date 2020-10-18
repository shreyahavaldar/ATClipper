import React from "react";
import { Link } from "react-router-dom";

export default function Header(props) {
  return (
    <div className="header">
      <div className="header-bar"></div>

      <Link className="header-text" to="/">
        <h1>LOS ANGELES COUNTY DISTRICT ATTORNEY’S OFFICE | </h1>
        <h2>National Attorney Database</h2>
      </Link>
    </div>
  );
}
