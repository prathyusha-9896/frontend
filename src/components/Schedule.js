import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import Navbar from './Navbar';
import Header from './Header';
const Schedule = () => {
  const { name } = useParams();  // Get the name from the URL
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [available, setAvailable] = useState(true);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null); // To store the selected time slot
  const navigate = useNavigate(); // Use navigate to redirect to another page

  // Fetch availability for the user when the component mounts
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/availability/${name}`);
        console.log('Availability response:', response.data);
        if (response.data.length > 0) {
          // Store the availability as date + time slot array for each date
          setAvailability(response.data);
        } else {
          setAvailable(false);  // If no availability, show an error message
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
        setAvailable(false);
      }
    };

    fetchAvailability();
  }, [name]);

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Fetch time slots for the selected date
    const slotsForSelectedDate = availability.filter(a => new Date(a.startTime).toDateString() === date.toDateString());
    setTimeSlots(slotsForSelectedDate);
  };

  // Handle slot selection
  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot); // Store the selected time slot
  };

  // Handle the "Next" button click
  const handleNextClick = () => {
    // Navigate to the schedule details page with the selected date and time slot
    if (selectedDate && selectedSlot) {
      navigate('/schedule-details', {
        state: {
          name,
          date: selectedDate.toLocaleDateString(),
          startTime: new Date(selectedSlot.startTime).toLocaleTimeString(),
          endTime: new Date(selectedSlot.endTime).toLocaleTimeString(),
        }
      });
    }
  };

  return (
    <>
    <div className='flex min-h-screen'>
        <Navbar/>
    <div className="container mx-auto my-8 p-6 bg-white shadow-lg rounded-lg max-w-3xl">
        <Header/>
      <h2 className="text-3xl font-bold text-center mb-6">Schedule a Meeting with {name}</h2>
      {availability.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar Section */}
          <div className="w-full lg:w-1/2">
            <h3 className="text-xl font-semibold mb-4">Select a Date:</h3>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              highlightDates={availability.map(a => new Date(a.startTime))} // Highlight available dates
              includeDates={availability.map(a => new Date(a.startTime))}  // Only include available dates
              inline
              className="w-full"
            />
          </div>

          {/* Time Slots Section */}
          {selectedDate && (
            <div className="w-full lg:w-1/2">
              <h3 className="text-xl font-semibold mb-4">Available Times for {selectedDate.toLocaleDateString()}:</h3>
              {timeSlots.length > 0 ? (
                <div className="overflow-y-auto max-h-64">
                  <ul className="list-group">
                    {timeSlots.map((slot, index) => (
                      <li key={index} className="list-group-item">
                        <button
                          className={`w-full text-left py-2 px-4 border ${selectedSlot === slot ? 'bg-teal-500 text-white' : 'bg-white text-gray-800'}`}
                          onClick={() => handleSlotSelection(slot)}
                        >
                          {new Date(slot.startTime).toLocaleTimeString()} - {new Date(slot.endTime).toLocaleTimeString()}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No time slots available for the selected date.</p>
              )}

              {/* Next button */}
              <button 
                onClick={handleNextClick} 
                disabled={!selectedSlot}  // Disable if no time slot is selected
                className={`mt-4 w-full py-2 px-4 rounded-lg ${selectedSlot ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-gray-400 text-gray-800 cursor-not-allowed'}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : available ? (
        <p>Loading availability...</p>
      ) : (
        <p>Sorry, this time slot is no longer available.</p>
      )}
    </div>
    </div>
    </>
  );
};

export default Schedule;
