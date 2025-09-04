// Go Portfolio App - Frontend JavaScript

class TaskManager {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
        this.tasks = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.loadTasks();
    }

    setupEventListeners() {
        // Auth forms
        document.getElementById('loginFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        document.getElementById('registerFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });

        // Task form
        document.getElementById('createTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTask();
        });
    }

    checkAuthStatus() {
        if (this.token) {
            this.showMainApp();
        } else {
            this.showAuthForms();
        }
    }

    showAuthForms() {
        document.getElementById('authForms').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }

    showMainApp() {
        document.getElementById('authForms').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        document.getElementById('userInfo').textContent = this.user.username || 'User';
    }

    async makeRequest(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (this.token) {
            defaultOptions.headers['Authorization'] = `Bearer ${this.token}`;
        }

        const finalOptions = { ...defaultOptions, ...options };

        try {
            this.showLoading(true);
            const response = await fetch(url, finalOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            this.showToast('Error', error.message, 'error');
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    async login() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const data = await this.makeRequest('/api/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });

            this.token = data.token;
            this.user = data.user;
            
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));

            this.showToast('Success', 'Login successful!', 'success');
            this.showMainApp();
            this.loadTasks();
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    async register() {
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const data = await this.makeRequest('/api/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
            });

            this.showToast('Success', 'Registration successful! Please login.', 'success');
            toggleForms(); // Switch back to login form
        } catch (error) {
            console.error('Registration failed:', error);
        }
    }

    logout() {
        this.token = null;
        this.user = {};
        this.tasks = [];
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        this.showAuthForms();
        this.showToast('Info', 'Logged out successfully', 'info');
    }

    async loadTasks() {
        if (!this.token) return;

        try {
            const tasks = await this.makeRequest('/api/tasks');
            this.tasks = tasks;
            this.renderTasks();
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    }

    async createTask() {
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;

        try {
            const task = await this.makeRequest('/api/tasks', {
                method: 'POST',
                body: JSON.stringify({ title, description }),
            });

            this.tasks.push(task);
            this.renderTasks();
            
            // Clear form
            document.getElementById('createTaskForm').reset();
            
            this.showToast('Success', 'Task created successfully!', 'success');
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    }

    async updateTask(taskId, updates) {
        try {
            const task = await this.makeRequest(`/api/tasks/${taskId}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });

            const index = this.tasks.findIndex(t => t.id === taskId);
            if (index !== -1) {
                this.tasks[index] = task;
                this.renderTasks();
            }

            this.showToast('Success', 'Task updated successfully!', 'success');
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }

    async deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await this.makeRequest(`/api/tasks/${taskId}`, {
                method: 'DELETE',
            });

            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.renderTasks();
            
            this.showToast('Success', 'Task deleted successfully!', 'success');
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        if (this.tasks.length === 0) {
            taskList.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-clipboard-list text-4xl mb-4"></i>
                    <p>No tasks yet. Create your first task!</p>
                </div>
            `;
            return;
        }

        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            taskList.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = 'task-card bg-gray-50 rounded-lg p-4 border border-gray-200';
        div.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h4 class="font-semibold text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}">${task.title}</h4>
                <div class="flex space-x-2">
                    <button onclick="taskManager.editTask(${task.id})" 
                            class="text-blue-600 hover:text-blue-800 text-sm">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="taskManager.deleteTask(${task.id})" 
                            class="text-red-600 hover:text-red-800 text-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${task.description ? `<p class="text-gray-600 text-sm mb-3">${task.description}</p>` : ''}
            <div class="flex justify-between items-center text-xs text-gray-500">
                <span>Created: ${new Date(task.created_at).toLocaleDateString()}</span>
                <label class="flex items-center space-x-2">
                    <input type="checkbox" 
                           ${task.completed ? 'checked' : ''} 
                           onchange="taskManager.toggleTaskComplete(${task.id}, this.checked)"
                           class="rounded">
                    <span>Complete</span>
                </label>
            </div>
        `;
        return div;
    }

    async editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const newTitle = prompt('Enter new title:', task.title);
        if (!newTitle) return;

        const newDescription = prompt('Enter new description:', task.description || '');

        await this.updateTask(taskId, {
            title: newTitle,
            description: newDescription,
        });
    }

    async toggleTaskComplete(taskId, completed) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        task.completed = completed;
        this.renderTasks();
        
        // Note: In a real app, you'd want to send this to the server
        this.showToast('Info', `Task ${completed ? 'completed' : 'uncompleted'}!`, 'info');
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }

    showToast(title, message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');

        // Set icon based on type
        let iconClass = 'fas fa-info-circle text-blue-500';
        if (type === 'success') iconClass = 'fas fa-check-circle text-green-500';
        if (type === 'error') iconClass = 'fas fa-exclamation-circle text-red-500';
        if (type === 'warning') iconClass = 'fas fa-exclamation-triangle text-yellow-500';

        toastIcon.innerHTML = `<i class="${iconClass} text-xl"></i>`;
        toastTitle.textContent = title;
        toastMessage.textContent = message;

        // Show toast
        toast.classList.remove('hidden');
        toast.classList.add('toast-enter');

        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => {
                toast.classList.add('hidden');
                toast.classList.remove('toast-enter', 'toast-exit');
            }, 300);
        }, 3000);
    }
}

// Global functions for HTML onclick handlers
function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }
}

function logout() {
    taskManager.logout();
}

// Initialize the app when DOM is loaded
let taskManager;
document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
});

// Add some utility functions
window.addEventListener('beforeunload', () => {
    // Clean up any pending operations
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit forms
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.closest('form')) {
            activeElement.closest('form').dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to close modals or cancel operations
    if (e.key === 'Escape') {
        // Add escape key functionality here
    }
});
