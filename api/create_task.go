package api

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/jmandal/tms/models"
	"github.com/uadmin/uadmin"
)

func TaskHandler(w http.ResponseWriter, r *http.Request) {
	task := models.Task{}

	memberID := r.FormValue("member_id")
	title := r.FormValue("title")
	description := r.FormValue("description")
	dueDateStr := r.FormValue("due_date")
	priorityLevelStr := r.FormValue("priority_level")
	statusStr := r.FormValue("status")

	// Parse the due date
	dueDate, err := time.Parse("2006-01-02", dueDateStr)
	if err != nil {
		uadmin.Trail(uadmin.ERROR, "Unable to parse due date: %s", err.Error())
		uadmin.ReturnJSON(w, r, map[string]interface{}{
			"status":  "error",
			"err_msg": "Unable to parse due date. " + err.Error(),
		})
		return
	}

	priorityLevel, err := strconv.ParseInt(priorityLevelStr, 10, 64)
	if err != nil {
		uadmin.Trail(uadmin.ERROR, "Unable to parse priority level: %s", err.Error())
		uadmin.ReturnJSON(w, r, map[string]interface{}{
			"status":  "error",
			"err_msg": "Unable to parse priority level. " + err.Error(),
		})
		return
	}

	status, err := strconv.ParseInt(statusStr, 10, 64)
	if err != nil {
		uadmin.Trail(uadmin.ERROR, "Unable to parse status: %s", err.Error())
		uadmin.ReturnJSON(w, r, map[string]interface{}{
			"status":  "error",
			"err_msg": "Unable to parse status. " + err.Error(),
		})
		return
	}

	if r.Method != "POST" {
		uadmin.ReturnJSON(w, r, map[string]interface{}{
			"status": "error",
			"msg":    "Invalid method!",
		})
	}

	task.Title = title
	task.Description = description
	task.DueDate = &dueDate
	task.PriorityLevel = models.PriorityLevel(priorityLevel)
	task.Status = models.Status(status)

	// Save the task
	task.Save()

	// Process member_id (assuming member_id is a string of IDs separated by commas)
	members := strings.Split(memberID, ",")

	// Retrieve the last task to get its ID
	db := uadmin.GetDB()
	result := models.Task{}
	db.Last(&task).Scan(&result)
	resultID := result.ID

	// Insert members into task_employee table
	for _, m := range members {
		db.Exec("INSERT INTO task_employee(table1_id, table2_id) VALUES (?, ?)", resultID, m).Scan(&result)
	}

	taskMany := models.Task{}
	uadmin.Get(&taskMany, "id = ?", resultID)
	taskMany.Save()

	uadmin.ReturnJSON(w, r, map[string]interface{}{
		"status": "ok",
		"msg":    "Task successfully added!",
	})
}
