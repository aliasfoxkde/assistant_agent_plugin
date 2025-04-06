# VAPI Integration Guide

This document provides details on how the Voice Assistance xBlock integrates with VAPI.ai.

## Overview

The Voice Assistance xBlock uses VAPI.ai to provide both text and voice interaction capabilities. VAPI.ai handles:

- Text-to-speech conversion
- Speech-to-text transcription
- Natural language understanding
- Dialog management

## Configuration

### Required Credentials

To use the xBlock, you'll need:

1. **VAPI API Key**: Your authentication key for the VAPI.ai API
2. **VAPI Assistant ID**: The ID of your configured assistant in VAPI.ai

These credentials are configured in the Studio edit view for the xBlock.

### Setting Up VAPI.ai

1. Create an account at [VAPI.ai](https://vapi.ai)
2. Create a new assistant
3. Configure the assistant with appropriate knowledge and behavior
4. Note the API Key and Assistant ID

## API Integration

### Text Interaction

The xBlock sends text messages to VAPI.ai using the following endpoint:

```
POST https://api.vapi.ai/call/text
```

With the following payload:

```json
{
  "assistantId": "<assistant_id>",
  "message": "<user_message>",
  "user": {
    "firstName": "Student"
  },
  "voice": {
    "voiceId": "<voice_id>",
    "speed": <speaking_rate>
  }
}
```

### Voice Interaction

For voice interactions, the xBlock sends audio data to VAPI.ai using:

```
POST https://api.vapi.ai/call/audio
```

With a multipart form containing:

- `audio`: The audio file (WAV format)
- `assistantId`: The VAPI Assistant ID
- `voice`: JSON string with voice configuration

## Voice Customization

The xBlock allows customization of the following voice parameters:

- **Voice ID**: The voice to use (alloy, echo, fable, onyx, nova)
- **Speaking Rate**: Speed of speech (0.5 to 2.0)
- **Volume**: Audio volume (0.1 to 1.0)
- **Language**: Language for the assistant (en-US, en-GB, etc.)

These settings can be configured by users through the settings panel.

## Error Handling

The xBlock implements error handling for various VAPI.ai API issues:

- Authentication errors
- Network connectivity issues
- Rate limiting
- Invalid requests

Errors are logged and displayed to users with appropriate messages.

## Future Enhancements

Planned enhancements for the VAPI.ai integration include:

1. **Context Awareness**: Providing course context to the assistant
2. **Proactive Assistance**: Triggering assistance based on user behavior
3. **Analytics Integration**: Tracking conversation metrics
4. **Multi-modal Interactions**: Supporting images and other media types
