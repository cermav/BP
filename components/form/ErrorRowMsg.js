import React from "react";
import { string } from "prop-types";

const ErrorRowMsg = ({ msg, className }) => {
    return typeof msg === "string" ? <p className={`errorMsg ${className || ""}`}>{msg}</p> : <></>;
};
export default ErrorRowMsg;
