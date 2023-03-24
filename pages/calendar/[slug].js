import React from "react";
import UserCalendar from "../../components/calendar/UserCalendar";
import DoctorCalendar from "../../components/calendar/DoctorCalendar";
import { getUserRole, userRoles } from "../../services/AuthToken";

import Layout from "../../layouts/Loggedin";

import { withRedux } from "../../components/hoc/withRedux";

const CalendarPage = () => {
  const userRole = 3; // getUserRole();

  const buttonText = {
    today: "dnes",
    month: "měsíc",
    week: "týden",
    day: "den",
    list: "seznam",
  };

  return (
    <Layout bodyClass="calendar" registrationPromo={false}>
      {userRole === userRoles.MEMBER ? "MEMBER" : "DOKTOR"}

      {userRole === userRoles.MEMBER ? (
        <UserCalendar buttonText={buttonText} />
      ) : (
        <DoctorCalendar buttonText={buttonText} />
      )}
    </Layout>
  );
};

export default withRedux(CalendarPage);
