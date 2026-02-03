package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Seller struct {
	ID               uuid.UUID `gorm:"type:uuid;primary_key;" json:"id"`
	UserID           uuid.UUID `gorm:"type:uuid;not null;uniqueIndex" json:"user_id"`
	User             User      `gorm:"foreignKey:UserID" json:"-"` // Relationship
	
	StoreName        string    `gorm:"type:varchar(100);not null" json:"store_name"`
	StoreDescription string    `gorm:"type:text" json:"store_description"`
	GSTNumber        string    `gorm:"type:varchar(50)" json:"gst_number"`
	Address          string    `gorm:"type:text" json:"address"`
	
	IsVerified       bool      `gorm:"default:false" json:"is_verified"`
	IsQuickCommerce  bool      `gorm:"default:false" json:"is_quick_commerce"`
	
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

func (s *Seller) BeforeCreate(tx *gorm.DB) (err error) {
	s.ID = uuid.New()
	return
}