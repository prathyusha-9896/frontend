import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Navbar from './Navbar';
import Header from './Header';

const ScheduleMeeting = () => {
  const [meetingDetails, setMeetingDetails] = useState({
    userName: '',
    userEmail: '',
    hostName: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    meetingApp: 'Zoom',
  });

  // Retrieve the access token from wherever it's stored after user login
  const accessToken = localStorage.getItem('accessToken'); // Example of how you might store it

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { userName, userEmail, hostName, date, startTime, endTime, meetingApp } = meetingDetails;
    const meetingDate = date.toISOString().split('T')[0];
    const startDateTime = `${meetingDate}T${startTime}:00`;
    const endDateTime = `${meetingDate}T${endTime}:00`;

    if (!userName.trim() || !userEmail.trim() || !hostName.trim() || !startTime || !endTime) {
      alert('Please fill all required fields.');
      return;
    }

    if (!accessToken) {
      alert('No access token found. Please log in to sync with Google Calendar.');
      return;
    }

    try {
      // Send request to backend to create the event in Google Calendar
      await axios.post('http://localhost:5000/api/sync-calendar', {
        access_token: accessToken,
        meetingDateTime: startDateTime,
        endDateTime: endDateTime,
        summary: `Meeting with ${hostName}`,
        description: `Scheduled meeting with ${hostName} via ${meetingApp}`,
      });

      alert(`Meeting scheduled and added to Google Calendar`);

      // Reset form after successful submission
      setMeetingDetails({
        userName: '',
        userEmail: '',
        hostName: '',
        date: new Date(),
        startTime: '',
        endTime: '',
        meetingApp: 'Zoom',
      });
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      alert('Error scheduling meeting.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Navbar /> {/* Sidebar remains fixed */}
      <div className="flex-grow flex justify-center items-center p-6">
        <div className="container max-w-lg bg-white rounded-lg p-6">
            <Header/>
          <h2 className="text-2xl font-semibold mb-4 text-center">Schedule a Meeting</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="block text-sm font-bold mb-1" htmlFor="userName">
                Your Name:
              </label>
              <input
                type="text"
                className="form-control w-full"
                id="userName"
                value={meetingDetails.userName}
                onChange={(e) => setMeetingDetails({ ...meetingDetails, userName: e.target.value })}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-bold mb-1" htmlFor="userEmail">
                Your Email:
              </label>
              <input
                type="email"
                className="form-control w-full"
                id="userEmail"
                value={meetingDetails.userEmail}
                onChange={(e) => setMeetingDetails({ ...meetingDetails, userEmail: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-bold mb-1" htmlFor="hostName">
                Host Name:
              </label>
              <input
                type="text"
                className="form-control w-full"
                id="hostName"
                value={meetingDetails.hostName}
                onChange={(e) => setMeetingDetails({ ...meetingDetails, hostName: e.target.value })}
                placeholder="Enter the host's name"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-bold mb-1">Select Date:</label>
              <DatePicker
                selected={meetingDetails.date}
                onChange={(date) => setMeetingDetails({ ...meetingDetails, date })}
                dateFormat="yyyy-MM-dd"
                className="form-control w-full"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-bold mb-1" htmlFor="startTime">
                Start Time:
              </label>
              <input
                type="time"
                className="form-control w-full"
                id="startTime"
                value={meetingDetails.startTime}
                onChange={(e) => setMeetingDetails({ ...meetingDetails, startTime: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-bold mb-1" htmlFor="endTime">
                End Time:
              </label>
              <input
                type="time"
                className="form-control w-full"
                id="endTime"
                value={meetingDetails.endTime}
                onChange={(e) => setMeetingDetails({ ...meetingDetails, endTime: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-bold mb-1" htmlFor="meetingApp">
                Meeting App:
              </label>
              <select
                className="form-select w-full"
                id="meetingApp"
                value={meetingDetails.meetingApp}
                onChange={(e) => setMeetingDetails({ ...meetingDetails, meetingApp: e.target.value })}
              >
                <option value="Zoom">Zoom</option>
                <option value="Google Meet">Google Meet</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Skype">Skype</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary bg-teal-600 border-teal-600 hover:bg-teal-800 hover:border-teal-800 w-full mt-4"
            >
              Schedule Meeting
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeeting;
