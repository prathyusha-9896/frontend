import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();  // Hook to programmatically navigate

  const handleLogout = () => {
    // Clear authentication tokens (e.g., from localStorage or sessionStorage)
    localStorage.removeItem('authToken');
    localStorage.removeItem('userDetails');

    // Optionally clear other relevant stored data
    // sessionStorage.clear();  // If you use session storage instead of local storage

    // Redirect to the login page (or another appropriate page)
    navigate('/signup');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Side Navigation */}
      <div className="w-[15%] fixed top-0 left-0 h-full bg-white shadow-md p-4">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
        <ul>
          <li className="mb-4">
            <Link to="/" className="text-teal-500 font-bold hover:text-teal-700">Home</Link>
          </li>
          <li className="mb-4">
            <Link to="/set-availability" className="text-blue-500 hover:text-blue-700">Availability</Link>
          </li>
          <li className="mb-4">
            <Link to="/schedule-event" className="text-blue-500 hover:text-blue-700">Schedule Event</Link>
          </li>
          <li className="mb-4">
            <Link to="/schedule-meeting" className="text-blue-500 hover:text-blue-700">Schedule Meeting</Link>
          </li>
          <li className="mb-4">
            {/* Trigger logout function when clicked */}
            <button onClick={handleLogout} className="text-blue-500 hover:text-blue-700">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
