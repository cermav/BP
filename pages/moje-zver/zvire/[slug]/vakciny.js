import React from "react";
import Vaccines from "../../../../components/myPets/pet/Vaccines";
import { withRedux } from "../../../../components/hoc/withRedux";
import { withUserRoute } from "../../../../components/hoc/withUserRoute";

const Pet = () => {
  return <Vaccines />;
};
export default withRedux(withUserRoute(Pet));
