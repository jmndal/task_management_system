package models

import (
	"strings"
	"time"

	"github.com/uadmin/uadmin"
)

type Status int

func (Status) ToDo() int {
	return 1
}

func (Status) InProgress() int {
	return 2
}

func (Status) Done() int {
	return 3
}

type PriorityLevel int

func (PriorityLevel) Low() int {
	return 1
}

func (PriorityLevel) Medium() int {
	return 2
}

func (PriorityLevel) High() int {
	return 3
}

type Task struct {
	uadmin.Model
	Member        []Employee `gorm:"-" uadmin:"list_exclude;"`
	MemberID      uint
	MemberList    string
	Title         string
	Description   string
	CreatedAt     *time.Time `uadmin:"read_only"`
	DueDate       *time.Time
	PriorityLevel PriorityLevel `uadmin:"read_only"`
	Status        Status        `uadmin:"read_only"`
}

func (t *Task) String() string {
	uadmin.Preload(t)
	return t.Title
}

func (t *Task) Save() {
	now := time.Time{}
	memberList := []string{}
	for i := range t.Member {
		name := t.Member[i].FirstName + " " + t.Member[i].LastName
		memberList = append(memberList, name)
	}
	joinMembers := strings.Join(memberList, ", ")

	t.MemberList = joinMembers
	t.CreatedAt = &now

	uadmin.Save(t)
}
