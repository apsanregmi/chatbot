require('dotenv').config();

// Environment variables
const socket = new WebSocket(window.env.WS_URL);
const assistantId = window.env.ASSISTANT_ID;
const threadId = window.env.THREAD_ID;


// Open WebSocket connection
socket.onopen = function() {
    console.log('WebSocket is connected.');
};

// Handle WebSocket errors
socket.onerror = function(error) {
    console.log('WebSocket error:', error);
};

// Listen for messages from the server
socket.onmessage = function(event) {
    console.log('Message from server', event.data);

    try {
        const messageData = JSON.parse(event.data);
        if (messageData.message) {
            const botReply = messageData.message || "No response received.";
            addMessageToChat('bot', botReply); // Add the message to the chat window
        }
    } catch (e) {
        console.log('Error parsing message:', e);
    }
};

// Handle WebSocket closure
socket.onclose = function(event) {
    if (event.wasClean) {
        console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
    } else {
        console.log('WebSocket connection closed unexpectedly.');
    }
};

// Function to toggle chat window
function toggleChatWindow() {
    var chatWindow = document.getElementById('chatWindow');
    if (chatWindow.style.display === 'none' || chatWindow.style.display === '') {
        chatWindow.style.display = 'flex';
    } else {
        chatWindow.style.display = 'none';
    }
}

// Function to send a message
function sendMessage() {
    var input = document.getElementById('chatInput');
    var message = input.value.trim();

    if (message !== '') {
        addMessageToChat('user', message);

        const messagePayload = {
            action: 'sendmessage',
            data: {
                question: message,
                assistant_id: assistantId,
                thread_id: threadId
            },
        };

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(messagePayload));
        } else {
            console.log('WebSocket connection is not open.');
        }

        input.value = '';  // Clear the input field after sending the message
    }
}

// Function to add a message to the chat body
function addMessageToChat(sender, message) {
    var chatBody = document.getElementById('chatBody');
    var messageElement = document.createElement('div');
    messageElement.classList.add('message');

    if (sender === 'user') {
        messageElement.classList.add('user-message');
    } else {
        messageElement.classList.add('bot-message');
    }

    messageElement.textContent = message;
    chatBody.appendChild(messageElement);

    // Scroll chat body to the bottom
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Send message on Enter key press
document.getElementById('chatInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
