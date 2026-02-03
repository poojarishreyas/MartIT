import Header from "./Header";
const TILE_COLORS = [
  "bg-[#F5F7FA]",
  "bg-[#FFF7ED]",
  "bg-[#F0FDF4]",
  "bg-[#EEF2FF]",
];

const categories = [
  { id: 1, name: "Monitor", image: "/monitor.webp" },
  { id: 2, name: "Smartphones", image: "/smartphone.webp" },
  { id: 3, name: "Audios", image: "/headphone.webp" },
  { id: 4, name: "Laptop", image: "/laptop.webp" },
  { id: 5, name: "Speakers", image: "/Speakers.webp" },
  { id: 6, name: "Cabinents", image: "/Cabinents.webp" },
  { id: 7, name: "Graphics Card", image: "/graphics_card.webp" },
  { id: 8, name: "Processors", image: "/processors.webp" },
  { id: 1, name: "Monitor", image: "/monitor.webp" },
  { id: 2, name: "Smartphones", image: "/smartphone.webp" },
  { id: 3, name: "Audios", image: "/headphone.webp" },
  { id: 4, name: "Laptop", image: "/laptop.webp" },
  { id: 5, name: "Speakers", image: "/Speakers.webp" },
  { id: 6, name: "Cabinents", image: "/Cabinents.webp" },
  { id: 7, name: "Graphics Card", image: "/graphics_card.webp" },
  { id: 8, name: "Processors", image: "/processors.webp" },
  { id: 1, name: "Monitor", image: "/monitor.webp" },
  { id: 2, name: "Smartphones", image: "/smartphone.webp" },
  { id: 3, name: "Audios", image: "/headphone.webp" },
  { id: 4, name: "Laptop", image: "/laptop.webp" },
  { id: 5, name: "Speakers", image: "/Speakers.webp" },
  { id: 6, name: "Cabinents", image: "/Cabinents.webp" },
  { id: 7, name: "Graphics Card", image: "/graphics_card.webp" },
  { id: 8, name: "Processors", image: "/processors.webp" },
  { id: 1, name: "Monitor", image: "/monitor.webp" },
  { id: 2, name: "Smartphones", image: "/smartphone.webp" },
  { id: 3, name: "Audios", image: "/headphone.webp" },
  { id: 4, name: "Laptop", image: "/laptop.webp" },
  { id: 5, name: "Speakers", image: "/Speakers.webp" },
  { id: 6, name: "Cabinents", image: "/Cabinents.webp" },
  { id: 7, name: "Graphics Card", image: "/graphics_card.webp" },
  { id: 8, name: "Processors", image: "/processors.webp" },
  { id: 1, name: "Monitor", image: "/monitor.webp" },
  { id: 2, name: "Smartphones", image: "/smartphone.webp" },
  { id: 3, name: "Audios", image: "/headphone.webp" },
  { id: 4, name: "Laptop", image: "/laptop.webp" },
  { id: 5, name: "Speakers", image: "/Speakers.webp" },
  { id: 6, name: "Cabinents", image: "/Cabinents.webp" },
  { id: 7, name: "Graphics Card", image: "/graphics_card.webp" },
  { id: 8, name: "Processors", image: "/processors.webp" },
  { id: 1, name: "Monitor", image: "/monitor.webp" },
  { id: 2, name: "Smartphones", image: "/smartphone.webp" },
  { id: 3, name: "Audios", image: "/headphone.webp" },
  { id: 4, name: "Laptop", image: "/laptop.webp" },
  { id: 5, name: "Speakers", image: "/Speakers.webp" },
  { id: 6, name: "Cabinents", image: "/Cabinents.webp" },
  { id: 7, name: "Graphics Card", image: "/graphics_card.webp" },
  { id: 8, name: "Processors", image: "/processors.webp" },
];

const Category = () => {
  return (

    <div className="bg-white">
      <Header />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`
              h-[420px]
              flex flex-col items-center justify-center
              border border-gray-400
              ${TILE_COLORS[category.id % TILE_COLORS.length]}
              hover:brightness-95 transition
              cursor-pointer
            `}
          >
            <img
              src={category.image}
              alt={category.name}
              className="h-[220px] object-contain transition-transform duration-300 hover:scale-105"
            />

            <h3 className="mt-8 text-sm font-semibold tracking-wide uppercase">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
