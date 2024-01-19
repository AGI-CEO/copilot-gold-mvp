"use client";
import React, { useState, useEffect } from "react";

const Countdown = () => {
  // Initialize state variables for days, hours, minutes, and seconds
  const [days, setDays] = useState(6);
  const [hours, setHours] = useState(23);
  const [minutes, setMinutes] = useState(59);
  const [seconds, setSeconds] = useState(59);

  // Update the countdown every second
  useEffect(() => {
    const timerId = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else {
          setMinutes((prevMinutes) => {
            if (prevMinutes > 0) {
              return prevMinutes - 1;
            } else {
              setHours((prevHours) => {
                if (prevHours > 0) {
                  return prevHours - 1;
                } else {
                  setDays((prevDays) => (prevDays > 0 ? prevDays - 1 : 0));
                  return 23;
                }
              });
              return 59;
            }
          });
          return 59;
        }
      });
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timerId);
  }, []);

  return (
    <>
      <div className="flex gap-5">
        <div>
          <span className="countdown font-mono text-4xl">
            <span style={{ "--value": days }}></span>
          </span>
          days
        </div>
        <div>
          <span className="countdown font-mono text-4xl">
            <span style={{ "--value": hours }}></span>
          </span>
          hours
        </div>
        <div>
          <span className="countdown font-mono text-4xl">
            <span style={{ "--value": minutes }}></span>
          </span>
          min
        </div>
        <div>
          <span className="countdown font-mono text-4xl">
            <span style={{ "--value": seconds }}></span>
          </span>
          sec
        </div>
      </div>
    </>
  );
};

export default Countdown;
