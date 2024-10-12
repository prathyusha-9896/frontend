import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const CalendarIntegration = () => {
  const [userData, setUserData] = useState(null);

  const handleLoginSuccess = async (response) => {
    const { access_token } = response;
    console.log('Access Token:', access_token);

    // Make a request to your backend to get calendar data
    try {
      const calendarData = await axios.get('http://localhost:5000/api/calendar', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log('Calendar Data:', calendarData.data);
      setUserData(calendarData.data); // Save user calendar data to state
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    }
  };

  const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
  };

  return (
    <div>
    <h2>Google Calendar Data:</h2>
    <pre>{JSON.stringify(userData, null, 2)}</pre>
  </div>
  );
};

export default CalendarIntegration;
