const socket = new WebSocket('wss://4bwcngjbd2.execute-api.us-east-1.amazonaws.com/Prod');
// Open WebSocket connection
socket.onopen = function(event) {
    console.log('WebSocket is connected.');
};
// Handle WebSocket errors
socket.onerror = function(error) {
    console.log('WebSocket error:', error);
};
// Listen for messages from the server
socket.onmessage = function(event) {
    console.log('Message from server', event.data);
    // Assuming the server sends JSON data
    const messageData = JSON.parse(event.data);
    // Check if the message is from the bot
    if (messageData.action === 'sendmessage' && messageData.data) {
        const botReply = messageData.data.question;
        addMessageToChat('bot', botReply);
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
        // WebSocket message payload with user's input
        const messagePayload = {
            action: 'sendmessage',
            data: {
                question: message,
                assistant_id: 'asst_SzVrgEGUGgOsGr5xuszO3oo5',
            thread_id: 'thread_Ljf0eu0BaJFojQaJEHvb9eTt'
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
document.getElementById('chatInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});