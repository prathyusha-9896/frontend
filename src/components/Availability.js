import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import Navbar from './Navbar';  // Import the Navbar component
import Header from './Header';

const Availability = () => {
  const [meetingDetails, setMeetingDetails] = useState({
    name: '',
    selectedDates: [],
    meetingDuration: '30', // Default to 30 minutes
    timezone: 'UTC',
    meetingApp: 'Zoom',
  });

  const [scheduledAvailabilities, setScheduledAvailabilities] = useState([]);
  const [scheduledMeetings, setScheduledMeetings] = useState([]); // Track confirmed scheduled meetings
  const [scheduledEvents, setScheduledEvents] = useState([]);
  
  // Load scheduled availabilities and meetings from localStorage when the component mounts
  useEffect(() => {
    const savedAvailabilities = localStorage.getItem('scheduledAvailabilities');
    if (savedAvailabilities) {
      setScheduledAvailabilities(JSON.parse(savedAvailabilities));
    }

    const savedMeetings = localStorage.getItem('scheduledMeetings');
    if (savedMeetings) {
      setScheduledMeetings(JSON.parse(savedMeetings));
      console.log('Loaded meetings:', JSON.parse(savedMeetings)); // Debugging: Check if meetings are loaded
    }

    const savedEvents = localStorage.getItem('scheduledEvents'); 
    if (savedEvents) {
      setScheduledEvents(JSON.parse(savedEvents));
      console.log('Loaded scheduled events:', JSON.parse(savedEvents)); 
    }
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Save scheduled availabilities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('scheduledAvailabilities', JSON.stringify(scheduledAvailabilities));
  }, [scheduledAvailabilities]);

  const handleDateSelect = (date) => {
    const selectedDates = [...meetingDetails.selectedDates];
    if (selectedDates.find((d) => d.getTime() === date.getTime())) {
      const index = selectedDates.findIndex((d) => d.getTime() === date.getTime());
      selectedDates.splice(index, 1);
    } else {
      selectedDates.push(date);
    }
    setMeetingDetails({ ...meetingDetails, selectedDates });
  };

  const generateTimeSlots = (duration) => {
    const slots = [];
    const startHour = 9; // 9:00 AM
    const endHour = 17; // 5:00 PM
    let currentTime = new Date();
    currentTime.setHours(startHour, 0, 0, 0); // Start at 9:00 AM

    while (currentTime.getHours() < endHour) {
      const startTime = new Date(currentTime);
      currentTime.setMinutes(currentTime.getMinutes() + duration); // Add the meeting duration to current time
      const endTime = new Date(currentTime);
      slots.push({ startTime: startTime.toISOString(), endTime: endTime.toISOString() });
    }

    return slots;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, selectedDates, meetingDuration } = meetingDetails;

    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }

    if (selectedDates.length === 0) {
      alert('Please select at least one date.');
      return;
    }

    const availabilityToSet = [];
    selectedDates.forEach((date) => {
      const slots = generateTimeSlots(parseInt(meetingDuration)); // Generate time slots for each selected date
      slots.forEach((slot) => {
        const formattedDate = date.toISOString().split('T')[0];
        availabilityToSet.push({
          userId: name,
          startTime: `${formattedDate}T${new Date(slot.startTime).toISOString().split('T')[1]}`,
          endTime: `${formattedDate}T${new Date(slot.endTime).toISOString().split('T')[1]}`,
        });
      });
    });

    try {
      const response = await axios.post('http://localhost:5000/api/availability', { availability: availabilityToSet });

      alert(`Availability set successfully.`);

      // Update scheduled availabilities and save to localStorage
      const newAvailability = { name, meetingDuration, link: `${window.location.origin}/schedule/${name}` };
      setScheduledAvailabilities((prev) => [...prev, newAvailability]);

      if (Notification.permission === 'granted') {
        new Notification('Availability Set', {
          body: `Your availability has been set successfully.`,
        });
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      alert('Error saving availability. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Render Navbar component at the top */}
      <Navbar className=""/>

      <div className="container mx-auto p-4">
        <Header className=""/>
        <h2 className="text-2xl font-bold mb-4 text-center">Set Your Availability</h2>
        {/* Flex container to hold the calendar and form fields side by side */}
        <div className="flex flex-col justify-center items-center lg:flex-row lg:space-x-36 bg-white rounded px-8 pt-6 pb-8 mb-4 w-full max-w-3xl mx-auto">
          <div className="mb-4 lg:mb-0">
            {/* Calendar component */}
            <h3 className="block text-gray-700 text-sm font-bold mb-2">Select Dates:</h3>
            <DatePicker
              selected={meetingDetails.selectedDates[0]}
              onChange={handleDateSelect}
              inline
              highlightDates={meetingDetails.selectedDates}
              minDate={new Date()}
              multiDatesPicker
            />
          </div>

          {/* Right side form fields */}
          <form onSubmit={handleSubmit} className="">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name:
              </label>
              <input
                type="text"
                className="form-control shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={meetingDetails.name}
                onChange={(e) => setMeetingDetails({ ...meetingDetails, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="meetingDuration">
                Meeting Duration:
              </label>
              <select
                className="form-select shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={meetingDetails.meetingDuration}
                onChange={(e) => setMeetingDetails({ ...meetingDetails, meetingDuration: e.target.value })}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="timezone">
                Timezone:
              </label>
              <select
                className="form-select shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={meetingDetails.timezone}
                onChange={(e) => setMeetingDetails({ ...meetingDetails, timezone: e.target.value })}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (US & Canada)</option>
                <option value="America/Chicago">Central Time (US & Canada)</option>
                <option value="America/Denver">Mountain Time (US & Canada)</option>
                <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="meetingApp">
                Meeting App:
              </label>
              <select
                className="form-select shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              className="btn btn-primary hover:bg-teal-800 bg-teal-600  w-full mt-4"
            >
              Set Availability
            </button>
          </form>
        </div>

                    {/* Scheduled Availabilities */}
                    {scheduledAvailabilities.length > 0 && (
              <div className='lg:ml-64'>
                <h3 className="text-xl font-semibold mb-4 ">Scheduled Availabilities:</h3>
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
      </div>
    </div>
    
  );
};

export default Availability;
