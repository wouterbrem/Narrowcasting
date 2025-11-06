const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

/**
 * Slide Manager
 * Manages different content types (slides) for narrowcasting
 *
 * Slide Types:
 * - webpage: Display any URL with cookie consent handling
 * - youtube: YouTube video/livestream with loop
 * - weather: Weather widget
 * - rss: RSS feed reader
 * - clock: Digital clock with date
 * - image: Image display or slideshow
 * - social: Social media feed
 * - news: News headlines
 * - html: Custom HTML content
 */

class SlideManager {
  constructor() {
    this.slides = new Map();
    this.sampleContentInitialized = false;
  }

  /**
   * Initialize sample content (slides) on first launch
   */
  initializeSampleContent() {
    // Only initialize if no slides exist
    if (this.slides.size > 0 || this.sampleContentInitialized) {
      return;
    }

    logger.info('Initializing sample slides...');

    try {
      // Sample 1: Clock Slide
      this.createSlide({
        type: 'clock',
        name: 'Sample Clock',
        duration: 15,
        config: {
          format: '24h',
          showSeconds: true,
          showDate: true,
          timezone: 'auto'
        }
      });

      // Sample 2: Weather Slide
      this.createSlide({
        type: 'weather',
        name: 'Sample Weather - Amsterdam',
        duration: 20,
        config: {
          location: 'Amsterdam, NL',
          units: 'metric',
          showForecast: true
        }
      });

      // Sample 3: Custom HTML - Welcome Message
      this.createSlide({
        type: 'html',
        name: 'Sample Welcome Message',
        duration: 10,
        config: {
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: 'Segoe UI', sans-serif; text-align: center; padding: 40px;">
              <h1 style="font-size: 72px; font-weight: 300; margin: 0 0 20px 0; text-shadow: 0 2px 20px rgba(0,0,0,0.3);">Welcome to Narrowcast Pro</h1>
              <p style="font-size: 32px; opacity: 0.9; margin: 0;">Your Professional Narrowcasting Solution</p>
              <p style="font-size: 24px; opacity: 0.7; margin: 40px 0 0 0;">This is a sample slide - Create your own!</p>
            </div>
          `
        }
      });

      // Sample 4: Web Page - News
      this.createSlide({
        type: 'webpage',
        name: 'Sample News - BBC',
        duration: 30,
        config: {
          url: 'https://www.bbc.com/news',
          handleCookies: true,
          zoom: 1.0
        }
      });

      this.sampleContentInitialized = true;
      logger.info(`✓ Created ${this.slides.size} sample slides`);
    } catch (error) {
      logger.error('Failed to initialize sample content:', error);
    }
  }

  /**
   * Create a new slide
   */
  createSlide(data) {
    const slide = {
      id: uuidv4(),
      type: data.type, // webpage, youtube, weather, rss, clock, image, social, news, html
      name: data.name,
      duration: data.duration || 30, // seconds
      config: data.config || {}, // Type-specific configuration
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Validate slide based on type
    this.validateSlide(slide);

    this.slides.set(slide.id, slide);
    return slide;
  }

  /**
   * Validate slide configuration based on type
   */
  validateSlide(slide) {
    switch (slide.type) {
      case 'webpage':
        if (!slide.config.url) {
          throw new Error('Webpage slide requires url in config');
        }
        // Default: enable cookie consent handling
        slide.config.handleCookieConsent = slide.config.handleCookieConsent !== false;
        break;

      case 'youtube':
        if (!slide.config.videoId && !slide.config.url) {
          throw new Error('YouTube slide requires videoId or url in config');
        }
        // Parse YouTube URL to get videoId if needed
        if (slide.config.url && !slide.config.videoId) {
          slide.config.videoId = this.parseYouTubeUrl(slide.config.url);
        }
        // Default: enable loop
        slide.config.loop = slide.config.loop !== false;
        slide.config.autoplay = slide.config.autoplay !== false;
        break;

      case 'weather':
        if (!slide.config.location) {
          throw new Error('Weather slide requires location in config');
        }
        slide.config.units = slide.config.units || 'metric';
        slide.config.apiKey = slide.config.apiKey || '';
        break;

      case 'rss':
        if (!slide.config.feedUrl) {
          throw new Error('RSS slide requires feedUrl in config');
        }
        slide.config.maxItems = slide.config.maxItems || 5;
        slide.config.refreshInterval = slide.config.refreshInterval || 300; // seconds
        break;

      case 'clock':
        slide.config.format = slide.config.format || '24h';
        slide.config.showDate = slide.config.showDate !== false;
        slide.config.showSeconds = slide.config.showSeconds !== false;
        slide.config.timezone = slide.config.timezone || 'local';
        break;

      case 'image':
        if (!slide.config.url && !slide.config.urls) {
          throw new Error('Image slide requires url or urls in config');
        }
        if (slide.config.urls) {
          slide.config.slideshowInterval = slide.config.slideshowInterval || 5; // seconds
        }
        slide.config.fit = slide.config.fit || 'cover'; // cover, contain, fill
        break;

      case 'social':
        if (!slide.config.platform || !slide.config.handle) {
          throw new Error('Social slide requires platform and handle in config');
        }
        slide.config.maxPosts = slide.config.maxPosts || 5;
        break;

      case 'news':
        slide.config.category = slide.config.category || 'general';
        slide.config.country = slide.config.country || 'us';
        slide.config.apiKey = slide.config.apiKey || '';
        slide.config.maxHeadlines = slide.config.maxHeadlines || 10;
        break;

      case 'html':
        if (!slide.config.html) {
          throw new Error('HTML slide requires html in config');
        }
        break;

      default:
        throw new Error(`Unknown slide type: ${slide.type}`);
    }

    return true;
  }

  /**
   * Parse YouTube URL to extract video ID
   */
  parseYouTubeUrl(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/live\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    throw new Error('Invalid YouTube URL');
  }

  /**
   * Update slide
   */
  updateSlide(slideId, updates) {
    const slide = this.slides.get(slideId);
    if (!slide) {
      throw new Error(`Slide not found: ${slideId}`);
    }

    const updatedSlide = {
      ...slide,
      ...updates,
      id: slide.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    this.validateSlide(updatedSlide);
    this.slides.set(slideId, updatedSlide);

    return updatedSlide;
  }

  /**
   * Delete slide
   */
  deleteSlide(slideId) {
    return this.slides.delete(slideId);
  }

  /**
   * Get slide by ID
   */
  getSlide(slideId) {
    return this.slides.get(slideId);
  }

  /**
   * Get all slides
   */
  getAllSlides() {
    return Array.from(this.slides.values());
  }

  /**
   * Get slides by type
   */
  getSlidesByType(type) {
    return Array.from(this.slides.values()).filter(slide => slide.type === type);
  }

  /**
   * Generate HTML for a slide to be displayed
   */
  generateSlideHtml(slideId, branding = {}) {
    const slide = this.getSlide(slideId);
    if (!slide) {
      throw new Error(`Slide not found: ${slideId}`);
    }

    return this.renderSlideContent(slide, branding);
  }

  /**
   * Render slide content based on type
   */
  renderSlideContent(slide, branding) {
    const brandingHtml = branding.enabled ? this.generateBrandingWrapper(branding) : '';

    switch (slide.type) {
      case 'webpage':
        return this.renderWebpageSlide(slide, brandingHtml);
      case 'youtube':
        return this.renderYouTubeSlide(slide, brandingHtml);
      case 'weather':
        return this.renderWeatherSlide(slide, brandingHtml);
      case 'rss':
        return this.renderRssSlide(slide, brandingHtml);
      case 'clock':
        return this.renderClockSlide(slide, brandingHtml);
      case 'image':
        return this.renderImageSlide(slide, brandingHtml);
      case 'html':
        return this.renderHtmlSlide(slide, brandingHtml);
      default:
        throw new Error(`Cannot render slide type: ${slide.type}`);
    }
  }

  /**
   * Generate branding wrapper HTML
   */
  generateBrandingWrapper(branding) {
    const logo = branding.logo || '';
    const text = branding.text || 'Powered by Narrowcast';
    const position = branding.position || 'bottom-right';
    const backgroundColor = branding.backgroundColor || 'rgba(0, 0, 0, 0.7)';
    const textColor = branding.textColor || '#ffffff';

    const positions = {
      'top-left': 'top: 20px; left: 20px;',
      'top-right': 'top: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;',
      'bottom-right': 'bottom: 20px; right: 20px;'
    };

    return `
      <div class="narrowcast-branding" style="
        position: fixed;
        ${positions[position]}
        background: ${backgroundColor};
        backdrop-filter: blur(10px);
        padding: 12px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      ">
        ${logo ? `<img src="${logo}" alt="Logo" style="height: 24px; width: auto;">` : ''}
        <span style="color: ${textColor}; font-size: 14px; font-weight: 500;">${text}</span>
      </div>
    `;
  }

  /**
   * Render webpage slide with cookie consent handling
   */
  renderWebpageSlide(slide, brandingHtml) {
    const cookieConsentScript = slide.config.handleCookieConsent ? `
      // Cookie consent handler
      setTimeout(() => {
        const selectors = [
          'button[id*="accept"]',
          'button[class*="accept"]',
          'button[id*="cookie"]',
          'button[class*="cookie"]',
          'a[id*="accept"]',
          'a[class*="accept"]',
          '.cookie-consent button',
          '.cookie-banner button',
          '#cookie-notice button',
          '[data-consent="accept"]',
          '[aria-label*="Accept"]',
          '[aria-label*="accept"]'
        ];

        for (const selector of selectors) {
          const buttons = document.querySelectorAll(selector);
          for (const button of buttons) {
            if (button.offsetParent !== null) {
              logger.info('Auto-accepting cookie consent:', button);
              button.click();
              return;
            }
          }
        }
      }, 2000);
    ` : '';

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${slide.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; }
    iframe { border: none; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <iframe src="${slide.config.url}" allowfullscreen></iframe>
  ${brandingHtml}
  <script>
    ${cookieConsentScript}

    // Reload iframe if needed
    window.addEventListener('message', (event) => {
      if (event.data === 'reload') {
        document.querySelector('iframe').src = document.querySelector('iframe').src;
      }
    });
  </script>
</body>
</html>`;
  }

  /**
   * Render YouTube slide with loop functionality
   */
  renderYouTubeSlide(slide, brandingHtml) {
    const videoId = slide.config.videoId;
    const loop = slide.config.loop ? 1 : 0;
    const autoplay = slide.config.autoplay ? 1 : 0;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${slide.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
    #player { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="player"></div>
  ${brandingHtml}

  <script src="https://www.youtube.com/iframe_api"></script>
  <script>
    let player;

    function onYouTubeIframeAPIReady() {
      player = new YT.Player('player', {
        videoId: '${videoId}',
        playerVars: {
          autoplay: ${autoplay},
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          loop: ${loop},
          playlist: '${videoId}' // Required for loop to work
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError
        }
      });
    }

    function onPlayerReady(event) {
      if (${autoplay}) {
        event.target.playVideo();
      }
    }

    function onPlayerStateChange(event) {
      // Loop video manually if needed
      if (event.data === YT.PlayerState.ENDED && ${loop}) {
        player.seekTo(0);
        player.playVideo();
      }
    }

    function onPlayerError(event) {
      logger.error('YouTube player error:', event.data);
      // Try to recover by reloading after 5 seconds
      setTimeout(() => {
        player.loadVideoById('${videoId}');
      }, 5000);
    }
  </script>
</body>
</html>`;
  }

  /**
   * Render weather slide
   */
  renderWeatherSlide(slide, brandingHtml) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${slide.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
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
      text-align: center;
    }
    .location { font-size: 36px; font-weight: 300; margin-bottom: 20px; }
    .temperature { font-size: 120px; font-weight: 200; line-height: 1; margin: 30px 0; }
    .description { font-size: 32px; font-weight: 300; margin-bottom: 40px; opacity: 0.9; }
    .details { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-top: 40px; }
    .detail-item { display: flex; align-items: center; gap: 16px; font-size: 20px; opacity: 0.9; justify-content: center; }
    .time { text-align: center; font-size: 28px; margin-top: 40px; opacity: 0.8; font-weight: 300; }
  </style>
</head>
<body>
  <div class="weather-container">
    <div class="location" id="location">Loading...</div>
    <div class="temperature" id="temperature">--°</div>
    <div class="description" id="description">--</div>
    <div class="details">
      <div class="detail-item">
        <span>💧</span>
        <span id="humidity">--%</span>
      </div>
      <div class="detail-item">
        <span>💨</span>
        <span id="wind">-- km/h</span>
      </div>
    </div>
    <div class="time" id="time"></div>
  </div>
  ${brandingHtml}

  <script>
    const API_KEY = '${slide.config.apiKey}';
    const LOCATION = '${slide.config.location}';
    const UNITS = '${slide.config.units}';

    async function fetchWeather() {
      try {
        const response = await fetch(\`https://api.openweathermap.org/data/2.5/weather?q=\${LOCATION}&units=\${UNITS}&appid=\${API_KEY}\`);
        const data = await response.json();

        document.getElementById('location').textContent = data.name;
        document.getElementById('temperature').textContent = Math.round(data.main.temp) + '°';
        document.getElementById('description').textContent = data.weather[0].description;
        document.getElementById('humidity').textContent = data.main.humidity + '% Humidity';
        document.getElementById('wind').textContent = Math.round(data.wind.speed * 3.6) + ' km/h';
      } catch (error) {
        logger.error('Weather fetch failed:', error);
        document.getElementById('location').textContent = 'Weather Unavailable';
      }
    }

    function updateTime() {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const dateString = now.toLocaleDateString('en-US', {
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
  }

  /**
   * Render RSS feed slide
   */
  renderRssSlide(slide, brandingHtml) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${slide.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      padding: 60px;
      min-height: 100vh;
    }
    .rss-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 { font-size: 48px; font-weight: 300; margin-bottom: 40px; text-align: center; }
    .feed-items { display: flex; flex-direction: column; gap: 24px; }
    .feed-item {
      backdrop-filter: blur(20px);
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 32px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: slideIn 0.5s ease-out forwards;
      opacity: 0;
    }
    .feed-item:nth-child(1) { animation-delay: 0.1s; }
    .feed-item:nth-child(2) { animation-delay: 0.2s; }
    .feed-item:nth-child(3) { animation-delay: 0.3s; }
    .feed-item:nth-child(4) { animation-delay: 0.4s; }
    .feed-item:nth-child(5) { animation-delay: 0.5s; }
    .item-title { font-size: 28px; font-weight: 500; margin-bottom: 12px; }
    .item-description { font-size: 18px; opacity: 0.9; line-height: 1.6; }
    .item-date { font-size: 14px; opacity: 0.7; margin-top: 12px; }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <div class="rss-container">
    <h1>${slide.name}</h1>
    <div class="feed-items" id="feed"></div>
  </div>
  ${brandingHtml}

  <script>
    const FEED_URL = '${slide.config.feedUrl}';
    const MAX_ITEMS = ${slide.config.maxItems};
    const REFRESH_INTERVAL = ${slide.config.refreshInterval * 1000};

    async function fetchFeed() {
      try {
        // Use RSS2JSON service to parse RSS feed
        const response = await fetch(\`https://api.rss2json.com/v1/api.json?rss_url=\${encodeURIComponent(FEED_URL)}\`);
        const data = await response.json();

        const feedContainer = document.getElementById('feed');
        feedContainer.innerHTML = '';

        data.items.slice(0, MAX_ITEMS).forEach((item, index) => {
          const itemEl = document.createElement('div');
          itemEl.className = 'feed-item';
          itemEl.style.animationDelay = (index * 0.1) + 's';
          itemEl.innerHTML = \`
            <div class="item-title">\${item.title}</div>
            <div class="item-description">\${item.description || ''}</div>
            <div class="item-date">\${new Date(item.pubDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
          \`;
          feedContainer.appendChild(itemEl);
        });
      } catch (error) {
        logger.error('RSS fetch failed:', error);
        document.getElementById('feed').innerHTML = '<div class="feed-item">Failed to load RSS feed</div>';
      }
    }

    fetchFeed();
    setInterval(fetchFeed, REFRESH_INTERVAL);
  </script>
</body>
</html>`;
  }

  /**
   * Render clock slide
   */
  renderClockSlide(slide, brandingHtml) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${slide.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
    }
    .clock-container {
      backdrop-filter: blur(20px);
      background: rgba(255, 255, 255, 0.05);
      border-radius: 32px;
      padding: 80px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .time {
      font-size: 160px;
      font-weight: 100;
      letter-spacing: -4px;
      line-height: 1;
      margin-bottom: 20px;
      font-variant-numeric: tabular-nums;
    }
    .date {
      font-size: 36px;
      font-weight: 300;
      opacity: 0.8;
    }
    .timezone {
      font-size: 20px;
      opacity: 0.6;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="clock-container">
    <div class="time" id="time">00:00:00</div>
    ${slide.config.showDate ? '<div class="date" id="date"></div>' : ''}
    <div class="timezone" id="timezone"></div>
  </div>
  ${brandingHtml}

  <script>
    const FORMAT = '${slide.config.format}';
    const SHOW_SECONDS = ${slide.config.showSeconds};
    const TIMEZONE = '${slide.config.timezone}';

    function updateClock() {
      const now = new Date();

      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: FORMAT === '12h'
      };

      if (SHOW_SECONDS) {
        timeOptions.second = '2-digit';
      }

      if (TIMEZONE !== 'local') {
        timeOptions.timeZone = TIMEZONE;
      }

      const timeString = now.toLocaleTimeString('en-US', timeOptions);
      document.getElementById('time').textContent = timeString;

      ${slide.config.showDate ? `
      const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: TIMEZONE !== 'local' ? TIMEZONE : undefined
      });
      document.getElementById('date').textContent = dateString;
      ` : ''}

      document.getElementById('timezone').textContent = TIMEZONE === 'local' ?
        Intl.DateTimeFormat().resolvedOptions().timeZone : TIMEZONE;
    }

    updateClock();
    setInterval(updateClock, 1000);
  </script>
</body>
</html>`;
  }

  /**
   * Render image slide
   */
  renderImageSlide(slide, brandingHtml) {
    const isSlideshow = Array.isArray(slide.config.urls);
    const imageSrc = isSlideshow ? slide.config.urls[0] : slide.config.url;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${slide.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
    .image-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: ${slide.config.fit};
      animation: fadeIn 0.5s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  </style>
</head>
<body>
  <div class="image-container">
    <img id="image" src="${imageSrc}" alt="${slide.name}">
  </div>
  ${brandingHtml}

  ${isSlideshow ? `
  <script>
    const images = ${JSON.stringify(slide.config.urls)};
    let currentIndex = 0;
    const interval = ${slide.config.slideshowInterval * 1000};

    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      const img = document.getElementById('image');
      img.style.animation = 'none';
      setTimeout(() => {
        img.src = images[currentIndex];
        img.style.animation = 'fadeIn 0.5s ease-out';
      }, 10);
    }

    setInterval(nextImage, interval);
  </script>
  ` : ''}
</body>
</html>`;
  }

  /**
   * Render custom HTML slide
   */
  renderHtmlSlide(slide, brandingHtml) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${slide.name}</title>
</head>
<body>
  ${slide.config.html}
  ${brandingHtml}
</body>
</html>`;
  }
}

module.exports = SlideManager;
