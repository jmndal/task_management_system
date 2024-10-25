package api

import (
	"net/http"
	"strings"
)

func APIHandler(w http.ResponseWriter, r *http.Request) {
	r.URL.Path = strings.TrimPrefix(r.URL.Path, "/api/")
	r.URL.Path = strings.TrimSuffix(r.URL.Path, "/")
	path := r.URL.Path

	switch path {
	case "task":
		TaskHandler(w, r)
		return
	}
}
