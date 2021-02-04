import React, { Fragment } from "react";
import logo from "../../assets/images/logo.svg";

function MagicRectangleLoader({ show = true, loaderType }) {
  if (!show) return null;

  return (
    <Fragment>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Magic rectangles are loading . . ,
        </p>
    </Fragment>
  );
}

export default MagicRectangleLoader;
