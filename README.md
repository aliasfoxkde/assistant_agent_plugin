# VAPI Voice & Chat Assistant

A web application that integrates the VAPI Voice Widget to create both voice and chat assistant experiences.

## Features

- Clean, responsive UI with tabbed interface
- Chat widget for text-based conversations
- Voice assistant for spoken interactions
- Real-time status updates
- Debug logging for troubleshooting
- Progressive Web App (PWA) support for offline use
- Automatic speech transcription
- Deployable to Cloudflare Pages

## Prerequisites

- A modern web browser with microphone access
- Internet connection to access VAPI services
- Node.js and npm (optional, for running the local server)

## Quick Start

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
4. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:3000)

## How It Works

This application combines two ways to interact with the VAPI assistant, both using the same underlying LLM and knowledge base:

1. **Voice Assistant**: Uses the official VAPI Voice Widget for spoken conversations
2. **Chat Interface**: Uses the VAPI SDK to send text messages to the same assistant

Key components:
- HTML/CSS for the user interface and chat widget
- JavaScript for handling messages, status updates, and debug logging
- VAPI Widget script for voice assistant functionality
- VAPI SDK integration for the chat interface
- Conversation history tracking to maintain context between messages

## Usage

### Voice Assistant
1. Click the microphone button in the bottom right corner
2. The button will change appearance when the assistant is active
3. Speak clearly into your microphone
4. Click the button again to end the conversation

### Chat Interface
1. Type your message in the input field at the bottom of the chat window
2. Press Enter or click the Send button
3. Your message and the assistant's response will appear in the chat window
4. The chat interface maintains conversation history for context
5. Messages are sent through the VAPI SDK, using the same LLM and knowledge base as the voice assistant
6. If no voice call is active, the chat interface will start a muted call to communicate with the assistant

## Configuration

The application uses the following VAPI credentials:
- Public API Key: e502110f-2369-4b28-a3aa-858865390e02
- Assistant ID: e6b55e0e-7bd3-49ed-87d6-afbe0a454625

To use your own VAPI assistant, update these constants in the `index.html` file:

```javascript
const assistant = "your-assistant-id";
const apiKey = "your-public-api-key";
```

You can customize:
- The voice button appearance by modifying the `buttonConfig` object
- The chat interface styling by editing the CSS
- The tab layout and content organization

## Troubleshooting

If you encounter issues:
1. Check the debug logs in the Debug tab for error messages
2. Ensure your microphone is working and permissions are granted
3. Check the browser console for additional error information
4. Try a different browser if you experience compatibility issues

## Resources

- [VAPI Documentation](https://docs.vapi.ai/)
- [VAPI Voice Widget](https://docs.vapi.ai/examples/voice-widget)

## PWA Support

This application supports Progressive Web App features:
- Can be installed on home screen
- Works offline
- Responsive design for all devices

## Deployment to Cloudflare Pages

### Manual Deployment

1. Log in to your Cloudflare dashboard
2. Go to Pages > Create a project > Connect to Git
3. Select your repository and configure the following settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (root directory)
4. Click "Save and Deploy"

### Using Wrangler CLI

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Install Wrangler CLI (if not already installed):
```bash
npm install -g wrangler
```

4. Authenticate with Cloudflare:
```bash
wrangler login
```

5. Deploy to Cloudflare Pages:
```bash
npm run deploy
```

### Troubleshooting Deployment

If you encounter issues with deployment:

1. Make sure the `wrangler.toml` file contains the `pages_build_output_dir` property
2. Ensure all static assets are properly included in the build
3. Check that the build script is creating the `dist` directory correctly
4. Verify that you have the correct permissions in your Cloudflare account
