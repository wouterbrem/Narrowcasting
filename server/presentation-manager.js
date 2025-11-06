const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

/**
 * Presentation Manager
 * Manages presentations (collections of slides) and their playback
 */

class PresentationManager {
  constructor(slideManager) {
    this.slideManager = slideManager;
    this.presentations = new Map();
    this.activePresentations = new Map(); // deviceId -> presentationId
    this.sampleContentInitialized = false;
  }

  /**
   * Initialize sample content (presentations) on first launch
   */
  initializeSampleContent() {
    // Only initialize if no presentations exist
    if (this.presentations.size > 0 || this.sampleContentInitialized) {
      return;
    }

    logger.info('Initializing sample presentations...');

    try {
      // Get all slides to find sample slides by name
      const allSlides = this.slideManager.getAllSlides();
      const sampleSlides = {};

      allSlides.forEach(slide => {
        if (slide.name.startsWith('Sample ')) {
          const key = slide.name.replace('Sample ', '').split(' - ')[0].toLowerCase();
          sampleSlides[key] = slide.id;
        }
      });

      // Sample Presentation 1: Welcome & Info
      if (sampleSlides.welcome && sampleSlides.clock) {
        this.createPresentation({
          name: 'Sample: Welcome & Info',
          description: 'A simple presentation with welcome message and clock',
          slides: [
            { slideId: sampleSlides.welcome, duration: 10 },
            { slideId: sampleSlides.clock, duration: 15 }
          ],
          branding: {
            enabled: true,
            text: 'Powered by Narrowcast Pro',
            position: 'bottom-right',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            textColor: '#ffffff',
            logo: ''
          },
          settings: {
            transition: 'fade',
            transitionDuration: 500,
            loop: true
          }
        });
      }

      // Sample Presentation 2: Full Demo
      if (sampleSlides.welcome && sampleSlides.clock && sampleSlides.weather) {
        this.createPresentation({
          name: 'Sample: Full Demo',
          description: 'Complete demo presentation with all sample slides',
          slides: [
            { slideId: sampleSlides.welcome, duration: 10 },
            { slideId: sampleSlides.weather, duration: 20 },
            { slideId: sampleSlides.clock, duration: 15 }
          ],
          branding: {
            enabled: true,
            text: 'Narrowcast Pro Demo',
            position: 'bottom-right',
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            textColor: '#ffffff',
            logo: ''
          },
          settings: {
            transition: 'slide',
            transitionDuration: 800,
            loop: true
          }
        });
      }

      // Sample Presentation 3: News & Weather (if news slide exists)
      if (sampleSlides.news && sampleSlides.weather) {
        this.createPresentation({
          name: 'Sample: News & Weather',
          description: 'Information display with news and weather updates',
          slides: [
            { slideId: sampleSlides.news, duration: 30 },
            { slideId: sampleSlides.weather, duration: 20 }
          ],
          branding: {
            enabled: true,
            text: 'Live Updates',
            position: 'top-right',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            textColor: '#ffffff',
            logo: ''
          },
          settings: {
            transition: 'fade',
            transitionDuration: 500,
            loop: true
          }
        });
      }

      this.sampleContentInitialized = true;
      logger.info(`✓ Created ${this.presentations.size} sample presentations`);
    } catch (error) {
      logger.error('Failed to initialize sample presentations:', error);
    }
  }

  /**
   * Create a new presentation
   */
  createPresentation(data) {
    const presentation = {
      id: uuidv4(),
      name: data.name,
      description: data.description || '',
      slides: data.slides || [], // Array of {slideId, duration} objects
      branding: data.branding || {
        enabled: true,
        text: 'Powered by Narrowcast',
        position: 'bottom-right',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        textColor: '#ffffff',
        logo: ''
      },
      settings: data.settings || {
        transition: 'fade', // fade, slide, none
        transitionDuration: 500, // ms
        loop: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Validate slides exist
    for (const slideRef of presentation.slides) {
      const slide = this.slideManager.getSlide(slideRef.slideId);
      if (!slide) {
        throw new Error(`Slide not found: ${slideRef.slideId}`);
      }
    }

    this.presentations.set(presentation.id, presentation);
    return presentation;
  }

  /**
   * Update presentation
   */
  updatePresentation(presentationId, updates) {
    const presentation = this.presentations.get(presentationId);
    if (!presentation) {
      throw new Error(`Presentation not found: ${presentationId}`);
    }

    // Validate slides if updated
    if (updates.slides) {
      for (const slideRef of updates.slides) {
        const slide = this.slideManager.getSlide(slideRef.slideId);
        if (!slide) {
          throw new Error(`Slide not found: ${slideRef.slideId}`);
        }
      }
    }

    const updatedPresentation = {
      ...presentation,
      ...updates,
      id: presentation.id,
      updatedAt: new Date().toISOString()
    };

    this.presentations.set(presentationId, updatedPresentation);
    return updatedPresentation;
  }

  /**
   * Delete presentation
   */
  deletePresentation(presentationId) {
    // Stop presentation on all devices first
    for (const [deviceId, activePresentationId] of this.activePresentations.entries()) {
      if (activePresentationId === presentationId) {
        this.activePresentations.delete(deviceId);
      }
    }

    return this.presentations.delete(presentationId);
  }

  /**
   * Get presentation
   */
  getPresentation(presentationId) {
    return this.presentations.get(presentationId);
  }

  /**
   * Get all presentations
   */
  getAllPresentations() {
    return Array.from(this.presentations.values());
  }

  /**
   * Get presentation with full slide details
   */
  getPresentationWithSlides(presentationId) {
    const presentation = this.getPresentation(presentationId);
    if (!presentation) {
      return null;
    }

    return {
      ...presentation,
      slides: presentation.slides.map(slideRef => ({
        ...slideRef,
        slide: this.slideManager.getSlide(slideRef.slideId)
      }))
    };
  }

  /**
   * Start presentation on device
   */
  startPresentation(presentationId, deviceId) {
    const presentation = this.getPresentation(presentationId);
    if (!presentation) {
      throw new Error(`Presentation not found: ${presentationId}`);
    }

    this.activePresentations.set(deviceId, presentationId);
    return true;
  }

  /**
   * Stop presentation on device
   */
  stopPresentation(deviceId) {
    return this.activePresentations.delete(deviceId);
  }

  /**
   * Get active presentation for device
   */
  getActivePresentation(deviceId) {
    const presentationId = this.activePresentations.get(deviceId);
    return presentationId ? this.getPresentation(presentationId) : null;
  }

  /**
   * Generate presentation player HTML
   * This HTML will play the presentation with slide rotation
   */
  generatePresentationPlayerHtml(presentationId) {
    const presentation = this.getPresentationWithSlides(presentationId);
    if (!presentation) {
      throw new Error(`Presentation not found: ${presentationId}`);
    }

    if (presentation.slides.length === 0) {
      return this.generateEmptyPresentationHtml(presentation);
    }

    // Generate slides data for player
    const slidesData = presentation.slides.map(slideRef => ({
      id: slideRef.slideId,
      duration: slideRef.duration || slideRef.slide.duration,
      html: this.slideManager.generateSlideHtml(
        slideRef.slideId,
        presentation.branding
      )
    }));

    return this.generatePlayerHtml(presentation, slidesData);
  }

  /**
   * Generate empty presentation HTML
   */
  generateEmptyPresentationHtml(presentation) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${presentation.name}</title>
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
      text-align: center;
      padding: 40px;
    }
    .empty-container {
      backdrop-filter: blur(20px);
      background: rgba(255, 255, 255, 0.1);
      border-radius: 32px;
      padding: 60px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    h1 { font-size: 48px; font-weight: 300; margin-bottom: 20px; }
    p { font-size: 24px; opacity: 0.8; }
  </style>
</head>
<body>
  <div class="empty-container">
    <h1>${presentation.name}</h1>
    <p>This presentation has no slides yet.</p>
  </div>
</body>
</html>`;
  }

  /**
   * Generate player HTML with slide rotation
   * @param {Object} presentation - Presentation object
   * @param {Array} slidesData - Array of slide data with HTML
   * @param {Object} branding - Custom branding configuration
   */
  generatePlayerHtml(presentation, slidesData, branding = null) {
    const slides = JSON.stringify(slidesData);
    const settings = JSON.stringify(presentation.settings);

    // Get branding CSS and HTML if provided
    const brandingManager = require('./branding-manager');
    const actualBranding = branding || brandingManager.getBranding();
    const brandingCSS = actualBranding.enabled ? brandingManager.generateBrandingCSS() : '';
    const brandingHTML = actualBranding.enabled ? brandingManager.generateBrandingHTML() : '';

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${presentation.name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #000;
    }

    .presentation-container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .slide-frame {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
      display: none;
    }

    .slide-frame.active {
      display: block;
      opacity: 1;
    }

    .slide-frame.transition-out {
      opacity: 0;
    }

    /* Loading indicator */
    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 24px;
      text-align: center;
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Progress bar */
    .progress-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      height: 4px;
      background: rgba(0, 113, 227, 0.8);
      width: 0%;
      transition: width 0.1s linear;
      z-index: 10000;
    }

    /* Debug info (can be removed) */
    .debug-info {
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10001;
      display: none; /* Hidden by default */
    }
  </style>
  ${brandingCSS}
</head>
<body>
  <div class="presentation-container" id="presentation">
    <div class="loading" id="loading">
      <div class="loading-spinner"></div>
      <div>Loading presentation...</div>
    </div>
  </div>

  <div class="progress-bar" id="progress"></div>

  <div class="debug-info" id="debug">
    Slide: <span id="debug-slide">0</span> / <span id="debug-total">0</span><br>
    Time: <span id="debug-time">0</span>s
  </div>

  ${brandingHTML}

  <script>
    const SLIDES = ${slides};
    const SETTINGS = ${settings};

    let currentSlideIndex = 0;
    let slideFrames = [];
    let slideTimer = null;
    let progressInterval = null;
    let startTime = 0;

    const container = document.getElementById('presentation');
    const loading = document.getElementById('loading');
    const progressBar = document.getElementById('progress');
    const debug = document.getElementById('debug');

    // Debug mode: press 'd' to toggle
    document.addEventListener('keydown', (e) => {
      if (e.key === 'd') {
        debug.style.display = debug.style.display === 'none' ? 'block' : 'none';
      }
    });

    // Initialize presentation
    function init() {
      logger.info('Initializing presentation with', SLIDES.length, 'slides');

      // Create iframes for all slides
      SLIDES.forEach((slide, index) => {
        const iframe = document.createElement('iframe');
        iframe.className = 'slide-frame';
        iframe.id = 'slide-' + index;
        iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-presentation';

        // Create blob URL from HTML
        const blob = new Blob([slide.html], { type: 'text/html' });
        iframe.src = URL.createObjectURL(blob);

        container.appendChild(iframe);
        slideFrames.push({
          iframe,
          duration: slide.duration,
          loaded: false
        });

        // Track load status
        iframe.onload = () => {
          slideFrames[index].loaded = true;
          logger.info('Slide', index, 'loaded');

          // Start when first slide is loaded
          if (index === 0) {
            loading.style.display = 'none';
            showSlide(0);
          }
        };

        iframe.onerror = () => {
          logger.error('Failed to load slide', index);
        };
      });

      // Update debug info
      document.getElementById('debug-total').textContent = SLIDES.length;
    }

    // Show specific slide
    function showSlide(index) {
      if (index < 0 || index >= slideFrames.length) {
        logger.error('Invalid slide index:', index);
        return;
      }

      logger.info('Showing slide', index);

      // Hide all slides
      slideFrames.forEach((frame, i) => {
        if (i === currentSlideIndex && i !== index) {
          frame.iframe.classList.add('transition-out');
        }
        frame.iframe.classList.remove('active');
      });

      // Show current slide after transition
      setTimeout(() => {
        slideFrames[index].iframe.classList.add('active');
        slideFrames[index].iframe.classList.remove('transition-out');
      }, SETTINGS.transitionDuration || 500);

      currentSlideIndex = index;

      // Update debug
      document.getElementById('debug-slide').textContent = index + 1;

      // Clear existing timers
      if (slideTimer) {
        clearTimeout(slideTimer);
        slideTimer = null;
      }
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }

      // Start progress bar
      startTime = Date.now();
      const duration = slideFrames[index].duration * 1000;

      progressBar.style.width = '0%';
      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        progressBar.style.width = progress + '%';

        // Update debug
        document.getElementById('debug-time').textContent =
          Math.floor(elapsed / 1000);
      }, 100);

      // Schedule next slide
      slideTimer = setTimeout(() => {
        nextSlide();
      }, duration);
    }

    // Go to next slide
    function nextSlide() {
      let nextIndex = currentSlideIndex + 1;

      // Loop if enabled
      if (nextIndex >= slideFrames.length) {
        if (SETTINGS.loop) {
          nextIndex = 0;
        } else {
          logger.info('Presentation finished (no loop)');
          progressBar.style.width = '100%';
          return;
        }
      }

      showSlide(nextIndex);
    }

    // Go to previous slide (for debugging)
    function prevSlide() {
      let prevIndex = currentSlideIndex - 1;
      if (prevIndex < 0) {
        prevIndex = slideFrames.length - 1;
      }
      showSlide(prevIndex);
    }

    // Keyboard controls for debugging
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === ' ') {
        e.preventDefault();
        // Restart current slide
        showSlide(currentSlideIndex);
      }
    });

    // Handle visibility change (pause when hidden)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (slideTimer) clearTimeout(slideTimer);
        if (progressInterval) clearInterval(progressInterval);
      } else {
        // Resume presentation
        showSlide(currentSlideIndex);
      }
    });

    // Start presentation
    init();
  </script>
</body>
</html>`;
  }

  /**
   * Get statistics about presentations
   */
  getStatistics() {
    const totalPresentations = this.presentations.size;
    const activePresentations = this.activePresentations.size;
    const totalSlides = Array.from(this.presentations.values())
      .reduce((sum, p) => sum + p.slides.length, 0);

    return {
      totalPresentations,
      activePresentations,
      totalSlides,
      averageSlidesPerPresentation: totalPresentations > 0 ?
        (totalSlides / totalPresentations).toFixed(1) : 0
    };
  }
}

module.exports = PresentationManager;
