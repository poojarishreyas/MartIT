import React from 'react';
import { Search, Star, Bell, ChevronRight, Cpu, Code2, Layout, Database, MessageSquare } from 'lucide-react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

// --- Types & Mock Data ---

type Tutor = {
  id: number;
  name: string;
  role: string;
  rating: number;
  rate: string;
  image: string;
  tags?: string[];
  stack?: React.ReactNode[];
};

const TOP_TUTORS: Tutor[] = [
  { id: 1, name: "Sarah Jenkins", role: "Physics Expert", rating: 4.9, rate: "$30/hr", image: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "David Chen", role: "Math Olympiad", rating: 4.9, rate: "$45/hr", image: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Elena Rodriguez", role: "Senior Dev", rating: 5.0, rate: "$60/hr", image: "https://i.pravatar.cc/150?u=3" },
  { id: 1, name: "Sarah Jenkins", role: "Physics Expert", rating: 4.9, rate: "$30/hr", image: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "David Chen", role: "Math Olympiad", rating: 4.9, rate: "$45/hr", image: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Elena Rodriguez", role: "Senior Dev", rating: 5.0, rate: "$60/hr", image: "https://i.pravatar.cc/150?u=3" },
  
];

const HARDWARE_TUTORS: Tutor[] = [
  { id: 4, name: "Mike Ross", role: "Embedded Systems", rating: 4.8, rate: "$40/hr", image: "https://i.pravatar.cc/150?u=4", tags: ["Arduino", "PCB Design"] },
  { id: 5, name: "Jessica Suits", role: "IoT Specialist", rating: 4.7, rate: "$35/hr", image: "https://i.pravatar.cc/150?u=5", tags: ["Raspberry Pi", "Sensors"] },
  { id: 6, name: "Harvey S.", role: "Circuit Analysis", rating: 4.9, rate: "$50/hr", image: "https://i.pravatar.cc/150?u=6", tags: ["Verilog", "FPGA"] },
  { id: 7, name: "Louis Litt", role: "Robotics", rating: 4.6, rate: "$30/hr", image: "https://i.pravatar.cc/150?u=7", tags: ["ROS", "C++"] },
{ id: 4, name: "Mike Ross", role: "Embedded Systems", rating: 4.8, rate: "$40/hr", image: "https://i.pravatar.cc/150?u=4", tags: ["Arduino", "PCB Design"] },
  { id: 5, name: "Jessica Suits", role: "IoT Specialist", rating: 4.7, rate: "$35/hr", image: "https://i.pravatar.cc/150?u=5", tags: ["Raspberry Pi", "Sensors"] },
  { id: 6, name: "Harvey S.", role: "Circuit Analysis", rating: 4.9, rate: "$50/hr", image: "https://i.pravatar.cc/150?u=6", tags: ["Verilog", "FPGA"] },
  { id: 7, name: "Louis Litt", role: "Robotics", rating: 4.6, rate: "$30/hr", image: "https://i.pravatar.cc/150?u=7", tags: ["ROS", "C++"] },

];

const SOFTWARE_TUTORS: Tutor[] = [
  { id: 8, name: "Rachel Zane", role: "Full Stack Dev", rating: 4.9, rate: "$55/hr", image: "https://i.pravatar.cc/150?u=8", stack: [<Code2 size={16} />, <Database size={16} />] },
  { id: 9, name: "Donna Paulsen", role: "UI/UX Design", rating: 5.0, rate: "$65/hr", image: "https://i.pravatar.cc/150?u=9", stack: [<Layout size={16} />, <MessageSquare size={16} />] },
  { id: 10, name: "Alex Williams", role: "Backend Arch", rating: 4.8, rate: "$60/hr", image: "https://i.pravatar.cc/150?u=10", stack: [<Database size={16} />, <Cpu size={16} />] },
  { id: 8, name: "Rachel Zane", role: "Full Stack Dev", rating: 4.9, rate: "$55/hr", image: "https://i.pravatar.cc/150?u=8", stack: [<Code2 size={16} />, <Database size={16} />] },
  { id: 9, name: "Donna Paulsen", role: "UI/UX Design", rating: 5.0, rate: "$65/hr", image: "https://i.pravatar.cc/150?u=9", stack: [<Layout size={16} />, <MessageSquare size={16} />] },
  { id: 10, name: "Alex Williams", role: "Backend Arch", rating: 4.8, rate: "$60/hr", image: "https://i.pravatar.cc/150?u=10", stack: [<Database size={16} />, <Cpu size={16} />] },
];

const TAGS = ["All", "Windows", "Mac", "Linux", "Drivers", "display", "Heating issue"];

// --- Component ---

export default function Tutor() {
  const navigate = useNavigate();
  return (
    <>
    <Header/>
    <div className="min-h-screen bg-[#FBFBFB] font-sans text-slate-800">
      
      {/* Centered Container for Balanced Spacing */}
      <div className="w-[90%] mx-auto px-6 py-8 space-y-12">

        {/* 1. Header & Search */}
        <header className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="relative w-full max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search for tutors, skills, or subjects..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-[#C4D9FF] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C5BAFF] transition-all"
            />
          </div>
          

        </header>

        {/* 2. Hero & Filters */}
        <section className="space-y-6">
          <h1 className="flex justify-center text-7xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Find your perfect Tutor.
          </h1>
          <div className="flex flex-wrap gap-3">
            {TAGS.map((tag, i) => (
              <button 
                key={tag} 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  i === 2 
                  ? 'bg-[#C5BAFF] text-white shadow-md' 
                  : 'bg-[#E8F9FF] text-slate-600 hover:bg-[#C4D9FF] hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* 3. Top Tutors Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Top Tutors</h2>
            <button className="text-[#8B80F9] text-sm font-semibold flex items-center hover:underline">
              See All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOP_TUTORS.map((tutor) => (
              <div key={tutor.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative group hover:shadow-md transition-all">
                {/* Badge */}
                <div className="absolute top-4 right-4 bg-[#E0D9FF] text-[#6B5CE7] text-xs font-bold px-3 py-1 rounded-full">
                  Top Rated
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <img src={tutor.image} alt={tutor.name} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{tutor.name}</h3>
                    <div className="flex items-center gap-1 text-amber-400 text-sm font-medium">
                      <Star size={14} fill="currentColor" />
                      <span>{tutor.rating}</span>
                      <span className="text-slate-400 font-normal ml-2">| {tutor.rate}</span>
                    </div>
                  </div>
                </div>
<button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-300 to-purple-500 text-white font-semibold
                   hover:bg-[#B6AAFF] active:scale-[0.98]
                   transition-all shadow-sm hover:shadow-md"
                   onClick={() => navigate(`/tutorprofile`)}>
                    
  View Profile
</button>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* 4. Hardware Tutors (Grid) */}
 <section>
            <h2 className="text-xl font-bold text-slate-800 mb-6">Hardware Related Tutors</h2>
            <div className="space-y-4">
              {SOFTWARE_TUTORS.map((tutor) => (
                <div key={tutor.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-between hover:border-[#C4D9FF] hover:shadow-sm transition-all">
                  <div className="flex items-center gap-4">
                    <img src={tutor.image} alt={tutor.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-bold text-slate-900">{tutor.name}</h3>
                      <p className="text-sm text-slate-500">{tutor.role}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-2">
                    {tutor.stack?.map((icon, i) => (
                      <div key={i} className="p-2 bg-[#E8F9FF] text-[#6B5CE7] rounded-full">
                        {icon}
                      </div>
                    ))}
                  </div>

                  <button className="px-5 py-2 rounded-lg border border-[#C5BAFF] text-[#6B5CE7] text-sm font-semibold hover:bg-[#FBFBFB] transition-colors" onClick={() => navigate(`/tutorprofile`)}>
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Software Tutors (List) */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-6">Software Related Tutors</h2>
            <div className="space-y-4">
              {SOFTWARE_TUTORS.map((tutor) => (
                <div key={tutor.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-between hover:border-[#C4D9FF] hover:shadow-sm transition-all">
                  <div className="flex items-center gap-4">
                    <img src={tutor.image} alt={tutor.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-bold text-slate-900">{tutor.name}</h3>
                      <p className="text-sm text-slate-500">{tutor.role}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-2">
                    {tutor.stack?.map((icon, i) => (
                      <div key={i} className="p-2 bg-[#E8F9FF] text-[#6B5CE7] rounded-full">
                        {icon}
                      </div>
                    ))}
                  </div>

                  <button className="px-5 py-2 rounded-lg border border-[#C5BAFF] text-[#6B5CE7] text-sm font-semibold hover:bg-[#FBFBFB] transition-colors" onClick={() => navigate(`/tutorprofile`)}>
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>
    </div>
    </>
  );
}