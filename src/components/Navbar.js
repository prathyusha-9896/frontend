import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();  // Hook to programmatically navigate

  const handleLogout = () => {
    // Clear authentication tokens (e.g., from localStorage or sessionStorage)
    localStorage.removeItem('authToken');
    localStorage.removeItem('userDetails');

    // Redirect to the signup page (or another appropriate page)
    navigate('/signup');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 lg:block hidden">
      {/* Side Navigation */}
      <div className="w-[15%] fixed top-0 left-0 h-full bg-white shadow-md p-4">
        <ul>
          <li className="mb-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? 'text-teal-500 font-bold hover:text-teal-700'
                  : 'text-teal-500 font-thin hover:text-teal-700'
              }
            >
              Home
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/set-availability"
              className={({ isActive }) =>
                isActive
                  ? 'text-teal-500 font-bold hover:text-teal-700'
                  : 'text-teal-500 font-thin hover:text-teal-700'
              }
            >
              Availability
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/schedule-event"
              className={({ isActive }) =>
                isActive
                  ? 'text-teal-500 font-bold hover:text-teal-700'
                  : 'text-teal-500 font-thin hover:text-teal-700'
              }
            >
              Schedule Event
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/schedule-meeting"
              className={({ isActive }) =>
                isActive
                  ? 'text-teal-500 font-bold hover:text-teal-700'
                  : 'text-teal-500 font-thin hover:text-teal-700'
              }
            >
              Schedule Meeting
            </NavLink>
          </li>
          <li className="mb-4">
            {/* Trigger logout function when clicked */}
            <button onClick={handleLogout} className="text-teal-500 hover:text-teal-700">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
