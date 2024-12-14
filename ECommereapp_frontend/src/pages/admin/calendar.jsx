import React, { useState } from 'react';
import Sidebar from '../../components/admin/sidebar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Helmet } from "react-helmet";

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());

  return (
    <>
    <Helmet>
      <title>Calendar | Admin | Mera Bestie</title>
    </Helmet>
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 ml-[5rem] lg:ml-64 bg-pink-50 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Calendar</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <Calendar
              onChange={setDate}
              value={date}
              className="w-full border-none"
              tileClassName={({ date: tileDate }) => {
                if (
                  tileDate.getDate() === new Date().getDate() &&
                  tileDate.getMonth() === new Date().getMonth() &&
                  tileDate.getFullYear() === new Date().getFullYear()
                ) {
                  return 'bg-pink-200 text-pink-800 rounded-full';
                }
              }}
            />
          </div>

          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Selected Date: {date.toDateString()}
            </h2>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CalendarPage;
