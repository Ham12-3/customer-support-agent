// Simple Customer Support Widget
(function() {
    'use strict';

    // Get configuration from script tag
    const scriptTag = document.currentScript || document.querySelector('script[data-domain]');
    const config = {
        domain: scriptTag?.getAttribute('data-domain') || 'localhost:3002',
        apiKey: scriptTag?.getAttribute('data-api-key') || '',
        apiUrl: scriptTag?.getAttribute('data-api-url') || 'http://localhost:5000'
    };

    console.log('🤖 Widget Config:', config);

    // Create widget container
    const widgetHTML = `
        <div id="cs-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <!-- Chat Button -->
            <button id="cs-chat-btn" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s;
            ">💬</button>

            <!-- Chat Window (hidden by default) -->
            <div id="cs-chat-window" style="
                display: none;
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                flex-direction: column;
                overflow: hidden;
            ">
                <!-- Header -->
                <div style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0; font-size: 16px;">Customer Support</h3>
                    <button id="cs-close-btn" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 20px;
                        cursor: pointer;
                        padding: 0;
                        width: 24px;
                        height: 24px;
                    ">×</button>
                </div>

                <!-- Messages -->
                <div id="cs-messages" style="
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px;
                    background: #f5f5f5;
                "></div>

                <!-- Input -->
                <div style="
                    padding: 16px;
                    border-top: 1px solid #ddd;
                    background: white;
                    display: flex;
                    gap: 8px;
                ">
                    <input id="cs-input" type="text" placeholder="Type your message..." style="
                        flex: 1;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 20px;
                        outline: none;
                        font-size: 14px;
                    ">
                    <button id="cs-send-btn" style="
                        background: #667eea;
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        cursor: pointer;
                        font-size: 18px;
                    ">➤</button>
                </div>
            </div>
        </div>
    `;

    // Inject widget into page
    const container = document.createElement('div');
    container.innerHTML = widgetHTML;
    document.body.appendChild(container);

    // Get elements
    const chatBtn = document.getElementById('cs-chat-btn');
    const chatWindow = document.getElementById('cs-chat-window');
    const closeBtn = document.getElementById('cs-close-btn');
    const input = document.getElementById('cs-input');
    const sendBtn = document.getElementById('cs-send-btn');
    const messagesDiv = document.getElementById('cs-messages');

    let sessionId = 'session-' + Date.now();
    let isOpen = false;

    // Toggle chat window
    function toggleChat() {
        isOpen = !isOpen;
        chatWindow.style.display = isOpen ? 'flex' : 'none';
        if (isOpen && messagesDiv.children.length === 0) {
            addMessage('bot', 'Hello! How can I help you today?');
        }
    }

    // Add message to chat
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            margin-bottom: 12px;
            display: flex;
            justify-content: ${sender === 'user' ? 'flex-end' : 'flex-start'};
        `;
        
        const bubble = document.createElement('div');
        bubble.style.cssText = `
            background: ${sender === 'user' ? '#667eea' : 'white'};
            color: ${sender === 'user' ? 'white' : '#333'};
            padding: 10px 14px;
            border-radius: 18px;
            max-width: 70%;
            word-wrap: break-word;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        `;
        bubble.textContent = text;
        messageDiv.appendChild(bubble);
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Send message to API
    async function sendMessage(text) {
        if (!text.trim()) return;

        addMessage('user', text);
        input.value = '';

        // Show typing indicator
        addMessage('bot', 'Typing...');

        try {
            const response = await fetch(`${config.apiUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': config.apiKey,
                    'X-Domain': config.domain
                },
                body: JSON.stringify({
                    message: text,
                    sessionId: sessionId
                })
            });

            // Remove typing indicator
            messagesDiv.removeChild(messagesDiv.lastChild);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ API Response:', data);
                const message = data.message || data.Message || 'No message received';
                addMessage('bot', message);
            } else {
                const errorText = await response.text();
                console.error('❌ API Error:', response.status, errorText);
                addMessage('bot', `Error: Response status code does not indicate success: ${response.status} (${response.statusText}).`);
            }
        } catch (error) {
            // Remove typing indicator
            messagesDiv.removeChild(messagesDiv.lastChild);
            addMessage('bot', 'Connection error. Please try again.');
            console.error('Chat error:', error);
        }
    }

    // Event listeners
    chatBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', () => sendMessage(input.value));
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage(input.value);
    });

    // Hover effect on button
    chatBtn.addEventListener('mouseenter', () => {
        chatBtn.style.transform = 'scale(1.1)';
    });
    chatBtn.addEventListener('mouseleave', () => {
        chatBtn.style.transform = 'scale(1)';
    });

    console.log('✅ Customer Support Widget loaded successfully!');
})();

