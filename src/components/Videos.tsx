import Header from "./Header";

// 1️⃣ Color palette (4 colors)
const CARD_COLORS = [
  "bg-[#F5F7FA]",
  "bg-[#FFF7ED]",
  "bg-[#F0FDF4]",
  "bg-[#EEF2FF]",
];

// 2️⃣ Stable random color generator
const getCardColor = (index: number) => {
  const hash = (index * 9301 + 49297) % 233280;
  return CARD_COLORS[hash % CARD_COLORS.length];
};

const video_data = [
  { id: "3rGFQN7ZIeU", title: "Video 1", description: "Description 1" },
  { id: "3rGFQN7ZIeU", title: "Video 2", description: "Description 2" },
  { id: "3rGFQN7ZIeU", title: "Video 3", description: "Description 3" },
  { id: "3rGFQN7ZIeU", title: "Video 4", description: "Description 4" },
  { id: "3rGFQN7ZIeU", title: "Video 5", description: "Description 5" },
  { id: "3rGFQN7ZIeU", title: "Video 6", description: "Description 6" },
  { id: "3rGFQN7ZIeU", title: "Video 7", description: "Description 7" },
  { id: "3rGFQN7ZIeU", title: "Video 8", description: "Description 8" },
  { id: "3rGFQN7ZIeU", title: "Video 1", description: "Description 1" },
  { id: "3rGFQN7ZIeU", title: "Video 2", description: "Description 2" },
  { id: "3rGFQN7ZIeU", title: "Video 3", description: "Description 3" },
  { id: "3rGFQN7ZIeU", title: "Video 4", description: "Description 4" },
  { id: "3rGFQN7ZIeU", title: "Video 5", description: "Description 5" },
  { id: "3rGFQN7ZIeU", title: "Video 6", description: "Description 6" },
  { id: "3rGFQN7ZIeU", title: "Video 7", description: "Description 7" },
  { id: "3rGFQN7ZIeU", title: "Video 8", description: "Description 8" },
];

const Video = () => {
  return (
    <>
      <Header />

      <div className="w-screen px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {video_data.map((video, index) => (
            <div
              key={index}
              className={`rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition
                ${getCardColor(index)}`}
            >
              {/* Video */}
              <div className="relative w-full aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Video;
