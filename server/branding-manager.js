/**
 * Branding Manager
 * Manages custom branding (logo, colors, fonts) for presentations
 */

const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

class BrandingManager {
  constructor() {
    this.brandingFile = path.join(__dirname, '../data/branding.json');
    this.uploadDir = path.join(__dirname, '../uploads/branding');
    this.branding = null;
    this.defaultBranding = {
      id: 'default',
      name: 'Default Branding',
      enabled: true,
      logo: {
        enabled: false,
        url: null,
        position: 'top-left', // top-left, top-right, bottom-left, bottom-right, center
        size: 'medium' // small, medium, large
      },
      colors: {
        primary: '#0071E3',
        secondary: '#34C759',
        background: '#FFFFFF',
        text: '#000000',
        accent: '#FF9500'
      },
      text: {
        enabled: false,
        content: '',
        position: 'bottom-right',
        fontSize: 'medium' // small, medium, large
      },
      overlay: {
        enabled: true,
        opacity: 0.95,
        blur: 0
      }
    };
    this.init();
  }

  /**
   * Initialize branding manager
   */
  async init() {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(this.brandingFile);
      await fs.mkdir(dataDir, { recursive: true });

      // Ensure upload directory exists
      await fs.mkdir(this.uploadDir, { recursive: true });

      // Load or create branding
      await this.load();
    } catch (error) {
      logger.error('Failed to initialize branding manager:', error);
      this.branding = { ...this.defaultBranding };
    }
  }

  /**
   * Load branding from file
   */
  async load() {
    try {
      const data = await fs.readFile(this.brandingFile, 'utf8');
      this.branding = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, use default
        this.branding = { ...this.defaultBranding };
        await this.save();
      } else {
        throw error;
      }
    }
  }

  /**
   * Save branding to file
   */
  async save() {
    try {
      await fs.writeFile(
        this.brandingFile,
        JSON.stringify(this.branding, null, 2),
        'utf8'
      );
    } catch (error) {
      logger.error('Failed to save branding:', error);
      throw error;
    }
  }

  /**
   * Get current branding
   * @returns {Object} Branding configuration
   */
  getBranding() {
    return { ...this.branding };
  }

  /**
   * Update branding
   * @param {Object} updates - Branding updates
   * @returns {Object} Updated branding
   */
  async updateBranding(updates) {
    // Merge updates with current branding
    this.branding = {
      ...this.branding,
      ...updates,
      logo: { ...this.branding.logo, ...updates.logo },
      colors: { ...this.branding.colors, ...updates.colors },
      text: { ...this.branding.text, ...updates.text },
      overlay: { ...this.branding.overlay, ...updates.overlay }
    };

    await this.save();
    return this.getBranding();
  }

  /**
   * Upload logo file
   * @param {Object} file - File object from multer
   * @returns {string} Logo URL
   */
  async uploadLogo(file) {
    const ext = path.extname(file.originalname);
    const filename = `logo-${uuidv4()}${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    // Move file to uploads directory
    await fs.rename(file.path, filepath);

    // Delete old logo if exists
    if (this.branding.logo.url) {
      try {
        const oldPath = path.join(__dirname, '..', this.branding.logo.url);
        await fs.unlink(oldPath);
      } catch (error) {
        // Ignore error if old file doesn't exist
      }
    }

    // Return relative URL
    return `/uploads/branding/${filename}`;
  }

  /**
   * Delete logo
   */
  async deleteLogo() {
    if (this.branding.logo.url) {
      try {
        const filepath = path.join(__dirname, '..', this.branding.logo.url);
        await fs.unlink(filepath);
      } catch (error) {
        logger.error('Failed to delete logo:', error);
      }
    }

    this.branding.logo.url = null;
    this.branding.logo.enabled = false;
    await this.save();
  }

  /**
   * Reset branding to default
   */
  async resetToDefault() {
    // Delete logo if exists
    if (this.branding.logo.url) {
      await this.deleteLogo();
    }

    this.branding = { ...this.defaultBranding };
    await this.save();
    return this.getBranding();
  }

  /**
   * Generate branding CSS
   * @returns {string} CSS string
   */
  generateBrandingCSS() {
    const { colors, text, overlay } = this.branding;

    return `
      <style>
        :root {
          --brand-primary: ${colors.primary};
          --brand-secondary: ${colors.secondary};
          --brand-background: ${colors.background};
          --brand-text: ${colors.text};
          --brand-accent: ${colors.accent};
        }

        .branding-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: ${overlay.opacity};
        }

        .branding-logo {
          position: fixed;
          z-index: 10000;
          max-width: ${this.getLogoSize()}px;
          max-height: ${this.getLogoSize()}px;
          ${this.getLogoPositionCSS()}
        }

        .branding-text {
          position: fixed;
          z-index: 10000;
          color: var(--brand-text);
          font-size: ${this.getTextSize()}px;
          font-weight: 600;
          padding: 12px 20px;
          background: var(--brand-background);
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
          ${this.getTextPositionCSS()}
        }
      </style>
    `;
  }

  /**
   * Generate branding HTML overlay
   * @returns {string} HTML string
   */
  generateBrandingHTML() {
    if (!this.branding.enabled) {
      return '';
    }

    let html = '<div class="branding-overlay">';

    // Add logo if enabled
    if (this.branding.logo.enabled && this.branding.logo.url) {
      html += `
        <img
          src="${this.branding.logo.url}"
          alt="Brand Logo"
          class="branding-logo"
        />
      `;
    }

    // Add text if enabled
    if (this.branding.text.enabled && this.branding.text.content) {
      html += `
        <div class="branding-text">
          ${this.escapeHtml(this.branding.text.content)}
        </div>
      `;
    }

    html += '</div>';
    return html;
  }

  /**
   * Get logo size in pixels
   * @returns {number}
   */
  getLogoSize() {
    const sizes = { small: 80, medium: 120, large: 180 };
    return sizes[this.branding.logo.size] || sizes.medium;
  }

  /**
   * Get logo position CSS
   * @returns {string}
   */
  getLogoPositionCSS() {
    const position = this.branding.logo.position;
    const margin = '20px';

    switch (position) {
      case 'top-left':
        return `top: ${margin}; left: ${margin};`;
      case 'top-right':
        return `top: ${margin}; right: ${margin};`;
      case 'bottom-left':
        return `bottom: ${margin}; left: ${margin};`;
      case 'bottom-right':
        return `bottom: ${margin}; right: ${margin};`;
      case 'center':
        return `top: 50%; left: 50%; transform: translate(-50%, -50%);`;
      default:
        return `top: ${margin}; left: ${margin};`;
    }
  }

  /**
   * Get text size in pixels
   * @returns {number}
   */
  getTextSize() {
    const sizes = { small: 14, medium: 18, large: 24 };
    return sizes[this.branding.text.fontSize] || sizes.medium;
  }

  /**
   * Get text position CSS
   * @returns {string}
   */
  getTextPositionCSS() {
    const position = this.branding.text.position;
    const margin = '20px';

    switch (position) {
      case 'top-left':
        return `top: ${margin}; left: ${margin};`;
      case 'top-right':
        return `top: ${margin}; right: ${margin};`;
      case 'bottom-left':
        return `bottom: ${margin}; left: ${margin};`;
      case 'bottom-right':
        return `bottom: ${margin}; right: ${margin};`;
      case 'center':
        return `top: 50%; left: 50%; transform: translate(-50%, -50%);`;
      default:
        return `bottom: ${margin}; right: ${margin};`;
    }
  }

  /**
   * Escape HTML special characters
   * @param {string} text
   * @returns {string}
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

module.exports = new BrandingManager();
