import React from "react";
import Appointments from "../../../../components/myPets/pet/Appointments";
import { withRedux } from "../../../../components/hoc/withRedux";
import { withUserRoute } from "../../../../components/hoc/withUserRoute";

const Pet = () => {
  return <Appointments />;
};
export default withRedux(withUserRoute(Pet));
