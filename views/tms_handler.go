package views

import (
	"net/http"
	"strings"

	"github.com/uadmin/uadmin"
)

func TMSHandler(w http.ResponseWriter, r *http.Request) {
	r.URL.Path = strings.TrimPrefix(r.URL.Path, "/tms/")
	page := strings.TrimSuffix(r.URL.Path, "/")
	context := map[string]interface{}{}

	session := r.FormValue("session")
	if session != "" {
		http.SetCookie(w, &http.Cookie{
			Name:  "session",
			Value: session,
			Path:  "/",
		})
	}

	sess := uadmin.IsAuthenticated(r)
	if sess == nil {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	switch page {
	case "dashboard":
		context = DashboardHandler(w, r)
	case "user_profile":
		context = UserProfileHandler(w, r)
	case "create_user":
		context = CreateUserHandler(w, r)
	case "create_task":
		context = CreateTaskHandler(w, r)
	case "task":
		context = TaskHandler(w, r)
	default:
		page = "dashboard"
	}

	context["Page"] = page
	Rendering(w, r, page, context)
}

func Rendering(w http.ResponseWriter, r *http.Request, page string, context map[string]interface{}) {
	templateList := []string{}
	templateList = append(templateList, "./templates/html/base.html")

	path := "./templates/html/" + page + ".html"
	templateList = append(templateList, path)

	uadmin.RenderMultiHTML(w, r, templateList, context)
}
