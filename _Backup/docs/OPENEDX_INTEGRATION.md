# OpenEdX Integration Guide

This document provides detailed instructions for integrating the VAPI Voice & Chat Assistant plugin with OpenEdX.

## Prerequisites

- OpenEdX instance (Tutor-managed recommended)
- Administrator access to your OpenEdX installation
- Git repository access
- VAPI account with API credentials

## Installation Methods

There are two primary methods for installing this plugin:

### Method 1: Installation with Tutor (Recommended)

Tutor is the official Docker-based OpenEdX distribution. This is the recommended installation method.

#### 1. Add the Plugin to Tutor Configuration

```bash
tutor config save --append OPENEDX_EXTRA_PIP_REQUIREMENTS="git+https://github.com/aliasfoxkde/assistant_agent_plugin.git@main"
```

#### 2. Add Plugin to Installed Apps

Create a plugin file to add the assistant_agent app to INSTALLED_APPS:

```bash
tutor config render \
  --extra-config="$(cat <<EOF
OPENEDX_LMSAPP_EXTRA_APPS:
  - assistant_agent
OPENEDX_CMSAPP_EXTRA_APPS:
  - assistant_agent
EOF
)" \
  > "$(tutor config printroot)/env/build/openedx/requirements/private.txt"
```

#### 3. Rebuild the OpenEdX Image

```bash
tutor images build openedx
```

#### 4. Restart Tutor

```bash
tutor local stop
tutor local start -d
```

#### 5. Run Migrations

```bash
tutor local run lms python manage.py migrate assistant_agent
```

### Method 2: Manual Installation (Non-Tutor OpenEdX)

For OpenEdX installations not managed by Tutor:

#### 1. Install the Package

```bash
pip install git+https://github.com/aliasfoxkde/assistant_agent_plugin.git@main
```

#### 2. Add to INSTALLED_APPS

Edit your LMS and CMS settings files to add 'assistant_agent' to INSTALLED_APPS:

```python
INSTALLED_APPS = [
    # ... existing apps
    'assistant_agent',
]
```

#### 3. Add Middleware (if needed)

If you want the assistant to be available on all pages, add the middleware to your settings:

```python
MIDDLEWARE = [
    # ... existing middleware
    'assistant_agent.middleware.AssistantMiddleware',
]
```

#### 4. Run Migrations

```bash
python manage.py migrate assistant_agent
```

#### 5. Restart the LMS and CMS

Restart your OpenEdX services to apply the changes.

## Configuration

### Admin Configuration

1. Log in to your OpenEdX instance as an administrator
2. Navigate to Admin > Assistant Agent > Configuration
3. Enter your VAPI credentials:
   - API Key
   - Assistant ID
4. Configure global settings:
   - Default UI position
   - Default appearance
   - Enable/disable features

### Course-Level Configuration

Course teams can customize the assistant for their specific courses:

1. In Studio, navigate to Settings > Advanced Settings
2. Find the "Assistant Agent Configuration" section
3. Customize settings for the specific course

### User Preferences

Users can adjust their personal preferences:

1. From the user dashboard, navigate to Account > Preferences
2. Find the "Assistant Settings" section
3. Adjust personal preferences for the assistant

## Troubleshooting

### Installation Issues

If you encounter issues during installation:

1. **Package Not Found**: Verify the repository URL and branch name
2. **Migration Errors**: Check database permissions and connection
3. **App Not Loaded**: Verify INSTALLED_APPS configuration

### Integration Issues

If the assistant doesn't appear or function correctly:

1. **JavaScript Console Errors**: Check browser console for errors
2. **Missing UI**: Verify middleware is properly installed
3. **Authentication Issues**: Check VAPI credentials
4. **Context Problems**: Verify the plugin can access course and user context

### Logs

Check the following logs for troubleshooting:

1. LMS and CMS application logs
2. Browser console logs
3. Assistant Agent specific logs (in /var/log/openedx/assistant_agent.log)

## Updating the Plugin

To update to a newer version:

### With Tutor

```bash
tutor config save --append OPENEDX_EXTRA_PIP_REQUIREMENTS="git+https://github.com/aliasfoxkde/assistant_agent_plugin.git@main"
tutor images build openedx
tutor local restart openedx
```

### Without Tutor

```bash
pip install --upgrade git+https://github.com/aliasfoxkde/assistant_agent_plugin.git@main
python manage.py migrate assistant_agent
# Restart your OpenEdX services
```

## Advanced Configuration

For advanced configuration options, see the [Configuration Reference](https://github.com/aliasfoxkde/assistant_agent_plugin/wiki/Configuration) in the wiki.
