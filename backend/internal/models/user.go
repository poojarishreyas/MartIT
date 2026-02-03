package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

const (
	RoleCustomer   = "customer"
	RoleSeller     = "seller"
	RoleTechnician = "technician"
	RoleAdmin      = "admin"
)

type User struct {
	ID           uuid.UUID `gorm:"type:uuid;primary_key;" json:"id"`
	Name         string    `gorm:"type:varchar(100);not null" json:"name"`
	Email        string    `gorm:"type:varchar(100);uniqueIndex;not null" json:"email"`
	// Changed to pointer (*string) to allow NULL values for uniqueness
	Phone        *string   `gorm:"type:varchar(20);uniqueIndex" json:"phone"` 
	PasswordHash string    `gorm:"type:text;not null" json:"-"`
	Role         string    `gorm:"type:varchar(20);default:'customer'" json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	u.ID = uuid.New()
	return
}