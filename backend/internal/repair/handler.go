package repair

import (
	"encoding/json"
	"net/http"

	"mart-it-backend/internal/middleware"
	"mart-it-backend/internal/models"
	"mart-it-backend/pkg/database"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

// 1. Technician Registration
func RegisterTechnician(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(uuid.UUID)
	
	var req struct {
		Specialization string `json:"specialization"`
		Experience     string `json:"experience"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	tech := models.Technician{
		UserID:         userID,
		Specialization: req.Specialization,
		Experience:     req.Experience,
	}

	if err := database.DB.Create(&tech).Error; err != nil {
		http.Error(w, "Failed to register technician", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

// 2. Create Repair Request (Customer)
func CreateRequest(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(uuid.UUID)

	var req models.RepairRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	req.CustomerID = userID
	req.Status = "pending"

	if err := database.DB.Create(&req).Error; err != nil {
		http.Error(w, "Failed to create request", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(req)
}

// 3. Get Pending Requests (For Technician Dashboard)
func GetPendingRequests(w http.ResponseWriter, r *http.Request) {
	var requests []models.RepairRequest
	// Fetch all requests with 'pending' status
	database.DB.Preload("Customer").Where("status = ?", "pending").Find(&requests)
	json.NewEncoder(w).Encode(requests)
}

// 4. Accept Request (Technician)
func AcceptRequest(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(uuid.UUID)
	requestID := chi.URLParam(r, "id")

	// Verify User is a Technician
	var tech models.Technician
	if err := database.DB.Where("user_id = ?", userID).First(&tech).Error; err != nil {
		http.Error(w, "Unauthorized: Technician profile required", http.StatusForbidden)
		return
	}

	// Update Request
	result := database.DB.Model(&models.RepairRequest{}).
		Where("id = ? AND status = ?", requestID, "pending").
		Updates(map[string]interface{}{
			"status":        "assigned",
			"technician_id": tech.ID, // Use the Technician ID, not User ID
		})

	if result.RowsAffected == 0 {
		http.Error(w, "Request not found or already taken", http.StatusConflict)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Job Accepted"})
}

// 5. Get My Jobs (Technician)
func GetMyJobs(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(uuid.UUID)
	
	// Get Tech ID
	var tech models.Technician
	database.DB.Where("user_id = ?", userID).First(&tech)

	var requests []models.RepairRequest
	database.DB.Preload("Customer").Where("technician_id = ?", tech.ID).Find(&requests)
	
	json.NewEncoder(w).Encode(requests)
}

func GetTechnicianProfile(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(uuid.UUID)

	var tech models.Technician
	if err := database.DB.Where("user_id = ?", userID).First(&tech).Error; err != nil {
		http.Error(w, "Profile not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(tech)
}


// GetCustomerRequests returns history for the logged-in customer
func GetCustomerRequests(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(uuid.UUID)

	var requests []models.RepairRequest
	// Preload Technician so we can show their name (optional)
	database.DB.Preload("Technician").Where("customer_id = ?", userID).Find(&requests)

	json.NewEncoder(w).Encode(requests)
}