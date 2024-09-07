package main

import (
	"time"
	"wsclient/ws"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	wss := ws.NewWebSocketServer()
	wsGroup := r.Group("ws")
	{
		wsGroup.POST("token", wss.GetToken)
		wsGroup.GET(":clientID", wss.Connect)
	}

	r.Run(":8080")
}
