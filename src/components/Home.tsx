import Header from "./Header";
import { ShoppingCart, Star, ArrowRight, Heart, Eye, Menu, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import "/monitor.webp"
import ScrollCanvas from "./ScrollCanvas";
// --- Types ---
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number
  vendor: string;
  badge?: string;
  image: string;
}

interface Category {
  id: number;
  name: string;
  items: number;
  image: string;
}

// --- Mock Data ---
const categories: Category[] = [
  { id: 1, name: "Monitor", image: "/monitor.webp" },
  { id: 2, name: "Smartphones",image: "/smartphone.webp" },
  { id: 3, name: "Audios",image: "/headphone.webp" },
  { id: 4, name: "Laptop",  image: "/laptop.webp" },
  { id: 5, name: "Speakers", image: "/Speakers.webp" },
  { id: 6, name: "Cabinents", image: "/Cabinents.webp" },
  { id: 7, name: "Graphics card", image: "/graphics_card.webp" },
  { id: 8, name: "Processors", image: "/processors.webp" },
  
];

const products: Product[] = [
  { id: 1, name: "Asus tuf", category: "laptops", price: 20.50, oldPrice: 22.55, rating: 4.5, vendor: "Nature", badge: "Hot", image: "/asus_tuf.webp" },
  { id: 2, name: "Mac", category: "laptop", price: 15.00, oldPrice: 18.00, rating: 4.0, vendor: "Farm", badge: "Sale", image: "/mac.webp" },
  { id: 3, name: "Lenov Loq", category: "laptop", price: 12.99, rating: 5.0, vendor: "TeaCo", image: "/loq.webp" },
  { id: 4, name: "Dell", category: "laptop", price: 8.50, oldPrice: 10.00, rating: 3.5, vendor: "CoolFreeze", badge: "-15%", image: "dell.webp" },
];

// --- Components ---

const Badge = ({ children, color = "bg-[#C5BAFF]" }: { children: React.ReactNode, color?: string }) => (
  <span className={`${color} text-white text-xs font-bold px-3 py-1 rounded-tl-xl rounded-br-xl shadow-sm z-10 absolute top-0 left-0`}>
    {children}
  </span>
);

const SectionHeader = ({ title, links }: { title: string, links?: string[] }) => (
  <div className="flex flex-col md:flex-row justify-between items-end mb-8">
    <h2 className="text-3xl font-bold text-slate-800 relative">
      {title}
      <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#C5BAFF] rounded-full"></span>
    </h2>
    {links && (
      <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500 mt-4 md:mt-0">
        {links.map((link, i) => (
          <a key={i} href="#" className="hover:text-[#C5BAFF] transition-colors cursor-pointer">{link}</a>
        ))}
      </div>
    )}
  </div>
);

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group bg-white border border-[#E8F9FF] hover:border-[#C4D9FF] hover:shadow-lg rounded-2xl p-4 transition-all duration-300 relative overflow-hidden">
      {product.badge && <Badge>{product.badge}</Badge>}
      
      {/* Image Area */}
      <div className="relative h-48 w-full flex items-center justify-center bg-[#FBFBFB] rounded-xl mb-4 overflow-hidden">
        <img src={product.image} alt={product.name} className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-500" />
        
        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/30 backdrop-blur-sm">
          <button className="p-2 bg-white text-[#C5BAFF] hover:bg-[#C5BAFF] hover:text-white rounded-full shadow-md transition-colors"><Heart size={18} /></button>
          <button className="p-2 bg-white text-[#C5BAFF] hover:bg-[#C5BAFF] hover:text-white rounded-full shadow-md transition-colors"><Eye size={18} /></button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-1">
        <p className="text-xs text-slate-400">{product.category}</p>
        <h3 className="font-bold text-slate-800 text-lg leading-tight truncate">{product.name}</h3>
        
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
          ))}
          <span className="text-xs text-slate-400 ml-1">({product.rating})</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <span className="text-[#C5BAFF] font-bold text-xl">${product.price.toFixed(2)}</span>
            {product.oldPrice && <span className="text-xs text-slate-400 line-through">${product.oldPrice.toFixed(2)}</span>}
          </div>
          <button className="flex items-center gap-2 bg-[#E8F9FF] text-[#C5BAFF] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#C5BAFF] hover:text-white transition-all">
            Add <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const BannerCard = ({ title, subtitle, image, bgClass }: { title: string, subtitle: string, image: string, bgClass: string }) => (
  <div className={`relative rounded-2xl overflow-hidden ${bgClass} h-64 flex items-center p-8 transition-transform hover:-translate-y-1 duration-300`}>
    <div className="z-10 w-1/2">
      <h3 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">{title}</h3>
      <p className="text-slate-500 mb-6">{subtitle}</p>
      <button className="px-5 py-2 bg-[#C5BAFF] text-white text-sm font-bold rounded-lg shadow-md hover:bg-[#b0a2ff] transition-colors flex items-center gap-2">
        Shop Now <ArrowRight size={16} />
      </button>
    </div>
    <div className="absolute right-0 bottom-0 w-1/2 h-full">
        {/* Abstract shapes for aesthetics instead of real photos to fit the theme */}
       <div className="w-full h-full opacity-50 translate-x-10 translate-y-10 rounded-full bg-gradient-to-tl from-white to-transparent"></div>
       <img src={image} alt="banner" className="absolute bottom-0 right-0 h-5/6 object-contain drop-shadow-lg" />
    </div>
  </div>
);
const Home=()=>{
    return(
        <>
        <Header/>
         <div className="min-h-screen font-sans bg-[#FBFBFB] text-slate-700">
      
      {/* Top Nav (Simplified) */}


      <main className="container mx-auto px-4 py-8 space-y-16">
        
        {/* Section 1: Featured Categories */}
<section>
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold">Featured Categories</h2>
    <div className="flex gap-2">
      <button className="p-2 bg-[#E8F9FF] rounded-full hover:bg-[#C4D9FF] text-slate-600">
        <ChevronLeft size={16} />
      </button>
      <button className="p-2 bg-[#E8F9FF] rounded-full hover:bg-[#C4D9FF] text-slate-600">
        <ChevronRight size={16} />
      </button>
    </div>
  </div>

  <div className="flex gap-6 overflow-x-auto overflow-y-hidden pb-4 no-scrollbar">
    {categories.map((cat) => (
      <div
        key={cat.id}
        className="
          min-w-[220px] max-w-[220px] h-[260px]
          bg-[#E8F9FF]
          hover:bg-white hover:border-[#C5BAFF]
          border border-transparent
          rounded-xl
          p-4
          flex flex-col items-center justify-between
          text-center
          cursor-pointer
          transition-all duration-300
          shadow-sm hover:shadow-md
          group
        "
      >
        {/* Image wrapper (same size for all cards) */}
        <div className="w-full h-[170px] flex items-center justify-center">
          <img
            src={cat.image}
            alt={cat.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Title */}
        <h4 className="font-bold text-slate-700 text-lg group-hover:text-[#C5BAFF] transition-colors">
          {cat.name}
        </h4>
      </div>
    ))}
  </div>
</section>


        {/* Section 2: Banners */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="md:col-span-2">
    <BannerCard 
      title="Upgrade Your PC" 
      subtitle="From bottleneck to beast — upgrade with confidence" 
      bgClass="bg-[#F3F0FF]" /* Extremely light purple */
      image="https://placehold.co/200x200/C5BAFF/ffffff?text=PC"
    />
  </div>

  <BannerCard 
    title="build Your Studio" 
    subtitle="Professional gear for creators, producers, and streamers" 
    bgClass="bg-[#E8F9FF]" 
    image="https://placehold.co/200x200/C4D9FF/ffffff?text=STUDIO"
  />
</section>


        {/* Section 3: Popular Products */}
        <section>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
             {products.map(p => <ProductCard key={p.id} product={p} />)}
             {products.map(p => <ProductCard key={`dup-${p.id}`} product={{...p, id: p.id + 10}} />)}
          </div>
        </section>

        {/* ScrollCanvas Section - Full Experience */}
        <SectionHeader title="Latest release" />
        <section className="w-full">
           <ScrollCanvas/>
        </section>

        {/* Section 4: Daily Best Sells */}
        <SectionHeader title="Dals f you" />
        <section>
           
              {/* Products Slider/Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.slice(0, 3).map(p => (
                   <div key={p.id} className="border border-[#E8F9FF] rounded-2xl p-4 bg-white relative hover:shadow-lg transition-shadow">
                      <Badge color="bg-slate-800">Best Sell</Badge>
                      <div className="flex gap-4">
                         <img src={p.image} className="w-24 h-24 object-contain bg-[#FBFBFB] rounded-lg" alt={p.name} />
                         <div className="flex flex-col justify-center">
                            <h4 className="font-bold text-slate-800">{p.name}</h4>
                            <div className="flex items-center gap-1 my-1">
                               <Star size={12} className="fill-yellow-400 text-yellow-400"/>
                               <span className="text-xs text-slate-400">4.5</span>
                            </div>
                            <span className="text-[#C5BAFF] font-bold">${p.price}</span>
                         </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                         <div className="h-1.5 w-full bg-[#E8F9FF] rounded-full mb-2 overflow-hidden">
                           <div className="h-full bg-[#C5BAFF] w-3/4 rounded-full"></div>
                         </div>
                         <p className="text-xs text-slate-400">Sold: 90/120</p>
                      </div>
                   </div>
                ))}
              </div>
        </section>   

      </main>
      

      
    </div>
    </>
        
    )
} 
export default Home