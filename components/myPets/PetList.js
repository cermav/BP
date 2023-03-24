import Link from "next/link";
import React, { useEffect, useState } from "react";
import PetListIcon from "./pet/PetListIcon";
import { getAuthorizationHeader } from "../../services/AuthToken";
import { useRouter } from "next/router";

export const LIGHT_THEME = "light";
export const DARK_THEME = "dark";
const PetList = () => {
  const router = useRouter();
  const [pet, setPet] = useState(null);
  const [change, setChange] = useState(false);
  useEffect(() => {
    const fetchStates = async () => {
      const response = await fetch(process.env.apiURL + "pets/list", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      if (response.status === 401) return router.replace("../../../login");
      const responeObject = await response.json();

      setPet(responeObject);
    };
    fetchStates();
  }, []);
  return (
    <>
      {pet &&
        pet.map((item) => (
          <li key={item.id} style={{ listStyle: "none", margin: 10 }} onClick={() => setChange(true)}>
            <Link href={"/moje-zver/zvire/" + item.id}>
              <a>
                <PetListIcon
                  name={item.pet_name}
                  color={"#fd8985"}
                  imageUrl={
                    item.avatar ? process.env.storageUrl + "/pet_avatar/" + item.avatar : "/images/favicon-original.png"
                  }
                />
              </a>
            </Link>
          </li>
        ))}
    </>
  );
};
export default PetList;
