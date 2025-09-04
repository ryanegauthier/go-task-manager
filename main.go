package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

// User model
type User struct {
	ID        uint      `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Password  string    `json:"-"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Task model
type Task struct {
	ID          uint      `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Completed   bool      `json:"completed"`
	UserID      uint      `json:"user_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// LoginRequest represents login credentials
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// RegisterRequest represents registration data
type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// TaskRequest represents task creation/update data
type TaskRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
}

// In-memory storage for Phase 1
var (
	users          = make(map[string]User)
	tasks          = make(map[uint]Task)
	userID    uint = 1
	taskID    uint = 1
	userMutex sync.RWMutex
	taskMutex sync.RWMutex
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using default values")
	}

	// Set Gin mode
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Create router
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Serve static files
	r.Static("/static", "./static")
	r.LoadHTMLGlob("templates/*")

	// Routes
	api := r.Group("/api")
	{
		// Auth routes
		api.POST("/register", register)
		api.POST("/login", login)

		// Protected routes
		protected := api.Group("/")
		protected.Use(authMiddleware())
		{
			protected.GET("/tasks", getTasks)
			protected.POST("/tasks", createTask)
			protected.GET("/tasks/:id", getTask)
			protected.PUT("/tasks/:id", updateTask)
			protected.DELETE("/tasks/:id", deleteTask)
			protected.GET("/profile", getProfile)
		}
	}

	// Web routes
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title": "Go Portfolio App",
		})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func checkPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userMutex.Lock()
	defer userMutex.Unlock()

	// Check if user already exists
	if _, exists := users[req.Username]; exists {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}

	// Hash password
	hashedPassword, err := hashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Create user
	user := User{
		ID:        userID,
		Username:  req.Username,
		Email:     req.Email,
		Password:  hashedPassword,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	users[req.Username] = user
	userID++

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}

func login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userMutex.RLock()
	user, exists := users[req.Username]
	userMutex.RUnlock()

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Check password
	if !checkPassword(req.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate JWT token
	token, err := generateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   token,
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}

func getTasks(c *gin.Context) {
	userID := c.GetUint("user_id")

	taskMutex.RLock()
	defer taskMutex.RUnlock()

	var userTasks []Task
	for _, task := range tasks {
		if task.UserID == userID {
			userTasks = append(userTasks, task)
		}
	}

	c.JSON(http.StatusOK, userTasks)
}

func createTask(c *gin.Context) {
	userID := c.GetUint("user_id")

	var req TaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	taskMutex.Lock()
	defer taskMutex.Unlock()

	task := Task{
		ID:          taskID,
		Title:       req.Title,
		Description: req.Description,
		UserID:      userID,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	tasks[taskID] = task
	taskID++

	c.JSON(http.StatusCreated, task)
}

func getTask(c *gin.Context) {
	userID := c.GetUint("user_id")
	taskIDStr := c.Param("id")

	// Convert taskID string to uint (simplified)
	var taskID uint
	_, err := fmt.Sscanf(taskIDStr, "%d", &taskID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	taskMutex.RLock()
	task, exists := tasks[taskID]
	taskMutex.RUnlock()

	if !exists || task.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	c.JSON(http.StatusOK, task)
}

func updateTask(c *gin.Context) {
	userID := c.GetUint("user_id")
	taskIDStr := c.Param("id")

	var req TaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Convert taskID string to uint (simplified)
	var taskID uint
	_, err := fmt.Sscanf(taskIDStr, "%d", &taskID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	taskMutex.Lock()
	defer taskMutex.Unlock()

	task, exists := tasks[taskID]
	if !exists || task.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	task.Title = req.Title
	task.Description = req.Description
	task.UpdatedAt = time.Now()
	tasks[taskID] = task

	c.JSON(http.StatusOK, task)
}

func deleteTask(c *gin.Context) {
	userID := c.GetUint("user_id")
	taskIDStr := c.Param("id")

	// Convert taskID string to uint (simplified)
	var taskID uint
	_, err := fmt.Sscanf(taskIDStr, "%d", &taskID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	taskMutex.Lock()
	defer taskMutex.Unlock()

	task, exists := tasks[taskID]
	if !exists || task.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	delete(tasks, taskID)

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}

func getProfile(c *gin.Context) {
	userID := c.GetUint("user_id")

	userMutex.RLock()
	defer userMutex.RUnlock()

	// Find user by ID
	var user User
	for _, u := range users {
		if u.ID == userID {
			user = u
			break
		}
	}

	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":         user.ID,
		"username":   user.Username,
		"email":      user.Email,
		"created_at": user.CreatedAt,
	})
}
