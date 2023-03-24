import React from "react";
import PetUpdate from "../../../../components/myPets/pet/PetUpdate";
import { withRedux } from "../../../../components/hoc/withRedux";
import { withUserRoute } from "../../../../components/hoc/withUserRoute";

const Pet = () => {
  return <PetUpdate />;
};
export default withRedux(withUserRoute(Pet));
