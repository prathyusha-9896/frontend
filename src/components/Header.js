import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Icons for hamburger menu

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track the menu state
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userDetails');
    navigate('/signup');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
  };

  return (
    <div>
      {/* Header */}
      <header className="p-4 lg:hidden flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        {/* Hamburger icon for small screens */}
        <button onClick={toggleMenu} className="lg:hidden text-2xl text-gray-600">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* Dropdown menu for smaller screens as an overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute top-0 right-0 bg-white shadow-md p-6 w-[75%] max-w-sm h-full">
            {/* Close button at the top */}
            <button onClick={toggleMenu} className="text-2xl text-gray-600 absolute top-4 right-4">
              <FaTimes />
            </button>

            <ul className="mt-10"> {/* Added margin to push the links down below the close button */}
              <li className="mb-4">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? 'text-teal-500 font-bold hover:text-teal-700'
                      : 'text-teal-500 font-thin hover:text-teal-700'
                  }
                  onClick={toggleMenu}
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
                  onClick={toggleMenu}
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
                  onClick={toggleMenu}
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
                  onClick={toggleMenu}
                >
                  Schedule Meeting
                </NavLink>
              </li>
              <li className="mb-4">
                <button onClick={() => { handleLogout(); toggleMenu(); }} className="text-teal-500 hover:text-teal-700">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
