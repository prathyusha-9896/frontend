import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';
import Signup from './components/SignUp';
import CalendarIntegration from './components/CalendarIntegration';
import Availability from './components/Availability'; // Assuming Availability component exists

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [availability, setAvailability] = useState({
    startTime: '',
    endTime: '',
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // Set user as authenticated on successful login
  };

  // Handle availability form submission
  const handleAvailabilitySubmit = async () => {
    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'currentUserId', // Replace with actual user ID (from authenticated state)
          startTime: availability.startTime,
          endTime: availability.endTime,
        }),
      });

      if (response.ok) {
        alert('Availability saved successfully!');
      } else {
        alert('Error saving availability');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving availability');
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID.apps.googleusercontent.com">
      <div>
        <h1>Firebase Auth Example</h1>
        {/* Show Login and Signup only if user is not authenticated */}
        {!isAuthenticated ? (
          <>
            <Signup onLoginSuccess={handleLoginSuccess} />
            <Login onLoginSuccess={handleLoginSuccess} />
          </>
        ) : (
          <div>
            <h2>Welcome!</h2>
            {/* Show Calendar Integration and Availability forms after login */}
            <CalendarIntegration />
            <Availability/>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
