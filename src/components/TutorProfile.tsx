import React from 'react';
import { Star, Calendar, CheckCircle2 } from 'lucide-react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

// --- Mock Data based on the image ---
const TUTOR_DATA = {
  id: 1,
  name: "Sarah L.",
  // Using a placeholder image that matches the look
  image: "https://images.unsplash.com/photo-1526080652727-5b77f74eacd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
  isTopRated: true,
  rating: 4.9,
  reviewCount: 124,
  // The exact text from the image, including typos for accuracy
  description: "Sarah L is a exclusive computer expertise.. rrectional Engine, and software preenance and abecurse convaboraory technologies teaching thte Nay with head also style, teaching, help funatize and presemations to imaunir, and sorial interestags.",
  hourlyRate: 30,
  tierLevel: "Platinum",
  skills: [
    "Computer Science",
    "Software Engineering",
    "System Architecture",
    "Algorithm Design",
    "Data Structures"
  ],
  certifications: [
    "Certified Hardware Engineer (CHE)",
    "AWS Solutions Architect Associate",
    // Adding a third one as implied by the cutoff in the image
    "AWS Solutions Architect Professional" 
  ]
};

export default function TutorProfile() {
  const navigate = useNavigate();

  return (
    <>
    <Header/>
  
    <div className="min-h-screen bg-[#FBFBFB] font-sans text-slate-800 p-6 flex justify-center">
      
      <div className="w-[85%] ">
        
        {/* --- Hero Section with Gradient Background --- */}
        {/* Using a soft gradient to match the image's blue-to-purple transition */}
        <div className="bg-gradient-to-r from-[#C4D9FF]/40 to-[#C5BAFF]/40 rounded-[32px] p-9 md:p-12 flex flex-col md:flex-row gap-10 items-start justify-between relative overflow-hidden shadow-sm">
          
          {/* Left Side: Profile Info */}
          <div className="flex-1 flex flex-col md:flex-row gap-8 items-start z-10">
             {/* Avatar with white border */}
            <div className="w-70 h-70 rounded-full overflow-hidden border-4 border-white shadow-sm flex-shrink-0 mx-auto md:mx-0">
              <img src={TUTOR_DATA.image} alt={TUTOR_DATA.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="space-y-4 text-center md:text-left">
              <h1 className="text-8xl md:text-5xl font-bold text-slate-900">{TUTOR_DATA.name}</h1>
              
              {/* Ratings & Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                {TUTOR_DATA.isTopRated && (
                  <span className="px-3 py-1 bg-[#C5BAFF] text-white text-sm font-semibold rounded-full">
                    Top Rated
                  </span>
                )}
                <div className="flex items-center gap-1 font-semibold">
                  <Star fill="#FBBF24" className="text-amber-400" size={20} />
                  <span>{TUTOR_DATA.rating}/5</span>
                  <span className="text-slate-500 font-normal">({TUTOR_DATA.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-700 text-2xl leading-relaxed max-w-2xl">
                {TUTOR_DATA.description}
              </p>
            </div>
          </div>

          {/* Right Side: Floating Booking Card */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-purple-100/50 w-full md:w-auto md:min-w-[320px] flex-shrink-0 z-10 mx-auto">
            <div className="flex justify-between mb-8 gap-8">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Hourly Rate:</p>
                <p className="text-4xl font-bold text-slate-900">${TUTOR_DATA.hourlyRate}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-sm font-medium mb-1">Tier Level:</p>
                <p className="text-xl font-bold text-slate-900">{TUTOR_DATA.tierLevel}</p>
              </div>
            </div>
            
            <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold text-lg shadow-md hover:opacity-95 hover:shadow-lg transition-all flex items-center justify-center gap-2" onClick={() => navigate(`/booksession`)}>
              <Calendar size={20} />
              Book a Session
            </button>
          </div>

          {/* Subtle background decorative element (optional, based on image's bottom right corner) */}
          <div className="absolute -bottom-10 -right-10 text-white opacity-20">
             <Star size={100} fill="currentColor" />
          </div>
        </div>

        {/* --- Content Section (Skills & Certifications) --- */}
        <div className="mt-16 px-4 md:px-12 space-y-16">
          
          {/* Skills Section */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-3">
              {TUTOR_DATA.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-5 py-2.5 bg-[#E8F9FF] text-slate-700 text-sm md:text-base font-medium rounded-full border border-[#C4D9FF]/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Certifications Section */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Certifications</h2>
            <ul className="space-y-4">
              {TUTOR_DATA.certifications.map((cert, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-700 text-lg">
                  {/* Using a check circle icon with outline style */}
                  <CheckCircle2 className="text-slate-400 flex-shrink-0" size={24} strokeWidth={1.5} />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

      </div>
    </div>
    </>
  );
}