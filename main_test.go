package main

import (
	"bytes"
	"testing"

	"github.com/stretchr/testify/assert"
)

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
