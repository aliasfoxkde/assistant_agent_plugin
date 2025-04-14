# MENTOR Learning Platform

MENTOR is an AI-powered learning platform that adapts to your needs, providing personalized education for students and powerful tools for instructors.

## Overview

MENTOR is a standalone education and learning platform with AI Tutor and assistance, built from the ground up. The platform offers interactive learning experiences, course management, and gamification features to enhance the learning process.

## Documentation

For detailed information about the project, please refer to the following documentation:

### Project Planning
- [Planning](docs/PLANNING.md) - Project scope, architecture, and roadmap
- [Tasks](docs/TASKS.md) - Current development tasks and progress
- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md) - Detailed development phases and sprints
- [Changelog](docs/CHANGELOG.md) - Version history and updates

### Technical Documentation
- [Structure](docs/STRUCTURE.md) - Project structure and organization
- [Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md) - System architecture and design
- [LMS Features](docs/LMS_FEATURES.md) - Learning Management System capabilities
- [AI Tutor](docs/AI_TUTOR.md) - AI Tutor functionality and implementation
- [Development Notes](docs/DEVELOPMENT_NOTES.md) - Development approaches and lessons learned

### User Documentation
- [Usage](docs/USAGE.md) - How to use the platform

## Features

- **AI-Powered Tutor**: Interactive learning with context-aware AI assistance
- **Course Management**: Create, search, and enroll in courses
- **User Role Management**: Administrator, Instructor, and Student roles
- **Interactive Learning**: Step-by-step guidance, quizzes, and progress tracking
- **Gamification**: Progress tracking, achievements, and leaderboards
- **Responsive Design**: Mobile-friendly interface for learning on any device

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Supabase account for authentication and database
- VAPI account for AI voice capabilities

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/mentor-learning-platform.git
   cd mentor-learning-platform
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your API keys and configuration.

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:4000`

## First-Run Wizard

On first run, MENTOR will guide you through setting up:
- Administrator account
- API keys configuration
- Site settings
- Demo content (optional)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- VAPI for AI voice capabilities
- Supabase for authentication and database services
- All the learning platforms that inspired this project: Coursera, Skillshare, Udemy, edX, Codecademy, Khan Academy, MasterClass, etc.
