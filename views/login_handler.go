package views

import (
	"net/http"

	"github.com/uadmin/uadmin"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	context := map[string]interface{}{}
	session := uadmin.IsAuthenticated(r)
	user := uadmin.User{}

	if session != nil {
		http.Redirect(w, r, "/tms/dashboard", http.StatusSeeOther)
		return
	}

	if r.Method == "POST" {
		username := r.FormValue("username")
		password := r.FormValue("password")

		uadmin.Get(&user, "username = ?", username)
		newSession := user.Login(password, "")

		if newSession != nil {
			http.SetCookie(w, &http.Cookie{
				Path:  "/",
				Name:  "session",
				Value: newSession.Key,
			})

			http.SetCookie(w, &http.Cookie{
				Path:  "/",
				Name:  "username",
				Value: username,
			})

			http.Redirect(w, r, "/tms/dashboard", http.StatusSeeOther)
		}
	}

	context["Title"] = "Log In"
	uadmin.RenderHTML(w, r, "./templates/html/login.html", context)
}
