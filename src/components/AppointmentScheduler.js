import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AppointmentScheduler = () => {
  const [availability, setAvailability] = useState({
    date: new Date(),
    time: '',
    timezone: 'UTC',
  });
  
  const [generatedLink, setGeneratedLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { date, time, timezone } = availability;
    const availableDateTime = `${date.toISOString().split('T')[0]} ${time} ${timezone}`;

    try {
      const response = await axios.post('http://localhost:5000/api/setAvailability', { availableDateTime });
      setGeneratedLink(response.data.link); // Get the unique link for sharing

      alert(`Availability set. Share this link to schedule appointments: ${response.data.link}`);
    } catch (error) {
      console.error('Error setting availability:', error);
      alert('Error setting availability. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Select Date:
          <DatePicker
            selected={availability.date}
            onChange={(date) => setAvailability({ ...availability, date })}
            dateFormat="yyyy-MM-dd"
          />
        </label>

        <label>
          Select Time:
          <input
            type="time"
            value={availability.time}
            onChange={(e) => setAvailability({ ...availability, time: e.target.value })}
          />
        </label>

        <label>
          Timezone:
          <select
            value={availability.timezone}
            onChange={(e) => setAvailability({ ...availability, timezone: e.target.value })}
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time (US & Canada)</option>
            <option value="America/Chicago">Central Time (US & Canada)</option>
            <option value="America/Denver">Mountain Time (US & Canada)</option>
            <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
          </select>
        </label>

        <button type="submit">Set Availability</button>
      </form>

      {generatedLink && (
        <div>
          <p>Share the following link to allow others to schedule appointments:</p>
          <a href={generatedLink} target="_blank" rel="noopener noreferrer">{generatedLink}</a>
        </div>
      )}
    </div>
  );
};

export default AppointmentScheduler;
