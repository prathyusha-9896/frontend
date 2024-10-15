import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Home = () => {
  const [scheduledAvailabilities, setScheduledAvailabilities] = useState([]);
  const [scheduledMeetings, setScheduledMeetings] = useState([]);
  const [scheduledEvents, setScheduledEvents] = useState([]);

  useEffect(() => {
    const savedAvailabilities = localStorage.getItem('scheduledAvailabilities');
    if (savedAvailabilities) {
      setScheduledAvailabilities(JSON.parse(savedAvailabilities));
    }

    const savedMeetings = localStorage.getItem('scheduledMeetings');
    if (savedMeetings) {
      setScheduledMeetings(JSON.parse(savedMeetings));
    }

    const savedEvents = localStorage.getItem('scheduledEvents');
    if (savedEvents) {
      setScheduledEvents(JSON.parse(savedEvents));
    }
  }, []);
  const isEmpty = scheduledAvailabilities.length === 0 && scheduledMeetings.length === 0 && scheduledEvents.length === 0;
  return (
    <div className="flex min-h-screen ">
      {/* Side Navigation */}
      <Navbar/>

      <div className="ml-[15%] w-[85%] p-6">
        {isEmpty ? (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">No schedules or events available</h3>
          </div>
        ) : (
          <>
            {/* Scheduled Availabilities */}
            {scheduledAvailabilities.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Scheduled Availabilities:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scheduledAvailabilities.map((availability, index) => (
                    <li key={index} className="border p-4 rounded shadow-sm">
                      <p><strong>Name:</strong> {availability.name}</p>
                      <p><strong>Duration:</strong> {availability.meetingDuration} minutes</p>
                      <a href={availability.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Open Availability</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Scheduled Meetings */}
            {scheduledMeetings.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Scheduled Meetings:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scheduledMeetings.map((meeting, index) => (
                    <li key={index} className="border p-4 rounded shadow-sm">
                      <p><strong>Host Name:</strong> {meeting.hostName}</p>
                      <p><strong>Date:</strong> {meeting.date}</p>
                      <p><strong>Time:</strong> {meeting.startTime} - {meeting.endTime}</p>
                      <p><strong>Attendee:</strong> {meeting.userName} ({meeting.userEmail})</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Scheduled Events */}
            {scheduledEvents.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Scheduled Events:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scheduledEvents.map((event, index) => (
                    <li key={index} className="border p-4 rounded shadow-sm">
                      <p><strong>Event Name:</strong> {event.eventName}</p>
                      <p><strong>Type:</strong> {event.eventType}</p>
                      <p><strong>Date:</strong> {event.date}</p>
                      <p><strong>Time:</strong> {event.time}</p>
                      <p><strong>Host:</strong> {event.host}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
