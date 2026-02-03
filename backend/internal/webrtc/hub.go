package webrtc

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// Client represents a connected user
type Client struct {
	Hub    *Hub
	Conn   *websocket.Conn
	Send   chan []byte
	RoomID string
}

// Hub maintains the set of active clients
type Hub struct {
	Clients    map[*Client]bool
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan []byte
	Rooms      map[string]map[*Client]bool // RoomID -> Clients
	mu         sync.Mutex
}

func NewHub() *Hub {
	return &Hub{
		Clients:    make(map[*Client]bool),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Broadcast:  make(chan []byte),
		Rooms:      make(map[string]map[*Client]bool),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.mu.Lock()
			h.Clients[client] = true
			if h.Rooms[client.RoomID] == nil {
				h.Rooms[client.RoomID] = make(map[*Client]bool)
			}
			h.Rooms[client.RoomID][client] = true
			h.mu.Unlock()

		case client := <-h.Unregister:
			h.mu.Lock()
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				close(client.Send)
				delete(h.Rooms[client.RoomID], client)
			}
			h.mu.Unlock()

		case message := <-h.Broadcast:
			// Parse message to find RoomID
			var msgMap map[string]interface{}
			json.Unmarshal(message, &msgMap)
			
			roomID, _ := msgMap["roomID"].(string)

			h.mu.Lock()
			// Send only to clients in that room
			for client := range h.Rooms[roomID] {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(h.Clients, client)
				}
			}
			h.mu.Unlock()
		}
	}
}

// ServeWs handles websocket requests from the peer.
func ServeWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	roomID := r.URL.Query().Get("roomID")
	if roomID == "" {
		log.Println("No Room ID provided")
		return
	}

	client := &Client{Hub: hub, Conn: conn, Send: make(chan []byte, 256), RoomID: roomID}
	client.Hub.Register <- client

	go client.WritePump()
	go client.ReadPump()
}

func (c *Client) ReadPump() {
	defer func() {
		c.Hub.Unregister <- c
		c.Conn.Close()
	}()
	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			break
		}
		c.Hub.Broadcast <- message
	}
}

func (c *Client) WritePump() {
	defer func() {
		c.Conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.Send:
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			c.Conn.WriteMessage(websocket.TextMessage, message)
		}
	}
}