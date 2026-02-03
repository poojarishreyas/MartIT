import React from 'react';
import { 
  Search, Smartphone, Laptop, Tablet, Watch, Gamepad2, Headphones, 
  CheckCircle2, Circle, Wrench, Battery, Zap, ChevronRight, Clock 
} from 'lucide-react';
import Header from './Header';

// --- Types & Mock Data ---

const DEVICE_CATEGORIES = [
  { id: 1, name: "Smartphone", icon: <Smartphone size={32} /> },
  { id: 2, name: "Laptop", icon: <Laptop size={32} /> },
  { id: 3, name: "Tablet", icon: <Tablet size={32} /> },
  { id: 4, name: "Smartwatch", icon: <Watch size={32} /> },
  { id: 5, name: "Console", icon: <Gamepad2 size={32} /> },
  { id: 6, name: "Audio", icon: <Headphones size={32} /> },
];

const POPULAR_FIXES = [
  { id: 1, title: "Screen Replacement", device: "iPhone 14 / 15 Series", time: "45 mins", price: "From $89", icon: <Smartphone className="text-[#6B5CE7]" /> },
  { id: 2, title: "Battery Replacement", device: "MacBook Air / Pro", time: "2 hours", price: "From $129", icon: <Battery className="text-[#6B5CE7]" /> },
  { id: 3, title: "Water Damage Cleanup", device: "Any Device", time: "24 hours", price: "Diagnostics $30", icon: <Zap className="text-[#6B5CE7]" /> },
   { id: 1, title: "Screen Replacement", device: "iPhone 14 / 15 Series", time: "45 mins", price: "From $89", icon: <Smartphone className="text-[#6B5CE7]" /> },
  { id: 2, title: "Battery Replacement", device: "MacBook Air / Pro", time: "2 hours", price: "From $129", icon: <Battery className="text-[#6B5CE7]" /> },
  { id: 3, title: "Water Damage Cleanup", device: "Any Device", time: "24 hours", price: "Diagnostics $30", icon: <Zap className="text-[#6B5CE7]" /> },
];

const ORDER_STEPS = [
  { label: "Received", status: "completed" },
  { label: "Diagnostics", status: "current" },
  { label: "Repairing", status: "upcoming" },
  { label: "Ready", status: "upcoming" },
];

// --- Component ---

export default function Repair() {
  return (
    <div className="min-h-screen bg-[#FBFBFB] font-sans text-slate-800">
        <Header/>
      
      {/* Centered Container */}
      <div className="max-w-[90%] mx-auto px-6 py-10 space-y-12">

        {/* 1. Header & Search */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Broken device? Let's get it fixed.
          </h1>
          
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search for your device model or issue (e.g., 'MacBook Screen')..." 
              className="w-full pl-14 pr-4 py-4 bg-white border border-[#C4D9FF] rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C5BAFF] transition-all"
            />
          </div>
        </div>

        {/* 2. Active Repair Status Tracker */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-sm font-bold text-[#6B5CE7] uppercase tracking-wide">Active Repair Status</h2>
              <p className="font-semibold text-slate-700 mt-1">Order #2491 - MacBook Pro 14" (Screen Damage)</p>
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-xs text-slate-400">Est. Completion</span>
              <p className="text-sm font-medium text-slate-600">Tomorrow, 4:00 PM</p>
            </div>
          </div>

          {/* Progress Bar Visual */}
          <div className="relative flex justify-between items-center w-full">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-[#E8F9FF] -z-10 rounded-full"></div>
            
            {/* Active Progress Line (50% for visual demo) */}
            <div className="absolute top-1/2 left-0 w-1/3 h-1 bg-[#6B5CE7] -z-10 rounded-full transition-all duration-500"></div>

            {ORDER_STEPS.map((step, index) => (
              <div key={index} className="flex flex-col items-center gap-3 bg-[#FBFBFB] px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  step.status === 'completed' ? 'bg-[#C5BAFF] border-[#C5BAFF] text-white' :
                  step.status === 'current' ? 'bg-white border-[#C5BAFF] text-[#6B5CE7]' :
                  'bg-white border-[#6B5CE7] text-slate-300'
                }`}>
                  {step.status === 'completed' ? <CheckCircle2 size={16} /> : 
                   step.status === 'current' ? <Wrench size={14} className="animate-pulse" /> : 
                   <Circle size={10} fill="currentColor" className="text-slate-200" />}
                </div>
                <span className={`text-xs font-medium ${step.status === 'upcoming' ? 'text-slate-400' : 'text-slate-700'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Device Categories */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6">Select Your Device Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {DEVICE_CATEGORIES.map((cat) => (
              <button key={cat.id} className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-[#E8F9FF] border border-[#6B5CE7] hover:border-[#C4D9FF] hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer">
                <div className="text-[#6B5CE7] mb-3 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 4. Popular Quick Fixes (List View) */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6">Popular Quick Fixes</h2>
          <div className="space-y-4">
            {POPULAR_FIXES.map((fix) => (
              <div key={fix.id} className="group bg-white border border-[#6B5CE7] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between hover:border-[#C5BAFF] hover:shadow-sm transition-all">
                
                <div className="flex items-center gap-5 mb-4 md:mb-0">
                  <div className="w-14 h-14 rounded-xl bg-[#E8F9FF] flex items-center justify-center">
                    {fix.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{fix.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <span>{fix.device}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {fix.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 pl-16 md:pl-0">
                  <span className="font-bold text-slate-700">{fix.price}</span>
                  <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 text-white font-semibold text-sm shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                    Book Now
                  </button>
                </div>

              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}