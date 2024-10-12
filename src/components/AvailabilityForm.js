import React, {useState} from 'react'
import axios from 'axios';
const AvailabilityForm = () => {
    const [availability, setAvailability] = useState({
      startTime: '',
      endTime: '',
    });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        const userId = '12345';  // Replace with actual user ID
        await axios.post('/api/availability', { ...availability, userId });
        alert('Availability saved!');
      } catch (error) {
        console.error('Error saving availability:', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label>Start Time:</label>
        <input
          type="datetime-local"
          value={availability.startTime}
          onChange={(e) => setAvailability({ ...availability, startTime: e.target.value })}
        />
        <br />
        <label>End Time:</label>
        <input
          type="datetime-local"
          value={availability.endTime}
          onChange={(e) => setAvailability({ ...availability, endTime: e.target.value })}
        />
        <br />
        <button type="submit">Save Availability</button>
      </form>
    );
  };


export default AvailabilityForm