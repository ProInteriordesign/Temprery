// User Authentication
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const showRegisterLink = document.getElementById('showRegister');
    const backToLoginBtn = document.getElementById('backToLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Simple user storage (for demo purposes)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Toggle between login and register forms
    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });
    
    backToLoginBtn.addEventListener('click', function() {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // In a real app, you would validate against a database
        const user = users.find(u => u.username === username && u.password === password);
        
        if(user) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            showGeneratorSection();
        } else {
            alert('Invalid username or password');
        }
    });
    
    // Register form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        if(password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if(users.some(u => u.username === username)) {
            alert('Username already exists');
            return;
        }
        
        if(users.some(u => u.email === email)) {
            alert('Email already registered');
            return;
        }
        
        const newUser = { username, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Registration successful! Please login.');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginForm.reset();
        registerForm.reset();
    });
    
    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('loggedInUser');
        showLoginSection();
    });
    
    // Image Generation
    generateBtn.addEventListener('click', async function() {
        const prompt = document.getElementById('promptInput').value;
        const style = document.getElementById('styleSelect').value;
        
        if(!prompt) {
            alert('Please enter a description for the image');
            return;
        }
        
        // Show loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
        
        try {
            // In a real app, you would call an AI image generation API
            // For demo, we'll use a placeholder image service
            const response = await fetch(`https://source.unsplash.com/random/800x600/?${prompt}`);
            
            if(response.ok) {
                const imageUrl = response.url;
                const imgElement = document.getElementById('generatedImage');
                imgElement.src = imageUrl;
                imgElement.classList.remove('hidden');
                document.getElementById('placeholderText').classList.add('hidden');
                document.getElementById('downloadSection').classList.remove('hidden');
                
                // Set up download button
                downloadBtn.onclick = function() {
                    const a = document.createElement('a');
                    a.href = imageUrl;
                    a.download = `ai-generated-${prompt.substring(0, 10)}.jpg`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                };
            } else {
                throw new Error('Failed to generate image');
            }
        } catch (error) {
            console.error('Error generating image:', error);
            alert('Failed to generate image. Please try again.');
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Image';
        }
    });
    
    // Check if user is already logged in
    if(localStorage.getItem('loggedInUser')) {
        showGeneratorSection();
    } else {
        showLoginSection();
    }
});

function showLoginSection() {
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('generatorSection').classList.add('hidden');
    document.getElementById('loginForm').reset();
}

function showGeneratorSection() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('generatorSection').classList.remove('hidden');
    document.getElementById('promptInput').value = '';
    document.getElementById('generatedImage').classList.add('hidden');
    document.getElementById('placeholderText').classList.remove('hidden');
    document.getElementById('downloadSection').classList.add('hidden');
}
