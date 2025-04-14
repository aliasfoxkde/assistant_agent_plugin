# MENTOR Learning Platform - Structure

This document provides detailed information about the code structure, architecture, and components of the MENTOR Learning Platform.

## Project Organization

```
mentor-learning-platform/
├── assets/                # Static assets for the application
│   ├── css/               # CSS stylesheets
│   │   ├── styles.css             # Main application styles
│   │   ├── auth-styles.css        # Authentication UI styles
│   │   ├── login-styles.css       # Login page specific styles
│   │   ├── sidebar.css            # Sidebar navigation styles
│   │   ├── dark-mode.css          # Dark mode theme styles
│   │   ├── dashboard-styles.css   # Dashboard styles
│   │   └── course-styles.css      # Course-related styles
│   ├── js/                # JavaScript files
│   │   ├── app.js                 # Main application logic
│   │   ├── auth.js                # Authentication module
│   │   ├── auth-ui.js             # Authentication UI components
│   │   ├── cloudflare-auth.js     # Cloudflare authentication handler
│   │   ├── login.js               # Login page functionality
│   │   ├── sidebar.js             # Sidebar navigation functionality
│   │   ├── dashboard.js           # Dashboard functionality
│   │   ├── courses.js             # Course management functionality
│   │   ├── ai-tutor.js            # AI tutor integration
│   │   ├── gamification.js        # Gamification features
│   │   └── config.js              # Configuration management
│   ├── icons/             # Application icons
│   ├── images/            # Image assets
│   └── sounds/            # Sound effects
├── docs/                  # Documentation files
│   ├── CHANGELOG.md               # Version history
│   ├── PLANNING.md                # Project scope and roadmap
│   ├── STRUCTURE.md               # This file
│   ├── TASKS.md                   # Development tasks
│   └── USAGE.md                   # User guide
├── pages/                 # Additional HTML pages
│   ├── about.html                 # About page
│   ├── contact.html               # Contact page
│   ├── privacy.html               # Privacy policy
│   ├── terms.html                 # Terms of service
│   └── help.html                  # Help center
├── functions/             # Serverless functions for Cloudflare Pages
│   └── _middleware.js             # Authentication middleware
├── app/                   # Application pages
│   ├── dashboard.html             # User dashboard
│   ├── courses/                   # Course-related pages
│   │   ├── browse.html            # Course browsing
│   │   ├── view.html              # Course viewer
│   │   └── create.html            # Course creator
│   ├── profile/                   # User profile pages
│   │   ├── settings.html          # User settings
│   │   └── achievements.html      # User achievements
│   └── admin/                     # Admin pages
│       ├── users.html             # User management
│       ├── courses.html           # Course management
│       └── settings.html          # Platform settings
├── index.html             # Landing page
├── login.html             # Authentication page
├── signup.html            # Registration page
├── config.html            # Configuration page
├── manifest.json          # PWA manifest
├── _redirects             # Cloudflare/Netlify redirects
├── build.sh               # Build script
├── package.json           # Project dependencies
└── README.md              # Project overview
```

## Component Architecture

### Frontend Components

1. **Authentication System**
   - Login/Signup forms
   - Session management
   - Role-based access control
   - Profile management

2. **Navigation System**
   - Collapsible sidebar
   - Mobile-responsive menu
   - Role-specific navigation items
   - Dark/light mode toggle

3. **Dashboard**
   - Role-specific dashboards (Student, Instructor, Admin)
   - Progress visualization
   - Recent activity
   - Recommendations

4. **Course Management**
   - Course browsing and search
   - Course creation and editing
   - Enrollment system
   - Content viewer

5. **AI Tutor**
   - Chat interface
   - Voice interaction
   - Context management
   - Knowledge base integration

6. **Gamification System**
   - Achievement tracking
   - Points and rewards
   - Leaderboards
   - Progress visualization

### Backend Integration

1. **Supabase Integration**
   - Authentication
   - Database
   - Storage
   - Real-time updates

2. **VAPI Integration**
   - Voice processing
   - AI conversation
   - Context management
   - Personalization

3. **Cloudflare Integration**
   - Hosting
   - CDN
   - Authentication middleware
   - Environment variables

## Data Models

### User Model

```javascript
{
  id: "uuid",
  email: "string",
  created_at: "timestamp",
  updated_at: "timestamp",
  user_metadata: {
    full_name: "string",
    avatar_url: "string",
    isInstructor: "boolean",
    instructorVerificationStatus: "string", // "pending", "approved", "rejected"
    signupTimestamp: "timestamp",
    learningStyle: "string", // "visual", "auditory", "reading", "kinesthetic"
    preferences: {
      darkMode: "boolean",
      emailNotifications: "boolean",
      // other preferences
    }
  },
  // Role-based access control
  role: "string" // "student", "instructor", "admin"
}
```

### Course Model

```javascript
{
  id: "uuid",
  title: "string",
  description: "string",
  objectives: ["string"],
  thumbnail: "string", // URL to image
  category: "string",
  tags: ["string"],
  difficulty: "string", // "beginner", "intermediate", "advanced"
  created_at: "timestamp",
  updated_at: "timestamp",
  author_id: "uuid", // Reference to user
  published: "boolean",
  featured: "boolean",
  modules: [
    {
      id: "uuid",
      title: "string",
      description: "string",
      order: "number",
      lessons: [
        {
          id: "uuid",
          title: "string",
          content: "string", // HTML/Markdown content
          order: "number",
          type: "string", // "text", "video", "quiz", "interactive"
          // Additional fields based on type
        }
      ]
    }
  ]
}
```

### Enrollment Model

```javascript
{
  id: "uuid",
  user_id: "uuid", // Reference to user
  course_id: "uuid", // Reference to course
  enrolled_at: "timestamp",
  last_accessed: "timestamp",
  progress: "number", // Percentage
  completed: "boolean",
  completed_at: "timestamp",
  // Tracking for individual lessons
  lesson_progress: [
    {
      lesson_id: "uuid",
      status: "string", // "not_started", "in_progress", "completed"
      last_accessed: "timestamp",
      time_spent: "number", // seconds
      attempts: "number", // For quizzes
      score: "number" // For quizzes
    }
  ]
}
```

### Achievement Model

```javascript
{
  id: "uuid",
  title: "string",
  description: "string",
  icon: "string", // URL to icon
  points: "number",
  category: "string", // "course", "platform", "social"
  requirements: {
    // Criteria for earning the achievement
    type: "string", // "course_completion", "streak", "quiz_score", etc.
    threshold: "number", // Value required to earn
    course_id: "uuid", // Optional, for course-specific achievements
  }
}
```

### User Achievement Model

```javascript
{
  id: "uuid",
  user_id: "uuid", // Reference to user
  achievement_id: "uuid", // Reference to achievement
  earned_at: "timestamp",
  progress: "number", // For partially completed achievements
}
```

## API Endpoints

The platform uses Supabase for database operations, which provides a RESTful API for data access. Key endpoints include:

### Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Authenticate a user
- `POST /auth/logout` - Log out a user
- `POST /auth/reset-password` - Request password reset
- `GET /auth/user` - Get current user information

### Courses

- `GET /courses` - List all courses
- `GET /courses/:id` - Get a specific course
- `POST /courses` - Create a new course
- `PUT /courses/:id` - Update a course
- `DELETE /courses/:id` - Delete a course
- `GET /courses/:id/lessons` - Get lessons for a course
- `POST /courses/:id/enroll` - Enroll in a course

### User Data

- `GET /users/:id/profile` - Get user profile
- `PUT /users/:id/profile` - Update user profile
- `GET /users/:id/courses` - Get user's enrolled courses
- `GET /users/:id/progress` - Get user's learning progress
- `GET /users/:id/achievements` - Get user's achievements

### AI Tutor

- `POST /ai/chat` - Send a message to the AI tutor
- `GET /ai/history` - Get conversation history
- `POST /ai/voice` - Process voice input
- `GET /ai/context` - Get current learning context

## Integration Points

### Supabase Integration

The platform uses Supabase for:
- User authentication and management
- Database storage for courses, enrollments, and achievements
- File storage for course content and images
- Real-time updates for collaborative features

### VAPI Integration

VAPI is used for:
- Voice input processing
- Text-to-speech output
- AI conversation management
- Context-aware assistance

### Cloudflare Integration

Cloudflare provides:
- Hosting through Cloudflare Pages
- CDN for performance optimization
- Environment variable management
- Authentication middleware
- Serverless functions for backend logic

## Deployment Architecture

The platform follows a JAMstack architecture:
- Static HTML/CSS/JS files served from Cloudflare Pages
- API calls to Supabase for data operations
- Serverless functions for custom backend logic
- PWA capabilities for offline access and installation

## Development Workflow

1. Local development using `npm start` on port 4000
2. Version control with Git
3. CI/CD pipeline for automated testing and deployment
4. Deployment to Cloudflare Pages
5. Database migrations through Supabase interface
