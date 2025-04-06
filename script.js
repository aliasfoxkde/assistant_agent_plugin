// Conversation history to maintain context
let conversationHistory = [];
let currentAssistantMessageDiv = null;

// Variables for streaming text
let currentStreamingMessage = null;

// VAPI configuration
const ASSISTANT_ID = 'e6b55e0e-7bd3-49ed-87d6-afbe0a454625';
const API_KEY = 'e502110f-2369-4b28-a3aa-858865390e02';
let vapiInstance = null;
let isCallActive = false;

// Stats tracking
let stats = {
    latency: 0,
    duration: 0,
    timeToFirstWord: 0,
    messagesSent: 0,
    callStartTime: 0,
    firstWordTime: 0,
    microphoneAvailable: false
};

// Debug logging function
function logDebug(message) {
    console.log(message);
    const debugInfoElement = document.getElementById('debug-info');
    if (debugInfoElement) {
        const timestamp = new Date().toLocaleTimeString();
        debugInfoElement.innerHTML += `<div>[${timestamp}] ${message}</div>`;
        debugInfoElement.scrollTop = debugInfoElement.scrollHeight;
    }
}

// Update status function
function updateStatus(message, type = 'ready') {
    // Update chat status
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = message;
    }

    // Update main status
    const mainStatusElement = document.getElementById('main-status');
    if (mainStatusElement) {
        mainStatusElement.textContent = message;
    }

    // Update status dot
    const statusDot = document.getElementById('status-dot');
    if (statusDot) {
        statusDot.className = 'status-dot ' + type;
    }

    logDebug(`Status: ${message}`);
}

// Update stats function
function updateStats() {
    document.getElementById('stat-latency').textContent = stats.latency + ' ms';
    document.getElementById('stat-duration').textContent = stats.duration + ' sec';
    document.getElementById('stat-ttfw').textContent = stats.timeToFirstWord + ' ms';
    document.getElementById('stat-messages-sent').textContent = stats.messagesSent;
    document.getElementById('stat-assistant-id').textContent = ASSISTANT_ID;
    document.getElementById('stat-mic-status').textContent = stats.microphoneAvailable ? 'Available' : 'Not Available';
}

// Add message to chat
function addMessage(text, isUser = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'assistant-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

// Stream text to message
function streamTextToMessage(text, speed = 30) {
    // If there's already a streaming message, clear it
    if (currentStreamingMessage) {
        clearTimeout(currentStreamingMessage);
        currentStreamingMessage = null;
    }

    // Create a new message div
    const messageDiv = addMessage('', false);

    // Add a cursor element
    const cursorElement = document.createElement('span');
    cursorElement.classList.add('cursor');
    messageDiv.appendChild(cursorElement);

    let i = 0;
    const streamNextChar = () => {
        if (i < text.length) {
            // Insert the character before the cursor
            const textNode = document.createTextNode(text.charAt(i));
            messageDiv.insertBefore(textNode, cursorElement);
            i++;

            // Scroll to bottom
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Schedule the next character
            currentStreamingMessage = setTimeout(streamNextChar, speed);
        } else {
            // Remove the cursor when done
            cursorElement.remove();
            currentStreamingMessage = null;
        }
    };

    // Start streaming
    streamNextChar();

    return messageDiv;
}

// Remove loading indicators
function removeLoadingIndicators() {
    const loadingElements = document.querySelectorAll('.message');
    loadingElements.forEach(el => {
        if (el.textContent === '...') {
            el.remove();
        }
    });
}

// Speech recognition for voice trigger
let recognition = null;
let recognitionActive = false;
let recognitionPaused = false;

function setupSpeechRecognition() {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        logDebug('Speech recognition not supported in this browser');
        stats.microphoneAvailable = false;
        updateStats();
        return;
    }

    // Check for microphone permission
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            // Microphone is available
            stats.microphoneAvailable = true;
            updateStats();

            // Create speech recognition object
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();

            // Configure recognition
            recognition.continuous = false; // Changed to false to prevent continuous restarts
            recognition.interimResults = false;

            // Handle results
            recognition.onresult = function(event) {
                const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
                logDebug(`Speech recognized: ${transcript}`);

                // Check for trigger phrase
                if (transcript.includes('start voice chat')) {
                    logDebug('Voice trigger phrase detected');

                    // Pause recognition
                    recognitionPaused = true;

                    // Simulate typing the trigger phrase
                    const messageInput = document.getElementById('message-input');
                    messageInput.value = 'Start Voice Chat';

                    // Expand chat bubble if minimized
                    if (!document.getElementById('chat-bubble').classList.contains('expanded')) {
                        toggleChatBubble();
                    }

                    // Send the message
                    document.getElementById('send-button').click();
                }
            };

            // Handle errors
            recognition.onerror = function(event) {
                logDebug(`Speech recognition error: ${event.error}`);
                recognitionActive = false;

                // Only restart for non-critical errors and if not paused
                if (event.error !== 'aborted' && event.error !== 'no-speech' && !recognitionPaused && !isCallActive) {
                    startSpeechRecognition();
                }
            };

            // Handle end of recognition
            recognition.onend = function() {
                logDebug('Speech recognition ended');
                recognitionActive = false;

                // Only restart if not paused and not in a call
                if (!recognitionPaused && !isCallActive) {
                    startSpeechRecognition();
                }
            };

            // Start recognition
            startSpeechRecognition();

            // Stream ended
            stream.getTracks().forEach(track => track.stop());
        })
        .catch(function(err) {
            logDebug(`Error accessing microphone: ${err.message}`);
            stats.microphoneAvailable = false;
            updateStats();
        });
}

// Start speech recognition with backoff
let recognitionBackoff = 1000; // Start with 1 second
const maxBackoff = 10000; // Max 10 seconds

function startSpeechRecognition() {
    if (recognitionActive || recognitionPaused || isCallActive) return;

    setTimeout(() => {
        try {
            if (recognition && !recognitionActive && !recognitionPaused && !isCallActive) {
                recognition.start();
                recognitionActive = true;
                logDebug(`Speech recognition started (backoff: ${recognitionBackoff}ms)`);
                recognitionBackoff = 1000; // Reset backoff on successful start
            }
        } catch (e) {
            logDebug(`Error starting speech recognition: ${e.message}`);
            recognitionActive = false;

            // Increase backoff for next attempt (with max limit)
            recognitionBackoff = Math.min(recognitionBackoff * 1.5, maxBackoff);

            // Try again with increased backoff
            if (!recognitionPaused && !isCallActive) {
                startSpeechRecognition();
            }
        }
    }, recognitionBackoff);
}

// Resume speech recognition
function resumeSpeechRecognition() {
    if (recognition && !recognitionActive && !isCallActive) {
        recognitionPaused = false;
        startSpeechRecognition();
    }
}

// Initialize VAPI Widget
function initVapiWidget() {
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js';
    script.defer = true;
    script.async = true;

    // Set up onload handler
    script.onload = function() {
        logDebug('VAPI Widget script loaded');

        try {
            // Initialize VAPI Widget
            vapiInstance = window.vapiSDK.run({
                apiKey: API_KEY,
                assistant: ASSISTANT_ID,
                config: {
                    position: "bottom-right",
                    offset: "40px",
                    width: "60px",
                    height: "60px",
                    idle: {
                        color: "#007bff",
                        type: "round",
                        icon: "https://unpkg.com/lucide-static@0.321.0/icons/mic.svg",
                    },
                    loading: {
                        color: "#ffc107",
                        type: "round",
                        icon: "https://unpkg.com/lucide-static@0.321.0/icons/loader-2.svg",
                    },
                    active: {
                        color: "#dc3545",
                        type: "round",
                        icon: "https://unpkg.com/lucide-static@0.321.0/icons/phone-off.svg",
                    },
                }
            });

            logDebug('VAPI Widget initialized');

            // Log available methods
            try {
                const methods = [];
                for (const key in vapiInstance) {
                    if (typeof vapiInstance[key] === 'function') {
                        methods.push(key);
                    }
                }
                logDebug(`VAPI instance methods: ${methods.join(', ')}`);

                // Log specific methods we need
                logDebug(`start method exists: ${typeof vapiInstance.start === 'function'}`);
                logDebug(`startCall method exists: ${typeof vapiInstance.startCall === 'function'}`);
                logDebug(`send method exists: ${typeof vapiInstance.send === 'function'}`);
                logDebug(`say method exists: ${typeof vapiInstance.say === 'function'}`);
            } catch (e) {
                logDebug(`Error logging methods: ${e.message}`);
            }

            // Set up event listeners
            setupVapiEventListeners();

        } catch (error) {
            logDebug(`Error initializing VAPI Widget: ${error.message}`);
            updateStatus('Error initializing voice assistant');
        }
    };

    // Set up error handler
    script.onerror = function() {
        logDebug('Failed to load VAPI Widget script');
        updateStatus('Failed to load voice assistant');
    };

    // Add script to document
    document.head.appendChild(script);
}

// Set up VAPI event listeners
function setupVapiEventListeners() {
    if (!vapiInstance) return;

    // Voice call events
    vapiInstance.on('call-start', () => {
        logDebug('Call started');
        updateStatus('Connected to assistant', 'processing');
        isCallActive = true;

        // Update stats
        stats.callStartTime = Date.now();
        stats.firstWordTime = 0;
        updateStats();

        // Pause speech recognition during call
        recognitionPaused = true;

        // Update mic button
        const micButton = document.getElementById('mic-button');
        if (micButton) {
            micButton.classList.add('active');
        }
    });

    vapiInstance.on('call-end', () => {
        logDebug('Call ended');
        updateStatus('Ready', 'ready');
        isCallActive = false;
        currentAssistantMessageDiv = null; // Reset the message div

        // Update stats
        if (stats.callStartTime > 0) {
            stats.duration = ((Date.now() - stats.callStartTime) / 1000).toFixed(1);
            updateStats();
        }

        // Resume speech recognition after call
        setTimeout(() => {
            recognitionPaused = false;
            startSpeechRecognition();
        }, 1000);

        // Update mic button
        const micButton = document.getElementById('mic-button');
        if (micButton) {
            micButton.classList.remove('active');
        }
    });

    // Speech events
    vapiInstance.on('speech-start', () => {
        logDebug('Assistant is speaking');
        updateStatus('Assistant is speaking', 'processing');

        // If this is the first speech, calculate time to first word
        if (stats.callStartTime > 0 && stats.firstWordTime === 0) {
            stats.firstWordTime = Date.now();
            stats.timeToFirstWord = stats.firstWordTime - stats.callStartTime;
            updateStats();
        }
    });

    vapiInstance.on('speech-end', () => {
        logDebug('Assistant finished speaking');
        updateStatus('Connected - Your turn', 'ready');
    });

    // Error events
    vapiInstance.on('error', (error) => {
        logDebug(`Error: ${JSON.stringify(error)}`);
        updateStatus('Error: ' + (error.message || 'Connection failed'), 'error');

        // Update mic button
        const micButton = document.getElementById('mic-button');
        if (micButton) {
            micButton.classList.remove('active');
        }

        // Resume speech recognition after error
        setTimeout(() => {
            isCallActive = false;
            recognitionPaused = false;
            startSpeechRecognition();
        }, 2000);
    });

    // Message events
    vapiInstance.on('message', (message) => {
        logDebug(`Message received: ${JSON.stringify(message)}`);
        logDebug(`Message type: ${message.type}`);

        // Always remove loading indicators when we get any message
        removeLoadingIndicators();

        try {
            // Handle different message types
            if (message.type === 'speech-update') {
                if (message.status === 'end' && message.text) {
                    // Assistant speech end
                    logDebug(`Adding assistant speech: ${message.text}`);
                    streamTextToMessage(message.text);
                } else if (message.status === 'started') {
                    // Assistant speech started
                    logDebug('Assistant speech started');
                    // Create an empty message div for streaming
                    currentAssistantMessageDiv = addMessage('', false);
                }
            } else if (message.type === 'transcript') {
                if (message.role === 'assistant') {
                    // Assistant transcript - this is what we want to stream!
                    const transcriptText = message.transcript;
                    logDebug(`Assistant transcript: ${transcriptText}`);

                    // Check if this is a new part or a continuation
                    if (message.transcriptType === 'final') {
                        // This is the final transcript for this part
                        // Add it as a new message if we don't have a current message div
                        if (!currentAssistantMessageDiv) {
                            currentAssistantMessageDiv = addMessage(transcriptText, false);
                        } else {
                            // Update the current message with the transcript
                            currentAssistantMessageDiv.textContent = transcriptText;
                            const chatMessages = document.getElementById('chat-messages');
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }

                        // Reset the current message div for the next part
                        currentAssistantMessageDiv = null;
                    } else if (message.transcriptType === 'partial') {
                        // This is a partial transcript, update the current message
                        if (!currentAssistantMessageDiv) {
                            currentAssistantMessageDiv = addMessage(transcriptText, false);
                        } else {
                            // Update the current message with the transcript
                            currentAssistantMessageDiv.textContent = transcriptText;
                            const chatMessages = document.getElementById('chat-messages');
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }
                    }
                } else if (message.role === 'user' && message.transcript && message.transcript.text) {
                    // User speech transcript
                    logDebug(`Adding user transcript: ${message.transcript.text}`);
                    addMessage(message.transcript.text, true);
                }
            } else if (message.type === 'model-output' && message.output && message.output.content) {
                // Direct model output
                logDebug(`Adding model output: ${message.output.content}`);
                streamTextToMessage(message.output.content);
            } else if (message.type === 'text' && message.text) {
                // Text message
                logDebug(`Adding text message: ${message.text}`);
                streamTextToMessage(message.text);
            } else if (message.type === 'conversation-update') {
                // Conversation update
                logDebug('Processing conversation update');
                if (message.conversation && message.conversation.messages && message.conversation.messages.length > 0) {
                    const lastMessage = message.conversation.messages[message.conversation.messages.length - 1];
                    if (lastMessage.role === 'assistant' && lastMessage.content) {
                        logDebug(`Adding assistant message from conversation: ${lastMessage.content}`);
                        streamTextToMessage(lastMessage.content);
                    }
                }
            } else if (message.type === 'function-call' && message.function) {
                // Function call
                logDebug('Processing function call');
                if (message.function.response) {
                    logDebug(`Adding function response: ${message.function.response}`);
                    streamTextToMessage(message.function.response);
                }
            } else {
                logDebug(`Unhandled message type: ${message.type}`);
            }
        } catch (error) {
            logDebug(`Error processing message: ${error.message}`);
        }
    });

    // Add a specific handler for the 'text' event
    if (typeof vapiInstance.on === 'function') {
        vapiInstance.on('text', (text) => {
            logDebug(`Text event received: ${text}`);
            removeLoadingIndicators();
            streamTextToMessage(text);
        });
    }
}

// Send message function
async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (!message) return;

    // Reset the current assistant message div
    currentAssistantMessageDiv = null;

    // Check for voice trigger phrase
    if (message.toLowerCase() === 'start voice chat') {
        // Add user message to chat
        addMessage(message, true);
        messageInput.value = '';

        // Start voice chat
        if (vapiInstance) {
            logDebug('Starting voice chat...');
            updateStatus('Starting voice chat...');

            try {
                // Start the call
                await vapiInstance.start(ASSISTANT_ID);
                updateStatus('Voice chat started. Speak now.');
            } catch (error) {
                logDebug(`Error starting voice chat: ${error.message}`);
                updateStatus('Error starting voice chat');
                addMessage('Sorry, there was an error starting voice chat. Please try again.', false);
            }
        } else {
            logDebug('VAPI instance not available');
            updateStatus('Voice assistant not available');
            addMessage('Sorry, the voice assistant is not available right now.', false);
        }
        return;
    }

    // Regular text message
    // Add user message to chat
    addMessage(message, true);
    messageInput.value = '';

    // Disable input while processing
    messageInput.disabled = true;
    document.getElementById('send-button').disabled = true;

    try {
        // Add to conversation history
        conversationHistory.push({
            role: 'user',
            content: message
        });

        // Show loading indicator
        addMessage('...', false);

        // If vapiInstance exists, use it to send the message
        if (vapiInstance) {
            logDebug(`Sending message to VAPI: ${message}`);

            // If there's no active call, start one
            if (!isCallActive) {
                logDebug('Starting call...');
                logDebug(`Starting call with assistant ID: ${ASSISTANT_ID}`);

                // Try different methods to start a call
                try {
                    await vapiInstance.start(ASSISTANT_ID);
                } catch (error) {
                    logDebug(`Error starting call: ${error.message}`);
                    removeLoadingIndicators();
                    addMessage('Sorry, there was an error connecting to the assistant. Please try again.', false);
                    updateStatus('Error connecting to assistant');

                    // Re-enable input
                    messageInput.disabled = false;
                    document.getElementById('send-button').disabled = false;
                    messageInput.focus();
                    return;
                }
            }

            // Try different methods to send the message
            try {
                // Method 1: Using the send method
                if (typeof vapiInstance.send === 'function') {
                    logDebug('Using send method');
                    vapiInstance.send({
                        type: 'add-message',
                        message: {
                            role: 'user',
                            content: message
                        }
                    });
                }
                // Method 2: Using the say method
                else if (typeof vapiInstance.say === 'function') {
                    logDebug('Using say method');
                    vapiInstance.say(message, false);
                }
                // Method 3: Using the start method with a message
                else if (typeof vapiInstance.start === 'function') {
                    logDebug('Using start method with message');
                    vapiInstance.start(ASSISTANT_ID, { message: message });
                }
                // No method available
                else {
                    throw new Error('No method available to send message');
                }
            } catch (err) {
                logDebug(`Error sending message: ${err.message}`);
                removeLoadingIndicators();
                addMessage('Sorry, I cannot send your message at this time.', false);
            }

            // Set a timeout to remove loading indicator if no response
            setTimeout(() => {
                removeLoadingIndicators();
            }, 10000); // 10 seconds timeout
        } else {
            logDebug('VAPI instance not available');
            removeLoadingIndicators();
            addMessage('Sorry, the assistant is not available. Please try again later.', false);
            updateStatus('Assistant not available');
        }
    } catch (error) {
        logDebug(`Error in sendMessage: ${error.message}`);
        removeLoadingIndicators();
        addMessage('Sorry, there was an error processing your request.', false);
    } finally {
        // Re-enable input
        messageInput.disabled = false;
        document.getElementById('send-button').disabled = false;
        messageInput.focus();
    }
}

// Tab switching
function switchTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(tabId + '-tab').classList.add('active');

    // Activate selected tab button
    document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
}

// Toggle chat bubble
function toggleChatBubble(forceMinimize = false) {
    const chatBubble = document.getElementById('chat-bubble');
    
    if (chatBubble.classList.contains('expanded') || forceMinimize) {
        // Minimize
        chatBubble.classList.remove('expanded');
    } else {
        // Expand
        chatBubble.classList.add('expanded');
        
        // Play slide sound effect
        playSlideSound();

        // Focus input field
        setTimeout(() => {
            document.getElementById('message-input').focus();
        }, 300);
    }
}

// Play slide sound effect
function playSlideSound() {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => {
        logDebug(`Error playing sound: ${e.message}`);
    });
}

// Handle collapse button click
function handleCollapseButtonClick(event) {
    // Prevent event from bubbling to the chat bubble
    event.stopPropagation();

    // Force minimize
    toggleChatBubble(true);
}

// Handle microphone button click
function handleMicButtonClick(event) {
    // Prevent event from bubbling
    if (event) {
        event.stopPropagation();
    }

    if (isCallActive) {
        // End call if active
        if (vapiInstance) {
            try {
                vapiInstance.stop();
            } catch (e) {
                logDebug(`Error stopping call: ${e.message}`);
            }
        }
    } else {
        // Start voice chat
        const messageInput = document.getElementById('message-input');
        messageInput.value = 'Start Voice Chat';

        // Expand chat bubble if minimized
        if (!document.getElementById('chat-bubble').classList.contains('expanded')) {
            toggleChatBubble();
        }

        // Send the message
        document.getElementById('send-button').click();
    }
}

// Handle click outside chat bubble
function handleDocumentClick(event) {
    const chatBubble = document.getElementById('chat-bubble');
    
    // If chat is expanded and click is outside the chat bubble
    if (chatBubble.classList.contains('expanded')) {
        // Check if the click is outside the chat bubble
        if (!chatBubble.contains(event.target)) {
            toggleChatBubble(true);
        }
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    logDebug('Page loaded');
    updateStatus('Ready', 'ready');

    // Initialize speech recognition for voice trigger
    setupSpeechRecognition();

    // Initialize VAPI Widget
    initVapiWidget();

    // Set up send button
    const sendButton = document.getElementById('send-button');
    sendButton.addEventListener('click', sendMessage);

    // Set up enter key press
    const messageInput = document.getElementById('message-input');
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Set up tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.getAttribute('data-tab'));
        });
    });

    // Set up chat bubble toggle
    const chatBubble = document.getElementById('chat-bubble');
    chatBubble.addEventListener('click', (e) => {
        // Only toggle if clicking on the bubble itself, not its children
        if (e.target === chatBubble || e.target.classList.contains('chat-icon')) {
            toggleChatBubble();
        }
    });

    // Set up microphone button
    const micButton = document.getElementById('mic-button');
    micButton.addEventListener('click', handleMicButtonClick);

    // Set up collapse button
    const collapseButton = document.getElementById('collapse-button');
    collapseButton.addEventListener('click', handleCollapseButtonClick);

    // Set up click outside listener
    document.addEventListener('click', handleDocumentClick);

    // Update stats initially
    updateStats();
});
