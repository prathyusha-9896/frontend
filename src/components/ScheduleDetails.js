import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import Navbar from './Navbar';
import Header from './Header';
const ScheduleDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, date, startTime, endTime } = location.state || {};

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleConfirmMeeting = async () => {
    try {
      if (!userDetails.name || !userDetails.email) {
        return alert('Please enter your name and email.');
      }

      const meetingData = {
        userName: userDetails.name,
        userEmail: userDetails.email,
        hostName: name,
        date,
        startTime,
        endTime
      };

      const response = await axios.post('http://localhost:5000/api/schedule-meeting', meetingData);

      if (response.status === 200) {
        alert('Meeting scheduled successfully!');

        // Store the scheduled meeting in localStorage
        const savedMeetings = JSON.parse(localStorage.getItem('scheduledMeetings')) || [];
        savedMeetings.push(meetingData);
        localStorage.setItem('scheduledMeetings', JSON.stringify(savedMeetings));

        console.log('Saved meetings:', savedMeetings); // Debugging: Check if meetings are saved

        // Redirect back to the availability page
        navigate('/');
      } else {
        alert('Failed to schedule the meeting. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('Bad Request: Please fill all required fields.');
      } else {
        alert('Error scheduling the meeting. Please try again.');
      }
    }
  };

  return (
    <>
    <div className='flex min-h-screen'>
        <Navbar/>
    <div className="container mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg max-w-lg">
        <Header/>
      <h2 className="text-2xl font-bold text-center mb-6">Confirm Your Meeting</h2>

      <div className="mb-4">
        <p><strong>Host Name:</strong> {name}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Time:</strong> {startTime} - {endTime}</p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Your Name:
        </label>
        <input
          type="text"
          name="name"
          className="form-control shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={userDetails.name}
          onChange={handleInputChange}
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Your Email:
        </label>
        <input
          type="email"
          name="email"
          className="form-control shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={userDetails.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          required
        />
      </div>

      <button
        onClick={handleConfirmMeeting}
        className="btn btn-success bg-teal-600 hover:bg-teal-800 w-full py-2 mt-4"
      >
        Confirm Meeting
      </button>
    </div>
    </div>
    </>
  );
};

export default ScheduleDetails;
