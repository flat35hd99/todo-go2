package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Controller struct {
	db *gorm.DB
}

func errorMiddleware(c *gin.Context) {
	c.Next()

	err := c.Errors.ByType(gin.ErrorTypePrivate).Last()
	if err != nil {
		log.Print(err.Err)

		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"status": "error",
		})
		return
	}

	err = c.Errors.ByType(gin.ErrorTypePublic).Last()
	if err != nil {
		log.Print(err.Err)

		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": err.Err,
		})
	}
}

func main() {
	var c Controller
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&Todo{})

	c.db = db

	r := gin.Default()

	r.Use(errorMiddleware)

	r.GET("/todo/:id", c.getTodoById)
	r.GET("/todo", c.listTodoById)
	r.POST("/todo", c.createTodo)
	r.PATCH("/todo", c.updateTodo)

	r.Run()
}
