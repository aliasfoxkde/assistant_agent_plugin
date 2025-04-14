# Structure
This document provides detailed information about the code structure, architecture, and components of the VAPI Voice & Chat Assistant OpenEdX plugin/extension.

## TBD
- Logging, testing, reporting and notifications should be global but are included in this project for development purposes (to be migrated and fine-tuned later).

## File Organization
assistant_agent_plugin/
├── docs/
│   ├── CONTRIBUTE.md
│   ├── CHANGELOG.md
│   ├── HISTORY.md
│   ├── OPENEDX_INTEGRATION.md
│   ├── PLANNING.md
│   ├── STRUCTURE.md
│   ├── TASKS.md
│   ├── TESTING.md
│   └── USAGE.md
├── logs/
├── tests/
│   ├── integration_tests.py
│   ├── platform_tests.py
│   └── unit_tests.py
├── assistant_agent/
│   ├── __init__.py
│   ├── apps.py
│   ├── middleware.py
│   ├── plugin.py
│   ├── settings.py
│   ├── urls.py
│   ├── views.py
│   ├── static/
│   │   ├── css/
│   │   │   └── assistant.css
│   │   ├── html/
│   │   │   ├── assistant.html
│   │   │   ├── history.html
│   │   │   └── settings.html
│   │   ├── img/
│   │   │   ├── assistant_icon.svg
│   │   │   ├── history_icon.svg
│   │   │   └── settings_icon.svg
│   │   └── js/
│   │       ├── assistant.js
│   │       ├── history.js
│   │       └── settings.js
│   └── templates/
│       └── assistant_agent/
│           ├── assistant.html
│           ├── config.html
│           └── dashboard.html
├── __init__.py
├── .gitignore
├── README.md
├── setup.py
└── setup.cfg