# Go Portfolio Task Manager

A full-stack Go web application demonstrating modern web development practices, authentication, database management, and comprehensive testing. This project serves as an excellent portfolio piece showcasing Go development skills.

## 🚀 Features

### Backend (Go)
- **RESTful API** with Gin framework
- **JWT Authentication** with secure token management
- **SQLite Database** with GORM ORM
- **Password Hashing** using bcrypt
- **CORS Support** for cross-origin requests
- **Input Validation** and error handling
- **Comprehensive Testing** with unit and integration tests

### Frontend
- **Modern UI** with Tailwind CSS
- **Responsive Design** for all devices
- **Real-time Updates** with JavaScript
- **User Authentication** flow
- **Task Management** with CRUD operations
- **Toast Notifications** for user feedback

### Testing
- **Unit Tests** for all business logic
- **Integration Tests** for API endpoints
- **Benchmark Tests** for performance
- **Test Coverage** for authentication, CRUD operations, and validation

## 🛠️ Tech Stack

- **Backend**: Go 1.22+, Gin, GORM, JWT, bcrypt
- **Database**: SQLite (with GORM)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS, Font Awesome
- **Testing**: Go testing package, testify
- **Development**: Docker support

## 📋 Prerequisites

- Go 1.22 or higher
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd go-portfolio-app
```

### 2. Install Dependencies
```bash
go mod download
```

### 3. Run the Application
```bash
go run .
```

The application will be available at `http://localhost:8080`

### 4. Run Tests
```bash
go test -v
```

For test coverage:
```bash
go test -cover
```

For benchmark tests:
```bash
go test -bench=.
```

## 📁 Project Structure

```
go-portfolio-app/
├── main.go              # Main application entry point
├── auth.go              # Authentication middleware and JWT utilities
├── main_test.go         # Comprehensive test suite
├── go.mod               # Go module dependencies
├── go.sum               # Dependency checksums
├── templates/
│   └── index.html       # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css    # Custom CSS styles
│   └── js/
│       └── app.js       # Frontend JavaScript
├── README.md            # This file
└── .env                 # Environment variables (create this)
```

## 🔧 Configuration

Create a `.env` file in the root directory:

```env
PORT=8080
GIN_MODE=debug
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/register
Register a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### POST /api/login
Authenticate a user.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Protected Endpoints (Require Authorization Header)

#### GET /api/tasks
Get all tasks for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### POST /api/tasks
Create a new task.

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs"
}
```

#### GET /api/tasks/:id
Get a specific task.

#### PUT /api/tasks/:id
Update a task.

#### DELETE /api/tasks/:id
Delete a task.

#### GET /api/profile
Get user profile information.

## 🧪 Testing

The project includes comprehensive tests covering:

- **Authentication**: Password hashing, JWT token generation/validation
- **User Management**: Registration, login, profile retrieval
- **Task Management**: Full CRUD operations
- **API Endpoints**: All REST endpoints with proper status codes
- **Validation**: Input validation and error handling
- **Security**: Authentication middleware testing

### Running Tests

```bash
# Run all tests
go test -v

# Run tests with coverage
go test -cover

# Run specific test
go test -v -run TestUserRegistration

# Run benchmark tests
go test -bench=.

# Run tests with race detection
go test -race
```

## 🐳 Docker Support

### Build Docker Image
```bash
docker build -t go-portfolio-app .
```

### Run with Docker
```bash
docker run -p 8080:8080 go-portfolio-app
```

### Docker Compose
```bash
docker-compose up -d
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with cost factor 14
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Proper CORS headers
- **SQL Injection Prevention**: GORM parameterized queries
- **XSS Protection**: Proper content-type headers

## 🎯 Portfolio Highlights

This project demonstrates:

1. **Full-Stack Development**: Complete web application with frontend and backend
2. **Modern Go Practices**: Using latest Go features and popular frameworks
3. **Database Design**: Proper schema design with relationships
4. **Authentication System**: Secure user authentication and authorization
5. **API Design**: RESTful API with proper HTTP status codes
6. **Testing**: Comprehensive test coverage with different test types
7. **Frontend Development**: Modern UI with responsive design
8. **Error Handling**: Proper error management and user feedback
9. **Documentation**: Clear API documentation and setup instructions
10. **Security**: Industry-standard security practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Your Name - [your-email@example.com](mailto:your-email@example.com)

## 🙏 Acknowledgments

- [Gin Web Framework](https://github.com/gin-gonic/gin)
- [GORM](https://gorm.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Font Awesome](https://fontawesome.com/)

---

**Note**: This is a portfolio project demonstrating Go development skills. For production use, additional security measures, logging, monitoring, and deployment configurations should be implemented.
