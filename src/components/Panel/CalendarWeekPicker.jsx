import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar } from 'react-icons/fi';

export default function CalendarWeekPicker({ onDateSelect, initialDate = null }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [formatted, setFormatted] = useState('');
  const [userTimeZone, setUserTimeZone] = useState('UTC');

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimeZone(tz);
  }, []);

  useEffect(() => {
    if (initialDate && !isNaN(initialDate.getTime())) {
      setSelectedDate(initialDate);
      const h = initialDate.getHours().toString().padStart(2, '0');
      const m = initialDate.getMinutes().toString().padStart(2, '0');
      const time = `${h}:${m}`;
      setSelectedTime(time);
      updateDateTime(initialDate, time);
    }
  }, [initialDate]);

  const handleFormatting = (dateObj) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: userTimeZone,
      timeZoneName: 'short',
    });

    const parts = formatter.formatToParts(dateObj);
    const get = (type) => parts.find((p) => p.type === type)?.value || '';
    const formattedStr = `${get('weekday')} ${get('month')} ${get('day')} ${get('year')} ${get('hour')}:${get('minute')} ${get('timeZoneName')}`;
    setFormatted(formattedStr);

    if (onDateSelect) {
      onDateSelect({
        date: dateObj.toISOString(),
        formatted: formattedStr,
        userTimeZone,
      });
    }
  };

  const updateDateTime = (date, time) => {
    if (!date || !time) return;
    const [hours, minutes] = time.split(':').map(Number);
    const dateWithTime = new Date(date);
    dateWithTime.setHours(hours);
    dateWithTime.setMinutes(minutes);
    handleFormatting(dateWithTime);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (selectedTime) updateDateTime(date, selectedTime);
    else setFormatted('');
  };

  const handleTimeChange = (e) => {
    const timeValue = e.target.value;
    setSelectedTime(timeValue);
    if (selectedDate) updateDateTime(selectedDate, timeValue);
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const generateTimes = () => {
    const times = [];
    for (let h = 8; h < 21; h++) {
      times.push(`${h.toString().padStart(2, '0')}:00`);
      times.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return times;
  };

  return (
    <div className="w-full space-y-4 sm:space-y-5 px-2 sm:px-0">
      <label className="flex items-center gap-2 text-[#2E3191] font-semibold text-sm sm:text-base">
        <FiCalendar className="text-[#2E3191]" />
        <span>Select Date & Time</span>
        <span className="text-gray-600 text-xs">(08:00–21:00 Nairobi Time)</span>
      </label>

      <div className="border border-gray-300 rounded-lg p-2">
        <DatePicker
          inline
          selected={selectedDate}
          onChange={handleDateChange}
          filterDate={isWeekday}
          minDate={new Date()}
          maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
        />
      </div>

      {selectedDate && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Select Time:</label>
          <select
            value={selectedTime}
            onChange={handleTimeChange}
            className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-[#2E3191]"
          >
            <option value="">-- Select Time --</option>
            {generateTimes().map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      )}

      {formatted && (
        <div className="text-green-700 font-medium text-sm text-center mt-2">
          ✅ Selected: <span className="font-semibold">{formatted}</span>
        </div>
      )}
    </div>
  );
}
