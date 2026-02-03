import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CreditCard, ChevronDown } from 'lucide-react';
import Header from './Header';

// Mock data to match the design in the image
const SESSION_DATA = {
  tutor: {
    name: "Sarah L.",
    image: "https://images.unsplash.com/photo-1526080652727-5b77f74eacd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    rate: "$30/hr",
    profileLink: "Mini profile"
  },
  date: "Oct 15",
  time: "4:00 PM",
  duration: "1 hr",
  price: 30.00,
  fee: 2.50,
  total: 32.50,
  selectedDate: 15,
  selectedMonth: "June 2023",
  selectedSlot: "4:00 PM - 5:00 PM"
};

const TIME_SLOTS = [
  "0:00 AM - 1:00 PM", "0:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM", "1:00 PM - 4:00 PM",
  "2:00 PM - 4:00 PM", "3:00 PM - 5:00 PM",
  "4:00 PM - 5:00 PM", "4:00 PM - 5:00 PM",
  "5:00 PM - 6:00 PM"
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function BookSessionPage() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Generate calendar days for the mock month (June 2023 starts on a Thursday)
  const calendarDays = [];
  for (let i = 0; i < 4; i++) calendarDays.push(null); // Empty slots for Sun-Wed
  for (let i = 1; i <= 30; i++) calendarDays.push(i); // Days 1-30

  return (
    <>
    <Header/>
        <div className="min-h-screen bg-gradient-to-br from-[#f6f7f9] to-[#f1efe9] font-sans text-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-10">Book Your Session</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Session Details */}
          <div className="w-full lg:w-7/12 bg-gray-50 p-8 rounded-3xl shadow-sm border-2 border-gray-300">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Session Details</h2>
            
            <div className="mb-8">
              <label htmlFor="problem-description" className="block text-sm font-medium text-slate-700 mb-2">
                Describe your problem or learning goals:
              </label>
              <textarea
                id="problem-description"
                rows={6}
                placeholder="e.g., Need help with Python data structures for my project..."
                className="w-full p-4 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#C5BAFF] focus:border-transparent placeholder-slate-400"
              ></textarea>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-4">Select Date & Time</h2>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Calendar */}
              <div className="w-full md:w-1/2">
                <div className="flex items-center justify-between mb-4">
                  <button className="p-1 rounded-full hover:bg-slate-100"><ChevronLeft size={20} className="text-slate-500" /></button>
                  <h3 className="font-bold text-slate-800">{SESSION_DATA.selectedMonth}</h3>
                  <button className="p-1 rounded-full hover:bg-slate-100"><ChevronRight size={20} className="text-slate-500" /></button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                  {DAYS.map(day => <div key={day} className="text-xs font-medium text-slate-400">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {calendarDays.map((day, index) => (
                    <div key={index} className="aspect-square flex items-center justify-center">
                      {day && (
                        <button 
                          onClick={() => setSelectedDate(day)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                          ${day === selectedDate ? 'bg-[#C5BAFF] text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
                          {day}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="w-full md:w-1/2 grid grid-cols-2 gap-3 content-start">
                {TIME_SLOTS.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all
                      ${slot === selectedSlot 
                        ? 'bg-[#C5BAFF] border-[#C5BAFF] text-white shadow-sm' 
                        : 'border-slate-200 text-slate-600 hover:border-[#C4D9FF] hover:bg-[#E8F9FF]'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Summary */}
          <div className="w-full lg:w-5/12 bg-[#E8F9FF] p-8 rounded-3xl border border-[#C4D9FF]/50">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Booking Summary</h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Order Summary</h3>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <img src={SESSION_DATA.tutor.image} alt={SESSION_DATA.tutor.name} className="w-12 h-12 rounded-full object-cover border-2 border-white" />
                  <div>
                    <p className="font-bold text-slate-900">{SESSION_DATA.tutor.name}</p>
                    <p className="text-xs text-slate-500">{SESSION_DATA.tutor.profileLink}</p>
                  </div>
                </div>
                <p className="font-semibold text-slate-900">{SESSION_DATA.tutor.rate}</p>
              </div>

              <div className="space-y-3 text-sm border-b border-slate-200/50 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Date:</span>
                  <span className="font-medium text-slate-900">
                    {selectedDate ? `${SESSION_DATA.selectedMonth.split(' ')[0]} ${selectedDate}` : 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Time:</span>
                  <span className="font-medium text-slate-900">
                    {selectedSlot ? selectedSlot.split(' - ')[0] : 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between"><span className="text-slate-600">Duration:</span><span className="font-medium text-slate-900">{SESSION_DATA.duration}</span></div>
              </div>

              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between"><span className="text-slate-600">Session Price:</span><span className="font-medium text-slate-900">${SESSION_DATA.price.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Service Fee:</span><span className="font-medium text-slate-900">${SESSION_DATA.fee.toFixed(2)}</span></div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200/50">
                <span className="text-lg font-bold text-slate-900">Total:</span>
                <span className="text-2xl font-bold text-slate-900">${SESSION_DATA.total.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-slate-800" />
                <h3 className="text-sm font-semibold text-slate-800">Payment Method</h3>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Card Number and card"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5BAFF] focus:border-transparent"
                />
                <div className="flex gap-3">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Expiry"
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5BAFF] focus:border-transparent pr-10"
                    />
                    <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <input
                    type="text"
                    placeholder="CVC"
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5BAFF] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <button className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-purple-400 to-purple-600 text-white  font-bold text-lg shadow-md hover:opacity-95 transition-all">
              Confirm and Pay ${SESSION_DATA.total.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}