package product

import (
	"encoding/json"
	"net/http"

	"mart-it-backend/internal/middleware"
	"mart-it-backend/internal/models"
	"mart-it-backend/pkg/database"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type CreateProductRequest struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Category    string   `json:"category"`
	Price       float64  `json:"price"`
	Stock       int      `json:"stock"`
	Images      []string `json:"images"`
}

// CreateProduct handles adding a product + inventory in a transaction
func CreateProduct(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(uuid.UUID)

	// 1. Find the Seller ID belonging to this User
	var seller models.Seller
	if err := database.DB.Where("user_id = ?", userID).First(&seller).Error; err != nil {
		http.Error(w, "Seller profile not found. Please complete onboarding.", http.StatusForbidden)
		return
	}

	var req CreateProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// 2. Start Transaction
	tx := database.DB.Begin()

	// 3. Create Product
	product := models.Product{
		SellerID:    seller.ID,
		Name:        req.Name,
		Description: req.Description,
		Category:    req.Category,
		Price:       req.Price,
		Images:      req.Images,
		IsActive:    true,
	}

	if err := tx.Create(&product).Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to create product", http.StatusInternalServerError)
		return
	}

	// 4. Create Inventory
	inventory := models.Inventory{
		ProductID: product.ID,
		Stock:     req.Stock,
	}

	if err := tx.Create(&inventory).Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to set inventory", http.StatusInternalServerError)
		return
	}

	// 5. Commit Transaction
	tx.Commit()

	// Return the full product with inventory
	product.Inventory = inventory
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(product)
}

// GetSellerProducts returns all products for the logged-in seller
func GetSellerProducts(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(uuid.UUID)

	var seller models.Seller
	if err := database.DB.Where("user_id = ?", userID).First(&seller).Error; err != nil {
		http.Error(w, "Seller not found", http.StatusNotFound)
		return
	}

	var products []models.Product
	// Preload Inventory so we get the stock count too
	if err := database.DB.Preload("Inventory").Where("seller_id = ?", seller.ID).Find(&products).Error; err != nil {
		http.Error(w, "Failed to fetch products", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(products)
}

// DeleteProduct soft deletes or removes a product
func DeleteProduct(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(uuid.UUID)
	productID := chi.URLParam(r, "id")

	// Verify ownership before deleting
	var seller models.Seller
	database.DB.Where("user_id = ?", userID).First(&seller)

	result := database.DB.Where("id = ? AND seller_id = ?", productID, seller.ID).Delete(&models.Product{})
	if result.Error != nil || result.RowsAffected == 0 {
		http.Error(w, "Product not found or unauthorized", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Product deleted"})
}


// GetAllProducts fetches all active products for the customer catalog
func GetAllProducts(w http.ResponseWriter, r *http.Request) {
	var products []models.Product
	
	// Preload Inventory to show "Out of Stock" labels if needed
	// In a real app, we would add pagination and filtering here
	result := database.DB.Preload("Inventory").
		Where("is_active = ?", true).
		Order("created_at desc").
		Find(&products)
		
	if result.Error != nil {
		http.Error(w, "Failed to fetch products", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(products)
}

// GetProductByID fetches a single product details
func GetProductByID(w http.ResponseWriter, r *http.Request) {
	productID := chi.URLParam(r, "id")
	var product models.Product

	if err := database.DB.Preload("Inventory").Preload("Seller").First(&product, "id = ?", productID).Error; err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(product)
}