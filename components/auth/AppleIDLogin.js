import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";

import { setToken } from "../../services/AuthToken";

const login = () => {
  return (
    <button type="button" id="apple">
      PŘIHLÁSIT POMOCÍ APPLE ID
    </button>
  );
};
export default login;
