import React, { useState, useEffect } from "react";
import { getAuthorizationHeader } from "../../services/AuthToken";
import { useRouter } from "next/router";

import FullCalendar from "@fullcalendar/react";
import daygrid from "@fullcalendar/daygrid";
import timegrid from "@fullcalendar/timegrid";
import interaction from "@fullcalendar/interaction";
import list from "@fullcalendar/list";

import ToggleModalContent from "../modal/ToggleModalContent";
import UpdateEventOwnerModal from "../modal/calendar/UpdateEventOwnerModal";
import CreateEventOwnerModal from "../modal/calendar/CreateEventOwnerModal";
import ConfirmOrUpdateModal from "../modal/calendar/ConfirmOrUpdateModal";

const UserCalendar = (props) => {
  const initialView = "dayGridMonth";
  /**
   * hooks
   */
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [refresh, setRefresh] = useState(Date.now());
  const [clickedDate, setClickedDate] = useState();
  const [clickedEvent, setClickedEvent] = useState(null);
  const [viewType, setViewType] = useState(initialView);

  /**
   * API calls
   */
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`${process.env.apiURL}${router.query.slug}/event/getForMember`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });

      const responseObject = await result.json();
      if (result.status === 401) return router.replace("../../../login");

      setEventColors(responseObject);

      console.log(responseObject);
      setAppointments(responseObject);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  /**
   * functions
   */
  const setEventColors = (eventsObject) => {
    Object.keys(eventsObject).forEach((e) => {
      const event = eventsObject[e];
      if (!event.accepted) {
        event.backgroundColor = "#aaa";
      }
    });
  };
  const handleDateClick = (args, show) => {
    setClickedDate(args);
    show();
  };

  const handleEventClick = (event, show) => {
    setClickedEvent(event.id);
    show();
  };

  const handleClose = (date) => {
    setClickedEvent(null);

    setRefresh(date);
  };

  const handleHide = (hide) => {
    setClickedEvent(null);
    hide();
  };

  const getModalElement = (hide) => {
    const event = clickedEvent && appointments.find((a) => a.id === parseInt(clickedEvent, 10));
    console.log(event);
    return clickedEvent ? (
      event.accepted ? (
        <UpdateEventOwnerModal
          hide={() => handleHide(hide)}
          close={handleClose}
          dateObj={clickedDate}
          viewType={viewType}
          event={event}
        />
      ) : (
        <ConfirmOrUpdateModal event={event} hide={() => handleHide(hide)} close={handleClose} />
      )
    ) : (
      <CreateEventOwnerModal
        hide={() => handleHide(hide)}
        close={handleClose}
        dateObj={clickedDate}
        viewType={viewType}
      />
    );
  };

  return (
    <ToggleModalContent
      toggle={(show) => (
        <div className="calendar-wrapper">
          <FullCalendar
            headerToolbar={{ center: "dayGridMonth,timeGridWeek,timeGridDay" }}
            plugins={[daygrid, timegrid, interaction, list]}
            initialView={initialView}
            dateClick={(args) => handleDateClick(args, show)}
            eventClick={(event) => handleEventClick(event.event, show)}
            viewClassNames={(e) => setViewType(e.view.type)}
            events={appointments}
            buttonText={props.buttonText}
            firstDay="1"
            locale="cs"
          />
        </div>
      )}
      content={(hide) => getModalElement(hide)}
    />
  );
};

export default UserCalendar;
