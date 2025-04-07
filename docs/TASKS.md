# TASKS
This document outlines the tasks required to implement the Voice Assistance Plugin, organized by phase, scope, and category.

Infrastructure
- [ ] Deploy to Cloudflare (to share demo)

Improvements:
- [ ] Change messages sent to be Session Count, and keep track of the number of voice/chat instances are started.
- [ ] Latency, Tokens Sent, and Tokens Received are not being calculated. Can you fix this?
- [ ] Details tab is all boilerplate. Please use the API response to populate these values accurately.
- [ ] Put "Assistant" in tittle on the next line.
- [ ] Microphone activated and deactivated repeatidly. Can this be improved, maybe adjust the "Speech recognition" backoff of 1000ms.
      Is is there a smarter way to listen for "Start Voice Chat"?

- [ ] Automate add, commit (with AI Message), and push (for IDE Agentic features)?
- [ ] Add tooltip info box for instructions into the chat widget
- [ ] Add floating text or identifier on how to activate the chat, etc.
- [ ] Move API Keys to .env (later into Admin settings/dashboard; not in code)
- [ ] Remove the "vapi-icon-container" button as it's redundant (only hidden for now)
- [ ] Add "Summary" tab to Stats, Debug, etc. and create a summary of the conversation
- [ ] Add maximize chat window options
- [ ] Settings panel for voice customization
- [ ] Improve stats handling
- [ ] Improve Conversation history tracking
- [ ] Basic error handling and fallbacks
- [ ] Add ability for user to rate the tool (vote up/down & feedback)
- [ ] Add support for user push notifications
- [ ] Add message count (red round with number) to floating chat/voice icon
- [ ] Incorporate Thumbs UP/DOWN on conversations, Voice Settings, Feedback Buttons, etc.
- [ ] Buttons: Play (Text Chat), Microphone (Voice/Dictate), Feedback, Settings
      Speech-to-text Writer Feature to dictate?

Future Planning
- [ ] Maybe eventually a note editor, try code feature, or something
- [ ] Notification bubbles (red with count)
- [ ] Persistent floating chat button
- [ ] Fallback options (Hello default, Connection failure, etc.)
- [ ] Simplify implimentation and code.
- [ ] Improved package metadata and requirements handling.

UI/UX:
- [ ] Add sound effects
- [ ] Improve styling and Design (make it look like a chat)
- [ ] Add mobile responsiveness
- [ ] Create graphics (favicon, svgs, etc.)
- [ ] Create audio effects
- [ ] Add rating and feedback icons (maybe share?)
- [ ] Add settings button

Bugs:
- [ ] Fix where words are cut off in the chat window
- [ ] Fix how spoken words (agent or user) override each other
- [ ] Swoosh sound does not (always?) work on first hover of chat window
- [ ] There are the occasional empty bubble in chat (there shouldn't be)
- [ ] User messages are not being recorded into the chat box (seems like the first one is, or it's being updated?)
- [ ] Bubbles that are not complete sentences should be merged so that they are.
- [ ] Various stats are not working correctly (such as messages sent, tokens, etc.)
- [ ] Fix the API creating a voice floating icon?

## Phase 1: Foundation

### Backend Infrastructure
- [x] Create OpenEdX Plugin project structure
- [x] Set up VAPI.ai API client
- [x] Implement user settings storage
- [ ] Create conversation history storage mechanism
- [ ] Develop context awareness utilities

### UI/UX Base Components
- [x] Design floating button component
- [x] Implement expandable chat interface
- [x] Create basic voice recording functionality
- [x] Implement text input and response display
- [x] Design initial settings panel
- [x] Create basic style framework

### Integration
- [x] Set up authentication with VAPI.ai
- [x] Implement basic TTS functionality
- [x] Develop simple STT capability
- [x] Implement basic user identification
- [ ] Build out OpenEdX Integration
- [ ] Create course navigation hooks
- [ ] Setup 2-way communication with EdX through API

## Phase 2: Enhanced Features

### Context Awareness
- [ ] Implement course position tracking
- [ ] Create user progress awareness
- [ ] Develop content-specific context extraction
- [ ] Build problem state integration
- [ ] Create adaptive prompting system

### Voice Customization
- [ ] Implement voice selection interface
- [ ] Create speed adjustment controls
- [ ] Develop Gender Selection (filter)
- [ ] Develop Voice Selection list (grouped by filter)
- [ ] Develop language selection
- [ ] Design volume controls
- [ ] Create accent preferences

### History Management
- [x] Implement conversation storage
- [x] Create history browsing interface
- [ ] Develop conversation search
- [ ] Build export functionality
- [ ] Implement deletion and privacy controls

## Phase 3: Advanced Features

### Proactive Assistance
- [ ] Develop user state monitoring
- [ ] Create "stuck detection" algorithm
- [ ] Implement notification system
- [ ] Design proactive prompt templates
- [ ] Create intelligent intervention timing

### Analytics
- [ ] Implement usage tracking
- [ ] Create conversation analytics
- [ ] Develop help topic identification
- [ ] Build instructor dashboard
- [ ] Create performance monitoring

### Accessibility Enhancements
- [ ] Implement keyboard navigation
- [ ] Create screen reader compatibility
- [ ] Develop high contrast mode
- [ ] Implement font size adjustments
- [ ] Create focus management

## Phase 4: Refinement (Weeks 7-8)

### Performance Optimization
- [ ] Implement asset loading optimization
- [ ] Create request batching
- [ ] Develop local storage caching
- [ ] Optimize animation performance
- [ ] Reduce initial load time

### Cross-Browser Testing
- [ ] Test in Chrome, Firefox, Safari
- [ ] Create mobile responsiveness
- [ ] Implement iOS compatibility fixes
- [ ] Develop Android compatibility fixes
- [ ] Create fallbacks for older browsers

### Documentation and Deployment
- [ ] Create user documentation
- [ ] Develop administrator guide
- [ ] Write developer documentation
- [ ] Create demo videos
- [ ] Prepare release package

## Continuous Tasks

### Quality Assurance
- [ ] Develop unit tests for backend functions
- [ ] Create UI component tests
- [ ] Implement integration tests
- [ ] Design user acceptance testing
- [ ] Create automated regression tests

### User Feedback Integration
- [ ] Set up feedback collection mechanism
- [ ] Create prioritization framework
- [ ] Develop feedback categorization
- [ ] Implement rapid iteration process
- [ ] Design A/B testing framework
