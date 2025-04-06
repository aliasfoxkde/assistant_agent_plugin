// Conversation history to maintain context
let conversationHistory = [];
let currentAssistantMessageDiv = null;

// Variables for streaming text
let currentStreamingMessage = null;

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

// Add message to chat
function addMessage(text, isUser = false) {
    // Don't add empty messages
    if (!text || text.trim() === '') {
        return null;
    }

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
    // Skip empty messages
    if (!text || text.trim() === '') {
        return null;
    }

    // If there's already a streaming message, clear it
    if (currentStreamingMessage) {
        clearTimeout(currentStreamingMessage);
        currentStreamingMessage = null;
    }

    // Create a new message div
    const messageDiv = addMessage('', false);

    // If message creation failed, return
    if (!messageDiv) {
        return null;
    }

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

            // Add to conversation history when streaming is complete
            conversationHistory.push({
                role: 'assistant',
                content: text,
                timestamp: new Date().toLocaleTimeString()
            });
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
                    // If we have a current transcript element, remove it
                    if (currentUserTranscript) {
                        currentUserTranscript.remove();
                    }

                    // Create a new transcript element or update existing
                    currentUserTranscript = addMessage(transcript, true);

                    // Add to conversation history
                    conversationHistory.push({
                        role: 'user',
                        content: transcript,
                        timestamp: new Date().toLocaleTimeString()
                    });

                    // Increment user message count
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

                        // Increment message counts for assistant responses
                        stats.messagesSent++;
                        stats.assistantMessages++;
                        updateStats();

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
                        // If we have a current transcript element, remove it
                        if (currentUserTranscript) {
                            currentUserTranscript.remove();
                            currentUserTranscript = null;
                        }

                        // Check if this is a continuation of a previous sentence
                        const lastMessage = getLastUserMessage();
                        const shouldMerge = lastMessage && shouldMergeSentences(lastMessage.textContent, userText);

                        if (shouldMerge && lastMessage) {
                            // Merge with the previous message
                            lastMessage.textContent = mergeSentences(lastMessage.textContent, userText);

                            // Update the conversation history
                            for (let i = conversationHistory.length - 1; i >= 0; i--) {
                                if (conversationHistory[i].role === 'user') {
                                    conversationHistory[i].content = lastMessage.textContent;
                                    break;
                                }
                            }
                        } else {
                            // Add as a new message
                            addMessage(userText, true);

                            // Add to conversation history with timestamp
                            conversationHistory.push({
                                role: 'user',
                                content: userText,
                                timestamp: new Date().toLocaleTimeString()
                            });
                        }

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
                        // This is a partial transcript
                        if (!currentUserTranscript) {
                            // Create a new transcript element
                            currentUserTranscript = addMessage(userText, true);
                        } else {
                            // Update existing transcript element
                            currentUserTranscript.textContent = userText;
                        }
                    }
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
        // Add to conversation history with timestamp
        conversationHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date().toLocaleTimeString()
        });

        // Increment message counts
        stats.messagesSent++;
        stats.userMessages++;

        // Record request start time for latency calculation
        stats.requestStartTime = Date.now();

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

// Check if two sentences should be merged
function shouldMergeSentences(sentence1, sentence2) {
    if (!sentence1 || !sentence2) return false;

    // Trim the sentences
    sentence1 = sentence1.trim();
    sentence2 = sentence2.trim();

    // If either sentence is empty, don't merge
    if (sentence1 === '' || sentence2 === '') return false;

    // Check if the first sentence ends with a complete sentence marker
    const endsWithSentenceMarker = /[.!?]\s*$/.test(sentence1);
    if (endsWithSentenceMarker) return false;

    // Check if the second sentence starts with a lowercase letter (likely a continuation)
    const startsWithLowercase = /^[a-z]/.test(sentence2);

    // Check if the combined text makes sense (no repeated words at the boundary)
    const lastWordOfFirst = sentence1.split(' ').pop();
    const firstWordOfSecond = sentence2.split(' ')[0];
    const hasRepeatedWords = lastWordOfFirst.toLowerCase() === firstWordOfSecond.toLowerCase();

    return startsWithLowercase || !hasRepeatedWords;
}

// Merge two sentences intelligently
function mergeSentences(sentence1, sentence2) {
    if (!sentence1 || sentence1.trim() === '') return sentence2 || '';
    if (!sentence2 || sentence2.trim() === '') return sentence1 || '';

    // Trim the sentences
    sentence1 = sentence1.trim();
    sentence2 = sentence2.trim();

    // Check if the second sentence starts with a word that's already at the end of the first
    const words1 = sentence1.split(' ');
    const words2 = sentence2.split(' ');

    const lastWordOfFirst = words1[words1.length - 1].toLowerCase();
    const firstWordOfSecond = words2[0].toLowerCase();

    if (lastWordOfFirst === firstWordOfSecond) {
        // Remove the duplicate word
        return sentence1 + ' ' + words2.slice(1).join(' ');
    } else {
        // Just concatenate with a space
        return sentence1 + ' ' + sentence2;
    }
}

// Update history tab with conversation
function updateHistoryTab() {
    const historyContent = document.getElementById('history-content');
    if (!historyContent) return;

    // Clear existing content
    historyContent.innerHTML = '';

    if (conversationHistory.length === 0) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('history-message', 'system-message');
        messageDiv.textContent = 'No conversation history yet';
        historyContent.appendChild(messageDiv);
        return;
    }

    // Add each message to the history
    conversationHistory.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('history-message');
        messageDiv.classList.add(message.role === 'user' ? 'user-message' : 'assistant-message');

        // Add timestamp if available
        if (message.timestamp) {
            const timestampSpan = document.createElement('span');
            timestampSpan.classList.add('message-timestamp');
            timestampSpan.textContent = message.timestamp;
            messageDiv.appendChild(timestampSpan);
        }

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
    conversationHistory = [];
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