# Contributing to Narrowcast Pro

Thank you for your interest in contributing to Narrowcast Pro! We welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Found a bug? Please create an issue using the Bug Report template.

**Before submitting:**
1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include relevant log files
4. Provide clear steps to reproduce

### ✨ Suggesting Features

Have an idea? We'd love to hear it!

**Before submitting:**
1. Check existing feature requests
2. Use the feature request template
3. Describe your use case
4. Explain why this would be valuable

### 📝 Improving Documentation

Documentation improvements are always welcome!

- Fix typos
- Clarify confusing sections
- Add examples
- Update outdated information

### 💻 Contributing Code

Ready to code? Great! Please read the development setup below.

---

## Development Setup

### Prerequisites

- **Node.js 16+** ([download](https://nodejs.org/))
- **Git** ([download](https://git-scm.com/))
- **ImageMagick** (for building installers)
  - macOS: `brew install imagemagick`
  - Windows: `choco install imagemagick`

### Initial Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/Narrowcasting.git
cd Narrowcasting

# 3. Add upstream remote
git remote add upstream https://github.com/wouterbrem/Narrowcasting.git

# 4. Install dependencies
npm run install-all

# 5. Start development server
npm run electron:dev
```

This will:
- Start the backend server (port 3001)
- Start React dev server (port 3000)
- Launch Electron app

### Project Structure

```
Narrowcasting/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   └── services/     # API services
│   └── public/           # Static files
├── server/               # Node.js backend
│   ├── index.js          # Express server
│   ├── logger.js         # Winston logger
│   ├── chromecast-manager.js
│   ├── slide-manager.js
│   └── ...               # Other managers
├── electron/             # Electron main process
│   └── main.js
├── build/                # Build resources
│   └── *.svg             # Icon source files
└── .github/              # GitHub config
    └── workflows/        # CI/CD
```

### Development Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes

# Run tests
npm test

# Run linter (if you've added one)
npm run lint

# Build to verify
npm run build

# Commit your changes
git add .
git commit -m "Add feature: your feature description"

# Push to your fork
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

---

## Coding Standards

### JavaScript/React

- **ES6+** syntax
- **Functional components** with hooks (React)
- **Descriptive variable names**
- **Comments** for complex logic
- **Error handling** for all async operations

### Code Style

```javascript
// ✅ Good
const fetchSlides = async () => {
  try {
    const response = await slideAPI.getSlides();
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch slides:', error);
    throw error;
  }
};

// ❌ Avoid
function getSlides() {
  slideAPI.getSlides().then(r => r.data)
}
```

### Logging

Use the Winston logger instead of console:

```javascript
const logger = require('./logger');

// ✅ Good
logger.info('Slides loaded successfully');
logger.error('Failed to load slides:', error);
logger.warn('Slide duration too short');

// ❌ Avoid
console.log('Slides loaded');
console.error(error);
```

### File Organization

- One component per file
- Related files in same directory
- Clear naming (e.g., `SlideManager.js`, `slide-manager.test.js`)

### Testing

- Write tests for new features
- Update tests when modifying existing features
- Aim for reasonable coverage (50%+)

```javascript
// Example test
describe('SlideManager', () => {
  it('should create a slide with valid data', () => {
    const slide = slideManager.createSlide({
      name: 'Test',
      type: 'webpage',
      url: 'https://example.com'
    });
    expect(slide).toHaveProperty('id');
    expect(slide.name).toBe('Test');
  });
});
```

---

## Submitting Changes

### Pull Request Process

1. **Update documentation** if you've added/changed features
2. **Run tests** and ensure they pass
3. **Build successfully** (`npm run build`)
4. **Update CHANGELOG** (if applicable)
5. **Fill out PR template** completely
6. **Request review** from maintainers

### PR Guidelines

**Good PR:**
- Focused on one feature or fix
- Clear description
- Includes tests
- Updates documentation
- Passes CI checks

**PR Title Format:**
```
feat: Add scheduling feature
fix: Resolve Chromecast discovery issue
docs: Update installation guide
refactor: Simplify slide rendering
```

### Commit Message Guidelines

Use clear, descriptive commit messages:

```bash
# Good commits
git commit -m "Add YouTube slide type with auto-play support"
git commit -m "Fix crash when casting to unavailable Chromecast"
git commit -m "Update README with FAQ section"

# Avoid
git commit -m "Update"
git commit -m "Fix bug"
git commit -m "Changes"
```

---

## Reporting Bugs

### Before Reporting

1. **Check existing issues** - Your bug might already be reported
2. **Try latest version** - Bug might be fixed
3. **Check troubleshooting** - See INSTALL.md

### Bug Report Checklist

- [ ] Clear description
- [ ] Steps to reproduce
- [ ] Expected vs actual behavior
- [ ] OS and version
- [ ] Narrowcast Pro version
- [ ] Relevant logs
- [ ] Screenshots (if applicable)

### Where to Report

Use the [Bug Report template](https://github.com/wouterbrem/Narrowcasting/issues/new?template=bug_report.yml)

---

## Suggesting Features

### Before Suggesting

1. **Check existing requests** - Feature might already be requested
2. **Consider alternatives** - Is there a workaround?
3. **Think about use cases** - How would this help others?

### Feature Request Checklist

- [ ] Clear description
- [ ] Specific use case
- [ ] Why it's valuable
- [ ] Mockups or examples (if applicable)

### Where to Suggest

Use the [Feature Request template](https://github.com/wouterbrem/Narrowcasting/issues/new?template=feature_request.yml)

---

## Development Tips

### Debugging

**Check logs:**
```bash
# View combined logs
tail -f logs/combined.log

# View error logs only
tail -f logs/error.log
```

**Inspect Chromecasts:**
```javascript
// In server/index.js
const devices = chromecastManager.getDevices();
console.log('Discovered devices:', devices);
```

**React DevTools:**
- Install React Developer Tools extension
- Inspect component state and props

### Testing Locally

**Test single Chromecast:**
```bash
# Ensure you have at least one Chromecast on network
npm run electron:dev
# Navigate to Dashboard
# Verify Chromecast appears
```

**Test build:**
```bash
# Mac
npm run dist:mac

# Windows
npm run dist:win

# Test the installer!
```

### Common Issues

**Chromecasts not appearing?**
- Check firewall permissions
- Ensure same network
- Restart app

**Port 3001 already in use?**
```bash
# Mac
lsof -ti:3001 | xargs kill

# Windows
# Use Task Manager to kill node.exe
```

**Build fails?**
```bash
# Clean and reinstall
rm -rf node_modules client/node_modules
npm run install-all
```

---

## Release Process

### For Maintainers

**Creating a release:**

```bash
# 1. Update version
./prepare-release.sh

# 2. Create and push tag
git tag v2.2.0
git push origin v2.2.0

# 3. GitHub Actions builds installers automatically
# 4. Verify release on GitHub
# 5. Test installers
```

**Release checklist:**
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version bumped
- [ ] Tag created
- [ ] Installers tested

---

## Questions?

- **General questions**: [Open a Question issue](https://github.com/wouterbrem/Narrowcasting/issues/new?template=question.yml)
- **Documentation**: Check [README.md](README.md), [INSTALL.md](INSTALL.md), [QUICK_START.md](QUICK_START.md)
- **Development help**: Open a discussion on GitHub

---

## Recognition

All contributors will be recognized in:
- GitHub contributors page
- Release notes
- Project documentation

Thank you for contributing to Narrowcast Pro! 🎉

---

## License

By contributing to Narrowcast Pro, you agree that your contributions will be licensed under the MIT License.
