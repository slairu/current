import { React, useEffect, useState } from "react";
import CalHeader from "./CalHeader";
import Hour from "./Hour";
import "./styles/Calendar.css";
import {
  addDays,
  eachHourOfInterval,
  endOfWeek,
  format,
  startOfWeek,
  isBefore,
  isToday,
} from "date-fns";
import NewEvent from "./Event/NewEvent";
import UpdateEvent from "./Event/UpdateEvent";
import useUser from "../../utils/useUser";
import useGetToken from "../../utils/useGetToken";
import SideBar from "../SideBar";
import UserWrapper from "../userWrapper.js";

async function createEvent(name, start, end, color, userId, token) {
  await fetch(`http://localhost:4200/api/v1/users/${userId}/calendar/events/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: name,
      startTimestamp: start,
      endTimestamp: end,
      color: color,
    }),
  });
}

async function updateEvent(name, color, userId, eventId, token) {
  try {
    await fetch(
      `http://localhost:4200/api/v1/users/${userId}/calendar/events/${eventId}/name`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
        }),
      }
    );
    await fetch(
      `http://localhost:4200/api/v1/users/${userId}/calendar/events/${eventId}/color`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          color: color,
        }),
      }
    );
  } catch (error) {
    console.error("Error updating event:", error);
  }
}

async function deleteEvent(userId, eventId, token) {
  await fetch(
    `http://localhost:4200/api/v1/users/${userId}/calendar/events/${eventId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

function Calendar(props) {
  const days = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const labels = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const [hour, setHour] = useState(null);
  const [week, setWeek] = useState(startOfWeek(new Date()));

  const [events, setEvents] = useState([]);
  const user = useUser();
  const token = useGetToken();
  const prevWeek = () => {
    setWeek(addDays(week, -7));
  };
  const nextWeek = () => {
    setWeek(addDays(week, 7));
  };
  const toToday = () => {
    setWeek(startOfWeek(new Date()));
  };

  const hours = eachHourOfInterval({ start: week, end: endOfWeek(week) });

  useEffect(() => {
    if (!user) {
      return;
    }
    const userId = user._id;
    async function fetchDates() {
      fetch(`http://localhost:4200/api/v1/users/${userId}/calendar/events/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data.events);
          setEvents(data.events);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }
    fetchDates();
  }, [user]);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const isDateFree = (startDate) =>
    events.find(
      (e) =>
        !isBefore(startDate, new Date(e.startTimestamp)) &&
        isBefore(startDate, new Date(e.endTimestamp))
    );

  return (
    <UserWrapper user={user}>
      <div className="CalendarWrapper">
        <SideBar />
        <div className="CalendarContainer">
          <CalHeader
            dateRange={
              format(week, "MMMM dd yyyy") +
              " - " +
              format(endOfWeek(week), "MMMM dd yyyy")
            }
            prevWeek={prevWeek}
            nextWeek={nextWeek}
            toToday={toToday}
          />

          <div className="WeekView">
            <div className="Days">
              {days.map((d, index) => (
                <div
                  className={d === "" ? "LeftCol" : "Day"}
                  id={
                    d !== "" && isToday(addDays(week, index - 1))
                      ? "today"
                      : null
                  }
                  key={index}
                >
                  {d !== "" && (
                    <>
                      <div className="DayNum">
                        {format(addDays(week, index - 1), "dd")}
                      </div>
                      <p>{d}</p>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="Cells">
              {labels.map((h) => (
                <div className="LeftCol Time">{h + " AM"}</div>
              ))}
              {labels.map((h) => (
                <div className="LeftCol Time">{h + " PM"}</div>
              ))}
              {hours.map((h) => (
                <Hour
                  event={isDateFree(h)}
                  hour={new Date(h)}
                  onClick={() => setHour(h)}
                />
              ))}
            </div>
          </div>

          {hour != null && isDateFree(hour) === undefined && (
            <NewEvent
              start={hour}
              onSave={(name, start, end, color) => {
                createEvent(name, start, end, color, user._id, token).then(
                  (response) => {
                    setEvents([
                      ...events,
                      {
                        name: name,
                        startTimestamp: start,
                        endTimestamp: end,
                        color: color,
                      },
                    ]);
                    setHour(null);
                  }
                );
              }}
              onCancel={() => {
                setHour(null);
              }}
            ></NewEvent>
          )}
          {hour != null && isDateFree(hour) !== undefined && (
            <UpdateEvent
              event={isDateFree(hour)}
              onSave={(name, color, eventId) => {
                updateEvent(name, color, user._id, eventId, token).then(
                  (response) => {
                    var temp = isDateFree(hour);
                    setEvents(
                      [
                        events.filter((e) => e !== temp),
                        {
                          name: name,
                          startTimestamp: temp.startTimestamp,
                          endTimestamp: temp.endTimestamp,
                          color: color,
                        },
                      ].flat()
                    );
                    setHour(null);
                  }
                );
              }}
              onDelete={(eventId) => {
                deleteEvent(user._id, eventId, token).then((response) => {
                  var temp = isDateFree(hour);
                  setEvents(events.filter((e) => e !== temp));
                  setHour(null);
                });
              }}
              onCancel={() => {
                setHour(null);
              }}
            ></UpdateEvent>
          )}
        </div>
      </div>
    </UserWrapper>
  );
}

export default Calendar;
