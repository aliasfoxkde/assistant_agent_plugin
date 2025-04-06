# Voice Assistance xBlock Version History

This document tracks the development history, major changes, and release notes for the Voice Assistance xBlock.

## Version 0.1.1 (2024-04-05)

### Added
- SVG icons for feedback, history, and settings buttons
- Feedback dialog with rating system
- Improved installation instructions for Tutor
- MANIFEST.in file for proper package distribution
- Requirements.txt file for dependency management

### Changed
- Updated setup.py to be more compatible with OpenEdX build process
- Removed openai dependency to avoid conflicts
- Improved package metadata and requirements handling
- Enhanced README with detailed installation instructions
- Updated HTML templates to use SVG icons

### Fixed
- Fixed package_data handling in setup.py
- Addressed potential build issues with Tutor
- Improved error handling in VAPI API calls

## Version 0.1.0 (2024-04-04)

### Added
- Initial project structure and documentation
- Basic xBlock implementation
- Floating UI design
- VAPI.ai integration framework
- Settings panel for voice customization
- History tracking functionality

### Coming Soon
- Proactive assistance features
- Advanced context awareness
- Analytics and reporting

## Development Timeline

### Planning Phase (Completed)
- Requirements gathering
- Technology selection
- UI/UX design concepts
- Integration planning

### Initial Development (Current)
- Core functionality implementation
- Basic UI components
- VAPI.ai API integration
- Settings and history management

### Future Milestones

#### Beta Release (Est. Q2 2023)
- Complete core functionality
- Initial user testing
- Performance optimization
- Bug fixes

#### 1.0 Release (Est. Q3 2023)
- Full feature set
- Comprehensive testing
- Documentation
- Production readiness

## Changelog Format
Changes for future releases will follow this format:
[major.minor.patch.bug] - {One-Line Summary}
- Updated: YYYY/DD/MM @ 00:00 AM
- [x] {Fix|Change|Feat|Security}: - {Description)
- [-] {Deprecated|Removed}: - {Description)

## Versioning Strategy
This project follows [Semantic Versioning](https://semver.org/):
- MAJOR version for breaking (aka. incompatible) changes
- MINOR version for backward-compatible functionality additions
- PATCH version for backward-compatible bug fixes
- BUG FIX version for minor bug fixes.