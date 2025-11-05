# Narrowcast Pro - Professional Multi-Chromecast Narrowcasting System

A professional narrowcasting solution for controlling multiple Chromecasts with advanced slide-based content management.

## 🎯 Version 2.0 - Slide-Based Architecture

### ✅ Completed (Backend)

#### **1. Slide System** (`server/slide-manager.js`)
9 different content types with automatic rendering:

- **📄 Web Page** - Display any URL with automatic cookie consent handling
- **🎬 YouTube** - Videos/livestreams with auto-loop and iframe API integration
- **🌤️ Weather** - Beautiful weather widgets with OpenWeather API
- **📰 RSS Feed** - Automatic RSS feed reader with rotation
- **🕐 Clock** - Digital clock with customizable format and timezone
- **🖼️ Image** - Single images or automatic slideshows
- **👥 Social Media** - Social media feed integration (planned)
- **📊 News** - News headlines integration (planned)
- **💻 Custom HTML** - Full control with custom HTML/CSS/JS

**Features:**
- Automatic cookie consent handling (detects and clicks common accept buttons)
- YouTube loop functionality with error recovery
- Branding wrapper on all slides (customizable position, colors, logo)
- Validation for each slide type
- HTML generation for each content type

#### **2. Presentation System** (`server/presentation-manager.js`)
Manage collections of slides with automatic rotation:

- **Presentation Builder** - Group multiple slides together
- **Auto-Rotation** - Configurable slide duration and transitions
- **Branding** - Consistent branding across all slides
- **Loop Control** - Loop presentations or play once
- **Player HTML** - Complete iframe-based player with:
  - Smooth transitions between slides
  - Progress bar
  - Keyboard controls (debug mode)
  - Automatic error recovery
  - Pause/resume on visibility change

#### **3. Complete REST API** (`server/index.js`)
Full API with the following endpoints:

**Devices:**
- `GET /api/devices` - List all Chromecasts
- `POST /api/devices/stop` - Stop playback
- `POST /api/devices/volume` - Control volume

**Slides:**
- `GET /api/slides` - List all slides (filter by type)
- `POST /api/slides` - Create slide
- `PUT /api/slides/:id` - Update slide
- `DELETE /api/slides/:id` - Delete slide
- `GET /api/slides/:id/preview` - Preview slide HTML

**Presentations:**
- `GET /api/presentations` - List all presentations
- `POST /api/presentations` - Create presentation
- `PUT /api/presentations/:id` - Update presentation
- `DELETE /api/presentations/:id` - Delete presentation
- `GET /api/presentations/:id/player` - Get player HTML
- `POST /api/presentations/:id/cast` - Cast to Chromecasts

**System:**
- `GET /api/health` - Health check
- `GET /api/statistics` - System statistics

**WebSocket:**
- Real-time updates for devices, slides, and presentations
- Broadcast changes to all connected clients

#### **4. Multi-Chromecast Discovery** (`server/chromecast-manager.js`)
- Cross-platform Bonjour/mDNS discovery
- Real-time device status updates
- Device grouping
- Volume control
- Connection management

---

### 🚧 In Progress (Frontend)

The frontend needs to be rebuilt to support the new slide-based architecture:

#### **Priority 1: Core Pages**

1. **Dashboard** (`client/src/pages/Dashboard-new.js`)
   - Device grid with status
   - Quick presentation casting
   - Active presentation monitoring
   - Device groups

2. **Slides Management** (`client/src/pages/Slides.js`)
   - List all slides by type
   - Create slide modal with type selection
   - Edit slide configuration
   - Preview slides
   - Delete slides
   - Type-specific forms for:
     - Web Page (URL, cookie consent toggle)
     - YouTube (video ID/URL, loop, autoplay)
     - Weather (location, API key, units)
     - RSS (feed URL, max items, refresh interval)
     - Clock (format, timezone, show date/seconds)
     - Image (URL or multiple URLs for slideshow)
     - Custom HTML (HTML editor)

3. **Presentations Management** (`client/src/pages/Presentations.js`)
   - List all presentations
   - Create presentation
   - Add slides to presentation (drag & drop)
   - Configure slide duration
   - Configure branding (logo, text, position, colors)
   - Preview presentation
   - Cast to devices
   - Monitor active presentations

#### **Priority 2: Enhanced Features**

4. **Presentation Builder** (Visual editor)
   - Drag-and-drop slide ordering
   - Visual timeline
   - Slide thumbnails
   - Duration adjustment
   - Transition settings

5. **Templates** (Quick start)
   - Pre-built presentation templates
   - Common use cases (reception, conference room, retail)
   - One-click deployment

6. **Scheduling** (Time-based)
   - Schedule presentations by time
   - Day/time rules
   - Auto-start/stop

#### **Priority 3: Electron App**

7. **Desktop Application**
   - Electron wrapper
   - System tray integration
   - Auto-updater
   - Easy installation
   - Menu bar controls

---

## 🏗️ Architecture

```
/Narrowcasting
├── server/
│   ├── index.js                  # Main server + REST API
│   ├── chromecast-manager.js     # Chromecast discovery & control
│   ├── slide-manager.js          # Slide content management ✅
│   ├── presentation-manager.js   # Presentation composition ✅
│   └── schedule-manager.js       # Time-based scheduling
│
├── client/
│   ├── src/
│   │   ├── App.js               # Main app (needs update)
│   │   ├── pages/
│   │   │   ├── Dashboard.js     # Device management 🚧
│   │   │   ├── Slides.js        # Slide management 🚧
│   │   │   └── Presentations.js # Presentation management 🚧
│   │   ├── components/
│   │   │   ├── SlideCard.js     # Slide display component
│   │   │   ├── SlideEditor.js   # Slide edit modal
│   │   │   └── DeviceCard.js    # Device display component
│   │   └── services/
│   │       └── api.js           # API client
│   └── public/
│
└── package.json
```

---

## 🚀 Quick Start (Current Version)

### Backend (Fully Functional)

```bash
# Install dependencies
npm install

# Start server
npm run server
```

The backend is complete and ready to use:
- Chromecast discovery via Bonjour
- Full REST API for slides and presentations
- WebSocket for real-time updates
- Slide rendering with branding
- Presentation player with rotation

### Test the API

```bash
# Create a weather slide
curl -X POST http://localhost:3001/api/slides \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Amsterdam Weather",
    "type": "weather",
    "duration": 30,
    "config": {
      "location": "Amsterdam",
      "apiKey": "YOUR_API_KEY",
      "units": "metric"
    }
  }'

# Create a YouTube slide
curl -X POST http://localhost:3001/api/slides \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lofi Stream",
    "type": "youtube",
    "duration": 300,
    "config": {
      "url": "https://www.youtube.com/watch?v=jfKfPfyJRdk",
      "loop": true,
      "autoplay": true
    }
  }'

# Create a presentation
curl -X POST http://localhost:3001/api/presentations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Reception Display",
    "slides": [
      {"slideId": "WEATHER_SLIDE_ID", "duration": 30},
      {"slideId": "YOUTUBE_SLIDE_ID", "duration": 60}
    ],
    "branding": {
      "enabled": true,
      "text": "Company Name",
      "position": "bottom-right"
    }
  }'

# Cast presentation to Chromecasts
curl -X POST http://localhost:3001/api/presentations/PRESENTATION_ID/cast \
  -H "Content-Type: application/json" \
  -d '{
    "deviceIds": ["DEVICE_ID_1", "DEVICE_ID_2"]
  }'
```

### Preview Slides

Open in browser:
- `http://localhost:3001/api/slides/SLIDE_ID/preview` - Preview individual slide
- `http://localhost:3001/api/presentations/PRESENTATION_ID/player` - Play presentation

---

## 📋 Slide Configuration Examples

### Web Page with Cookie Consent
```javascript
{
  "name": "Company Website",
  "type": "webpage",
  "duration": 60,
  "config": {
    "url": "https://example.com",
    "handleCookieConsent": true  // Auto-click accept buttons
  }
}
```

### YouTube Livestream with Loop
```javascript
{
  "name": "24/7 Music Stream",
  "type": "youtube",
  "duration": 3600,
  "config": {
    "url": "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    "loop": true,  // Restart when finished
    "autoplay": true
  }
}
```

### RSS Feed
```javascript
{
  "name": "Tech News",
  "type": "rss",
  "duration": 45,
  "config": {
    "feedUrl": "https://feeds.bbci.co.uk/news/technology/rss.xml",
    "maxItems": 5,
    "refreshInterval": 300  // seconds
  }
}
```

### Clock
```javascript
{
  "name": "Office Clock",
  "type": "clock",
  "duration": 30,
  "config": {
    "format": "24h",  // or "12h"
    "timezone": "Europe/Amsterdam",
    "showDate": true,
    "showSeconds": true
  }
}
```

### Image Slideshow
```javascript
{
  "name": "Photo Gallery",
  "type": "image",
  "duration": 60,
  "config": {
    "urls": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg"
    ],
    "slideshowInterval": 5,  // seconds per image
    "fit": "cover"  // or "contain", "fill"
  }
}
```

---

## 🎨 Branding Configuration

Every presentation can have custom branding:

```javascript
{
  "branding": {
    "enabled": true,
    "text": "Powered by Your Company",
    "logo": "https://example.com/logo.png",  // Optional
    "position": "bottom-right",  // top-left, top-right, bottom-left, bottom-right
    "backgroundColor": "rgba(0, 0, 0, 0.7)",
    "textColor": "#ffffff"
  }
}
```

The branding wrapper appears on ALL slides in the presentation with:
- Glassmorphism effect (backdrop blur)
- Smooth shadow
- Customizable position
- Optional logo
- High z-index (always on top)

---

## 🔧 Technical Details

### Cookie Consent Handler

Automatically detects and clicks common cookie consent buttons using these selectors:
```javascript
[
  'button[id*="accept"]',
  'button[class*="accept"]',
  'button[id*="cookie"]',
  'button[class*="cookie"]',
  '.cookie-consent button',
  '.cookie-banner button',
  '[data-consent="accept"]',
  '[aria-label*="Accept"]'
]
```

Runs 2 seconds after page load to allow banners to appear.

### YouTube Integration

Uses YouTube iframe API with:
- Auto-loop with playlist parameter
- Error recovery (auto-reload on failure)
- State monitoring
- Manual loop fallback

### Presentation Player

Advanced iframe-based player with:
- Smooth transitions (configurable duration)
- Progress bar showing slide progress
- Keyboard controls:
  - `→` Next slide
  - `←` Previous slide
  - `Space` Restart current slide
  - `d` Toggle debug info
- Automatic pause/resume on visibility change
- Blob URLs for security

---

## 📊 API Response Examples

### List Slides
```json
GET /api/slides

[
  {
    "id": "uuid-1",
    "name": "Amsterdam Weather",
    "type": "weather",
    "duration": 30,
    "config": { "location": "Amsterdam", ... },
    "createdAt": "2025-11-05T10:00:00.000Z",
    "updatedAt": "2025-11-05T10:00:00.000Z"
  }
]
```

### List Presentations
```json
GET /api/presentations?withSlides=true

[
  {
    "id": "uuid-1",
    "name": "Reception Display",
    "description": "Main reception area presentation",
    "slides": [
      {
        "slideId": "uuid-2",
        "duration": 30,
        "slide": { /* full slide object */ }
      }
    ],
    "branding": { /* branding config */ },
    "settings": {
      "transition": "fade",
      "transitionDuration": 500,
      "loop": true
    },
    "createdAt": "2025-11-05T10:00:00.000Z",
    "updatedAt": "2025-11-05T10:00:00.000Z"
  }
]
```

### System Statistics
```json
GET /api/statistics

{
  "devices": {
    "total": 5,
    "playing": 3,
    "idle": 2
  },
  "slides": {
    "total": 15,
    "byType": {
      "webpage": 3,
      "youtube": 2,
      "weather": 2,
      "rss": 2,
      "clock": 1,
      "image": 3,
      "html": 2
    }
  },
  "presentations": {
    "totalPresentations": 4,
    "activePresentations": 2,
    "totalSlides": 20,
    "averageSlidesPerPresentation": "5.0"
  },
  "groups": 2
}
```

---

## 🛠️ Development Roadmap

### Phase 1: Complete Frontend ✅ (Backend Done)
- [x] Slide Manager backend
- [x] Presentation Manager backend
- [x] REST API endpoints
- [x] WebSocket updates
- [ ] Dashboard UI
- [ ] Slides Management UI
- [ ] Presentations Management UI

### Phase 2: Enhanced Features
- [ ] Drag-and-drop slide builder
- [ ] Visual presentation editor
- [ ] Template library
- [ ] Advanced scheduling
- [ ] Social media integrations
- [ ] News API integration

### Phase 3: Electron App
- [ ] Electron wrapper
- [ ] Auto-updater
- [ ] System tray
- [ ] Menu bar controls
- [ ] Installer creation
- [ ] App Store submission

### Phase 4: Cloud Features
- [ ] Cloud sync
- [ ] Multi-user support
- [ ] Remote management
- [ ] Analytics dashboard
- [ ] Content library

---

## 🎯 Next Steps

To complete the system:

1. **Build Frontend Pages** - Use the existing design system
2. **Create Slide Forms** - Type-specific configuration forms
3. **Build Presentation Editor** - Drag & drop interface
4. **Add Preview** - Live preview of slides and presentations
5. **Test with Real Chromecasts** - End-to-end testing
6. **Package as Electron App** - Easy installation

---

## 💡 Use Cases

### Reception Area
```javascript
// Weather + News + Company Video
Presentation with:
- Weather slide (30s)
- RSS news feed (45s)
- YouTube company video (60s)
- Clock (15s)
```

### Conference Room
```javascript
// Schedule + Announcements
Presentation with:
- Google Calendar today's meetings (30s)
- Company announcements webpage (20s)
- Clock (10s)
```

### Retail Display
```javascript
// Products + Promotions
Presentation with:
- Product image slideshow (60s)
- Promotional video (YouTube, 120s)
- Special offers webpage (30s)
```

### Restaurant Menu Board
```javascript
// Menu + Weather + Clock
Presentation with:
- Menu webpage (60s)
- Weather widget (15s)
- Clock (5s)
```

---

## 📝 License

MIT

---

## 🤝 Contributing

The backend is solid and ready. Frontend contributions welcome!

Priority areas:
1. Slide management UI
2. Presentation builder
3. Visual timeline editor
4. Template library

---

**Built with ❤️ for professional narrowcasting**
