# Tutor Integration Guide

This document provides detailed instructions for integrating the Voice Assistance xBlock with OpenEdX using Tutor.

## Prerequisites

- Tutor installed and configured
- Access to the Tutor command line
- Git repository access

## Installation Steps

### 1. Add the Package to Tutor Configuration

```bash
tutor config save --append OPENEDX_EXTRA_PIP_REQUIREMENTS="git+https://github.com/aliasfoxkde/assistant_agent_xblock.git@main"
```

This command adds our xBlock to the list of additional pip requirements that Tutor will install.

### 2. Rebuild the OpenEdX Image

```bash
tutor images build openedx
```

This step rebuilds the OpenEdX Docker image with our xBlock included.

### 3. Restart Tutor

```bash
tutor local stop
tutor local start -d
```

This restarts the Tutor instance with the new configuration.

### 4. Enable the xBlock in Studio

In Studio, navigate to:
- Settings → Advanced Settings
- Add "voice_assistance" to the "Advanced Modules List"
- Save changes

```json
{
  "advanced_modules": [
    "voice_assistance"
  ]
}
```

## Troubleshooting

### Build Failures

If you encounter build failures during the `tutor images build openedx` step:

1. **Network Issues**: Ensure you have a stable internet connection. The build process downloads packages from PyPI and npm.

2. **Dependency Conflicts**: Our package has minimal dependencies to avoid conflicts. If you still encounter issues, try:
   ```bash
   tutor local run openedx pip install git+https://github.com/aliasfoxkde/assistant_agent_xblock.git@main
   ```

3. **Docker Issues**: Ensure Docker has enough resources allocated (memory, CPU).

### xBlock Not Appearing in Studio

If the xBlock doesn't appear in Studio after installation:

1. Verify the xBlock is properly installed:
   ```bash
   tutor local run openedx pip list | grep assistant_agent_xblock
   ```

2. Check the Studio logs for errors:
   ```bash
   tutor local logs --follow openedx-lms
   ```

3. Ensure you've added "voice_assistance" to the advanced modules list in Studio settings.

## Configuration

After adding the xBlock to your course, you'll need to configure:

1. VAPI API Key
2. VAPI Assistant ID
3. UI preferences (button position, color)
4. Voice settings (voice ID, speaking rate)

These can be configured in the Studio edit view for the xBlock.

## Updating the xBlock

To update to a newer version:

```bash
tutor config save --append OPENEDX_EXTRA_PIP_REQUIREMENTS="git+https://github.com/aliasfoxkde/assistant_agent_xblock.git@main"
tutor images build openedx
tutor local restart openedx
```
