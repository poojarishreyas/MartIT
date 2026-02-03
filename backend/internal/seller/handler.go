package seller

import (
	"encoding/json"
	"net/http"

	"mart-it-backend/internal/middleware"
	"mart-it-backend/internal/models"
	"mart-it-backend/pkg/database"
	"github.com/google/uuid"
)

type CreateStoreRequest struct {
	StoreName        string `json:"store_name"`
	StoreDescription string `json:"store_description"`
	GSTNumber        string `json:"gst_number"`
	Address          string `json:"address"`
}

func RegisterSeller(w http.ResponseWriter, r *http.Request) {
	// 1. Get User ID from Context (set by Middleware)
	userID := r.Context().Value(middleware.UserIDKey).(uuid.UUID)

	var req CreateStoreRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// 2. Check if seller profile already exists
	var existingSeller models.Seller
	if err := database.DB.Where("user_id = ?", userID).First(&existingSeller).Error; err == nil {
		http.Error(w, "Seller profile already exists", http.StatusConflict)
		return
	}

	// 3. Create Seller Profile
	seller := models.Seller{
		UserID:           userID,
		StoreName:        req.StoreName,
		StoreDescription: req.StoreDescription,
		GSTNumber:        req.GSTNumber,
		Address:          req.Address,
	}

	if result := database.DB.Create(&seller); result.Error != nil {
		http.Error(w, "Failed to create store", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(seller)
}

func GetProfile(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(uuid.UUID)

	var seller models.Seller
	if err := database.DB.Where("user_id = ?", userID).First(&seller).Error; err != nil {
		http.Error(w, "Store not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(seller)
}