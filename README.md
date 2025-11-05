# Narrowcast Pro - Professional Multi-Chromecast Narrowcasting System

**Status: v2.1 MVP - Working End-to-End! 🎉**

A professional narrowcasting solution built with **senior full-stack developer approach**: clean architecture, reusable components, proper separation of concerns, and production-ready patterns.

## 🚀 Quick Start (2 Commands!)

```bash
# 1. Install (backend + frontend)
npm run install-all

# 2. Start both servers
npm run dev
```

Then open: **http://localhost:3000**

---

## ✅ What Works Right Now

### You Can:
1. ✅ See all Chromecasts on your network (auto-discovery)
2. ✅ Create slides via API (9 types: Web, YouTube, Weather, RSS, Clock, etc.)
3. ✅ Create presentations via API (group slides with rotation)
4. ✅ **Cast presentations to multiple Chromecasts from Dashboard**
5. ✅ Stop playback from Dashboard
6. ✅ Real-time device updates
7. ✅ Preview slides/presentations in browser

### Backend (100% Complete):
- 9 slide content types with automatic rendering
- Automatic cookie consent handling
- YouTube loop with iframe API integration
- Branding wrapper on all slides
- Presentation system with auto-rotation
- Multi-Chromecast discovery (Bonjour)
- Complete REST API + WebSocket

### Frontend (MVP Complete):
- Professional API service layer (clean abstraction)
- WebSocket hook with auto-reconnection
- Dashboard with device management
- Cast presentations to Chromecasts **from the UI**
- Real-time updates

---

## 📺 Example: Create & Cast in 30 Seconds

```bash
# 1. Create a clock slide
SLIDE_ID=$(curl -s -X POST http://localhost:3001/api/slides \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Office Clock",
    "type": "clock",
    "duration": 10,
    "config": {"format": "24h", "showDate": true}
  }' | jq -r '.slide.id')

# 2. Create a presentation
PRES_ID=$(curl -s -X POST http://localhost:3001/api/presentations \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test Presentation\",
    \"slides\": [{\"slideId\": \"$SLIDE_ID\", \"duration\": 10}],
    \"branding\": {\"enabled\": true, \"text\": \"My Company\"}
  }" | jq -r '.presentation.id')

# 3. Cast to Chromecasts (or use Dashboard UI!)
curl -X POST http://localhost:3001/api/presentations/$PRES_ID/cast \
  -H "Content-Type: application/json" \
  -d '{"deviceIds": ["your-device-id"]}'
```

Or just use the **Dashboard** → Select devices → Select presentation → Click "Cast"!

---

## 🎨 9 Slide Content Types

### 1. **Web Page** - Any URL with cookie consent handling
```javascript
{ "type": "webpage", "config": { "url": "https://example.com", "handleCookieConsent": true }}
```

### 2. **YouTube** - Videos/livestreams with loop
```javascript
{ "type": "youtube", "config": { "url": "https://youtube.com/watch?v=...", "loop": true }}
```

### 3. **Weather** - Beautiful widget with OpenWeather API
```javascript
{ "type": "weather", "config": { "location": "Amsterdam", "apiKey": "..." }}
```

### 4. **RSS Feed** - Automatic RSS reader
```javascript
{ "type": "rss", "config": { "feedUrl": "https://...", "maxItems": 5 }}
```

### 5. **Clock** - Digital clock with date
```javascript
{ "type": "clock", "config": { "format": "24h", "timezone": "Europe/Amsterdam" }}
```

### 6. **Image** - Single or slideshow
```javascript
{ "type": "image", "config": { "urls": ["url1", "url2"], "slideshowInterval": 5 }}
```

### 7-9. **Social**, **News**, **Custom HTML** - Frameworks ready

---

## 📁 Architecture (Professional Approach)

```
├── server/                     # Backend (Node.js)
│   ├── index.js               # REST API + WebSocket
│   ├── slide-manager.js       # 9 content types
│   ├── presentation-manager.js # Composition + player
│   └── chromecast-manager.js  # Device discovery
│
└── client/src/                # Frontend (React)
    ├── services/
    │   └── api.js             # Clean API abstraction
    ├── hooks/
    │   └── useWebSocket.js    # Auto-reconnecting WS hook
    ├── pages/
    │   ├── Dashboard.js       # Working MVP!
    │   ├── Slides.js          # Placeholder
    │   └── Presentations.js   # Placeholder
    └── App.js                 # Main app
```

**Key Principles:**
- Services → Hooks → Components → Pages
- Reusable, typed, error-handled
- Real-time via WebSocket

---

## 🎯 Complete API

### Slides
```bash
GET    /api/slides              # List all
POST   /api/slides              # Create
PUT    /api/slides/:id          # Update
DELETE /api/slides/:id          # Delete
GET    /api/slides/:id/preview  # Preview HTML
```

### Presentations
```bash
GET    /api/presentations                # List all
POST   /api/presentations                # Create
PUT    /api/presentations/:id            # Update
DELETE /api/presentations/:id            # Delete
GET    /api/presentations/:id/player     # Player HTML
POST   /api/presentations/:id/cast       # Cast to devices!
```

### Devices
```bash
GET    /api/devices            # List Chromecasts
POST   /api/devices/stop       # Stop playback
POST   /api/devices/volume     # Volume control
```

### System
```bash
GET    /api/health             # Health check
GET    /api/statistics         # Stats
```

---

## 🎓 Technical Highlights

### Cookie Consent Handler
Automatically clicks accept buttons on websites using 10+ selectors.

### YouTube Loop
Uses iframe API with error recovery and manual fallback.

### Presentation Player
Advanced player with progress bar, keyboard controls, auto-pause/resume.

### Branding
Customizable wrapper on all slides (logo, text, position, colors).

### WebSocket Hook
Auto-reconnecting (max 5 attempts) with automatic state management.

---

## 💡 Use Cases

**Corporate**: Reception displays, meeting rooms, office dashboards
**Retail**: Product displays, promotions, digital signage
**Restaurants**: Menu boards, specials, wait times
**Healthcare**: Queue management, information displays
**Education**: Campus announcements, event schedules

---

## 🚧 Next Phase (Frontend UI)

Currently slides/presentations are created via API. Next:

- [ ] Full Slides management UI (create/edit/delete with forms)
- [ ] Full Presentations management UI (drag-drop builder)
- [ ] Visual presentation editor
- [ ] Template library
- [ ] Electron desktop app

---

## 📖 More Documentation

- **README-V2.md**: Detailed backend documentation
- **Source Code**: Extensive JSDoc comments

---

## 🎉 Try It Now!

```bash
npm run dev  # Start both servers
```

Then:
1. Open http://localhost:3000
2. See your Chromecasts in Dashboard
3. Create slides/presentations via API (see examples in Slides/Presentations pages)
4. Cast from Dashboard UI!

---

**Built with ❤️ using professional full-stack patterns**

Clean code • Proper architecture • Production-ready • Real-time updates
