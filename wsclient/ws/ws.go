package ws

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[string]*websocket.Conn)
var clientsMutex = &sync.Mutex{}
var jwtKey = []byte("your_secret_key")

type Claims struct {
	ClientID string `json:"clientID"`
	jwt.RegisteredClaims
}

func Connect(c *gin.Context) {
	token := c.Query("token")
	clientID := c.Param("clientID")

	if !validateToken(token,clientID) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade to WebSocket"})
		return
	}

	clientsMutex.Lock()
	clients[clientID] = conn
	clientsMutex.Unlock()

	defer func() {
		clientsMutex.Lock()
		delete(clients, clientID)
		clientsMutex.Unlock()
		conn.Close()
	}()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			break
		}
		// Echo the message back to the client
		conn.WriteMessage(websocket.TextMessage, message)
	}
}

func GetToken(c *gin.Context) {
	clientID := uuid.NewString()
	expirationTime := time.Now().Add(5 * time.Minute)
	claims := &Claims{
		ClientID: clientID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"clientID": clientID, "token": tokenString})
}
func validateToken(tokenString, clientID string) bool {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil || !token.Valid || claims.ClientID != clientID {
		return false
	}
	return true
}
