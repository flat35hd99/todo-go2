package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Todo struct {
	gorm.Model
	Title string `json:"title"`
}

func (controller *Controller) getTodoById(c *gin.Context) {
	id := c.Param("id")

	var todo Todo
	if err := controller.db.First(&todo, id).Error; err != nil {
		// Not foundで返したいけど、どうやってミドルウェア書くか考えてない。
		c.Error(err).SetType(gin.ErrorTypePrivate)
		return
	}

	c.JSON(http.StatusOK, todo)
}

func (controller *Controller) listTodoById(c *gin.Context) {
	var todos []Todo
	if err := controller.db.Find(&todos).Error; err != nil {
		c.Error(err).SetType(gin.ErrorTypePrivate)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"todos": todos,
	})
}

func (controller *Controller) createTodo(c *gin.Context) {
	var json Todo
	if err := c.ShouldBindJSON(&json); err != nil {
		c.Error(err).SetType(gin.ErrorTypePublic)
		return
	}

	var newTodo Todo
	newTodo.Title = json.Title

	if err := controller.db.Create(&newTodo).Error; err != nil {
		c.Error(err).SetType(gin.ErrorTypePrivate)
		return
	}

	c.JSON(http.StatusCreated, newTodo)
}

func (controller *Controller) updateTodo(c *gin.Context) {
	var json Todo
	if err := c.ShouldBindJSON(&json); err != nil {
		c.Error(err).SetType(gin.ErrorTypePublic)
		return
	}

	var newTodo Todo
	if err := controller.db.Find(&newTodo, json.ID).Error; err != nil {
		c.Error(err).SetType(gin.ErrorTypePrivate)
		return
	}

	newTodo.Title = json.Title

	if err := controller.db.Save(&newTodo).Error; err != nil {
		c.Error(err).SetType(gin.ErrorTypePrivate)
		return
	}

	c.JSON(http.StatusAccepted, newTodo)
}
