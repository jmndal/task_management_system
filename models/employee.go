package models

import (
	"github.com/uadmin/uadmin"
)

type Employee struct {
	uadmin.Model
	User         uadmin.User `uadmin:"list_exclude;hidden"`
	UserID       uint
	ProfileImage string `uadmin:"image"`
	FirstName    string `uadmin:"required;search"`
	LastName     string `uadmin:"required;search"`
	Email        string `uadmin:"required;search"`
	Username     string `uadmin:"required;search"`
	Password     string `uadmin:"required;search"`
	Company      string `uadmin:"search"`
	Job          string `uadmin:"search"`
	Country      string `uadmin:"search"`
	Address      string `uadmin:"search"`
	PhoneNumber  string `uadmin:"search"`
	Admin        bool
	Active       bool
}

func (e *Employee) String() string {
	uadmin.Preload(e)
	return e.FirstName + " " + e.LastName
}

func (e *Employee) Save() {
	u := uadmin.User{}
	u.FirstName = e.FirstName
	u.LastName = e.LastName
	u.Email = e.Email
	u.Username = e.Username
	u.Password = e.Password
	u.Admin = true
	u.Active = true
	u.Save()

	e.UserID = u.ID
	uadmin.Save(e)
}
