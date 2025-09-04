package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// TestMain sets up the test environment
func TestMain(m *testing.M) {
	// Set Gin to test mode
	gin.SetMode(gin.TestMode)

	// Setup test database
	if err := setupTestDB(); err != nil {
		panic("Failed to setup test database: " + err.Error())
	}

	// Run tests
	code := m.Run()

	// Cleanup
	cleanupTestDB()

	os.Exit(code)
}

// setupTestDB initializes a test database
func setupTestDB() error {
	// Use test database configuration
	dsn := "host=localhost port=5432 user=postgres password=password dbname=taskmanager_test sslmode=disable"

	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	// Auto migrate schema
	return db.AutoMigrate(&User{}, &Task{})
}

// cleanupTestDB cleans up the test database
func cleanupTestDB() {
	if db != nil {
		// Drop all tables
		db.Migrator().DropTable(&Task{}, &User{})
	}
}

// setupTestRouter creates a test router
func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// API routes
	api := r.Group("/api")
	{
		api.POST("/register", register)
		api.POST("/login", login)

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

	return r
}

// TestPasswordHashing tests password hashing functionality
func TestPasswordHashing(t *testing.T) {
	password := "testpassword123"

	// Test hashing
	hash, err := hashPassword(password)
	assert.NoError(t, err)
	assert.NotEqual(t, password, hash)
	assert.Len(t, hash, 60) // bcrypt hash length

	// Test password verification
	assert.True(t, checkPassword(password, hash))
	assert.False(t, checkPassword("wrongpassword", hash))
}

// TestJWTTokenGeneration tests JWT token generation
func TestJWTTokenGeneration(t *testing.T) {
	userID := uint(1)

	token, err := generateToken(userID)
	assert.NoError(t, err)
	assert.NotEmpty(t, token)
	assert.Len(t, token, 167) // JWT token length varies
}

// TestJWTSecretFunction tests the JWT secret function
func TestJWTSecretFunction(t *testing.T) {
	secret := getJWTSecret()
	assert.NotEmpty(t, secret)
	assert.Len(t, secret, 36) // Default secret length
}

// TestValidationFunctions tests input validation
func TestValidationFunctions(t *testing.T) {
	// Test valid email
	validEmail := "test@example.com"
	assert.True(t, isValidEmail(validEmail))

	// Test invalid email
	invalidEmail := "invalid-email"
	assert.False(t, isValidEmail(invalidEmail))

	// Test password strength
	strongPassword := "password123"
	assert.True(t, isValidPassword(strongPassword))

	weakPassword := "123"
	assert.False(t, isValidPassword(weakPassword))
}

// TestUserRegistration tests user registration endpoint
func TestUserRegistration(t *testing.T) {
	router := setupTestRouter()

	// Test successful registration
	registerData := map[string]interface{}{
		"username": "testuser",
		"email":    "test@example.com",
		"password": "password123",
	}

	jsonData, _ := json.Marshal(registerData)
	req, _ := http.NewRequest("POST", "/api/register", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "User created successfully", response["message"])

	// Test duplicate username
	req, _ = http.NewRequest("POST", "/api/register", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusConflict, w.Code)
}

// TestUserLogin tests user login endpoint
func TestUserLogin(t *testing.T) {
	router := setupTestRouter()

	// First register a user
	registerData := map[string]interface{}{
		"username": "logintestuser",
		"email":    "logintest@example.com",
		"password": "password123",
	}

	jsonData, _ := json.Marshal(registerData)
	req, _ := http.NewRequest("POST", "/api/register", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Test successful login
	loginData := map[string]interface{}{
		"username": "logintestuser",
		"password": "password123",
	}

	jsonData, _ = json.Marshal(loginData)
	req, _ = http.NewRequest("POST", "/api/login", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "Login successful", response["message"])
	assert.NotEmpty(t, response["token"])

	// Test invalid credentials
	invalidLoginData := map[string]interface{}{
		"username": "logintestuser",
		"password": "wrongpassword",
	}

	jsonData, _ = json.Marshal(invalidLoginData)
	req, _ = http.NewRequest("POST", "/api/login", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

// TestTaskCRUD tests task CRUD operations
func TestTaskCRUD(t *testing.T) {
	router := setupTestRouter()

	// Register and login to get token
	registerData := map[string]interface{}{
		"username": "tasktestuser",
		"email":    "tasktest@example.com",
		"password": "password123",
	}

	jsonData, _ := json.Marshal(registerData)
	req, _ := http.NewRequest("POST", "/api/register", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Login to get token
	loginData := map[string]interface{}{
		"username": "tasktestuser",
		"password": "password123",
	}

	jsonData, _ = json.Marshal(loginData)
	req, _ = http.NewRequest("POST", "/api/login", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	var loginResponse map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &loginResponse)
	token := loginResponse["token"].(string)

	// Test create task
	taskData := map[string]interface{}{
		"title":       "Test Task",
		"description": "Test Description",
	}

	jsonData, _ = json.Marshal(taskData)
	req, _ = http.NewRequest("POST", "/api/tasks", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	var taskResponse map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &taskResponse)
	assert.NoError(t, err)
	assert.Equal(t, "Test Task", taskResponse["title"])

	taskID := taskResponse["id"]

	// Test get tasks
	req, _ = http.NewRequest("GET", "/api/tasks", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var tasksResponse []map[string]interface{}
	err = json.Unmarshal(w.Body.Bytes(), &tasksResponse)
	assert.NoError(t, err)
	assert.Len(t, tasksResponse, 1)

	// Test get specific task
	req, _ = http.NewRequest("GET", "/api/tasks/"+fmt.Sprintf("%v", taskID), nil)
	req.Header.Set("Authorization", "Bearer "+token)

	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	// Test update task
	updateData := map[string]interface{}{
		"title":       "Updated Task",
		"description": "Updated Description",
	}

	jsonData, _ = json.Marshal(updateData)
	req, _ = http.NewRequest("PUT", "/api/tasks/"+fmt.Sprintf("%v", taskID), bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var updateResponse map[string]interface{}
	err = json.Unmarshal(w.Body.Bytes(), &updateResponse)
	assert.NoError(t, err)
	assert.Equal(t, "Updated Task", updateResponse["title"])

	// Test delete task
	req, _ = http.NewRequest("DELETE", "/api/tasks/"+fmt.Sprintf("%v", taskID), nil)
	req.Header.Set("Authorization", "Bearer "+token)

	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

// TestAuthenticationMiddleware tests the authentication middleware
func TestAuthenticationMiddleware(t *testing.T) {
	router := setupTestRouter()

	// Test without token
	req, _ := http.NewRequest("GET", "/api/tasks", nil)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)

	// Test with invalid token
	req, _ = http.NewRequest("GET", "/api/tasks", nil)
	req.Header.Set("Authorization", "Bearer invalid-token")

	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

// TestProfileEndpoint tests the profile endpoint
func TestProfileEndpoint(t *testing.T) {
	router := setupTestRouter()

	// Register and login to get token
	registerData := map[string]interface{}{
		"username": "profiletestuser",
		"email":    "profiletest@example.com",
		"password": "password123",
	}

	jsonData, _ := json.Marshal(registerData)
	req, _ := http.NewRequest("POST", "/api/register", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Login to get token
	loginData := map[string]interface{}{
		"username": "profiletestuser",
		"password": "password123",
	}

	jsonData, _ = json.Marshal(loginData)
	req, _ = http.NewRequest("POST", "/api/login", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	var loginResponse map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &loginResponse)
	token := loginResponse["token"].(string)

	// Test get profile
	req, _ = http.NewRequest("GET", "/api/profile", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var profileResponse map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &profileResponse)
	assert.NoError(t, err)
	assert.Equal(t, "profiletestuser", profileResponse["username"])
	assert.Equal(t, "profiletest@example.com", profileResponse["email"])
}

// Benchmark tests for performance
func BenchmarkPasswordHashing(b *testing.B) {
	password := "testpassword123"
	for i := 0; i < b.N; i++ {
		hashPassword(password)
	}
}

func BenchmarkPasswordVerification(b *testing.B) {
	password := "testpassword123"
	hash, _ := hashPassword(password)
	for i := 0; i < b.N; i++ {
		checkPassword(password, hash)
	}
}

// Helper functions for validation (these would be implemented in the main code)
func isValidEmail(email string) bool {
	// Simple email validation - in production you'd use a proper library
	return len(email) > 3 && len(email) < 254 &&
		bytes.Contains([]byte(email), []byte("@")) &&
		bytes.Contains([]byte(email), []byte("."))
}

func isValidPassword(password string) bool {
	return len(password) >= 6
}
