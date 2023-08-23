document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://localhost:3000');

    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const form = document.getElementById('chat-form');
    const messagesContainer = document.querySelector('.body');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (name !== '' && message !== '') {
            // Emit the message along with the sender's name to the server
            socket.emit('chat message', { name, message });

            // Clear the message input
            messageInput.value = '';
        }
    });

    socket.on('chat message', (data) => {
        displayMessage(data.name, data.message);
    });

    function displayMessage(sender, message) {
        const messageElement = document.createElement('p');
        
        const senderElement = document.createElement('span');
        senderElement.textContent = sender + ': ';
        senderElement.classList.add('sender-name'); // Apply CSS class to the sender's name
        
        const messageTextElement = document.createElement('span');
        messageTextElement.textContent = message;

        
        
        messageElement.appendChild(senderElement);
        messageElement.appendChild(messageTextElement);
        
        messagesContainer.appendChild(messageElement);
    }
});
