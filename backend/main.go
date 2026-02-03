package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"mart-it-backend/internal/auth"
	"mart-it-backend/internal/cart"
	"mart-it-backend/internal/middleware"
	"mart-it-backend/internal/models"
	"mart-it-backend/internal/product"
	"mart-it-backend/internal/repair"
	"mart-it-backend/internal/seller"
	"mart-it-backend/internal/webrtc" // Import WebRTC
	"mart-it-backend/pkg/database"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	// 1. Load Environment Variables
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found")
	}

	// 2. Connect to Database
	database.Connect()

	// 3. Run Database Migrations
	log.Println("Running Database Migrations...")
	err := database.DB.AutoMigrate(
		&models.User{},
		&models.Seller{},
		&models.Product{},
		&models.Inventory{},
		&models.Cart{},
		&models.CartItem{},
		&models.Technician{},
		&models.RepairRequest{},
	)
	if err != nil {
		log.Fatal("Migration failed: ", err)
	}
	log.Println("✅ Database Migration Complete: All tables ready")

	// Initialize WebRTC Hub
	hub := webrtc.NewHub()
	go hub.Run()

	// 4. Router Setup
	r := chi.NewRouter()

	// 5. Global Middleware
	r.Use(chiMiddleware.Logger)
	r.Use(chiMiddleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	// 6. Routes
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Mart IT Backend is Running"))
	})

	// WebSocket Route
	r.Get("/ws", func(w http.ResponseWriter, r *http.Request) {
		webrtc.ServeWs(hub, w, r)
	})

	// --- Auth Routes ---
	r.Route("/api/auth", func(r chi.Router) {
		r.Post("/register", auth.Register)
		r.Post("/login", auth.Login)
	})

	// --- Public Product Routes ---
	r.Route("/api/public", func(r chi.Router) {
		r.Get("/products", product.GetAllProducts)
		r.Get("/products/{id}", product.GetProductByID)
	})

	// --- Seller Routes ---
	r.Route("/api/seller", func(r chi.Router) {
		r.Use(middleware.Auth)
		r.Post("/register", seller.RegisterSeller)
		r.Get("/profile", seller.GetProfile)
		r.Post("/products", product.CreateProduct)
		r.Get("/products", product.GetSellerProducts)
		r.Delete("/products/{id}", product.DeleteProduct)
	})

	// --- Cart Routes ---
	r.Route("/api/cart", func(r chi.Router) {
		r.Use(middleware.Auth)
		r.Get("/", cart.GetCart)
		r.Post("/", cart.AddItem)
		r.Delete("/{id}", cart.RemoveItem)
	})

	// --- Repair Routes ---
	r.Route("/api/repair", func(r chi.Router) {
		r.Use(middleware.Auth)
		r.Post("/technician/register", repair.RegisterTechnician)
		r.Get("/technician/profile", repair.GetTechnicianProfile)
		r.Post("/request", repair.CreateRequest)
		r.Get("/pending", repair.GetPendingRequests)
		r.Put("/accept/{id}", repair.AcceptRequest)
		r.Get("/my-jobs", repair.GetMyJobs)
		r.Get("/history", repair.GetCustomerRequests)
	})

	// 7. Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Server running on port %s\n", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal(err)
	}
}