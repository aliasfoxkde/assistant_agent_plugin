## Component Architecture

### Backend Components
1. **VoiceAssistanceXBlock** (`voice_assistance.py`)
   - Core xBlock class implementing the OpenEdX XBlock interface
   - Manages student state, settings, and history
   - Handles VAPI.ai API communication
   - Processes context awareness
2. **Setup Script** (`setup.py`)
   - Defines package metadata and dependencies
   - Configures installation parameters

### Frontend Components

1. **Main Interface** (`voice_assistance.html`, `voice_assistance.js`, `voice_assistance.css`)
   - Floating button implementation
   - Expandable chat interface
   - Voice recording and playback
2. **Settings Panel** (`voice_settings.html`, `voice_settings.js`)
   - Voice customization interface
   - User preference management
3. **History Panel** (`voice_history.html`, `voice_history.js`)
   - Conversation history display
   - History navigation and replay

## Data Model

### XBlock Fields
1. **Configuration Settings**
   - `api_key`: VAPI.ai API key
   - `api_endpoint`: VAPI.ai service endpoint
   - `default_language`: Default language setting
   - `default_voice`: Default voice selection
2. **User State**
   - `user_settings`: User voice preferences
   - `conversation_history`: Past interactions
   - `context_data`: Current learning context
   - `notification_count`: Pending assistance offers

## Integration Points

### OpenEdX Platform
- Student user identification
- Course structure and navigation
- Progress tracking
- Runtime services

### VAPI.ai API
- Speech-to-text conversion
- Text-to-speech generation
- Natural language understanding
- Dialog management

## Setup
1. **Installation**
   Install the xBlock in your OpenEdX environment:
   ```bash
   pip install -e git+https://github.com/yourusername/voice_assistance_xblock.git#egg=voice_assistance_xblock
   ```

## Configuration
- Add to your advanced modules in Studio:
  ```"advanced_modules": ["voice_assistance"]```

## API Setup
- Obtain VAPI.ai credentials and configure in the xBlock settings.

## Course Integration
- Add the component to your course units where voice assistance is desired.

## Usage
- For Course Authors
  - Add the "Voice Assistance" component to your course
  - Configure API credentials and default settings
  - Set content-specific help prompts (optional)
- For Students
  - Access the floating assistant using the button in the bottom right
  - Speak or type questions related to the course content
  - Customize voice settings as preferred
  - Access conversation history as needed
- Development
  - Setting Up Development Environment
  - Clone the repository:
    ```git clone https://github.com/yourusername/voice_assistance_xblock.git```
  - Install in development mode:
    ```pip install -e ./voice_assistance_xblock```
  - Run tests:
    ```python -m unittest discover voice_assistance_xblock/tests```
  - Adding New Features
    - Extend the JavaScript modules in static/js/
    - Update the HTML templates in static/html/
    - Modify the core xBlock class in voice_assistance.py
    - Add appropriate tests in tests/

## Coding Standards
- Follow PEP 8 for Python code
- Use JSDoc for JavaScript documentation
- Maintain WCAG 2.1 AA compliance for accessibility
