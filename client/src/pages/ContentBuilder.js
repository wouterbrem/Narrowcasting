import React, { useState } from 'react';
import axios from 'axios';
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  CloudDrizzle,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  Gauge,
  Newspaper,
  Layout,
  Image as ImageIcon,
  Type,
  Clock,
  Globe,
  Save,
  Play,
  Code
} from 'lucide-react';
import './ContentBuilder.css';

function ContentBuilder({ devices }) {
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [templateType, setTemplateType] = useState('weather');
  const [customHtml, setCustomHtml] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Weather settings
  const [weatherLocation, setWeatherLocation] = useState('Amsterdam');
  const [weatherApiKey, setWeatherApiKey] = useState('');
  const [weatherTheme, setWeatherTheme] = useState('modern');

  // Dashboard settings
  const [dashboardTitle, setDashboardTitle] = useState('Welcome');
  const [dashboardLayout, setDashboardLayout] = useState('grid');
  const [showClock, setShowClock] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#1d1d1f');

  const templates = [
    { id: 'weather', name: 'Weather Display', icon: Cloud, description: 'Beautiful weather widget' },
    { id: 'dashboard', name: 'Info Dashboard', icon: Layout, description: 'Multi-widget dashboard' },
    { id: 'slideshow', name: 'Image Slideshow', icon: ImageIcon, description: 'Rotating images' },
    { id: 'announcements', name: 'Announcements', icon: Newspaper, description: 'Text announcements' },
    { id: 'custom', name: 'Custom HTML', icon: Code, description: 'Full control with HTML/CSS/JS' },
  ];

  const generateWeatherHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather Display</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 40px;
        }

        .weather-container {
            max-width: 600px;
            width: 100%;
            backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.1);
            border-radius: 32px;
            padding: 60px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .location {
            font-size: 36px;
            font-weight: 300;
            margin-bottom: 20px;
            letter-spacing: -0.5px;
        }

        .temperature {
            font-size: 120px;
            font-weight: 200;
            line-height: 1;
            margin: 30px 0;
            letter-spacing: -4px;
        }

        .description {
            font-size: 32px;
            font-weight: 300;
            margin-bottom: 40px;
            opacity: 0.9;
        }

        .details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            margin-top: 40px;
        }

        .detail-item {
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 20px;
            opacity: 0.9;
        }

        .detail-icon {
            width: 32px;
            height: 32px;
        }

        .time {
            text-align: center;
            font-size: 28px;
            margin-top: 40px;
            opacity: 0.8;
            font-weight: 300;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .weather-container > * {
            animation: fadeIn 0.6s ease-out forwards;
        }

        .temperature { animation-delay: 0.1s; }
        .description { animation-delay: 0.2s; }
        .details { animation-delay: 0.3s; }
    </style>
</head>
<body>
    <div class="weather-container">
        <div class="location" id="location">Loading...</div>
        <div class="temperature" id="temperature">--°</div>
        <div class="description" id="description">--</div>
        <div class="details">
            <div class="detail-item">
                <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
                </svg>
                <span id="humidity">--%</span>
            </div>
            <div class="detail-item">
                <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span id="wind">-- km/h</span>
            </div>
        </div>
        <div class="time" id="time"></div>
    </div>

    <script>
        const API_KEY = '${weatherApiKey || 'YOUR_API_KEY'}';
        const LOCATION = '${weatherLocation}';

        async function fetchWeather() {
            try {
                const response = await fetch(\`https://api.openweathermap.org/data/2.5/weather?q=\${LOCATION}&units=metric&appid=\${API_KEY}\`);
                const data = await response.json();

                document.getElementById('location').textContent = data.name;
                document.getElementById('temperature').textContent = Math.round(data.main.temp) + '°';
                document.getElementById('description').textContent = data.weather[0].description;
                document.getElementById('humidity').textContent = data.main.humidity + '% Humidity';
                document.getElementById('wind').textContent = Math.round(data.wind.speed * 3.6) + ' km/h';
            } catch (error) {
                console.error('Weather fetch failed:', error);
                document.getElementById('location').textContent = 'Weather Unavailable';
            }
        }

        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('nl-NL', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            const dateString = now.toLocaleDateString('nl-NL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            document.getElementById('time').textContent = \`\${dateString} · \${timeString}\`;
        }

        fetchWeather();
        setInterval(fetchWeather, 600000); // Update every 10 minutes

        updateTime();
        setInterval(updateTime, 1000);
    </script>
</body>
</html>`;
  };

  const generateDashboardHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${dashboardTitle}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: ${backgroundColor};
            color: ${textColor};
            padding: 60px;
            min-height: 100vh;
        }

        .dashboard {
            max-width: 1600px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 60px;
        }

        .title {
            font-size: 72px;
            font-weight: 200;
            margin-bottom: 20px;
            letter-spacing: -2px;
        }

        .current-time {
            font-size: 96px;
            font-weight: 100;
            letter-spacing: -3px;
            margin: 40px 0 20px;
        }

        .current-date {
            font-size: 32px;
            font-weight: 300;
            opacity: 0.7;
        }

        .widgets {
            display: grid;
            grid-template-columns: repeat(${dashboardLayout === 'grid' ? '2' : '1'}, 1fr);
            gap: 40px;
            margin-top: 60px;
        }

        .widget {
            background: rgba(${textColor === '#1d1d1f' ? '0,0,0' : '255,255,255'}, 0.05);
            border-radius: 24px;
            padding: 40px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(${textColor === '#1d1d1f' ? '0,0,0' : '255,255,255'}, 0.1);
        }

        .widget-title {
            font-size: 28px;
            font-weight: 500;
            margin-bottom: 24px;
            opacity: 0.9;
        }

        .widget-content {
            font-size: 20px;
            line-height: 1.6;
            opacity: 0.8;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .widget {
            animation: fadeIn 0.6s ease-out forwards;
        }

        .widget:nth-child(1) { animation-delay: 0s; }
        .widget:nth-child(2) { animation-delay: 0.1s; }
        .widget:nth-child(3) { animation-delay: 0.2s; }
        .widget:nth-child(4) { animation-delay: 0.3s; }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1 class="title">${dashboardTitle}</h1>
            ${showClock ? '<div class="current-time" id="time"></div>' : ''}
            ${showDate ? '<div class="current-date" id="date"></div>' : ''}
        </div>

        <div class="widgets">
            ${showWeather ? `
            <div class="widget">
                <div class="widget-title">Weather</div>
                <div class="widget-content" id="weather">Loading weather...</div>
            </div>
            ` : ''}

            <div class="widget">
                <div class="widget-title">Welcome</div>
                <div class="widget-content">
                    This is a customizable information dashboard. You can add more widgets and content through the Content Builder.
                </div>
            </div>
        </div>
    </div>

    <script>
        function updateTime() {
            const now = new Date();
            ${showClock ? `
            const timeString = now.toLocaleTimeString('nl-NL', {
                hour: '2-digit',
                minute: '2-digit'
            });
            document.getElementById('time').textContent = timeString;
            ` : ''}

            ${showDate ? `
            const dateString = now.toLocaleDateString('nl-NL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            document.getElementById('date').textContent = dateString;
            ` : ''}
        }

        ${showWeather ? `
        async function fetchWeather() {
            try {
                const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=${weatherLocation}&units=metric&appid=${weatherApiKey || 'YOUR_API_KEY'}');
                const data = await response.json();
                document.getElementById('weather').innerHTML = \`
                    <div style="font-size: 48px; font-weight: 200; margin: 20px 0;">\${Math.round(data.main.temp)}°C</div>
                    <div>\${data.weather[0].description}</div>
                \`;
            } catch (error) {
                document.getElementById('weather').textContent = 'Weather unavailable';
            }
        }
        fetchWeather();
        setInterval(fetchWeather, 600000);
        ` : ''}

        updateTime();
        setInterval(updateTime, 1000);
    </script>
</body>
</html>`;
  };

  const generateHtml = () => {
    switch (templateType) {
      case 'weather':
        return generateWeatherHtml();
      case 'dashboard':
        return generateDashboardHtml();
      case 'custom':
        return customHtml;
      default:
        return generateWeatherHtml();
    }
  };

  const handleDeploy = async () => {
    if (selectedDevices.length === 0) {
      alert('Please select at least one device');
      return;
    }

    const html = generateHtml();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    try {
      await axios.post('/api/cast', {
        deviceIds: selectedDevices,
        url: url,
        contentType: 'text/html'
      });
      alert('Content deployed successfully!');
    } catch (error) {
      console.error('Deploy failed:', error);
      alert('Failed to deploy content');
    }
  };

  const handlePreview = () => {
    const html = generateHtml();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="page content-builder">
      <div className="page-header">
        <h1 className="page-title">Content Builder</h1>
        <p className="page-description">
          Create beautiful narrowcasting content with templates or custom HTML
        </p>
      </div>

      <div className="builder-layout">
        <div className="builder-sidebar card">
          <h3>Templates</h3>
          <div className="template-list">
            {templates.map((template) => (
              <button
                key={template.id}
                className={`template-card ${templateType === template.id ? 'active' : ''}`}
                onClick={() => setTemplateType(template.id)}
              >
                <template.icon size={24} strokeWidth={1.5} />
                <div className="template-info">
                  <div className="template-name">{template.name}</div>
                  <div className="template-description">{template.description}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="device-selection">
            <h4>Deploy To</h4>
            <div className="device-checkboxes">
              {devices.map((device) => (
                <label key={device.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedDevices.includes(device.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDevices([...selectedDevices, device.id]);
                      } else {
                        setSelectedDevices(selectedDevices.filter(id => id !== device.id));
                      }
                    }}
                  />
                  <span>{device.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="deploy-actions">
            <button className="btn btn-secondary btn-lg" onClick={handlePreview}>
              <Eye size={18} />
              Preview
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleDeploy}
              disabled={selectedDevices.length === 0}
            >
              <Play size={18} />
              Deploy
            </button>
          </div>
        </div>

        <div className="builder-main">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                {templates.find(t => t.id === templateType)?.name} Settings
              </h3>
            </div>

            {templateType === 'weather' && (
              <div className="settings-grid">
                <div className="input-group">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="Amsterdam"
                    value={weatherLocation}
                    onChange={(e) => setWeatherLocation(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>OpenWeather API Key</label>
                  <input
                    type="text"
                    placeholder="Get your free API key from openweathermap.org"
                    value={weatherApiKey}
                    onChange={(e) => setWeatherApiKey(e.target.value)}
                  />
                  <small>Get your free API key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer">openweathermap.org</a></small>
                </div>
              </div>
            )}

            {templateType === 'dashboard' && (
              <div className="settings-grid">
                <div className="input-group">
                  <label>Dashboard Title</label>
                  <input
                    type="text"
                    value={dashboardTitle}
                    onChange={(e) => setDashboardTitle(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Layout</label>
                  <select value={dashboardLayout} onChange={(e) => setDashboardLayout(e.target.value)}>
                    <option value="grid">Grid (2 columns)</option>
                    <option value="stack">Stack (1 column)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Background Color</label>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Text Color</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                  />
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={showClock}
                      onChange={(e) => setShowClock(e.target.checked)}
                    />
                    <span>Show Clock</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={showDate}
                      onChange={(e) => setShowDate(e.target.checked)}
                    />
                    <span>Show Date</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={showWeather}
                      onChange={(e) => setShowWeather(e.target.checked)}
                    />
                    <span>Show Weather Widget</span>
                  </label>
                </div>

                {showWeather && (
                  <>
                    <div className="input-group">
                      <label>Weather Location</label>
                      <input
                        type="text"
                        value={weatherLocation}
                        onChange={(e) => setWeatherLocation(e.target.value)}
                      />
                    </div>

                    <div className="input-group">
                      <label>OpenWeather API Key</label>
                      <input
                        type="text"
                        value={weatherApiKey}
                        onChange={(e) => setWeatherApiKey(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {templateType === 'custom' && (
              <div className="input-group">
                <label>Custom HTML</label>
                <textarea
                  value={customHtml}
                  onChange={(e) => setCustomHtml(e.target.value)}
                  placeholder="Enter your custom HTML, CSS, and JavaScript here..."
                  rows={20}
                  style={{ fontFamily: 'monospace', fontSize: '14px' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentBuilder;
