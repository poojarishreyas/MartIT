package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Product struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key;" json:"id"`
	SellerID    uuid.UUID `gorm:"type:uuid;not null;index" json:"seller_id"`
	Seller      Seller    `gorm:"foreignKey:SellerID" json:"-"`
	
	Name        string    `gorm:"type:varchar(255);not null" json:"name"`
	Description string    `gorm:"type:text" json:"description"`
	Category    string    `gorm:"type:varchar(100)" json:"category"`
	Price       float64   `gorm:"type:decimal(10,2);not null" json:"price"`
	
	// Stores array of strings ["url1", "url2"] as JSON in DB
	Images      []string  `gorm:"serializer:json" json:"images"` 
	
	IsActive    bool      `gorm:"default:true" json:"is_active"`
	
	// Relationships
	Inventory   Inventory `gorm:"foreignKey:ProductID;constraint:OnDelete:CASCADE;" json:"inventory"`

	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Inventory struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;" json:"id"`
	ProductID uuid.UUID `gorm:"type:uuid;not null;uniqueIndex" json:"product_id"`
	Stock     int       `gorm:"not null;default:0" json:"stock"`
	Reserved  int       `gorm:"not null;default:0" json:"reserved"` // For items in cart but not paid
	UpdatedAt time.Time `json:"updated_at"`
}

func (p *Product) BeforeCreate(tx *gorm.DB) (err error) {
	p.ID = uuid.New()
	return
}

func (i *Inventory) BeforeCreate(tx *gorm.DB) (err error) {
	i.ID = uuid.New()
	return
}