# Structure
This document provides detailed information about the code structure, architecture, and components of the Voice Assistance xBlock.

## TBD
- Logging, testing, reporting and notifications should be global but are included in this project for development purposes (to be migrated and fine-tuned later).

## File Organization
voice_assistance_xblock/
├── docs/
│   ├── CONTRIBUTE.md
│   ├── CHANGELOG.md
│   ├── HISTORY.md
│   ├── PLANNING.md
│   ├── STRUCTURE.md
│   ├── STRUCTURE.md
│   ├── TASKS.md
│   ├── TESTING.md
│   └── USAGE.md
├── logs/
├── tests/
│   ├── sanity_checks.py
│   └── unit_tests.py
├── static/
│   ├── css/
│   │   └── voice_assistance.css
│   ├── html/
│   │   ├── voice_assistance.html
│   │   ├── voice_assistance_edit.html
│   │   ├── voice_history.html
│   │   └── voice_settings.html
│   ├── img/
│   │   ├── voice_icon.svg
│   │   ├── history_icon.svg
│   │   └── settings_icon.svg
│   └── js/
│       ├── voice_assistance.js
│       ├── voice_history.js
│       └── voice_settings.js
├── __init__.py
├── .gitignore
├── README.md
├── setup.py
└── voice_assistance.py