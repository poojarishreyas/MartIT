package cart

import (
	"encoding/json"
	"net/http"

	"mart-it-backend/internal/middleware"
	"mart-it-backend/internal/models"
	"mart-it-backend/pkg/database"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

// AddToCartRequest defines input for adding items
type AddToCartRequest struct {
	ProductID uuid.UUID `json:"product_id"`
	Quantity  int       `json:"quantity"`
}

func GetCart(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(uuid.UUID)

	var cart models.Cart
	// Find cart and preload Items -> Product -> Images
	if err := database.DB.Preload("Items.Product").Where("user_id = ?", userID).FirstOrCreate(&cart, models.Cart{UserID: userID}).Error; err != nil {
		http.Error(w, "Failed to get cart", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(cart)
}

func AddItem(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(uuid.UUID)

	var req AddToCartRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// 1. Get or Create Cart
	var cart models.Cart
	database.DB.Where("user_id = ?", userID).FirstOrCreate(&cart, models.Cart{UserID: userID})

	// 2. Check if item already in cart
	var item models.CartItem
	result := database.DB.Where("cart_id = ? AND product_id = ?", cart.ID, req.ProductID).First(&item)

	if result.RowsAffected > 0 {
		// Update Quantity
		item.Quantity += req.Quantity
		database.DB.Save(&item)
	} else {
		// Create New Item
		item = models.CartItem{
			CartID:    cart.ID,
			ProductID: req.ProductID,
			Quantity:  req.Quantity,
		}
		database.DB.Create(&item)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Item added to cart"})
}

func RemoveItem(w http.ResponseWriter, r *http.Request) {
	itemID := chi.URLParam(r, "id")
	// In a real app, verify this item belongs to the user's cart
	database.DB.Delete(&models.CartItem{}, "id = ?", itemID)
	w.WriteHeader(http.StatusOK)
}