import { useState, useEffect } from "react";

import { setToken } from "../services/AuthToken";

export default function useLoginUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginData, setLoginData] = useState(null);

  useEffect(() => {
    let didCancel = false;

    const doFetch = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${process.env.apiURL}auth/login`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });

        if (response.status === 200) {
          const token = await response.json();
          setToken(token.access_token);
          didCancel = true;
        } else if (response.status === 401) {
          setError("Zadali jste nesprávné heslo. ");
        } else if (response.status === 403) {
          setError("Váš účet není aktivaný, odkaz pro aktivaci najdete v mailu. ");
        } else if (response.status === 404) {
          setError("Nebyl nalezen uživatel se zadaným e-mailem. ");
        } else {
          setError(response.statusText);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(error);
      }
    };

    if (loginData && !didCancel) {
      doFetch();
    }

    return () => {
      didCancel = true;
    };
  }, [loginData, error]);

  return [
    {
      loading,
      error,
    },
    setLoginData,
  ];
}
