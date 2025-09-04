# Go Portfolio App - Makefile (Phase 3)

.PHONY: help build run test clean docker-build docker-run docker-stop docker-clean db-setup db-reset db-migrate lint format

# Default target
help:
	@echo "Go Portfolio App - Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  build        - Build the application"
	@echo "  run          - Run the application locally"
	@echo "  test         - Run tests"
	@echo "  lint         - Run linter"
	@echo "  format       - Format code"
	@echo ""
	@echo "Database:"
	@echo "  db-setup     - Setup PostgreSQL database"
	@echo "  db-reset     - Reset database (drop and recreate)"
	@echo "  db-migrate   - Run database migrations"
	@echo ""
	@echo "Docker:"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-run   - Run with Docker Compose"
	@echo "  docker-stop  - Stop Docker containers"
	@echo "  docker-clean - Clean up Docker resources"
	@echo ""
	@echo "Utilities:"
	@echo "  clean        - Clean build artifacts"

# Build the application
build:
	@echo "Building Go Portfolio App..."
	go build -o bin/go-portfolio-app .

# Run the application locally
run:
	@echo "Running Go Portfolio App..."
	go run .

# Run tests
test:
	@echo "Running tests..."
	go test -v -race -cover ./...

# Run tests with coverage report
test-coverage:
	@echo "Running tests with coverage..."
	go test -v -race -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report generated: coverage.html"

# Run benchmark tests
bench:
	@echo "Running benchmark tests..."
	go test -bench=. -benchmem ./...

# Run linter
lint:
	@echo "Running linter..."
	golangci-lint run

# Format code
format:
	@echo "Formatting code..."
	go fmt ./...
	goimports -w .

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf bin/
	rm -f coverage.out coverage.html
	go clean

# Database setup
db-setup:
	@echo "Setting up PostgreSQL database..."
	docker-compose up -d postgres
	@echo "Waiting for database to be ready..."
	@sleep 10
	@echo "Database setup complete!"

# Reset database
db-reset:
	@echo "Resetting database..."
	docker-compose down -v
	docker-compose up -d postgres
	@echo "Waiting for database to be ready..."
	@sleep 10
	@echo "Database reset complete!"

# Run database migrations
db-migrate:
	@echo "Running database migrations..."
	go run . --migrate

# Build Docker image
docker-build:
	@echo "Building Docker image..."
	docker build -t go-portfolio-app .

# Run with Docker Compose
docker-run:
	@echo "Starting services with Docker Compose..."
	docker-compose up --build -d
	@echo "Services started! Access the app at http://localhost:8080"

# Stop Docker containers
docker-stop:
	@echo "Stopping Docker containers..."
	docker-compose down

# Clean up Docker resources
docker-clean:
	@echo "Cleaning up Docker resources..."
	docker-compose down -v --remove-orphans
	docker system prune -f

# Development environment setup
dev-setup: db-setup
	@echo "Development environment setup complete!"
	@echo "Run 'make run' to start the application"

# Production build
prod-build:
	@echo "Building for production..."
	CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/go-portfolio-app .

# Install dependencies
deps:
	@echo "Installing dependencies..."
	go mod download
	go mod tidy

# Generate API documentation
docs:
	@echo "Generating API documentation..."
	@echo "API documentation would be generated here"
	@echo "Consider using tools like swaggo/swag for Go API documentation"

# Security scan
security:
	@echo "Running security scan..."
	gosec ./...

# Performance profiling
profile:
	@echo "Running performance profiling..."
	go run . &
	@sleep 2
	curl -X POST http://localhost:8080/api/register \
		-H "Content-Type: application/json" \
		-d '{"username":"profileuser","email":"profile@test.com","password":"password123"}'
	@echo "Profile data collected"

# Load testing
load-test:
	@echo "Running load tests..."
	@echo "Consider using tools like hey or wrk for load testing"
	@echo "Example: hey -n 1000 -c 10 http://localhost:8080/"

# Backup database
db-backup:
	@echo "Creating database backup..."
	docker exec go-task-manager-postgres pg_dump -U postgres taskmanager > backup_$(shell date +%Y%m%d_%H%M%S).sql

# Restore database
db-restore:
	@echo "Restoring database from backup..."
	@read -p "Enter backup file name: " backup_file; \
	docker exec -i go-task-manager-postgres psql -U postgres taskmanager < $$backup_file

# Monitor logs
logs:
	@echo "Showing application logs..."
	docker-compose logs -f app

# Monitor database logs
db-logs:
	@echo "Showing database logs..."
	docker-compose logs -f postgres

# Health check
health:
	@echo "Checking service health..."
	@curl -f http://localhost:8080/ || echo "Application not responding"
	@docker exec go-task-manager-postgres pg_isready -U postgres || echo "Database not responding"

# Full development workflow
dev: deps db-setup run

# Full production deployment
prod: prod-build docker-run

# Quick test
quick-test:
	@echo "Running quick tests..."
	go test -v -short ./...
