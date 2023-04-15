import React from "react";
import { isAuthorized, getAuthorizationHeader } from "../../services/AuthToken";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { withUserRoute } from "../../components/hoc/withUserRoute";

const Pet = () => {
  const router = useRouter();
  const isClient = typeof window === "object";

  useEffect(() => {
    const fetchLastPetId = async () => {
      const response = await fetch(process.env.apiURL + "pets/latest", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      const responseObject = await response.json();
      if (isAuthorized() && isClient) {
        if (response.status === 200 && responseObject && responseObject !== 0) {
          router.push("/moje-zver/zvire/" + responseObject);
        } else router.push("/moje-zver/vytvorit");
      } else {
        isClient && router.push("/login");
      }
    };

    fetchLastPetId();
  }, []);

  return <></>;
};
export default withUserRoute(Pet);
