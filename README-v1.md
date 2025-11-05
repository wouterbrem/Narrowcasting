# Multi-Chromecast Narrowcasting Controller

A professional narrowcasting solution that allows you to control multiple Chromecasts from your browser. Built with a minimalist, Jony Ive-inspired design philosophy.

## Features

### 🎯 Core Features
- **Multi-Device Control**: Discover and control multiple Chromecasts simultaneously
- **Real-time Updates**: WebSocket-based live device status updates
- **Content Builder**: Create beautiful narrowcasting content with templates
- **Weather Widgets**: Display live weather information on your screens
- **Dashboard Builder**: Create customizable information dashboards
- **Playlist Management**: Rotate through multiple URLs automatically
- **Scheduling**: Display different content at specific times using cron expressions
- **Device Groups**: Organize devices for easier management

### 🎨 Design
- Minimalist, clean interface inspired by Apple's design language
- Smooth animations and transitions
- Responsive layout
- Dark and light color schemes
- Professional typography using Inter font

### 📺 Content Templates
1. **Weather Display**: Beautiful weather widget with real-time data
2. **Info Dashboard**: Customizable multi-widget dashboard with clock, date, and weather
3. **Image Slideshow**: (Coming soon) Rotate through images
4. **Announcements**: (Coming soon) Display text announcements
5. **Custom HTML**: Full control with custom HTML/CSS/JavaScript

## Prerequisites

- Node.js 16+ and npm
- Network access to your Chromecasts (same network)
- (Optional) OpenWeather API key for weather features

**Note**: This application uses Bonjour for device discovery, which works cross-platform without additional system dependencies.

## Installation

### 1. Install Dependencies

```bash
# Install all dependencies (backend + frontend)
npm run install-all

# Or install separately
npm install                # Backend dependencies
cd client && npm install   # Frontend dependencies
```

### 2. Get OpenWeather API Key (Optional)

For weather features, get a free API key:
1. Visit https://openweathermap.org/api
2. Sign up for a free account
3. Generate an API key
4. Enter the API key in the Content Builder weather settings

## Usage

### Development Mode

Run both backend and frontend in development mode:

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3001
- Frontend development server on http://localhost:3000

### Production Mode

Build and run in production:

```bash
# Build the frontend
npm run build

# Start production server
npm start
```

The app will be available at http://localhost:3001

## How to Use

### 1. Dashboard
- View all discovered Chromecasts
- Select devices and cast URLs instantly
- Control volume
- Stop playback

### 2. Content Builder
- Choose from pre-built templates
- Customize settings (colors, layout, data)
- Preview content before deploying
- Deploy to selected devices

### 3. Playlists
- Create playlists with multiple URLs
- Set rotation interval
- Start/stop playlists on devices

### 4. Schedule
- Schedule content to display at specific times
- Use cron expressions for flexible scheduling
- Set duration or run indefinitely
- Manage multiple schedules

### 5. Groups
- Organize devices into logical groups
- Manage multiple devices as one unit
- Quick deployment to device groups

## API Endpoints

### Devices
- `GET /api/devices` - Get all discovered devices

### Casting
- `POST /api/cast` - Cast URL to devices
  ```json
  {
    "deviceIds": ["device1", "device2"],
    "url": "https://example.com",
    "contentType": "text/html"
  }
  ```
- `POST /api/stop` - Stop casting
- `POST /api/volume` - Set volume level

### Groups
- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create group
- `DELETE /api/groups/:id` - Delete group

### Playlists
- `GET /api/playlists` - Get all playlists
- `POST /api/playlists` - Create playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/start` - Start playlist
- `POST /api/playlists/:id/stop` - Stop playlist

### Schedules
- `GET /api/schedules` - Get all schedules
- `POST /api/schedules` - Create schedule
- `DELETE /api/schedules/:id` - Delete schedule

## Architecture

### Backend
- **Express.js**: Web server and REST API
- **WebSocket**: Real-time updates
- **castv2-client**: Chromecast communication
- **mdns**: Device discovery via mDNS
- **node-cron**: Schedule management

### Frontend
- **React**: UI framework
- **React Router**: Navigation
- **Axios**: HTTP client
- **Lucide React**: Icons
- **Custom CSS**: Minimalist design system

### Communication Flow
1. Backend discovers Chromecasts via mDNS
2. WebSocket connection established with frontend
3. Real-time device status updates pushed to all clients
4. REST API handles commands (cast, stop, volume, etc.)
5. Chromecast devices receive and display content

## Troubleshooting

### No Devices Found
- Ensure Chromecasts are on the same network
- Verify firewall allows mDNS traffic (port 5353)
- Restart the server and Chromecasts
- Check that multicast is enabled on your network

### WebSocket Connection Failed
- Check that port 3001 is not blocked
- Verify backend server is running
- Check browser console for errors

### Casting Fails
- Ensure URL is publicly accessible
- Check that Chromecast can reach the URL
- Verify content type is supported
- Check server logs for errors

### Weather Not Loading
- Verify OpenWeather API key is correct
- Check API key has not exceeded free tier limits
- Ensure internet connection is available

## Future Plans

- [ ] Native macOS application with Electron
- [ ] Image slideshow template
- [ ] Video playback support
- [ ] Analytics dashboard
- [ ] User authentication
- [ ] Multi-tenant support
- [ ] Content library management
- [ ] Advanced scheduling (holiday schedules, etc.)
- [ ] Mobile app for remote control
- [ ] Integration with popular CMS platforms

## Technology Stack

- **Backend**: Node.js, Express, WebSocket, castv2-client, bonjour
- **Frontend**: React 18, React Router, Axios
- **Design**: Custom CSS with CSS Variables
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)
- **Discovery**: Bonjour (cross-platform mDNS)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for the narrowcasting community
