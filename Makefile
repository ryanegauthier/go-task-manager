.PHONY: help build run test test-coverage test-bench clean docker-build docker-run docker-compose-up docker-compose-down

# Default target
help:
	@echo "Available commands:"
	@echo "  build          - Build the application"
	@echo "  run            - Run the application"
	@echo "  test           - Run tests"
	@echo "  test-coverage  - Run tests with coverage"
	@echo "  test-bench     - Run benchmark tests"
	@echo "  clean          - Clean build artifacts"
	@echo "  docker-build   - Build Docker image"
	@echo "  docker-run     - Run Docker container"
	@echo "  docker-compose-up   - Start with Docker Compose"
	@echo "  docker-compose-down - Stop Docker Compose"

# Build the application
build:
	@echo "Building application..."
	go build -o main .

# Run the application
run:
	@echo "Running application..."
	go run .

# Run tests
test:
	@echo "Running tests..."
	go test -v ./...

# Run tests with coverage
test-coverage:
	@echo "Running tests with coverage..."
	go test -v -cover ./...

# Run benchmark tests
test-bench:
	@echo "Running benchmark tests..."
	go test -bench=. ./...

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -f main
	rm -f *.db
	rm -f coverage.txt

# Build Docker image
docker-build:
	@echo "Building Docker image..."
	docker build -t go-portfolio-app .

# Run Docker container
docker-run:
	@echo "Running Docker container..."
	docker run -p 8080:8080 go-portfolio-app

# Start with Docker Compose
docker-compose-up:
	@echo "Starting with Docker Compose..."
	docker-compose up -d

# Stop Docker Compose
docker-compose-down:
	@echo "Stopping Docker Compose..."
	docker-compose down

# Install dependencies
deps:
	@echo "Installing dependencies..."
	go mod download

# Format code
fmt:
	@echo "Formatting code..."
	go fmt ./...

# Lint code
lint:
	@echo "Linting code..."
	golangci-lint run

# Generate documentation
docs:
	@echo "Generating documentation..."
	godoc -http=:6060

# Run with hot reload (requires air)
dev:
	@echo "Running with hot reload..."
	air

# Create database migration
migrate:
	@echo "Running database migrations..."
	go run . migrate
