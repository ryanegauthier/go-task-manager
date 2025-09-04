// Go Portfolio App - Frontend JavaScript (Phase 2)

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
        this.setupKeyboardShortcuts();
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

        // Add real-time form validation
        this.setupFormValidation();
    }

    setupFormValidation() {
        // Username validation
        const usernameInputs = document.querySelectorAll('input[name="username"]');
        usernameInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                if (value.length < 3) {
                    e.target.classList.add('border-red-500');
                    e.target.classList.remove('border-green-500');
                } else {
                    e.target.classList.remove('border-red-500');
                    e.target.classList.add('border-green-500');
                }
            });
        });

        // Email validation
        const emailInput = document.getElementById('registerEmail');
        if (emailInput) {
            emailInput.addEventListener('input', (e) => {
                const email = e.target.value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(email)) {
                    e.target.classList.remove('border-red-500');
                    e.target.classList.add('border-green-500');
                } else {
                    e.target.classList.add('border-red-500');
                    e.target.classList.remove('border-green-500');
                }
            });
        }

        // Password strength indicator
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const password = e.target.value;
                const strength = this.calculatePasswordStrength(password);
                this.updatePasswordStrengthIndicator(input, strength);
            });
        });
    }

    calculatePasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return Math.min(score, 5);
    }

    updatePasswordStrengthIndicator(input, strength) {
        const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
        const strengthTexts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        
        // Remove existing indicator
        const existingIndicator = input.parentNode.querySelector('.password-strength');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        if (input.value.length > 0) {
            const indicator = document.createElement('div');
            indicator.className = 'password-strength mt-1 text-xs';
            indicator.innerHTML = `
                <div class="flex items-center">
                    <div class="flex-1 bg-gray-200 rounded-full h-1 mr-2">
                        <div class="h-1 rounded-full ${strengthColors[strength - 1] || 'bg-gray-200'}" 
                             style="width: ${(strength / 5) * 100}%"></div>
                    </div>
                    <span class="text-gray-600">${strengthTexts[strength - 1] || 'Very Weak'}</span>
                </div>
            `;
            input.parentNode.appendChild(indicator);
        }
    }

    setupKeyboardShortcuts() {
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
                this.hideAllModals();
            }

            // Ctrl/Cmd + K to focus task input
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const taskInput = document.getElementById('taskTitle');
                if (taskInput) {
                    taskInput.focus();
                }
            }
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
        
        // Add welcome animation
        this.animateWelcome();
    }

    animateWelcome() {
        const welcomeElement = document.getElementById('mainApp');
        welcomeElement.style.opacity = '0';
        welcomeElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            welcomeElement.style.transition = 'all 0.5s ease-out';
            welcomeElement.style.opacity = '1';
            welcomeElement.style.transform = 'translateY(0)';
        }, 100);
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

        if (!username || !password) {
            this.showToast('Error', 'Please fill in all fields', 'error');
            return;
        }

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

        if (!username || !email || !password) {
            this.showToast('Error', 'Please fill in all fields', 'error');
            return;
        }

        if (password.length < 6) {
            this.showToast('Error', 'Password must be at least 6 characters', 'error');
            return;
        }

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

        if (!title.trim()) {
            this.showToast('Error', 'Task title is required', 'error');
            return;
        }

        try {
            const task = await this.makeRequest('/api/tasks', {
                method: 'POST',
                body: JSON.stringify({ title: title.trim(), description: description.trim() }),
            });

            this.tasks.push(task);
            this.renderTasks();
            
            // Clear form
            document.getElementById('createTaskForm').reset();
            
            // Reset password strength indicators
            document.querySelectorAll('.password-strength').forEach(el => el.remove());
            
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
                    <p class="text-sm mt-2">Use Ctrl+K to quickly add a task</p>
                </div>
            `;
            return;
        }

        // Sort tasks by creation date (newest first)
        const sortedTasks = [...this.tasks].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
        );

        sortedTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            taskList.appendChild(taskElement);
        });

        // Add task count
        this.updateTaskCount();
    }

    updateTaskCount() {
        const completedTasks = this.tasks.filter(t => t.completed).length;
        const totalTasks = this.tasks.length;
        const pendingTasks = totalTasks - completedTasks;
        
        // Update task count in header
        const countElement = document.getElementById('taskCount');
        if (countElement) {
            countElement.textContent = `${completedTasks}/${totalTasks} completed`;
        }
        
        // Update stats cards
        const totalTasksElement = document.getElementById('totalTasks');
        const completedTasksElement = document.getElementById('completedTasks');
        const pendingTasksElement = document.getElementById('pendingTasks');
        
        if (totalTasksElement) totalTasksElement.textContent = totalTasks;
        if (completedTasksElement) completedTasksElement.textContent = completedTasks;
        if (pendingTasksElement) pendingTasksElement.textContent = pendingTasks;
    }

    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = 'task-card bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200';
        div.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h4 class="font-semibold text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}">${task.title}</h4>
                <div class="flex space-x-2">
                    <button onclick="taskManager.editTask(${task.id})" 
                            class="text-blue-600 hover:text-blue-800 text-sm p-1 rounded hover:bg-blue-100 transition-colors">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="taskManager.deleteTask(${task.id})" 
                            class="text-red-600 hover:text-red-800 text-sm p-1 rounded hover:bg-red-100 transition-colors">
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

        // Create a modal for editing
        this.showEditModal(task);
    }

    showEditModal(task) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 class="text-lg font-semibold mb-4">Edit Task</h3>
                <form id="editTaskForm">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Title</label>
                        <input type="text" id="editTaskTitle" value="${task.title}" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea id="editTaskDescription" rows="3"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">${task.description || ''}</textarea>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" onclick="taskManager.hideEditModal()" 
                                class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                        <button type="submit" 
                                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submission
        document.getElementById('editTaskForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const newTitle = document.getElementById('editTaskTitle').value;
            const newDescription = document.getElementById('editTaskDescription').value;

            await this.updateTask(task.id, {
                title: newTitle,
                description: newDescription,
            });

            this.hideEditModal();
        });

        // Focus on title input
        setTimeout(() => {
            document.getElementById('editTaskTitle').focus();
        }, 100);
    }

    hideEditModal() {
        const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
        if (modal) {
            modal.remove();
        }
    }

    hideAllModals() {
        this.hideEditModal();
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
