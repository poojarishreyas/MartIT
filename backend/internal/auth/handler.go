package auth

import (
	"encoding/json"
	"net/http"

	"mart-it-backend/internal/models"
	"mart-it-backend/pkg/database"
	"mart-it-backend/pkg/utils"
)

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"` // Optional, defaults to customer
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Hash Password
	hashedPwd, _ := utils.HashPassword(req.Password)

	// Create User
	user := models.User{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: hashedPwd,
		Role:         req.Role, // In a real app, strict validation is needed here
	}

	if result := database.DB.Create(&user); result.Error != nil {
		http.Error(w, "Email already exists", http.StatusConflict)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
}

func Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Find User
	var user models.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Check Password
	if !utils.CheckPasswordHash(req.Password, user.PasswordHash) {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Generate Token
	token, _ := utils.GenerateToken(user.ID, user.Role)

	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
		"user": map[string]string{
			"id":    user.ID.String(),
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}