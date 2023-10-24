import React, { useEffect, useState } from "react";
import "./CallRecord.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import useGetToken from "../../utils/useGetToken";
import SideBar from "../SideBar";

const CallRecord = () => {
  const { id } = useParams();
  const [calls, setCalls] = useState([]);
  const token = useGetToken();

  useEffect(() => {
    if (!token) {
      return;
    }

    async function getCalls() {
      const response = await fetch(
        `http://localhost:4200/api/v1/groups/${id}/calls`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          },
        }
      );
      const JSON = await response.json();
      setCalls(JSON.calls);
      console.log(JSON);
      return JSON;
    }

    getCalls();
  }, [token]);

  const handleDownloadTranscript = (call) => {
    const element = document.createElement("a");
    const file = new Blob([call.transcript], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `transcript_call_${call.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="call-history-page">
      <SideBar />
      <h2 className="header">Call History</h2>
      <>
        {calls.map((call) => (
          <li className="call-list-item" key={call.id}>
            <div className="time-container">
              <p className="call-time">{call.startTimestamp}</p>
              <p className="call-time">{call.endTimestamp}</p>
            </div>

            <div className="button-container">
              <button
                type="button"
                className="download-button"
                onClick={() => window.open(call.audioFile)}
              >
                Audio
              </button>
              <button
                type="button"
                className="download-button"
                onClick={() => {
                  handleDownloadTranscript(call);
                }}
              >
                Transcript
              </button>
            </div>
          </li>
        ))}
      </>
    </div>
  );
};

export default CallRecord;
