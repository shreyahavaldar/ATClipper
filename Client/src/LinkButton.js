import React from "react";
import { Link } from "react-router-dom";

export default function LinkButton(props) {
  return (
    <div className="button">
      <Link className="button-link" to={props.link}>
        {props.text}
      </Link>
    </div>
  );
}
