import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { auth } from './firebase';  // Ensure you import Firebase auth
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth'; // Import required Firebase methods
import Login from './components/Login';
import Signup from './components/SignUp';
import Availability from './components/Availability';
import Schedule from './components/Schedule';
import ScheduleDetails from './components/ScheduleDetails';
import ScheduleMeeting from './components/ScheduleMeeting';
import CreateEvent from './components/CreateEvent';
import Home from './components/Home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state to show while checking auth

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // Set user as authenticated on successful login
  };

  // Check if user is already authenticated when app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Set local persistence (this will keep the user logged in across tabs and reloads)
        await setPersistence(auth, browserLocalPersistence);

        // Check if the user is already authenticated
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
          setLoading(false); // Stop showing loading indicator after auth check
        });

        return () => unsubscribe(); // Clean up the listener on unmount
      } catch (error) {
        console.error('Error with auth persistence:', error);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading spinner or message while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleOAuthProvider clientId="1070666646612-k29u9uttmshfaa1lip3kj9b8pdn4im3j.apps.googleusercontent.com">
      <div>
        <Routes>
          {/* Routes for authenticated users */}
          <Route path="/schedule/:name" element={<Schedule />} />
          <Route path="/schedule-details" element={<ScheduleDetails />} />
          <Route path="/schedule-meeting" element={<ScheduleMeeting />} />
          <Route path="/schedule-event" element={<CreateEvent />} />
          <Route path="/set-availability" element={<Availability />} />

          {/* Route for Login */}
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Route for Signup */}
          <Route
            path="/signup"
            element={<Signup onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Main route */}
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <>
                  <Signup onLoginSuccess={handleLoginSuccess} />
                </>
              ) : (
                <div>
                  <Home />
                </div>
              )
            }
          />
        </Routes>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
