const socket = io('http://localhost:3000');

const messageInput = document.querySelector('input[name="message"]');
const sendMessageButton = document.querySelector('button');
const messagesContainer = document.querySelector('.body');

sendMessageButton.addEventListener('click', (event) => {
    event.preventDefault();
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.emit('chat message', message);
        messageInput.value = '';
    }
});

socket.on('chat message', (message) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
});
