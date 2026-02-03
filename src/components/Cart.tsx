import React, { useState, type DragEvent } from "react";
import {
  Trash2,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  GripVertical,
} from "lucide-react";
import Header from "./Header";

type CartItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  image: string;
  savings?: number;
};

type WishlistItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
};

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "AURA PRO LAPTOP",
    description: "Intel i9 | 32GB RAM | RTX 4090",
    price: 159900,
    oldPrice: 189900,
    savings: 30000,
    quantity: 1,
    image: "/laptop.webp",
  },
  {
    id: 2,
    name: "QUANTUM SMARTPHONE",
    description: "256GB | Cosmic Purple",
    price: 99900,
    quantity: 1,
    image: "/iphone.webp",
  },
  {
    id: 3,
    name: "SONIC HEADPHONES",
    description: "Wireless | ANC | Black",
    price: 55800,
    oldPrice: 69800,
    savings: 14000,
    quantity: 2,
    image: "/headphone.webp",
  },
    {
    id: 1,
    name: "AURA PRO LAPTOP",
    description: "Intel i9 | 32GB RAM | RTX 4090",
    price: 159900,
    oldPrice: 189900,
    savings: 30000,
    quantity: 1,
    image: "/laptop.webp",
  },
  {
    id: 2,
    name: "QUANTUM SMARTPHONE",
    description: "256GB | Cosmic Purple",
    price: 99900,
    quantity: 1,
    image: "/iphone.webp",
  },
  {
    id: 3,
    name: "SONIC HEADPHONES",
    description: "Wireless | ANC | Black",
    price: 55800,
    oldPrice: 69800,
    savings: 14000,
    quantity: 2,
    image: "/headphone.webp",
  },
    {
    id: 1,
    name: "AURA PRO LAPTOP",
    description: "Intel i9 | 32GB RAM | RTX 4090",
    price: 159900,
    oldPrice: 189900,
    savings: 30000,
    quantity: 1,
    image: "/laptop.webp",
  },

  
];

const initialWishlist: WishlistItem[] = [
  {
    id: 1,
    name: "HYPER GPU RTX 5000",
    price: 149900,
    image: "/graphics_card.webp",
  },
  {
    id: 2,
    name: "ELITE MECHANICAL KEYBOARD",
    price: 15900,
    image: "/mac.webp",
  },
  {
    id: 3,
    name: "QUANTUM MOUSE PRO",
    price: 7900,
    image: "/Speakers.webp",
  },
    {
    id: 4,
    name: "HYPER GPU RTX 5000",
    price: 149900,
    image: "/graphics_card.webp",
  },
  {
    id: 5,
    name: "ELITE MECHANICAL KEYBOARD",
    price: 15900,
    image: "/mac.webp",
  },
  {
    id: 6,
    name: "QUANTUM MOUSE PRO",
    price: 7900,
    image: "/Speakers.webp",
  },
    {
    id: 7,
    name: "HYPER GPU RTX 5000",
    price: 149900,
    image: "/graphics_card.webp",
  },
  {
    id: 8,
    name: "ELITE MECHANICAL KEYBOARD",
    price: 15900,
    image: "/mac.webp",
  },
  {
    id: 9, 
    name: "QUANTUM MOUSE PRO",
    price: 7900,
    image: "/Speakers.webp",
  },
    {
    id: 10,
    name: "HYPER GPU RTX 5000",
    price: 149900,
    image: "/graphics_card.webp",
  },
  {
    id: 11,
    name: "ELITE MECHANICAL KEYBOARD",
    price: 15900,
    image: "/mac.webp",
  },
  {
    id: 12,
    name: "QUANTUM MOUSE PRO",
    price: 7900,
    image: "/Speakers.webp",
  },
];

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(initialWishlist);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedItem, setDraggedItem] = useState<WishlistItem | null>(null);

  // Calculate totals dynamically
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 500;
  const total = subtotal + delivery;
  const totalSavings = cartItems.reduce((sum, item) => sum + (item.savings || 0) * item.quantity, 0);

  // Drag handlers for wishlist items
  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: WishlistItem) => {
    setDraggedItem(item);
    e.dataTransfer.setData("text/plain", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setIsDragOver(false);
  };

  // Drop zone handlers for cart
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const data = e.dataTransfer.getData("text/plain");
      const wishlistItem: WishlistItem = JSON.parse(data);
      
      // Check if item already exists in cart
      const existingItem = cartItems.find((item) => item.name === wishlistItem.name);
      
      if (existingItem) {
        // Increase quantity if already in cart
        setCartItems((items) =>
          items.map((item) =>
            item.name === wishlistItem.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        // Add new item to cart
        const newCartItem: CartItem = {
          id: Date.now(),
          name: wishlistItem.name,
          description: wishlistItem.description || "",
          price: wishlistItem.price,
          quantity: 1,
          image: wishlistItem.image,
        };
        setCartItems((items) => [...items, newCartItem]);
      }

      // Remove from wishlist
      setWishlistItems((items) => items.filter((item) => item.id !== wishlistItem.id));
    } catch (error) {
      console.error("Failed to parse dropped item:", error);
    }
  };

  // Move item from wishlist to cart (button click)
  const moveToCart = (wishlistItem: WishlistItem) => {
    const existingItem = cartItems.find((item) => item.name === wishlistItem.name);
    
    if (existingItem) {
      setCartItems((items) =>
        items.map((item) =>
          item.name === wishlistItem.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const newCartItem: CartItem = {
        id: Date.now(),
        name: wishlistItem.name,
        description: wishlistItem.description || "",
        price: wishlistItem.price,
        quantity: 1,
        image: wishlistItem.image,
      };
      setCartItems((items) => [...items, newCartItem]);
    }
    
    setWishlistItems((items) => items.filter((item) => item.id !== wishlistItem.id));
  };

  // Update quantity
  const updateQuantity = (itemId: number, delta: number) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Remove from cart
  const removeFromCart = (itemId: number) => {
    setCartItems((items) => items.filter((item) => item.id !== itemId));
  };

  // Save for later (move to wishlist)
  const saveForLater = (cartItem: CartItem) => {
    const newWishlistItem: WishlistItem = {
      id: Date.now(),
      name: cartItem.name,
      price: cartItem.price,
      image: cartItem.image,
      description: cartItem.description,
    };
    setWishlistItems((items) => [...items, newWishlistItem]);
    removeFromCart(cartItem.id);
  };

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gradient-to-br from-[#f6f7f9] to-[#f1efe9] p-8">
      {/* Header */}
      
      <h1 className="text-4xl font-semibold mb-2">Your Cart</h1>
      <p className="flex items-center gap-2 text-gray-600 mb-4">
        <ShoppingCart size={18} />
        Cart Items (3)
      </p>

      {/* Savings Banner */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-cyan-100 to-blue-100 px-6 py-3 text-green-700 font-medium">
        🎉 You're saving ₹{totalSavings.toLocaleString()} on this order!
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items - Drop Zone */}
        <div 
          className={`lg:col-span-2 space-y-6 p-4 rounded-2xl transition-all duration-300 ${
            isDragOver 
              ? "bg-purple-100 border-2 border-dashed border-purple-400 scale-[1.01]" 
              : "border-2 border-transparent"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drop indicator */}
          {isDragOver && (
            <div className="flex items-center justify-center gap-2 py-4 text-purple-600 font-medium animate-pulse">
              <ShoppingCart size={24} />
              <span>Drop here to add to cart</span>
            </div>
          )}
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm p-6 flex gap-6"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 object-contain rounded-lg bg-gray-50"
              />

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-sm text-gray-500">
                      {item.description}
                    </p>
                  </div>
                  <Trash2 
                    className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors" 
                    onClick={() => removeFromCart(item.id)}
                  />
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xl font-semibold">
                    ₹{item.price.toLocaleString()}
                  </span>
                  {item.oldPrice && (
                    <span className="line-through text-gray-400">
                      ₹{item.oldPrice.toLocaleString()}
                    </span>
                  )}
                  {item.savings && (
                    <span className="text-green-600 text-sm">
                      Save ₹{item.savings.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {/* Quantity */}
                  <div className="flex items-center gap-2 bg-purple-100 rounded-full px-3 py-1">
                    <Minus 
                      size={16} 
                      className="cursor-pointer hover:text-purple-600 transition-colors"
                      onClick={() => updateQuantity(item.id, -1)}
                    />
                    <span className="font-medium">{item.quantity}</span>
                    <Plus 
                      size={16} 
                      className="cursor-pointer hover:text-purple-600 transition-colors"
                      onClick={() => updateQuantity(item.id, 1)}
                    />
                  </div>

                  <button 
                    className="flex items-center gap-2 text-purple-500 hover:text-purple-700 transition-colors"
                    onClick={() => saveForLater(item)}
                  >
                    <Heart size={18} />
                    Save for Later
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty Cart State */}
          {cartItems.length === 0 && !isDragOver && (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <ShoppingCart size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-gray-500">Drag items from your wishlist or continue shopping</p>
            </div>
          )}
        </div>

        {/* Wishlist */}
        <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-3xl font-semibold mb-4">
            <Heart size={40} />
            Your Wishlist
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            💡 Drag items to cart or click "Move to Cart"
          </p>

          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
                className={`bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                  draggedItem?.id === item.id ? "opacity-50 scale-95" : ""
                }`}
              >
                <GripVertical size={20} className="text-gray-400 flex-shrink-0" />
                
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-contain pointer-events-none"
                />

                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="font-semibold">
                    ₹{item.price.toLocaleString()}
                  </p>
                </div>

                <button 
                  className="bg-gradient-to-r from-purple-400 to-purple-600 text-white text-sm px-4 py-2 rounded-full hover:from-purple-500 hover:to-purple-700 transition-all"
                  onClick={() => moveToCart(item)}
                >
                  Move to Cart
                </button>
              </div>
            ))}

            {wishlistItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Heart size={40} className="mx-auto mb-2 opacity-50" />
                <p>Your wishlist is empty</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 mt-10 bg-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex gap-8 text-sm">
          <div>
            <p className="text-gray-500">Subtotal</p>
            <p className="font-semibold">₹{subtotal.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Delivery</p>
            <p className="font-semibold text-green-600">
              ₹{delivery.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Total</p>
            <p className="text-xl font-bold">
              ₹{total.toLocaleString()}
            </p>
          </div>
        </div>

        <button className="bg-gradient-to-r from-purple-400 to-purple-600 text-white px-10 py-4 rounded-full text-lg shadow-lg hover:scale-[1.02] transition">
          Buy Now
        </button>
      </div>
    </div>
    </>
  );
};

export default CartPage;
