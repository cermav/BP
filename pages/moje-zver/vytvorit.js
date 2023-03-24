import React from "react";
import PetCreate from "../../components/myPets/pet/PetCreate";
import { withRedux } from "../../components/hoc/withRedux";
import { withUserRoute } from "../../components/hoc/withUserRoute";

const Pet = () => {
  return <PetCreate />;
};
export default withRedux(withUserRoute(Pet));
