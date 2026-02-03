package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Technician struct {
	ID             uuid.UUID `gorm:"type:uuid;primary_key;" json:"id"`
	UserID         uuid.UUID `gorm:"type:uuid;uniqueIndex" json:"user_id"`
	User           User      `gorm:"foreignKey:UserID" json:"-"`
	
	Specialization string    `gorm:"type:varchar(100)" json:"specialization"` // e.g., "Mobile", "Laptop"
	Experience     string    `gorm:"type:varchar(50)" json:"experience"`
	IsAvailable    bool      `gorm:"default:true" json:"is_available"`
	Rating         float64   `gorm:"default:0" json:"rating"`
	
	CreatedAt      time.Time `json:"created_at"`
}

type RepairRequest struct {
	ID             uuid.UUID  `gorm:"type:uuid;primary_key;" json:"id"`
	CustomerID     uuid.UUID  `gorm:"type:uuid;index" json:"customer_id"`
	Customer       User       `gorm:"foreignKey:CustomerID" json:"customer"`
	
	TechnicianID   *uuid.UUID `gorm:"type:uuid;index" json:"technician_id"` // Nullable until assigned
	
	DeviceType     string     `gorm:"type:varchar(50)" json:"device_type"`
	IssueSummary   string     `gorm:"type:varchar(255)" json:"issue_summary"`
	Description    string     `gorm:"type:text" json:"description"`
	Status         string     `gorm:"type:varchar(20);default:'pending'" json:"status"` // pending, assigned, completed
	
	PreferredMode  string     `gorm:"type:varchar(20)" json:"preferred_mode"` // video_call, home_visit
	
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
}

func (t *Technician) BeforeCreate(tx *gorm.DB) (err error) {
	t.ID = uuid.New()
	return
}

func (r *RepairRequest) BeforeCreate(tx *gorm.DB) (err error) {
	r.ID = uuid.New()
	return
}