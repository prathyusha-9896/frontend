import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
const CreateEvent = () => {
  const [step, setStep] = useState(1); // Tracks the current step
  const [eventType, setEventType] = useState('');
  const [host, setHost] = useState('');
  const [eventDetails, setEventDetails] = useState({
    eventName: '',
    duration: '30', // Default to 30 min
    location: 'Zoom',
    invitees: 1
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [invitedEmails, setInvitedEmails] = useState([{ email: '', role: 'User' }]); // Stores email and roles
  const [emailError, setEmailError] = useState(''); // Error message for empty emails
  const [isDone, setIsDone] = useState(false); // State to show "Done" after invitations are sent

  const nextStep = () => setStep(step + 1);
  const previousStep = () => setStep(step - 1);

  // Generates time slots based on duration
  const generateTimeSlots = (duration) => {
    const timeSlots = [];
    let startTime = 9; // 9:00 AM start
    const endTime = 17; // 5:00 PM end
    while (startTime < endTime) {
      const hour = Math.floor(startTime);
      const minutes = startTime % 1 === 0.5 ? '30' : '00';
      const timeString = `${hour}:${minutes} ${hour < 12 ? 'AM' : 'PM'}`;
      timeSlots.push(timeString);
      startTime += duration / 60; // Duration in hours (e.g., 30 min -> 0.5)
    }
    return timeSlots;
  };

  const addEmail = () => {
    setInvitedEmails([...invitedEmails, { email: '', role: 'User' }]);
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...invitedEmails];
    newEmails[index].email = value;
    setInvitedEmails(newEmails);
  };

  const handleRoleChange = (index, role) => {
    const newEmails = [...invitedEmails];
    newEmails[index].role = role;
    setInvitedEmails(newEmails);
  };

  const sendInvitation = () => {
    const validEmails = invitedEmails.filter(user => user.email.trim() !== '');
    if (validEmails.length === 0) {
      setEmailError('Please enter at least one valid email address.');
      return;
    }
    setEmailError('');
    setIsDone(true); // Show "Done" message after sending invitations
  };

  const scheduleEvent = () => {
    const newEvent = {
      eventName: eventDetails.eventName,
      eventType,
      date: selectedDate.toLocaleDateString(),
      time: selectedTime,
      host,
    };

    const savedEvents = JSON.parse(localStorage.getItem('scheduledEvents')) || [];
    savedEvents.push(newEvent);
    localStorage.setItem('scheduledEvents', JSON.stringify(savedEvents));

    alert(`Event scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}`);
  };

  const validateEmailsAndProceed = () => {
    const validEmails = invitedEmails.filter(user => user.email.trim() !== ''); // Check for non-empty emails
  
    if (validEmails.length === 0) {
      setEmailError('Please enter at least one valid email address.'); // Show error message if no valid emails
      return; // Prevent advancing to the next step
    }
  
    setEmailError(''); // Clear error if valid emails are found
    nextStep(); // Proceed to the next step if the validation is successful
  };

  // Render different steps
  const renderEventTypeSelection = () => (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">Select Event Type</h2>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <button onClick={() => { setEventType('One-on-One'); nextStep(); }} className="btn btn-outline-primary border-teal-600 text-teal-600 hover:border-teal-600 hover:bg-teal-600">One-on-One</button>
        <button onClick={() => { setEventType('Group'); nextStep(); }} className="btn btn-outline-primary border-teal-600 text-teal-600 hover:border-teal-600 hover:bg-teal-600">Group</button>
        <button onClick={() => { setEventType('Collective'); setStep(5); }} className="btn btn-outline-primary border-teal-600 text-teal-600 hover:border-teal-600 hover:bg-teal-600">Collective</button>
        <button onClick={() => { setEventType('Round Robin'); setStep(5); }} className="btn btn-outline-primary border-teal-600 text-teal-600 hover:border-teal-600 hover:bg-teal-600">Round Robin</button>
      </div>
    </div>
  );

  const renderHostSelection = () => (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">Choose a Host</h2>
      <select
        value={host}
        onChange={(e) => setHost(e.target.value)}
        className="form-control mb-4 max-w-md mx-auto"
      >
        <option value="Prathyusha">Prathyusha 9896 (me)</option>
      </select>
      <div className="flex justify-between max-w-md mx-auto">
        <button onClick={previousStep} className="btn btn-secondary hover:bg-teal-800 hover:border-teal-800">Back</button>
        <button onClick={nextStep} className="btn btn-primary bg-teal-600 border-teal-600 hover:bg-teal-800 hover:border-teal-800">Next</button>
      </div>
    </div>
  );

  const renderEventCreationForm = () => (
    <div className="text-left">
      <h2 className="text-2xl font-semibold mb-6 text-center">Event Details</h2>
      <div className="flex flex-col max-w-md mx-auto mb-4">
        <label className="mb-1 font-medium">Event Name:</label>
        <input
          type="text"
          value={eventDetails.eventName}
          onChange={(e) => setEventDetails({ ...eventDetails, eventName: e.target.value })}
          className="form-control"
          placeholder="Name your event"
        />
      </div>
      <div className="flex flex-col max-w-md mx-auto mb-4">
        <label className="mb-1 font-medium">Duration:</label>
        <select
          value={eventDetails.duration}
          onChange={(e) => setEventDetails({ ...eventDetails, duration: e.target.value })}
          className="form-control"
        >
          <option value="15">15 min</option>
          <option value="30">30 min</option>
          <option value="60">1 hour</option>
          <option value="90">1.5 hours</option>
          <option value="120">2 hours</option>
        </select>
      </div>
      <div className="flex flex-col max-w-md mx-auto mb-4">
        <label className="mb-1 font-medium">Location:</label>
        <select
          value={eventDetails.location}
          onChange={(e) => setEventDetails({ ...eventDetails, location: e.target.value })}
          className="form-control"
        >
          <option value="Zoom">Zoom</option>
          <option value="Phone Call">Phone Call</option>
          <option value="In-person">In-person Meeting</option>
        </select>
      </div>
      {eventType !== 'One-on-One' && (
        <div className="flex flex-col max-w-md mx-auto mb-4">
          <label className="mb-1 font-medium">Maximum Invitees:</label>
          <input
            type="number"
            value={eventDetails.invitees}
            onChange={(e) => setEventDetails({ ...eventDetails, invitees: e.target.value })}
            className="form-control"
            min="1"
          />
        </div>
      )}
      <div className="flex justify-between max-w-md mx-auto">
        <button onClick={previousStep} className="btn btn-secondary hover:bg-teal-800 hover:border-teal-800">Back</button>
        <button onClick={nextStep} className="btn btn-primary  bg-teal-600 border-teal-600 hover:bg-teal-800 hover:border-teal-800">Next</button>
      </div>
    </div>
  );

  const renderDateTimeSelection = () => (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">Select a Date & Time</h2>
      <div className="flex justify-center items-start gap-6">
        <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} inline />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Select a Time</h3>
          <div className="grid grid-cols-2 gap-2">
            {generateTimeSlots(parseInt(eventDetails.duration)).map((time, index) => (
              <button
                key={index}
                onClick={() => setSelectedTime(time)}
                className={`py-2 px-4 border ${selectedTime === time ? 'bg-teal-600 text-white' : 'bg-white text-gray-800'}`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between max-w-md mx-auto mt-4">
        <button onClick={previousStep} className="btn btn-secondary hover:bg-teal-800 hover:border-teal-800">Back</button>
        <button onClick={scheduleEvent} className="btn btn-primary  bg-teal-600 border-teal-600 hover:bg-teal-800 hover:border-teal-800">Schedule Event</button>
      </div>
    </div>
  );

  const renderInviteUsers = () => (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">Invite Users</h2>
      {invitedEmails.map((user, index) => (
        <div key={index} className="flex justify-between max-w-md mx-auto mb-2">
          <input
            type="email"
            value={user.email}
            onChange={(e) => handleEmailChange(index, e.target.value)}
            className="form-control"
            placeholder="Enter email"
          />
          <select
            value={user.role}
            onChange={(e) => handleRoleChange(index, e.target.value)}
            className="form-select ml-2"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Group Admin">Group Admin</option>
          </select>
        </div>
      ))}
      <button onClick={addEmail} className="btn btn-secondary mb-4">Add another user</button>
      {emailError && <p className="text-red-500 mt-2">{emailError}</p>}
      <div className="flex justify-between max-w-md mx-auto mt-4">
        <button onClick={previousStep} className="btn btn-secondary  hover:bg-teal-800 hover:border-teal-800">Back</button>
        <button onClick={validateEmailsAndProceed} className="btn btn-primary  bg-teal-600 border-teal-600 hover:bg-teal-800 hover:border-teal-800">Next</button>
      </div>
    </div>
  );

  const renderAssignRoles = () => (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">Assign Roles</h2>
      {invitedEmails.map((user, index) => (
        <div key={index} className="flex justify-between max-w-md mx-auto mb-2">
          <span className="block">{user.email}</span>
          <select
            value={user.role}
            onChange={(e) => handleRoleChange(index, e.target.value)}
            className="form-select ml-2"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Group Admin">Group Admin</option>
          </select>
        </div>
      ))}
      <div className="flex justify-between max-w-md mx-auto mt-4">
        <button onClick={previousStep} className="btn btn-secondary hover:bg-teal-800 hover:border-teal-800">Back</button>
        <button onClick={sendInvitation} className="btn btn-success  bg-teal-600 border-teal-600 hover:bg-teal-800 hover:border-teal-800">Send Invitations</button>
      </div>
    </div>
  );

  // Conditional rendering to show "Done" text
  if (isDone) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-teal-600">Done</h2>
          <Link to="/" className="text-blue-500 underline text-lg">
             Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className='flex min-h-screen'>
        <Navbar/>
    <div className="container flex flex-col mx-auto p-6 bg-white rounded-lg max-w-3xl">
        {step === 1 && renderEventTypeSelection()}
        {step === 2 && renderHostSelection()}
        {step === 3 && renderEventCreationForm()}
        {step === 4 && renderDateTimeSelection()}
        {(eventType === 'Collective' || eventType === 'Round Robin') && step === 5 && renderInviteUsers()}
        {(eventType === 'Collective' || eventType === 'Round Robin') && step === 6 && renderAssignRoles()}
      </div>
    </div>
    </>
  );
};

export default CreateEvent;
