package main

import (
	"net/http"

	"github.com/jmandal/tms/api"
	"github.com/jmandal/tms/models"
	"github.com/jmandal/tms/views"
	"github.com/uadmin/uadmin"
)

func main() {
	DBConfig()
	RegisterModels()
	RegisterHandlers()
	Server()
}

func RegisterModels() {
	uadmin.Register(
		models.Employee{},
		models.Task{},
	)
}

func RegisterHandlers() {
	http.HandleFunc("/", uadmin.Handler(views.LoginHandler))
	http.HandleFunc("/tms/", uadmin.Handler(views.TMSHandler))
	http.HandleFunc("/logout/", uadmin.Handler(views.LogOutHandler))
	http.HandleFunc("/api/", uadmin.Handler(api.APIHandler))
}

func DBConfig() {
	uadmin.Database = &uadmin.DBSettings{
		Type:     "mysql",
		Name:     "task_management_system",
		User:     "root",
		Password: "Allen is Great 200%",
		Host:     "localhost",
		Port:     3306,
	}
}

func Server() {
	uadmin.RootURL = "/admin/"
	uadmin.Port = 7799
	uadmin.StartServer()
}
