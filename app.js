// Message Buffer System for robust message handling
class ChatMessage {
    constructor(role, content, isFinal = true) {
        this.id = Date.now() + Math.random().toString(36).substr(2, 9); // Unique ID
        this.role = role; // 'user' or 'assistant'
        this.content = content; // Message text
        this.timestamp = Date.now(); // Creation time
        this.isFinal = isFinal; // Whether this is a final transcript
        this.displayElement = null; // Reference to DOM element
    }

    // Check if this message should be merged with another
    shouldMergeWith(otherMessage) {
        // Only merge messages from the same speaker
        if (this.role !== otherMessage.role) return false;

        // Don't merge if either message is empty
        if (!this.content || !otherMessage.content) return false;

        // Only merge messages that are close in time (3 seconds max)
        const timeDiff = Math.abs(this.timestamp - otherMessage.timestamp);
        if (timeDiff > 3000) return false;

        // Check content-based rules
        return this.shouldMergeBasedOnContent(otherMessage);
    }

    // Content-based merging rules
    shouldMergeBasedOnContent(otherMessage) {
        const content1 = this.content.trim().toLowerCase();
        const content2 = otherMessage.content.trim().toLowerCase();

        // If one message contains the other entirely, they should be merged
        if (content1.includes(content2) || content2.includes(content1)) {
            return true;
        }

        // Check for significant overlap at the beginning
        const words1 = content1.split(' ');
        const words2 = content2.split(' ');

        let overlapCount = 0;
        const minLength = Math.min(words1.length, words2.length);

        for (let i = 0; i < minLength; i++) {
            if (words1[i] === words2[i]) {
                overlapCount++;
            } else {
                break;
            }
        }

        // If there's significant overlap (at least 2 words and 50% of the shorter message)
        if (overlapCount >= 2 && overlapCount >= minLength * 0.5) {
            return true;
        }

        // If the first message doesn't end with a sentence marker, it might be incomplete
        if (!content1.match(/[.!?]\s*$/)) {
            return true;
        }

        return false;
    }

    // Merge this message with another
    mergeWith(otherMessage) {
        const content1 = this.content.trim();
        const content2 = otherMessage.content.trim();

        // If one message contains the other entirely, use the longer one
        if (content1.toLowerCase().includes(content2.toLowerCase())) {
            return content1;
        }

        if (content2.toLowerCase().includes(content1.toLowerCase())) {
            return content2;
        }

        // Check for significant overlap at the beginning
        const words1 = content1.toLowerCase().split(' ');
        const words2 = content2.toLowerCase().split(' ');

        let overlapCount = 0;
        const minLength = Math.min(words1.length, words2.length);

        for (let i = 0; i < minLength; i++) {
            if (words1[i] === words2[i]) {
                overlapCount++;
            } else {
                break;
            }
        }

        // If there's significant overlap, use the longer message
        if (overlapCount >= 2 && overlapCount >= minLength * 0.5) {
            return content2.length > content1.length ? content2 : content1;
        }

        // Check if the second message starts with a word that's already at the end of the first
        const lastWordOfFirst = words1[words1.length - 1];
        const firstWordOfSecond = words2[0];

        if (lastWordOfFirst === firstWordOfSecond) {
            // Remove the duplicate word
            return content1 + ' ' + words2.slice(1).join(' ');
        }

        // Just concatenate with a space
        return content1 + ' ' + content2;
    }
}

class MessageBuffer {
    constructor() {
        this.messages = []; // Array of ChatMessage objects
        this.partialMessages = {}; // Map of role -> current partial message
    }

    // Add a message to the buffer
    addMessage(role, content, isFinal = true) {
        // Skip empty messages
        if (!content || content.trim() === '') {
            return null;
        }

        // Create a new message
        const message = new ChatMessage(role, content, isFinal);

        // Handle partial messages
        if (!isFinal) {
            this.partialMessages[role] = message;
            return message;
        }

        // Clear any partial messages for this role
        if (this.partialMessages[role]) {
            delete this.partialMessages[role];
        }

        // Try to merge with recent messages
        const recentMessages = this.getRecentMessages(role, 3);

        for (const existingMessage of recentMessages) {
            if (existingMessage.shouldMergeWith(message)) {
                // Merge the messages
                existingMessage.content = existingMessage.mergeWith(message);
                existingMessage.timestamp = Math.max(existingMessage.timestamp, message.timestamp);
                existingMessage.isFinal = true;

                // Return the merged message
                return existingMessage;
            }
        }

        // If no merge happened, add as a new message
        this.messages.push(message);
        return message;
    }

    // Update a partial message
    updatePartialMessage(role, content) {
        // Skip empty messages
        if (!content || content.trim() === '') {
            return null;
        }

        // If there's no partial message for this role, create one
        if (!this.partialMessages[role]) {
            this.partialMessages[role] = new ChatMessage(role, content, false);
            return this.partialMessages[role];
        }

        // Update the existing partial message
        this.partialMessages[role].content = content;
        this.partialMessages[role].timestamp = Date.now();

        return this.partialMessages[role];
    }

    // Finalize a partial message
    finalizePartialMessage(role) {
        // If there's no partial message, do nothing
        if (!this.partialMessages[role]) {
            return null;
        }

        // Get the partial message
        const message = this.partialMessages[role];
        message.isFinal = true;

        // Remove from partial messages
        delete this.partialMessages[role];

        // Try to merge with recent messages
        const recentMessages = this.getRecentMessages(role, 3);

        for (const existingMessage of recentMessages) {
            if (existingMessage.shouldMergeWith(message)) {
                // Merge the messages
                existingMessage.content = existingMessage.mergeWith(message);
                existingMessage.timestamp = Math.max(existingMessage.timestamp, message.timestamp);
                existingMessage.isFinal = true;

                // Return the merged message
                return existingMessage;
            }
        }

        // If no merge happened, add as a new message
        this.messages.push(message);
        return message;
    }

    // Get recent messages from a specific role
    getRecentMessages(role, count = 1) {
        return this.messages
            .filter(m => m.role === role)
            .sort((a, b) => b.timestamp - a.timestamp) // Most recent first
            .slice(0, count);
    }

    // Get all messages in chronological order
    getAllMessages() {
        return [...this.messages].sort((a, b) => a.timestamp - b.timestamp);
    }

    // Get the last message from a specific role
    getLastMessage(role) {
        const messages = this.getRecentMessages(role, 1);
        return messages.length > 0 ? messages[0] : null;
    }

    // Clear all messages
    clear() {
        this.messages = [];
        this.partialMessages = {};
    }
}

// Initialize the message buffer
const messageBuffer = new MessageBuffer();

// Variables for streaming text
let currentStreamingMessage = null;
let currentAssistantMessageDiv = null;

// VAPI configuration
// const ASSISTANT_ID = 'e6b55e0e-7bd3-49ed-87d6-afbe0a454625';
const ASSISTANT_ID = '007c44a8-8465-4539-b579-dd6d6f471b72';
const API_KEY = 'e502110f-2369-4b28-a3aa-858865390e02';
let vapiInstance = null;
let isCallActive = false;

// Transcription variables
let isTranscribing = false;
let transcriptionHistory = [];

// Sound effects
const slideSound = new Audio('sounds/slide.mp3');

// Duration timer
let durationTimer = null;

// Current user transcript
let currentUserTranscript = null;

// Stats tracking
let stats = {
    latency: 0,
    duration: 0,
    timeToFirstWord: 0,
    messagesSent: 0,
    userMessages: 0,
    assistantMessages: 0,
    callStartTime: 0,
    firstWordTime: 0,
    microphoneAvailable: false,
    requestStartTime: 0,
    tokensSent: 0,
    tokensReceived: 0
};

// Assistant details
let assistantDetails = {
    id: ASSISTANT_ID,
    name: 'VAPI Assistant',
    description: 'A voice-enabled AI assistant',
    model: 'Unknown',
    temperature: 0.7,
    systemPrompt: 'You are a helpful assistant.',
    voice: 'alloy',
    voiceSettings: {},
    tools: []
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
    document.getElementById('stat-duration').textContent = stats.duration.toFixed(1) + ' sec';
    document.getElementById('stat-ttfw').textContent = stats.timeToFirstWord + ' ms';
    document.getElementById('stat-messages-sent').textContent = stats.messagesSent;
    document.getElementById('stat-user-messages').textContent = stats.userMessages;
    document.getElementById('stat-assistant-messages').textContent = stats.assistantMessages;
    document.getElementById('stat-tokens-sent').textContent = stats.tokensSent;
    document.getElementById('stat-tokens-received').textContent = stats.tokensReceived;
    document.getElementById('stat-assistant-id').textContent = ASSISTANT_ID;
    document.getElementById('stat-mic-status').textContent = stats.microphoneAvailable ? 'Available' : 'Not Available';
}

// Update details tab
function updateDetailsTab() {
    // Basic Information
    document.getElementById('details-assistant-id').textContent = assistantDetails.id;
    document.getElementById('details-name').textContent = assistantDetails.name;
    document.getElementById('details-description').textContent = assistantDetails.description;

    // Model Configuration
    document.getElementById('details-model').textContent = assistantDetails.model;
    document.getElementById('details-temperature').textContent = assistantDetails.temperature;
    document.getElementById('details-system-prompt').textContent = assistantDetails.systemPrompt;

    // Voice Configuration
    document.getElementById('details-voice').textContent = assistantDetails.voice;
    document.getElementById('details-voice-settings').textContent =
        Object.keys(assistantDetails.voiceSettings).length > 0 ?
        JSON.stringify(assistantDetails.voiceSettings, null, 2) : 'Default';

    // Tools
    const toolsElement = document.getElementById('details-tools');
    if (assistantDetails.tools && assistantDetails.tools.length > 0) {
        toolsElement.innerHTML = '';
        assistantDetails.tools.forEach(tool => {
            const toolDiv = document.createElement('div');
            toolDiv.classList.add('tool-item');
            toolDiv.textContent = tool.name || tool;
            toolsElement.appendChild(toolDiv);
        });
    } else {
        toolsElement.textContent = 'No tools configured';
    }
}

// Start duration timer
function startDurationTimer() {
    // Clear any existing timer
    if (durationTimer) {
        clearInterval(durationTimer);
    }

    // Reset duration if starting a new call
    if (stats.callStartTime === 0) {
        stats.duration = 0;
        stats.callStartTime = Date.now();
    }

    // Update duration every second
    durationTimer = setInterval(() => {
        if (isCallActive) {
            stats.duration = (Date.now() - stats.callStartTime) / 1000;
            updateStats();
        }
    }, 1000);
}

// Stop duration timer
function stopDurationTimer() {
    if (durationTimer) {
        clearInterval(durationTimer);
        durationTimer = null;
    }
}

// Render all messages from the buffer to the DOM
function renderMessages() {
    const chatMessages = document.getElementById('chat-messages');

    // Store scroll position and check if we were at the bottom
    const wasAtBottom = chatMessages.scrollTop + chatMessages.clientHeight >= chatMessages.scrollHeight - 10;

    // Get all messages in chronological order
    const messages = messageBuffer.getAllMessages();

    // Get partial messages
    const partialMessages = Object.values(messageBuffer.partialMessages);

    // Create a document fragment to minimize DOM operations
    const fragment = document.createDocumentFragment();

    // Add each message to the fragment
    [...messages, ...partialMessages].sort((a, b) => a.timestamp - b.timestamp).forEach(message => {
        // Skip if the message already has a display element in the DOM
        if (message.displayElement && message.displayElement.parentNode === chatMessages) {
            // Just update the content if needed
            if (message.displayElement.textContent !== message.content) {
                message.displayElement.textContent = message.content;
            }
            return;
        }

        // Create a new message element
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(message.role === 'user' ? 'user-message' : 'assistant-message');
        messageDiv.textContent = message.content;
        messageDiv.dataset.messageId = message.id;

        // Store reference to the DOM element
        message.displayElement = messageDiv;

        // Add to fragment
        fragment.appendChild(messageDiv);
    });

    // Clear the container and add the fragment
    chatMessages.innerHTML = '';
    chatMessages.appendChild(fragment);

    // Restore scroll position if we were at the bottom
    if (wasAtBottom) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Add message to chat (updated to use message buffer)
function addMessage(text, isUser = false) {
    // Don't add empty messages
    if (!text || text.trim() === '') {
        return null;
    }

    // Add to message buffer
    const role = isUser ? 'user' : 'assistant';
    const message = messageBuffer.addMessage(role, text, true);

    // Render messages
    renderMessages();

    // Return the message object
    return message.displayElement;
}

// Stream text to message
function streamTextToMessage(text, speed = 30) {
    // Skip empty messages
    if (!text || text.trim() === '') {
        return null;
    }

    // If there's already a streaming message, clear it
    if (currentStreamingMessage) {
        clearTimeout(currentStreamingMessage);
        currentStreamingMessage = null;
    }

    // Create a streaming message in the buffer
    const message = messageBuffer.addMessage('assistant', '', true);

    // If message creation failed, return
    if (!message) {
        return null;
    }

    // Render the empty message
    renderMessages();

    // Get the message element
    const messageDiv = message.displayElement;

    // Add a cursor element
    const cursorElement = document.createElement('span');
    cursorElement.classList.add('cursor');
    messageDiv.appendChild(cursorElement);

    let i = 0;
    const streamNextChar = () => {
        if (i < text.length) {
            // Update the message content
            message.content = text.substring(0, i + 1);

            // Update the display element
            messageDiv.textContent = message.content;

            // Re-add the cursor
            messageDiv.appendChild(cursorElement);

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

            // Ensure the final content is set
            message.content = text;
            messageDiv.textContent = text;
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

// Speech recognition for voice trigger and transcription
let recognition = null;
let transcriptionRecognition = null;
let recognitionActive = false;
let recognitionPaused = false;
let transcriptionActive = false;

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
                const transcript = event.results[event.results.length - 1][0].transcript.trim();
                const lowerTranscript = transcript.toLowerCase();
                logDebug(`Speech recognized: ${transcript}`);

                // Handle transcription based on call state
                if (!isCallActive && !recognitionPaused) {
                    // Not in a call - add to transcription tab
                    const transcriptionContent = document.getElementById('transcription-content');
                    if (transcriptionContent) {
                        const messageDiv = document.createElement('div');
                        messageDiv.classList.add('transcription-message');
                        messageDiv.textContent = transcript;
                        transcriptionContent.appendChild(messageDiv);
                        transcriptionContent.scrollTop = transcriptionContent.scrollHeight;
                    }
                } else if (isCallActive) {
                    // In a voice call - add to chat window
                    logDebug(`Adding user speech to buffer: ${transcript}`);

                    // Add to message buffer as a final message
                    // The buffer will handle merging decisions
                    messageBuffer.addMessage('user', transcript, true);

                    // Render messages
                    renderMessages();

                    // Update stats
                    stats.userMessages++;
                    stats.messagesSent++;
                    updateStats();
                }

                // Check for trigger phrase
                if (lowerTranscript.includes('start voice chat')) {
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

// No longer need dedicated transcription recognition

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
        stats.messagesSent++;
        updateStats();

        // Start duration timer
        startDurationTimer();

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

        // Stop duration timer
        stopDurationTimer();

        // Calculate final duration
        if (stats.callStartTime > 0) {
            stats.duration = (Date.now() - stats.callStartTime) / 1000;
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

        // Check for assistant details
        if (message.assistant) {
            // Update assistant details
            assistantDetails.id = message.assistant.id || assistantDetails.id;
            assistantDetails.name = message.assistant.name || assistantDetails.name;
            assistantDetails.description = message.assistant.description || assistantDetails.description;

            if (message.assistant.model) {
                assistantDetails.model = message.assistant.model.name || message.assistant.model;
                if (message.assistant.model.temperature) {
                    assistantDetails.temperature = message.assistant.model.temperature;
                }
            }

            if (message.assistant.voice) {
                assistantDetails.voice = message.assistant.voice.name || message.assistant.voice;
                assistantDetails.voiceSettings = message.assistant.voice.settings || {};
            }

            if (message.assistant.tools) {
                assistantDetails.tools = message.assistant.tools;
            }

            if (message.assistant.system_prompt) {
                assistantDetails.systemPrompt = message.assistant.system_prompt;
            }

            // Update details tab
            updateDetailsTab();
        }

        // Check for token usage
        if (message.usage) {
            if (message.usage.prompt_tokens) {
                stats.tokensSent += message.usage.prompt_tokens;
            }
            if (message.usage.completion_tokens) {
                stats.tokensReceived += message.usage.completion_tokens;
            }
            updateStats();
        }

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

                    // Reset the current user transcript so the next user message will be new
                    currentUserTranscript = null;
                }
            } else if (message.type === 'transcript') {
                if (message.role === 'assistant') {
                    // Assistant transcript - this is what we want to stream!
                    const transcriptText = message.transcript;
                    logDebug(`Assistant transcript: ${transcriptText}`);

                    // Check if this is a final or partial transcript
                    const isFinal = message.transcriptType === 'final';

                    if (isFinal) {
                        // This is a final transcript - add to buffer
                        messageBuffer.addMessage('assistant', transcriptText, true);

                        // Increment message counts for assistant responses
                        stats.messagesSent++;
                        stats.assistantMessages++;
                        updateStats();

                        // Reset the current assistant message div
                        currentAssistantMessageDiv = null;
                    } else {
                        // This is a partial transcript - update or create partial message
                        messageBuffer.updatePartialMessage('assistant', transcriptText);
                    }

                    // Render messages
                    renderMessages();
                } else if (message.role === 'user' && message.transcript) {
                    // User speech transcript
                    const userText = message.transcript.text || message.transcript;
                    const isFinal = message.transcript.is_final === true;
                    logDebug(`Adding user transcript: ${userText} (final: ${isFinal})`);

                    // Skip empty transcripts
                    if (!userText || userText.trim() === '') {
                        return;
                    }

                    if (isFinal) {
                        // This is a final transcript - add to buffer
                        messageBuffer.addMessage('user', userText, true);

                        // Increment message counts for each final transcript
                        stats.messagesSent++;
                        stats.userMessages++;

                        // Calculate latency if we have a request start time
                        if (stats.requestStartTime > 0) {
                            stats.latency = Date.now() - stats.requestStartTime;
                            stats.requestStartTime = 0;
                        }

                        // Update stats display
                        updateStats();
                    } else {
                        // This is a partial transcript - update or create partial message
                        messageBuffer.updatePartialMessage('user', userText);
                    }

                    // Render messages
                    renderMessages();
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

            // Increment message counts for text responses
            stats.messagesSent++;
            stats.assistantMessages++;
            updateStats();
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
        // Add user message to buffer
        messageBuffer.addMessage('user', message, true);
        renderMessages();
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
    // Add user message to buffer
    messageBuffer.addMessage('user', message, true);
    renderMessages();
    messageInput.value = '';

    // Disable input while processing
    messageInput.disabled = true;
    document.getElementById('send-button').disabled = true;

    try {
        // Increment message counts
        stats.messagesSent++;
        stats.userMessages++;

        // Record request start time for latency calculation
        stats.requestStartTime = Date.now();

        // Show loading indicator
        messageBuffer.addMessage('assistant', '...', false);
        renderMessages();

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

        // Play slide sound
        slideSound.play().catch(err => {
            // Handle any errors with sound playback silently
            console.log('Sound playback error:', err);
        });

        // Focus input field
        setTimeout(() => {
            document.getElementById('message-input').focus();
        }, 300);
    }
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

// Add transcription to the transcription tab
function addTranscription(text, isSystem = false) {
    // Add to transcription history
    if (!isSystem) {
        transcriptionHistory.push({
            text: text
        });
    }

    // Add to transcription content
    const transcriptionContent = document.getElementById('transcription-content');
    if (transcriptionContent) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('transcription-message');
        if (isSystem) {
            messageDiv.classList.add('system-message');
        }
        messageDiv.textContent = text;
        transcriptionContent.appendChild(messageDiv);
        transcriptionContent.scrollTop = transcriptionContent.scrollHeight;
    }
}

// Clear transcription content
function clearTranscription() {
    const transcriptionContent = document.getElementById('transcription-content');
    if (transcriptionContent) {
        transcriptionContent.innerHTML = '';
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('transcription-message', 'system-message');
        messageDiv.textContent = 'Transcription cleared';
        transcriptionContent.appendChild(messageDiv);
    }
    transcriptionHistory = [];
}

// Get the last user message in the chat
function getLastUserMessage() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return null;

    // Get all user messages
    const userMessages = chatMessages.querySelectorAll('.user-message');
    if (userMessages.length === 0) return null;

    // Return the last one
    return userMessages[userMessages.length - 1];
}

// Get the last assistant message in the chat
function getLastAssistantMessage() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return null;

    // Get all assistant messages
    const assistantMessages = chatMessages.querySelectorAll('.assistant-message');
    if (assistantMessages.length === 0) return null;

    // Return the last one
    return assistantMessages[assistantMessages.length - 1];
}

// Check if the assistant has spoken since the last user message
function hasAssistantSpokenSinceLastUserMessage() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return true; // Default to true if we can't check

    // Get all message elements
    const messageElements = chatMessages.children;
    if (messageElements.length === 0) return false;

    // Start from the end and look for the pattern
    let lastUserMessageIndex = -1;

    // Find the last user message
    for (let i = messageElements.length - 1; i >= 0; i--) {
        if (messageElements[i].classList.contains('user-message')) {
            lastUserMessageIndex = i;
            break;
        }
    }

    // If no user message found, or it's the last message, return false
    if (lastUserMessageIndex === -1 || lastUserMessageIndex === messageElements.length - 1) {
        return false;
    }

    // Check if there's an assistant message after the last user message
    for (let i = lastUserMessageIndex + 1; i < messageElements.length; i++) {
        if (messageElements[i].classList.contains('assistant-message')) {
            return true;
        }
    }

    return false;
}

// Check if two sentences should be merged
function shouldMergeSentences(sentence1, sentence2) {
    if (!sentence1 || !sentence2) return false;

    // Trim the sentences
    sentence1 = sentence1.trim();
    sentence2 = sentence2.trim();

    // If either sentence is empty, don't merge
    if (sentence1 === '' || sentence2 === '') return false;

    // Check if the second sentence is a complete version of the first
    if (sentence2.toLowerCase().includes(sentence1.toLowerCase())) {
        // If the second sentence contains the first one entirely, use the second one
        return true;
    }

    // Check if the first sentence is a complete version of the second
    if (sentence1.toLowerCase().includes(sentence2.toLowerCase())) {
        // If the first sentence contains the second one entirely, keep the first one
        return false;
    }

    // Check if the first sentence ends with a complete sentence marker
    const endsWithSentenceMarker = /[.!?]\s*$/.test(sentence1);
    if (endsWithSentenceMarker) return false;

    // Check if the second sentence starts with a lowercase letter (likely a continuation)
    const startsWithLowercase = /^[a-z]/.test(sentence2);

    // Check if the sentences have significant overlap
    const words1 = sentence1.toLowerCase().split(' ');
    const words2 = sentence2.toLowerCase().split(' ');

    // Check for partial sentence overlap (e.g., "Tell me about" and "Tell me more about")
    let overlapCount = 0;
    const minLength = Math.min(words1.length, words2.length);
    for (let i = 0; i < minLength; i++) {
        if (words1[i] === words2[i]) {
            overlapCount++;
        } else {
            break;
        }
    }

    // If there's significant overlap at the beginning (more than 2 words), consider merging
    const hasSignificantOverlap = overlapCount >= 2 && overlapCount >= minLength * 0.5;

    // Check if the combined text makes sense (no repeated words at the boundary)
    const lastWordOfFirst = words1[words1.length - 1];
    const firstWordOfSecond = words2[0];
    const hasRepeatedWords = lastWordOfFirst === firstWordOfSecond;

    return startsWithLowercase || hasSignificantOverlap || !hasRepeatedWords;
}

// Merge two sentences intelligently
function mergeSentences(sentence1, sentence2) {
    if (!sentence1 || sentence1.trim() === '') return sentence2 || '';
    if (!sentence2 || sentence2.trim() === '') return sentence1 || '';

    // Trim the sentences
    sentence1 = sentence1.trim();
    sentence2 = sentence2.trim();

    // Check if the second sentence is a complete version of the first
    if (sentence2.toLowerCase().includes(sentence1.toLowerCase())) {
        // If the second sentence contains the first one entirely, use the second one
        return sentence2;
    }

    // Check if the first sentence is a complete version of the second
    if (sentence1.toLowerCase().includes(sentence2.toLowerCase())) {
        // If the first sentence contains the second one entirely, keep the first one
        return sentence1;
    }

    // Check for partial sentence overlap at the beginning
    const words1 = sentence1.toLowerCase().split(' ');
    const words2 = sentence2.toLowerCase().split(' ');

    let overlapCount = 0;
    const minLength = Math.min(words1.length, words2.length);
    for (let i = 0; i < minLength; i++) {
        if (words1[i] === words2[i]) {
            overlapCount++;
        } else {
            break;
        }
    }

    // If there's significant overlap at the beginning, merge intelligently
    if (overlapCount >= 2) {
        // Use the second sentence as it's likely more complete
        return sentence2;
    }

    // Check if the second sentence starts with a word that's already at the end of the first
    const lastWordOfFirst = words1[words1.length - 1];
    const firstWordOfSecond = words2[0];

    if (lastWordOfFirst === firstWordOfSecond) {
        // Remove the duplicate word
        return sentence1 + ' ' + words2.slice(1).join(' ');
    } else {
        // Just concatenate with a space
        return sentence1 + ' ' + sentence2;
    }
}

// Check if two assistant messages should be merged
function shouldMergeAssistantMessages(message1, message2) {
    if (!message1 || !message2) return false;

    // Trim the messages
    message1 = message1.trim();
    message2 = message2.trim();

    // If either message is empty, don't merge
    if (message1 === '' || message2 === '') return false;

    // Check if the second message is a complete version of the first
    if (message2.toLowerCase().includes(message1.toLowerCase())) {
        // If the second message contains the first one entirely, use the second one
        return true;
    }

    // Check if the first message is a complete version of the second
    if (message1.toLowerCase().includes(message2.toLowerCase())) {
        // If the first message contains the second one entirely, keep the first one
        return false;
    }

    // Check if the messages are part of the same sentence or thought
    // First, check if the first message ends with a complete sentence marker
    const endsWithSentenceMarker = /[.!?]\s*$/.test(message1);
    if (endsWithSentenceMarker) {
        // If the first message ends with a sentence marker, only merge if the second
        // message is clearly a continuation (starts with lowercase)
        return /^[a-z]/.test(message2);
    }

    // If the first message doesn't end with a sentence marker, it's likely incomplete
    // so we should merge with the second message
    return true;
}

// Merge two assistant messages intelligently
function mergeAssistantMessages(message1, message2) {
    if (!message1 || message1.trim() === '') return message2 || '';
    if (!message2 || message2.trim() === '') return message1 || '';

    // Trim the messages
    message1 = message1.trim();
    message2 = message2.trim();

    // Check if the second message is a complete version of the first
    if (message2.toLowerCase().includes(message1.toLowerCase())) {
        // If the second message contains the first one entirely, use the second one
        return message2;
    }

    // Check if the first message is a complete version of the second
    if (message1.toLowerCase().includes(message2.toLowerCase())) {
        // If the first message contains the second one entirely, keep the first one
        return message1;
    }

    // Check if the first message ends with a sentence marker
    if (/[.!?]\s*$/.test(message1)) {
        // If it does, just concatenate with a space
        return message1 + ' ' + message2;
    } else {
        // If it doesn't, it's likely an incomplete sentence, so we need to be smarter
        // about how we merge

        // Split into words
        const words1 = message1.split(' ');
        const words2 = message2.split(' ');

        // Check for duplicate words at the boundary
        const lastWordOfFirst = words1[words1.length - 1].toLowerCase();
        const firstWordOfSecond = words2[0].toLowerCase();

        if (lastWordOfFirst === firstWordOfSecond) {
            // Remove the duplicate word
            return message1 + ' ' + words2.slice(1).join(' ');
        } else {
            // Just concatenate with a space
            return message1 + ' ' + message2;
        }
    }
}

// Update history tab with conversation
function updateHistoryTab() {
    const historyContent = document.getElementById('history-content');
    if (!historyContent) return;

    // Clear existing content
    historyContent.innerHTML = '';

    // Get all messages from the buffer
    const messages = messageBuffer.getAllMessages();

    if (messages.length === 0) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('history-message', 'system-message');
        messageDiv.textContent = 'No conversation history yet';
        historyContent.appendChild(messageDiv);
        return;
    }

    // Add each message to the history
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('history-message');
        messageDiv.classList.add(message.role === 'user' ? 'user-message' : 'assistant-message');

        // Add timestamp
        const timestampSpan = document.createElement('span');
        timestampSpan.classList.add('message-timestamp');
        timestampSpan.textContent = new Date(message.timestamp).toLocaleTimeString();
        messageDiv.appendChild(timestampSpan);

        // Add content
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.textContent = message.content;
        messageDiv.appendChild(contentDiv);

        historyContent.appendChild(messageDiv);
    });

    // Scroll to bottom
    historyContent.scrollTop = historyContent.scrollHeight;
}

// Clear conversation history
function clearHistory() {
    messageBuffer.clear();
    renderMessages();
    updateHistoryTab();
    logDebug('Conversation history cleared');
}

// Switch chat tabs
function switchChatTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.chat-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all tab buttons
    document.querySelectorAll('.chat-tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(tabId + '-tab').classList.add('active');

    // Activate selected tab button
    document.querySelector(`.chat-tab-button[data-chat-tab="${tabId}"]`).classList.add('active');

    // Update history tab when switching to it
    if (tabId === 'history') {
        updateHistoryTab();
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

    // Set up transcription controls
    const clearTranscriptionButton = document.getElementById('clear-transcription-button');
    if (clearTranscriptionButton) {
        clearTranscriptionButton.addEventListener('click', clearTranscription);
    }

    // Set up history controls
    const clearHistoryButton = document.getElementById('clear-history-button');
    if (clearHistoryButton) {
        clearHistoryButton.addEventListener('click', clearHistory);
    }

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

    // Update stats and details initially
    updateStats();
    updateDetailsTab();

    // Set up hover behavior for chat bubble
    chatBubble.addEventListener('mouseenter', () => {
        if (!chatBubble.classList.contains('expanded')) {
            toggleChatBubble();
        }
    });

    // Set up document click handler to collapse chat when clicking away
    document.addEventListener('click', (e) => {
        const chatBubble = document.getElementById('chat-bubble');
        // Check if chat is expanded and click is outside the chat bubble
        if (chatBubble.classList.contains('expanded')) {
            // Check if the click target is not within the chat bubble
            if (!chatBubble.contains(e.target)) {
                toggleChatBubble(true); // Force minimize
            }
        }
    });
});