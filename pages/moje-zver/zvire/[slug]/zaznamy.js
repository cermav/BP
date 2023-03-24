import React from "react";
import Records from "../../../../components/myPets/pet/Records";
import { withRedux } from "../../../../components/hoc/withRedux";
import { withUserRoute } from "../../../../components/hoc/withUserRoute";

const Pet = () => {
  return <Records />;
};
export default withRedux(withUserRoute(Pet));
