'use strict';

// DOM Elements
const loginSection = document.querySelector('#login-section');
const chatContainer = document.querySelector('#chat-container');
const loginForm = document.querySelector('#loginForm');
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');
const chatMessages = document.querySelector('#chat-messages');
const chatHeader = document.querySelector('#chat-header');
const logoutBtn = document.querySelector('#logout-btn');
const validationMessage = document.querySelector('#validation-message');
const successMessage = document.querySelector('#success-message');
const clientsList = document.querySelector('#clients-list');
const sellersList = document.querySelector('#sellers-list');
const currentUserInfo = document.querySelector('#current-user-info');
const userSearch = document.querySelector('#user-search');

// Global variables
let stompClient = null;
let currentUserId = null;
let currentUserType = null;
let currentUserName = null;
let selectedUserId = null;
let selectedUserName = null;
let usersList = [];
let userNamesCache = {}; // Cache for user names

// Login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const userId = document.querySelector('#userId').value.trim();
    const userType = document.querySelector('#userType').value.trim();
    
    console.log('Login attempt - User ID:', userId, 'User Type:', userType);
    
    if (!userId || !userType) {
        showValidationMessage('Please enter both User ID and User Type');
        return;
    }
    
    // Validate user with backend
    const isValid = await validateUser(userId);
    console.log('User validation result:', isValid);
    if (!isValid) {
        showValidationMessage('User not found in UsersService. Please check your ID.');
        return;
    }
    
    // Fetch user details
    const userDetails = await fetchUserDetails(userId);
    console.log('User details:', userDetails);
    if (!userDetails) {
        showValidationMessage('Error fetching user details');
        return;
    }
    
    // Set current user info
    currentUserId = userId;
    currentUserType = userType;
    currentUserName = userDetails.nom || `User ${userId}`;
    
    // Cache the current user's name
    userNamesCache[currentUserId] = currentUserName;
    
    // Show success message
    showSuccessMessage(`Welcome, ${currentUserName}!`);
    
    // Connect to WebSocket
    connectToWebSocket();
}

// Validate user with backend
async function validateUser(userId) {
    try {
        console.log('Validating user ID:', userId);
        const response = await fetch(`/validate-user/${userId}`);
        console.log('Validation response status:', response.status);
        if (response.ok) {
            const result = await response.json();
            console.log('Validation result:', result);
            return result;
        }
        return false;
    } catch (error) {
        console.error('Error validating user:', error);
        return false;
    }
}

// Fetch user details from backend
async function fetchUserDetails(userId) {
    try {
        console.log('Fetching user details for ID:', userId);
        const response = await fetch(`/user/${userId}`);
        console.log('User details response status:', response.status);
        if (response.ok) {
            const result = await response.json();
            console.log('User details result:', result);
            return result;
        }
        return { nom: `User ${userId}` };
    } catch (error) {
        console.error('Error fetching user details:', error);
        return { nom: `User ${userId}` };
    }
}

// Fetch user name by ID (with caching)
async function fetchUserName(userId) {
    console.log('Fetching user name for ID:', userId);
    // Check cache first
    if (userNamesCache[userId]) {
        console.log('User name found in cache:', userNamesCache[userId]);
        return userNamesCache[userId];
    }
    
    try {
        const response = await fetch(`/user/${userId}`);
        if (response.ok) {
            const user = await response.json();
            const userName = user.nom || `User ${userId}`;
            // Cache the user name
            userNamesCache[userId] = userName;
            console.log('User name fetched and cached:', userName);
            return userName;
        }
    } catch (error) {
        console.error('Error fetching user name:', error);
    }
    
    const defaultName = `User ${userId}`;
    console.log('Using default user name:', defaultName);
    return defaultName;
}

// Connect to WebSocket
function connectToWebSocket() {
    console.log('Connecting to WebSocket');
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
}

// WebSocket connected callback
function onConnected() {
    console.log('WebSocket connected');
    // Subscribe to user's message queue
    stompClient.subscribe(`/user/${currentUserId}/queue/messages`, onMessageReceived);
    
    // Hide login section and show chat container
    loginSection.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    
    // Update UI
    currentUserInfo.textContent = `${currentUserName} (${currentUserType})`;
    
    // Load users list
    loadUsersList();
}

// WebSocket error callback
function onError(error) {
    console.error('WebSocket error:', error);
    showValidationMessage('Could not connect to WebSocket server. Please try again.');
}

// Load users list (clients and sellers) from backend
async function loadUsersList() {
    console.log('Loading users list');
    try {
        // Clear existing lists
        clientsList.innerHTML = '';
        sellersList.innerHTML = '';
        
        // Show loading message
        const loadingElement = document.createElement('li');
        loadingElement.className = 'loading-message';
        loadingElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading users...';
        clientsList.appendChild(loadingElement);
        
        // Load clients from backend
        console.log('Fetching clients');
        const clientsResponse = await fetch('/clients');
        console.log('Clients response status:', clientsResponse.status);
        let clients = [];
        if (clientsResponse.ok) {
            clients = await clientsResponse.json();
            console.log('Clients fetched:', clients.length);
        } else {
            console.log('Error fetching clients, status:', clientsResponse.status);
        }
        
        // Load sellers from backend
        console.log('Fetching sellers');
        const sellersResponse = await fetch('/sellers');
        console.log('Sellers response status:', sellersResponse.status);
        let sellers = [];
        if (sellersResponse.ok) {
            sellers = await sellersResponse.json();
            console.log('Sellers fetched:', sellers.length);
        } else {
            console.log('Error fetching sellers, status:', sellersResponse.status);
        }
        
        // Clear loading message
        clientsList.innerHTML = '';
        sellersList.innerHTML = '';
        
        // Display clients - always show all clients
        console.log('Displaying clients');
        if (clients.length > 0) {
            clients.forEach(client => {
                // Don't show current user in their own list
                if (client.id != currentUserId) {
                    const clientElement = createUserElement(client, 'client');
                    clientsList.appendChild(clientElement);
                }
            });
        } else {
            const noClientsElement = document.createElement('li');
            noClientsElement.className = 'no-users-message';
            noClientsElement.innerHTML = '<i class="fas fa-user-friends"></i> No clients available';
            clientsList.appendChild(noClientsElement);
        }
        
        // Display sellers - always show all sellers
        console.log('Displaying sellers');
        if (sellers.length > 0) {
            sellers.forEach(seller => {
                // Don't show current user in their own list
                if (seller.id != currentUserId) {
                    const sellerElement = createUserElement(seller, 'seller');
                    sellersList.appendChild(sellerElement);
                }
            });
        } else {
            const noSellersElement = document.createElement('li');
            noSellersElement.className = 'no-users-message';
            noSellersElement.innerHTML = '<i class="fas fa-store"></i> No sellers available';
            sellersList.appendChild(noSellersElement);
        }
        
        // Store users for reference and cache their names
        usersList = [...clients, ...sellers];
        usersList.forEach(user => {
            if (user.nom) {
                userNamesCache[user.id] = user.nom;
            }
        });
        
        console.log('Users list loaded. Total users:', usersList.length);
        
    } catch (error) {
        console.error('Error loading users list:', error);
        // Clear lists and show error message
        clientsList.innerHTML = '';
        sellersList.innerHTML = '';
        
        // Show error message to user
        const errorElement = document.createElement('li');
        errorElement.className = 'error-message';
        errorElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error loading users. Please refresh the page.';
        clientsList.appendChild(errorElement);
    }
}

// Create user element for the list
function createUserElement(user, type) {
    console.log('Creating user element:', user, 'Type:', type);
    const listItem = document.createElement('li');
    listItem.className = 'user-item';
    listItem.dataset.userId = user.id;
    listItem.dataset.userName = user.nom || `User ${user.id}`;
    listItem.dataset.userType = type;
    
    const userName = user.nom || `User ${user.id}`;
    const firstLetter = userName.charAt(0).toUpperCase();
    
    listItem.innerHTML = `
        <div class="user-avatar">${firstLetter}</div>
        <div class="user-info">
            <strong>${userName}</strong>
            <small>${type}</small>
        </div>
    `;
    
    listItem.addEventListener('click', () => selectUser(user.id, userName));
    
    return listItem;
}

// Select user for chat
async function selectUser(userId, userName) {
    console.log('Selecting user - ID:', userId, 'Name:', userName);
    // Remove active class from all users
    document.querySelectorAll('.user-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected user
    event.currentTarget.classList.add('active');
    
    // Set selected user
    selectedUserId = userId;
    selectedUserName = userName;
    
    // Update chat header
    chatHeader.innerHTML = `
        <h3><i class="fas fa-comments"></i> Chat with ${userName}</h3>
        <p>Start a conversation</p>
    `;
    
    // Show chat interface
    chatMessages.classList.remove('hidden');
    messageForm.classList.remove('hidden');
    
    // Clear chat messages
    chatMessages.innerHTML = '<div class="loading-messages"><i class="fas fa-spinner fa-spin"></i> Loading messages...</div>';
    
    // Load previous messages from database
    await loadPreviousMessages();
}

// Load previous messages from database
async function loadPreviousMessages() {
    console.log('Loading previous messages between', currentUserId, 'and', selectedUserId);
    try {
        if (!selectedUserId) {
            console.log('No selected user');
            return;
        }
        
        // Fetch messages in both directions to ensure we get all history
        const response1 = await fetch(`/messages/${currentUserId}/${selectedUserId}`);
        const response2 = await fetch(`/messages/${selectedUserId}/${currentUserId}`);
        
        let messages = [];
        if (response1.ok) {
            const msgs1 = await response1.json();
            messages = messages.concat(msgs1);
        }
        
        if (response2.ok) {
            const msgs2 = await response2.json();
            messages = messages.concat(msgs2);
        }
        
        console.log('Messages fetched:', messages.length);
        
        // Clear chat messages
        chatMessages.innerHTML = '';
        
        // Sort messages by timestamp
        messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Display messages
        if (messages.length > 0) {
            for (const message of messages) {
                // Determine if current user is sender or receiver
                const isSender = message.senderId == currentUserId;
                // Fetch sender name if not in cache
                const senderName = await fetchUserName(message.senderId);
                displayMessage(message, isSender);
            }
        } else {
            // No messages found, show empty chat
            chatMessages.innerHTML = '<div class="no-messages"><i class="fas fa-comment-slash"></i> No messages yet. Start a conversation!</div>';
        }
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error('Error loading previous messages:', error);
        chatMessages.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Error loading messages. Please try again.</div>';
    }
}

// Send message
function sendMessage(event) {
    event.preventDefault();
    
    const messageContent = messageInput.value.trim();
    console.log('Sending message:', messageContent);
    if (!messageContent || !stompClient || !selectedUserId) {
        console.log('Message not sent - missing data');
        return;
    }
    
    // Create chat message object
    const chatMessage = {
        senderId: parseInt(currentUserId),
        recipientId: parseInt(selectedUserId),
        content: messageContent,
        timestamp: new Date()
    };
    
    // Send message via WebSocket
    stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
    
    // Display message in UI
    displayMessage(chatMessage, true);
    
    // Clear input
    messageInput.value = '';
}

// Display message in chat
function displayMessage(message, isSender = false) {
    console.log('Displaying message - Content:', message.content, 'Is sender:', isSender);
    
    // Format timestamp
    const timestamp = new Date(message.timestamp);
    const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${isSender ? 'sender' : 'receiver'}`;
    
    if (!isSender) {
        messageContainer.innerHTML = `
            <div class="message-content">
                <strong>${message.senderName || 'Unknown User'}</strong>
                <div>${message.content}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
    } else {
        messageContainer.innerHTML = `
            <div class="message-content">
                <div>${message.content}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle received message
async function onMessageReceived(payload) {
    console.log('Message received', payload);
    try {
        const message = JSON.parse(payload.body);
        // Fetch sender name for received messages
        const senderName = await fetchUserName(message.senderId);
        message.senderName = senderName;
        // Display the received message
        displayMessage(message, false);
    } catch (error) {
        console.error('Error processing received message:', error);
    }
}

// Logout function
function logout() {
    console.log('Logging out');
    if (stompClient) {
        stompClient.disconnect();
    }
    
    // Reset variables
    currentUserId = null;
    currentUserType = null;
    currentUserName = null;
    selectedUserId = null;
    selectedUserName = null;
    userNamesCache = {}; // Clear cache
    
    // Show login section and hide chat container
    loginSection.classList.remove('hidden');
    chatContainer.classList.add('hidden');
    
    // Clear forms
    loginForm.reset();
    messageForm.reset();
    
    // Clear messages
    validationMessage.textContent = '';
    successMessage.textContent = '';
    chatMessages.innerHTML = '';
}

// Show validation message
function showValidationMessage(message) {
    console.log('Showing validation message:', message);
    validationMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    successMessage.textContent = '';
}

// Show success message
function showSuccessMessage(message) {
    console.log('Showing success message:', message);
    successMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    validationMessage.textContent = '';
}

// Search users
function searchUsers() {
    const searchTerm = userSearch.value.toLowerCase();
    
    // Search in clients list
    const clientItems = clientsList.querySelectorAll('.user-item');
    clientItems.forEach(item => {
        const userName = item.dataset.userName.toLowerCase();
        if (userName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Search in sellers list
    const sellerItems = sellersList.querySelectorAll('.user-item');
    sellerItems.forEach(item => {
        const userName = item.dataset.userName.toLowerCase();
        if (userName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Event listeners
loginForm.addEventListener('submit', handleLogin);
messageForm.addEventListener('submit', sendMessage);
logoutBtn.addEventListener('click', logout);
userSearch.addEventListener('input', searchUsers);

// Auto-resize textarea (if we were using textarea instead of input)
messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(new Event('submit'));
    }
});