# 🚀 Render.com Deployment Guide

This guide will walk you through deploying your Go Task Manager application to Render.com, a modern cloud platform that offers free hosting for web applications.

## 📋 Prerequisites

- A GitHub account with your `go-task-manager` repository
- A Render.com account (free tier available)
- Your Go application ready for deployment

## 🔧 Pre-Deployment Setup

### 1. Ensure Your Code is Ready

Make sure your application:
- ✅ Has all the necessary files (`render.yaml`, `Dockerfile`, `.dockerignore`)
- ✅ Uses environment variables for configuration
- ✅ Listens on the port specified by the `PORT` environment variable
- ✅ Has proper error handling and logging

### 2. Verify Your Repository

Your repository should contain:
```
go-task-manager/
├── main.go              # Main application
├── auth.go              # Authentication middleware
├── go.mod               # Go module file
├── go.sum               # Go dependencies
├── render.yaml          # Render deployment config
├── Dockerfile           # Container configuration
├── .dockerignore        # Docker ignore file
├── templates/           # HTML templates
│   └── index.html
└── static/              # Static assets
    ├── css/
    └── js/
```

## 🚀 Deployment Steps

### Step 1: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click "Get Started" and sign up with your GitHub account
3. Verify your email address

### Step 2: Connect Your Repository

1. In your Render dashboard, click "New +"
2. Select "Blueprint" (for multi-service deployment)
3. Connect your GitHub account if not already connected
4. Select your `go-task-manager` repository
5. Render will automatically detect the `render.yaml` file

### Step 3: Configure Deployment

1. **Blueprint Name**: `go-task-manager` (or your preferred name)
2. **Branch**: `main` (or your default branch)
3. **Root Directory**: Leave empty (uses repository root)
4. Click "Apply"

### Step 4: Monitor Deployment

1. Render will start building your application
2. You can monitor the build logs in real-time
3. The deployment process will:
   - Create a PostgreSQL database
   - Build your Go application
   - Deploy the web service
   - Configure environment variables

### Step 5: Access Your Application

1. Once deployment is complete, you'll get a URL like:
   `https://go-task-manager.onrender.com`
2. Click the URL to access your application
3. Test the functionality:
   - Register a new user
   - Login
   - Create and manage tasks

## 🔧 Environment Variables

Render automatically configures these environment variables:

### Database Variables (Auto-configured)
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_SSLMODE`: SSL mode (set to "require")

### Application Variables
- `PORT`: 10000 (Render's default)
- `GIN_MODE`: release
- `JWT_SECRET`: Auto-generated secure secret
- `CORS_ORIGIN`: "*" (for development)
- `CORS_METHODS`: "GET,POST,PUT,DELETE,OPTIONS"
- `CORS_HEADERS`: Standard CORS headers

## 📊 Monitoring and Logs

### View Logs
1. Go to your service dashboard in Render
2. Click on the "Logs" tab
3. View real-time application logs
4. Monitor for any errors or issues

### Health Checks
- Render automatically monitors your application
- Health check endpoint: `/`
- If the health check fails, Render will restart your service

### Performance Monitoring
- Monitor response times
- Check database connections
- Review error rates

## 🔄 Continuous Deployment

### Automatic Deployments
- Render automatically deploys when you push to your main branch
- You can disable auto-deploy in the service settings
- Manual deployments are also available

### Deployment Triggers
- Push to main branch
- Manual deployment from dashboard
- Webhook triggers

## 🛠️ Troubleshooting

### Common Issues

#### 1. Build Failures
**Problem**: Application fails to build
**Solution**:
- Check the build logs for specific errors
- Ensure all dependencies are in `go.mod`
- Verify the Dockerfile is correct

#### 2. Database Connection Issues
**Problem**: Can't connect to PostgreSQL
**Solution**:
- Verify database environment variables
- Check SSL mode configuration
- Ensure database is created and accessible

#### 3. Port Issues
**Problem**: Application not responding
**Solution**:
- Ensure your app listens on `PORT` environment variable
- Check that port 10000 is exposed in Dockerfile
- Verify health check endpoint

#### 4. Static Files Not Loading
**Problem**: CSS/JS files not found
**Solution**:
- Ensure static files are copied in Dockerfile
- Check file paths in templates
- Verify static file serving configuration

### Debugging Steps

1. **Check Build Logs**
   ```bash
   # View build logs in Render dashboard
   ```

2. **Check Runtime Logs**
   ```bash
   # View application logs in Render dashboard
   ```

3. **Test Locally**
   ```bash
   # Test with similar environment
   docker-compose up --build
   ```

4. **Verify Environment Variables**
   - Check all required variables are set
   - Ensure database connection details are correct

## 🔒 Security Considerations

### Production Security
- ✅ JWT secret is auto-generated
- ✅ Database uses SSL connections
- ✅ Non-root user in container
- ✅ Environment variables for sensitive data

### Additional Security Measures
- Consider setting up custom domain with SSL
- Implement rate limiting
- Add request validation
- Set up monitoring and alerting

## 📈 Scaling

### Free Tier Limitations
- 750 hours per month
- 512MB RAM
- Shared CPU
- 1GB disk space

### Paid Plans
- More resources available
- Custom domains
- SSL certificates
- Advanced monitoring

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Go on Render](https://render.com/docs/deploy-go)
- [PostgreSQL on Render](https://render.com/docs/databases)
- [Environment Variables](https://render.com/docs/environment-variables)

## 🎉 Success!

Once deployed, your application will be:
- ✅ Live and accessible via HTTPS
- ✅ Connected to a managed PostgreSQL database
- ✅ Automatically deployed on code changes
- ✅ Monitored and logged
- ✅ Ready for production use

Your Go Task Manager is now a professional, deployed application that demonstrates:
- Full-stack development skills
- Cloud deployment experience
- Database management
- DevOps practices
- Production-ready code

---

**Happy Deploying! 🚀**
