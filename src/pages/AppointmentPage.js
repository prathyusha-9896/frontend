import React, { useState } from 'react';
import axios from 'axios';

const AppointmentPage = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('');
    const [timezone, setTimezone] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/appointments', { date, time, duration, timezone }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Appointment scheduled');
        } catch (error) {
            console.error(error.response.data.message);
        }
    };

    return (
        <div>
            <h1>Schedule Appointment</h1>
            <form onSubmit={handleSubmit}>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (minutes)" required />
                <input type="text" value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="Timezone" required />
                <button type="submit">Schedule</button>
            </form>
        </div>
    );
};

export default AppointmentPage;
