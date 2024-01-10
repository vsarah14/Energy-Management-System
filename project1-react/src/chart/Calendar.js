import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Calendar = ({ onDateChange, consumptionData }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [enabledDates, setEnabledDates] = useState([]);

    useEffect(() => {
        if (consumptionData && consumptionData.length > 0) {
            const allDates = consumptionData.map((data) => new Date(data.timestamp));
            const uniqueDates = [...new Set(allDates)]; // Get unique dates
            setEnabledDates(uniqueDates);
        }
    }, [consumptionData]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        onDateChange(date);
    };

    const filterDates = (date) => {
        return enabledDates.some(
            (enabledDate) =>
                date.getDate() === enabledDate.getDate() &&
                date.getMonth() === enabledDate.getMonth() &&
                date.getFullYear() === enabledDate.getFullYear()
        );
    };

    return (
        <DatePicker selected={selectedDate} onChange={handleDateChange} filterDate={filterDates} />
    );
};

export default Calendar;
