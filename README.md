# Go Portfolio Task Manager

A comprehensive full-stack Go application showcasing modern web development practices, authentication, and task management capabilities. This project demonstrates proficiency in Go backend development, frontend integration, and DevOps practices.

## 🚀 **Phase 2: Enhanced Frontend & User Experience**

### ✨ **New Features in Phase 2**

#### 🎨 **Enhanced User Interface**
- **Modern Design**: Beautiful gradient backgrounds and smooth animations
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, transitions, and visual feedback
- **Dark Mode Support**: Automatic theme switching based on system preferences

#### 🔧 **Advanced Form Features**
- **Real-time Validation**: Instant feedback on username, email, and password input
- **Password Strength Indicator**: Visual strength meter with color-coded feedback
- **Form Accessibility**: Enhanced focus management and keyboard navigation
- **Input Placeholders**: Helpful guidance text for better user experience

#### ⌨️ **Keyboard Shortcuts**
- **Ctrl/Cmd + K**: Quick focus on task input
- **Ctrl/Cmd + Enter**: Submit any active form
- **Escape**: Close modals and cancel operations
- **Tab Navigation**: Full keyboard accessibility

#### 📊 **Task Management Enhancements**
- **Task Statistics**: Real-time counters for total, completed, and pending tasks
- **Sorting**: Tasks automatically sorted by creation date (newest first)
- **Modal Editing**: Inline task editing with modal dialogs
- **Visual Indicators**: Color-coded task status and completion states

#### 🎯 **User Experience Improvements**
- **Loading States**: Smooth loading indicators for all operations
- **Toast Notifications**: Non-intrusive success/error messages
- **Welcome Animation**: Smooth transitions when logging in
- **Task Cards**: Enhanced visual design with hover effects

#### 🔒 **Security Enhancements**
- **Input Sanitization**: Proper validation and sanitization
- **Password Requirements**: Minimum length and strength validation
- **Session Management**: Secure token handling and storage
- **CORS Configuration**: Proper cross-origin request handling

## 🏗️ **Architecture Overview**

### **Backend (Go + Gin)**
- **RESTful API**: Clean, well-structured endpoints
- **JWT Authentication**: Secure token-based authentication
- **In-Memory Storage**: Fast, reliable data storage (Phase 1)
- **Middleware**: CORS, authentication, and error handling
- **Validation**: Input validation and sanitization

### **Frontend (HTML5 + CSS3 + JavaScript)**
- **Vanilla JavaScript**: No framework dependencies
- **Tailwind CSS**: Utility-first styling approach
- **Font Awesome**: Professional iconography
- **Responsive Design**: Mobile-first approach
- **Progressive Enhancement**: Works without JavaScript

### **Development Tools**
- **Docker**: Containerized deployment
- **Makefile**: Development task automation
- **Testing**: Comprehensive unit and integration tests
- **Documentation**: Detailed API and setup documentation

## 🚀 **Quick Start**

### **Prerequisites**
- Go 1.22 or higher
- Git
- Docker (optional)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/ryanegauthier/go-with-tests.git
   cd go-with-tests
   ```

2. **Install dependencies**
   ```bash
   go mod tidy
   ```

3. **Run the application**
   ```bash
   go run .
   ```

4. **Access the application**
   - Open your browser to `http://localhost:8080`
   - Register a new account or login with existing credentials

### **Using Docker**

```bash
# Build and run with Docker
docker build -t go-portfolio-app .
docker run -p 8080:8080 go-portfolio-app

# Or use Docker Compose
docker-compose up --build
```

## 📁 **Project Structure**

```
go-with-tests/
├── main.go              # Main application entry point
├── auth.go              # JWT authentication middleware
├── main_test.go         # Comprehensive test suite
├── go.mod               # Go module dependencies
├── go.sum               # Dependency checksums
├── Dockerfile           # Container configuration
├── docker-compose.yml   # Multi-service setup
├── Makefile             # Development tasks
├── .gitignore           # Version control exclusions
├── README.md            # Project documentation
├── templates/
│   └── index.html       # Main application template
└── static/
    ├── css/
    │   └── style.css    # Enhanced styling and animations
    └── js/
        └── app.js       # Frontend JavaScript logic
```

## 🔧 **Configuration**

### **Environment Variables**
```bash
# JWT Configuration
JWT_SECRET=your-secret-key-here

# Server Configuration
PORT=8080

# Database Configuration (Phase 3)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanager
DB_USER=postgres
DB_PASSWORD=password
```

### **API Endpoints**

#### **Authentication**
- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `GET /api/profile` - Get user profile (protected)

#### **Task Management**
- `GET /api/tasks` - Get all tasks (protected)
- `POST /api/tasks` - Create new task (protected)
- `GET /api/tasks/:id` - Get specific task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)

## 🧪 **Testing**

### **Running Tests**
```bash
# Run all tests
go test -v

# Run tests with coverage
go test -cover

# Run benchmark tests
go test -bench=.

# Run specific test
go test -v -run TestPasswordHashing
```

### **Test Coverage**
- **Unit Tests**: Core functionality testing
- **Integration Tests**: API endpoint testing
- **Benchmark Tests**: Performance testing
- **Validation Tests**: Input validation testing

## 🐳 **Docker Support**

### **Building the Image**
```bash
docker build -t go-portfolio-app .
```

### **Running with Docker Compose**
```bash
# Start the application
docker-compose up --build

# Run in background
docker-compose up -d

# Stop the application
docker-compose down
```

## 📊 **API Documentation**

### **Request/Response Examples**

#### **User Registration**
```bash
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### **User Login**
```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

#### **Create Task**
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the Go portfolio project"
  }'
```

## 🔒 **Security Features**

### **Authentication**
- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: bcrypt with salt
- **Token Expiration**: Configurable token lifetime
- **Secure Headers**: CORS and security headers

### **Input Validation**
- **Email Validation**: Proper email format checking
- **Password Strength**: Minimum requirements enforcement
- **Username Validation**: Length and format validation
- **SQL Injection Prevention**: Parameterized queries

### **Data Protection**
- **HTTPS Ready**: Secure communication support
- **Input Sanitization**: XSS prevention
- **CSRF Protection**: Token-based protection
- **Rate Limiting**: Request throttling (Phase 3)

## 🎯 **Portfolio Highlights**

### **Technical Skills Demonstrated**
- ✅ **Go Development**: Modern Go practices and idioms
- ✅ **Web Framework**: Gin framework mastery
- ✅ **Authentication**: JWT implementation
- ✅ **API Design**: RESTful API development
- ✅ **Frontend Development**: HTML5, CSS3, JavaScript
- ✅ **Testing**: Comprehensive test coverage
- ✅ **DevOps**: Docker and deployment
- ✅ **Security**: Industry-standard security practices

### **Development Practices**
- ✅ **Clean Code**: Well-structured, readable code
- ✅ **Documentation**: Comprehensive documentation
- ✅ **Version Control**: Git workflow
- ✅ **Testing**: Unit and integration tests
- ✅ **Containerization**: Docker support
- ✅ **CI/CD Ready**: Automated testing and deployment

## 🚀 **Future Enhancements (Phase 3)**

### **Database Integration**
- **PostgreSQL**: Production-ready database
- **Migrations**: Database schema management
- **Connection Pooling**: Optimized database connections
- **Backup Strategy**: Data protection and recovery

### **Advanced Features**
- **Real-time Updates**: WebSocket integration
- **File Uploads**: Task attachments
- **Search & Filtering**: Advanced task management
- **User Roles**: Admin and user permissions
- **API Rate Limiting**: Request throttling
- **Monitoring**: Application metrics and logging

### **Production Deployment**
- **Load Balancing**: Horizontal scaling
- **SSL/TLS**: HTTPS encryption
- **Monitoring**: Application performance monitoring
- **Logging**: Structured logging with ELK stack
- **Backup**: Automated backup strategies

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**Ryan Gauthier**
- GitHub: [@ryanegauthier](https://github.com/ryanegauthier)
- Portfolio: [Portfolio Website](https://your-portfolio.com)

---

**Built with ❤️ using Go, Gin, and modern web technologies**
