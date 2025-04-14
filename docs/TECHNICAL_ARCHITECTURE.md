# MENTOR Learning Platform - Technical Architecture

This document outlines the technical architecture of the MENTOR Learning Platform, including the technology stack, component interactions, data flow, and infrastructure design.

## Technology Stack

### Frontend

- **HTML5/CSS3/JavaScript**: Core web technologies
- **CSS Framework**: Custom with responsive design principles
- **JavaScript Libraries**:
  - Vanilla JavaScript for core functionality
  - Small, focused libraries for specific features
- **PWA Features**:
  - Service Worker for offline capabilities
  - Web App Manifest for installability
  - Cache API for performance

### Backend Services

- **Supabase**:
  - Authentication and user management
  - PostgreSQL database
  - Storage for course content and media
  - Realtime subscriptions for live updates
  - Edge Functions for serverless logic

- **VAPI**:
  - AI conversation management
  - Voice processing
  - Text-to-speech generation
  - Context management

- **Cloudflare**:
  - Pages for hosting and deployment
  - CDN for content delivery
  - Workers for edge computing
  - KV for key-value storage
  - R2 for object storage (future)

## System Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Browser                           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────┐  │
│  │    PWA      │  │   UI Layer  │  │  Service    │  │  Cache │  │
│  │  Container  │  │ (Components)│  │  Workers    │  │  API   │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Cloudflare Pages                           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Static    │  │  Cloudflare │  │     Cloudflare          │  │
│  │   Assets    │  │   Workers   │  │     Functions           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└───────────┬───────────────┬────────────────────┬────────────────┘
            │               │                    │
            ▼               ▼                    ▼
┌───────────────────┐ ┌─────────────┐  ┌─────────────────────────┐
│     Supabase      │ │    VAPI     │  │      Other External     │
│                   │ │             │  │         Services         │
│ ┌─────────────┐   │ │ ┌─────────┐ │  │                         │
│ │   Auth      │   │ │ │   AI    │ │  │ ┌─────────┐ ┌─────────┐ │
│ └─────────────┘   │ │ │ Service │ │  │ │ Payment │ │ Analytics│ │
│ ┌─────────────┐   │ │ └─────────┘ │  │ └─────────┘ └─────────┘ │
│ │  Database   │   │ │ ┌─────────┐ │  │                         │
│ └─────────────┘   │ │ │  Voice  │ │  │                         │
│ ┌─────────────┐   │ │ │ Service │ │  │                         │
│ │   Storage   │   │ │ └─────────┘ │  │                         │
│ └─────────────┘   │ │             │  │                         │
└───────────────────┘ └─────────────┘  └─────────────────────────┘
```

### Data Flow

1. **Authentication Flow**:
   - User enters credentials in login form
   - Client sends auth request to Supabase Auth
   - Supabase validates credentials and returns JWT
   - Client stores JWT in local storage
   - Subsequent requests include JWT for authorization

2. **Course Access Flow**:
   - User navigates to course page
   - Client requests course data from Supabase
   - Supabase validates user access rights
   - Course data is returned and rendered
   - Progress updates are sent back to Supabase

3. **AI Tutor Interaction Flow**:
   - User sends message to AI Tutor
   - Client sends request to VAPI with context
   - VAPI processes request and generates response
   - Response is streamed back to client
   - Conversation history is updated in Supabase

4. **Content Delivery Flow**:
   - Static assets served from Cloudflare CDN
   - Dynamic content fetched from Supabase
   - Media content served from Supabase Storage
   - Service worker caches assets for offline use
   - Updates are pulled when connectivity is restored

## Database Schema

### Core Tables

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT NOT NULL DEFAULT 'student',
  is_instructor BOOLEAN DEFAULT FALSE,
  instructor_verification_status TEXT,
  learning_style TEXT,
  preferences JSONB DEFAULT '{}'::JSONB
);
```

#### Courses
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  objectives JSONB DEFAULT '[]'::JSONB,
  thumbnail_url TEXT,
  banner_url TEXT,
  category TEXT,
  tags TEXT[],
  difficulty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE
);
```

#### Modules
```sql
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Lessons
```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER NOT NULL,
  type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Enrollments
```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE,
  progress NUMERIC DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_id)
);
```

#### Lesson_Progress
```sql
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started',
  last_accessed TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  score NUMERIC,
  UNIQUE(enrollment_id, lesson_id)
);
```

#### Achievements
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  points INTEGER DEFAULT 0,
  category TEXT,
  requirements JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### User_Achievements
```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress NUMERIC DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);
```

#### Conversations
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  context JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB
);
```

### Database Relationships

- **One-to-Many**:
  - User → Courses (author)
  - User → Enrollments
  - Course → Modules
  - Module → Lessons
  - User → Conversations
  - Conversation → Messages

- **Many-to-Many**:
  - Users ↔ Courses (through Enrollments)
  - Users ↔ Achievements (through User_Achievements)
  - Enrollments ↔ Lessons (through Lesson_Progress)

## API Design

### RESTful Endpoints

#### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Authenticate a user
- `POST /auth/logout` - Log out a user
- `POST /auth/reset-password` - Request password reset

#### Users
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update current user profile
- `GET /users/me/courses` - Get enrolled courses
- `GET /users/me/achievements` - Get user achievements

#### Courses
- `GET /courses` - List all courses
- `GET /courses/:id` - Get a specific course
- `POST /courses` - Create a new course
- `PUT /courses/:id` - Update a course
- `DELETE /courses/:id` - Delete a course
- `POST /courses/:id/enroll` - Enroll in a course

#### Modules
- `GET /courses/:courseId/modules` - List modules
- `POST /courses/:courseId/modules` - Create module
- `PUT /modules/:id` - Update module
- `DELETE /modules/:id` - Delete module

#### Lessons
- `GET /modules/:moduleId/lessons` - List lessons
- `POST /modules/:moduleId/lessons` - Create lesson
- `PUT /lessons/:id` - Update lesson
- `DELETE /lessons/:id` - Delete lesson
- `POST /lessons/:id/progress` - Update lesson progress

#### Achievements
- `GET /achievements` - List all achievements
- `POST /achievements/:id/claim` - Claim an achievement

#### AI Tutor
- `POST /ai/chat` - Send message to AI tutor
- `GET /ai/conversations` - Get conversation history
- `POST /ai/voice` - Send voice input

### Real-time Subscriptions

- Course updates for enrolled students
- New message notifications
- Achievement unlocks
- Progress updates

## Security Architecture

### Authentication

- JWT-based authentication via Supabase Auth
- Role-based access control
- Session management
- Secure password policies
- Multi-factor authentication (future)

### Data Protection

- Row-level security in Supabase
- Data encryption at rest
- HTTPS for all communications
- Content security policy
- Input validation and sanitization

### Privacy Considerations

- Minimal data collection
- Clear data retention policies
- User control over data
- Transparent privacy practices
- GDPR and CCPA compliance

## Deployment Architecture

### Cloudflare Pages

- Static site hosting
- Global CDN distribution
- Automatic HTTPS
- Preview deployments
- Custom domains

### CI/CD Pipeline

```
GitHub Repository
       │
       ▼
GitHub Actions
       │
       ├─────────────┬─────────────┐
       │             │             │
       ▼             ▼             ▼
   Linting       Testing      Building
       │             │             │
       └─────────────┴─────────┬───┘
                               │
                               ▼
                      Cloudflare Pages
                               │
                     ┌─────────┴─────────┐
                     │                   │
                     ▼                   ▼
               Preview Branch      Production Branch
```

### Environment Configuration

- Development: Local environment with Supabase local emulator
- Staging: Cloudflare Pages preview deployments
- Production: Cloudflare Pages production deployment

## Performance Optimization

### Frontend Optimization

- Code splitting
- Tree shaking
- Asset optimization
- Lazy loading
- Critical CSS
- Caching strategies

### Backend Optimization

- Database indexing
- Query optimization
- Connection pooling
- Rate limiting
- Caching layers

### Network Optimization

- CDN distribution
- HTTP/2 support
- Compression
- Resource hints
- Service worker caching

## Monitoring and Logging

### Application Monitoring

- Error tracking
- Performance monitoring
- User behavior analytics
- Feature usage tracking
- A/B testing framework

### Infrastructure Monitoring

- Uptime monitoring
- Response time tracking
- Resource utilization
- Error rate monitoring
- Security alerts

### Logging Strategy

- Structured logging
- Log levels (debug, info, warn, error)
- Centralized log storage
- Log rotation and retention
- Audit logging for security events

## Scalability Considerations

### Horizontal Scaling

- Stateless architecture
- Distributed caching
- Load balancing
- Database sharding (future)
- Microservices evolution (future)

### Vertical Scaling

- Resource optimization
- Database performance tuning
- Query optimization
- Memory management
- CPU utilization

## Disaster Recovery

### Backup Strategy

- Regular database backups
- Content backup
- Configuration backup
- Versioned deployments
- Retention policies

### Recovery Procedures

- Database restoration
- Service redeployment
- Configuration recovery
- Data integrity verification
- Communication plan

## Future Architecture Considerations

### Framework Migration

- Potential migration to Vite+Remix
- Component-based architecture
- Server-side rendering
- Enhanced routing
- Improved state management

### Advanced Caching

- Multi-level caching
- Predictive caching
- Edge caching
- Cache invalidation strategies
- Offline-first approach

### Microservices Evolution

- Service decomposition
- API gateway
- Service discovery
- Event-driven architecture
- Containerization
