import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchDoctors } from "../redux/actions/doctors";

export default function useFetchDoctors() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
  fetch(process.env.apiURL+'all-doctors', {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(response => {
        if (response.error) {
          throw response.error;
        }
        setLoading(false);
        dispatch(fetchDoctors(response));
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        setError(error);
      });
  }, []);
  return { loading, error };
}
