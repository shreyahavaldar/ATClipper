import React from "react";
import { Link } from "react-router-dom";

export default function LinkButton(props) {
  return (
    //Button object to link to another page
    <div className="button">
      <Link className="button-link" to={props.link}>
        {props.text}
      </Link>
    </div>
  );
}
