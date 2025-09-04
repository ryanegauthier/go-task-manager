# Go Portfolio Task Manager

A comprehensive full-stack Go application showcasing modern web development practices, authentication, database management, and production-ready features. This project demonstrates proficiency in Go backend development, frontend integration, DevOps practices, and database design.

## 🚀 **Phase 3: Database Integration & Production Features**

### ✨ **New Features in Phase 3**

#### 🗄️ **Database Integration**
- **PostgreSQL Database**: Production-ready relational database
- **GORM ORM**: Modern Go ORM with automatic migrations
- **Database Relationships**: Proper foreign key relationships
- **Connection Pooling**: Optimized database connections
- **Auto Migration**: Automatic schema creation and updates

#### 🔧 **Production Features**
- **Docker Compose**: Multi-service container orchestration
- **Environment Configuration**: Comprehensive .env support
- **Health Checks**: Service health monitoring
- **Database Backup**: Automated backup strategies
- **Redis Integration**: Caching layer support

#### 🛡️ **Advanced Security**
- **Input Validation**: Enhanced request validation
- **SQL Injection Prevention**: Parameterized queries
- **Database Security**: Proper user permissions
- **Environment Variables**: Secure configuration management

#### 📊 **Enhanced Testing**
- **Integration Tests**: Full API endpoint testing
- **Database Tests**: Real database testing
- **Test Isolation**: Clean test environment
- **Benchmark Tests**: Performance testing

## 🏗️ **Architecture Overview**

### **Backend (Go + Gin + GORM)**
- **RESTful API**: Clean, well-structured endpoints
- **JWT Authentication**: Secure token-based authentication
- **PostgreSQL Database**: Production-ready data storage
- **GORM ORM**: Modern database abstraction
- **Middleware**: CORS, authentication, and error handling
- **Validation**: Input validation and sanitization

### **Database (PostgreSQL)**
- **Relational Design**: Proper table relationships
- **Indexes**: Performance optimization
- **Migrations**: Schema version control
- **Backup Strategy**: Data protection
- **Connection Pooling**: Efficient resource usage

### **Frontend (HTML5 + CSS3 + JavaScript)**
- **Vanilla JavaScript**: No framework dependencies
- **Tailwind CSS**: Utility-first styling approach
- **Font Awesome**: Professional iconography
- **Responsive Design**: Mobile-first approach
- **Progressive Enhancement**: Works without JavaScript

### **DevOps (Docker + Docker Compose)**
- **Containerization**: Isolated service deployment
- **Multi-Service**: Database, application, and cache
- **Health Monitoring**: Service health checks
- **Environment Management**: Development and production configs
- **Automated Setup**: One-command deployment

## 🚀 **Quick Start**

### **Prerequisites**
- Go 1.22 or higher
- Docker and Docker Compose
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/ryanegauthier/go-task-manager.git
   cd go-task-manager
   ```

2. **Setup with Docker Compose (Recommended)**
   ```bash
   # Start all services
   docker-compose up --build -d
   
   # Or use Makefile
   make docker-run
   ```

3. **Local Development Setup**
   ```bash
   # Setup database
   make db-setup
   
   # Run application
   make run
   ```

4. **Access the application**
   - Open your browser to `http://localhost:8080`
   - Register a new account or login with existing credentials

### **🌐 Live Deployment**

**Try the live application**: [Go Task Manager on Render](https://go-task-manager.onrender.com)

- ✅ **Live Demo**: Fully functional task management application
- ✅ **Production Database**: Managed PostgreSQL database
- ✅ **HTTPS Secure**: SSL certificate included
- ✅ **Auto-Deploy**: Updates automatically on code changes

### **Using Makefile Commands**

```bash
# Development
make dev-setup    # Setup development environment
make run          # Run application locally
make test         # Run tests
make test-coverage # Run tests with coverage

# Database
make db-setup     # Setup PostgreSQL database
make db-reset     # Reset database
make db-backup    # Create database backup

# Docker
make docker-run   # Start with Docker Compose
make docker-stop  # Stop containers
make docker-clean # Clean up resources

# Utilities
make lint         # Run linter
make format       # Format code
make health       # Check service health
```

## 📁 **Project Structure**

```
go-task-manager/
├── main.go              # Main application entry point
├── auth.go              # JWT authentication middleware
├── main_test.go         # Comprehensive test suite
├── go.mod               # Go module dependencies
├── go.sum               # Dependency checksums
├── Dockerfile           # Container configuration
├── docker-compose.yml   # Multi-service setup
├── render.yaml          # Render.com deployment config
├── .dockerignore        # Docker ignore file
├── Makefile             # Development tasks
├── .env                 # Environment variables
├── .gitignore           # Version control exclusions
├── README.md            # Project documentation
├── DEPLOYMENT.md        # Render deployment guide
├── init.sql             # Database initialization
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
# Server Configuration
PORT=8080
GIN_MODE=release

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanager
DB_USER=postgres
DB_PASSWORD=password
DB_SSLMODE=disable

# Redis Configuration (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Security Configuration
CORS_ORIGIN=*
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_HEADERS=Origin,Content-Type,Content-Length,Accept-Encoding,X-CSRF-Token,Authorization
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
go test -v -cover

# Run benchmark tests
go test -bench=.

# Run specific test
go test -v -run TestPasswordHashing
```

### **Test Coverage**
- **Unit Tests**: Core functionality testing
- **Integration Tests**: API endpoint testing with real database
- **Benchmark Tests**: Performance testing
- **Validation Tests**: Input validation testing

### **Test Database**
The application uses a separate test database (`taskmanager_test`) to ensure test isolation and prevent data conflicts.

## 🐳 **Docker Support**

### **Services**
- **PostgreSQL**: Production database
- **Redis**: Caching layer (optional)
- **Go Application**: Main application server

### **Running with Docker Compose**
```bash
# Start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean up
docker-compose down -v --remove-orphans
```

### **Database Management**
```bash
# Create database backup
docker exec go-task-manager-postgres pg_dump -U postgres taskmanager > backup.sql

# Restore database
docker exec -i go-task-manager-postgres psql -U postgres taskmanager < backup.sql

# Access database shell
docker exec -it go-task-manager-postgres psql -U postgres taskmanager
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

### **Database Security**
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Parameterized queries via GORM
- **User Permissions**: Proper database user permissions
- **Connection Security**: SSL/TLS support

### **Data Protection**
- **HTTPS Ready**: Secure communication support
- **Input Sanitization**: XSS prevention
- **CSRF Protection**: Token-based protection
- **Environment Variables**: Secure configuration management

## 🎯 **Portfolio Highlights**

### **Technical Skills Demonstrated**
- ✅ **Go Development**: Modern Go practices and idioms
- ✅ **Web Framework**: Gin framework mastery
- ✅ **Database Design**: PostgreSQL with GORM
- ✅ **Authentication**: JWT implementation
- ✅ **API Design**: RESTful API development
- ✅ **Frontend Development**: HTML5, CSS3, JavaScript
- ✅ **Testing**: Comprehensive test coverage
- ✅ **DevOps**: Docker and containerization
- ✅ **Cloud Deployment**: Render.com production deployment
- ✅ **Security**: Industry-standard security practices

### **Development Practices**
- ✅ **Clean Code**: Well-structured, readable code
- ✅ **Documentation**: Comprehensive documentation
- ✅ **Version Control**: Git workflow
- ✅ **Testing**: Unit and integration tests
- ✅ **Containerization**: Docker support
- ✅ **CI/CD Ready**: Automated testing and deployment

### **Production Features**
- ✅ **Database Integration**: PostgreSQL with GORM
- ✅ **Multi-Service Architecture**: Docker Compose
- ✅ **Environment Management**: Configuration management
- ✅ **Health Monitoring**: Service health checks
- ✅ **Backup Strategy**: Database backup procedures
- ✅ **Performance Optimization**: Connection pooling
- ✅ **Cloud Deployment**: Production-ready Render.com deployment
- ✅ **HTTPS Security**: SSL certificate and secure connections

## 🚀 **Future Enhancements**

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
- **CI/CD**: Automated deployment pipeline

### **Performance Optimization**
- **Caching**: Redis integration
- **Database Optimization**: Query optimization
- **Connection Pooling**: Efficient resource usage
- **CDN**: Static asset delivery
- **Compression**: Response compression

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

**Built with ❤️ using Go, Gin, PostgreSQL, and modern web technologies**
