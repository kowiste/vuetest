package ws

import (
	"fmt"
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

var jwtKey = []byte("your_secret_key")

type Claims struct {
	ClientID string `json:"clientID"`
	jwt.RegisteredClaims
}

type WebSocketServer struct {
	clients      map[string]*websocket.Conn
	clientsMutex *sync.Mutex
}

func NewWebSocketServer() *WebSocketServer {
	return &WebSocketServer{
		clients:      make(map[string]*websocket.Conn),
		clientsMutex: &sync.Mutex{},
	}
}

func (ws *WebSocketServer) Connect(c *gin.Context) {
	token := c.Query("token")
	clientID := c.Param("clientID")

	if !validateToken(token, clientID) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade to WebSocket"})
		return
	}

	ws.clientsMutex.Lock()
	ws.clients[clientID] = conn
	ws.clientsMutex.Unlock()

	defer func() {
		ws.clientsMutex.Lock()
		delete(ws.clients, clientID)
		ws.clientsMutex.Unlock()
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

func (ws *WebSocketServer) GetToken(c *gin.Context) {
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

func (ws *WebSocketServer) SendMessage(clientID string, message []byte) error {
	ws.clientsMutex.Lock()
	conn, ok := ws.clients[clientID]
	ws.clientsMutex.Unlock()

	if !ok {
		return fmt.Errorf("client not connected")
	}

	return conn.WriteMessage(websocket.TextMessage, message)
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
