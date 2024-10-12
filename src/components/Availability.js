import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Availability = () => {
  const [meetingDetails, setMeetingDetails] = useState({
    name: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    timezone: 'UTC',
    meetingApp: 'Zoom',  // New field for the meeting app
  });

  const [scheduledMeetings, setScheduledMeetings] = useState([]); // State to store multiple scheduled meetings

  // Request notification permission when component mounts
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, date, startTime, endTime, timezone, meetingApp } = meetingDetails;
    const meetingStartDateTime = `${date.toISOString().split('T')[0]} ${startTime} ${timezone}`;
    const meetingEndDateTime = `${date.toISOString().split('T')[0]} ${endTime} ${timezone}`;

    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }

    if (!startTime || !endTime) {
      alert('Please enter both start time and end time.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/meetings', {
        meetingStartDateTime, 
        meetingEndDateTime, 
        name, 
        meetingApp  // Include meeting app in the request
      });
      alert(`Meeting scheduled from ${meetingStartDateTime} to ${meetingEndDateTime} for ${name} via ${meetingApp}`);

      // Add the new meeting to the list of scheduled meetings
      setScheduledMeetings([
        ...scheduledMeetings,
        { name, date: date.toISOString().split('T')[0], startTime, endTime, timezone, meetingApp }
      ]);

      // Trigger notification after successfully scheduling a meeting
      if (Notification.permission === 'granted') {
        new Notification('Meeting Scheduled', {
          body: `Your meeting is scheduled from ${meetingStartDateTime} to ${meetingEndDateTime} with ${name} via ${meetingApp}`,
        });
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      alert('Error scheduling meeting. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={meetingDetails.name}
            onChange={(e) => setMeetingDetails({ ...meetingDetails, name: e.target.value })}
            placeholder="Enter your name"
          />
        </label>

        <label>
          Select Date:
          <DatePicker
            selected={meetingDetails.date}
            onChange={(date) => setMeetingDetails({ ...meetingDetails, date })}
            dateFormat="yyyy-MM-dd"
          />
        </label>

        <label>
          Start Time:
          <input
            type="time"
            value={meetingDetails.startTime}
            onChange={(e) => setMeetingDetails({ ...meetingDetails, startTime: e.target.value })}
          />
        </label>

        <label>
          End Time:
          <input
            type="time"
            value={meetingDetails.endTime}
            onChange={(e) => setMeetingDetails({ ...meetingDetails, endTime: e.target.value })}
          />
        </label>

        <label>
          Timezone:
          <select
            value={meetingDetails.timezone}
            onChange={(e) => setMeetingDetails({ ...meetingDetails, timezone: e.target.value })}
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time (US & Canada)</option>
            <option value="America/Chicago">Central Time (US & Canada)</option>
            <option value="America/Denver">Mountain Time (US & Canada)</option>
            <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
          </select>
        </label>

        <label>
          Meeting App:
          <select
            value={meetingDetails.meetingApp}
            onChange={(e) => setMeetingDetails({ ...meetingDetails, meetingApp: e.target.value })}
          >
            <option value="Zoom">Zoom</option>
            <option value="Google Meet">Google Meet</option>
            <option value="Phone Call">Phone Call</option>
            <option value="Microsoft Teams">Microsoft Teams</option>
            <option value="Skype">Skype</option>
          </select>
        </label>

        <button type="submit">Schedule Meeting</button>
      </form>

      {/* Display all scheduled meetings */}
      {scheduledMeetings.length > 0 && (
        <div>
          <h3>Scheduled Meetings:</h3>
          {scheduledMeetings.map((meeting, index) => (
            <div key={index}>
              <p>Name: {meeting.name}</p>
              <p>Date: {meeting.date}</p>a
              <p>Time: {meeting.startTime} - {meeting.endTime} {meeting.timezone}</p>
              <p>Meeting App: {meeting.meetingApp}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Availability;
