package views

import (
	"net/http"

	"github.com/uadmin/uadmin"
)

func LogOutHandler(w http.ResponseWriter, r *http.Request) {
	session := uadmin.Session{}
	key := uadmin.GetUserFromRequest(r).GetActiveSession().Key
	uadmin.Get(&session, "`key` = ?", key)
	uadmin.DeleteList(&session, "`key` = ?", key)

	http.SetCookie(w, &http.Cookie{
		Path:   "/",
		Name:   "session",
		Value:  "",
		MaxAge: -1,
	})

	http.SetCookie(w, &http.Cookie{
		Path:   "/",
		Name:   "username",
		Value:  "",
		MaxAge: -1,
	})

	http.Redirect(w, r, "/", http.StatusSeeOther)
}
