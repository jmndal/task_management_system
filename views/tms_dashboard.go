package views

import (
	"net/http"

	"github.com/jmandal/tms/models"
	"github.com/uadmin/uadmin"
)

func DashboardHandler(w http.ResponseWriter, r *http.Request) map[string]interface{} {
	context := map[string]interface{}{}

	context["Title"] = "Dashboard"
	return context
}

func UserProfileHandler(w http.ResponseWriter, r *http.Request) map[string]interface{} {
	context := map[string]interface{}{}

	employee := []models.Employee{}
	uadmin.All(&employee)
	for e := range employee {
		uadmin.Preload(&employee[e])
	}

	context["Title"] = "User Profile"
	context["Employee"] = employee
	return context
}

func CreateUserHandler(w http.ResponseWriter, r *http.Request) map[string]interface{} {
	context := map[string]interface{}{}

	employee := []models.Employee{}
	uadmin.All(&employee)
	for e := range employee {
		uadmin.Preload(&employee[e])
	}

	context["Title"] = "Create User"
	context["Employee"] = employee
	return context
}

func CreateTaskHandler(w http.ResponseWriter, r *http.Request) map[string]interface{} {
	context := map[string]interface{}{}

	employee := []models.Employee{}
	uadmin.All(&employee)
	for e := range employee {
		uadmin.Preload(&employee[e])
	}

	context["Title"] = "Create Task"
	context["Employee"] = employee
	return context
}

func TaskHandler(w http.ResponseWriter, r *http.Request) map[string]interface{} {
	context := map[string]interface{}{}

	employee := []models.Employee{}
	uadmin.All(&employee)
	for e := range employee {
		uadmin.Preload(&employee[e])
	}

	var task []map[string]interface{}
	tasks := []models.Task{}
	uadmin.All(&tasks)
	for t := range tasks {
		uadmin.Preload(&tasks[t])
		task = append(task, map[string]interface{}{
			"ID":            tasks[t].ID,
			"MemberID":      tasks[t].MemberID,
			"MemberList":    tasks[t].MemberList,
			"Title":         tasks[t].Title,
			"Description":   tasks[t].Description,
			"CreatedAt":     tasks[t].CreatedAt.Format("2006/01/02"),
			"DueDate":       tasks[t].DueDate.Format("2006/01/02"),
			"PriorityLevel": tasks[t].PriorityLevel,
			"Status":        tasks[t].Status,
		})
	}

	context["Title"] = "Task"
	context["Employee"] = employee
	context["Task"] = task
	return context
}
