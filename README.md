# VAPI Voice & Chat Assistant for OpenEdX

An OpenEdX plugin/extension that integrates the VAPI Voice Widget to create persistent, context-aware voice and chat assistant experiences across your entire OpenEdX site.

## Features

- **Site-wide Persistence**: Available across all pages in your OpenEdX instance
- **Context Awareness**: Understands the current course, section, and user context
- **Dual Interface**: Both voice and chat interaction options
- **Clean, Responsive UI**: Floating interface that doesn't interfere with content
- **Real-time Status Updates**: Clear feedback on assistant state
- **Debug Logging**: Comprehensive troubleshooting tools
- **Conversation History**: Maintains context between sessions
- **Customizable**: Configurable at site, course, and user levels

## Prerequisites

- OpenEdX instance (Tutor-managed recommended)
- Administrator access to your OpenEdX installation
- VAPI account with API credentials
- Modern web browsers with microphone access for end users

## Quick Start

1. Install the plugin in your OpenEdX instance (see detailed instructions in docs/OPENEDX_INTEGRATION.md)
2. Configure your VAPI credentials in the plugin settings
3. Customize appearance and behavior as needed
4. The assistant will be available across your entire OpenEdX site

## How It Works

This OpenEdX plugin provides two ways to interact with the VAPI assistant, both using the same underlying LLM and knowledge base:

1. **Voice Assistant**: Uses the official VAPI Voice Widget for spoken conversations
2. **Chat Interface**: Uses the VAPI SDK to send text messages to the same assistant

Key components:
- **OpenEdX Integration**: Hooks into the OpenEdX platform for site-wide presence
- **Context Awareness**: Extracts and provides course and user context to the assistant
- **UI Components**: Floating interface that's consistent across all pages
- **VAPI Integration**: Connects to VAPI services for AI capabilities
- **State Management**: Maintains conversation history and settings across sessions

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

## OpenEdX Integration

This plugin integrates with OpenEdX at the platform level, providing a consistent assistant experience across all pages. See the detailed integration guide in `docs/OPENEDX_INTEGRATION.md`.

Key integration points:

1. **Platform-wide Injection**: The assistant UI is injected into all pages
2. **User Authentication**: Leverages OpenEdX authentication for personalized experiences
3. **Course Context**: Extracts current course, section, and progress information
4. **User Data**: Accesses relevant user data to provide personalized assistance
5. **Configuration**: Integrates with OpenEdX admin interfaces for configuration

### Customization Options

The plugin can be customized at multiple levels:

1. **Site-wide Settings**: Default behavior for all courses
2. **Course-specific Settings**: Customize behavior for individual courses
3. **User Preferences**: Allow users to adjust their assistant experience

See the configuration documentation for detailed customization options.
