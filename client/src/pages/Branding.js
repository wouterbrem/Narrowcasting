import React, { useState, useEffect } from 'react';
import { brandingAPI } from '../services/api';
import {
  Palette,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Type,
  Eye
} from 'lucide-react';
import './Branding.css';

function Branding() {
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Load branding on mount
  useEffect(() => {
    loadBranding();
  }, []);

  const loadBranding = async () => {
    try {
      const data = await brandingAPI.get();
      setBranding(data);
      if (data.logo.url) {
        setLogoPreview(data.logo.url);
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to load branding: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Upload logo if selected
      if (logoFile) {
        const logoUrl = await brandingAPI.uploadLogo(logoFile);
        branding.logo.url = logoUrl;
        branding.logo.enabled = true;
      }

      // Update branding
      const updated = await brandingAPI.update(branding);
      setBranding(updated);
      setMessage({ type: 'success', text: 'Branding updated successfully!' });
      setLogoFile(null);

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to update branding: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoDelete = async () => {
    if (!window.confirm('Are you sure you want to delete the logo?')) return;

    try {
      await brandingAPI.deleteLogo();
      setBranding(prev => ({
        ...prev,
        logo: { ...prev.logo, url: null, enabled: false }
      }));
      setLogoPreview(null);
      setLogoFile(null);
      setMessage({ type: 'success', text: 'Logo deleted successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to delete logo: ${error.message}` });
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all branding to default?')) return;

    try {
      const defaultBranding = await brandingAPI.reset();
      setBranding(defaultBranding);
      setLogoPreview(null);
      setLogoFile(null);
      setMessage({ type: 'success', text: 'Branding reset to default!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to reset branding: ${error.message}` });
    }
  };

  const updateBranding = (path, value) => {
    setBranding(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="page branding-page">
        <div className="loading-state">
          <RefreshCw size={32} className="spinning" />
          <p>Loading branding configuration...</p>
        </div>
      </div>
    );
  }

  if (!branding) {
    return (
      <div className="page branding-page">
        <div className="error-state">
          <AlertCircle size={48} />
          <p>Failed to load branding configuration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page branding-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Brand Customization</h1>
          <p className="page-description">
            Customize your narrowcasting displays with your brand logo and colors
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleReset}>
            <RefreshCw size={18} />
            Reset to Default
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`message message-${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      <div className="branding-grid">
        {/* Logo Section */}
        <div className="branding-card card">
          <h3>
            <ImageIcon size={20} />
            Logo
          </h3>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={branding.logo.enabled}
                onChange={(e) => updateBranding('logo.enabled', e.target.checked)}
              />
              <span>Show logo on displays</span>
            </label>
          </div>

          {branding.logo.enabled && (
            <>
              <div className="logo-upload">
                {logoPreview ? (
                  <div className="logo-preview">
                    <img src={logoPreview} alt="Logo preview" />
                    <button className="btn-icon-danger" onClick={handleLogoDelete}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="upload-area">
                    <Upload size={32} />
                    <span>Click to upload logo</span>
                    <small>PNG, JPG, or SVG (max 5MB)</small>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoSelect}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              <div className="form-group">
                <label>Logo Position</label>
                <select
                  value={branding.logo.position}
                  onChange={(e) => updateBranding('logo.position', e.target.value)}
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="center">Center</option>
                </select>
              </div>

              <div className="form-group">
                <label>Logo Size</label>
                <select
                  value={branding.logo.size}
                  onChange={(e) => updateBranding('logo.size', e.target.value)}
                >
                  <option value="small">Small (80px)</option>
                  <option value="medium">Medium (120px)</option>
                  <option value="large">Large (180px)</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Colors Section */}
        <div className="branding-card card">
          <h3>
            <Palette size={20} />
            Brand Colors
          </h3>

          <div className="color-group">
            <label>Primary Color</label>
            <div className="color-input">
              <input
                type="color"
                value={branding.colors.primary}
                onChange={(e) => updateBranding('colors.primary', e.target.value)}
              />
              <input
                type="text"
                value={branding.colors.primary}
                onChange={(e) => updateBranding('colors.primary', e.target.value)}
                placeholder="#0071E3"
              />
            </div>
          </div>

          <div className="color-group">
            <label>Secondary Color</label>
            <div className="color-input">
              <input
                type="color"
                value={branding.colors.secondary}
                onChange={(e) => updateBranding('colors.secondary', e.target.value)}
              />
              <input
                type="text"
                value={branding.colors.secondary}
                onChange={(e) => updateBranding('colors.secondary', e.target.value)}
                placeholder="#34C759"
              />
            </div>
          </div>

          <div className="color-group">
            <label>Background Color</label>
            <div className="color-input">
              <input
                type="color"
                value={branding.colors.background}
                onChange={(e) => updateBranding('colors.background', e.target.value)}
              />
              <input
                type="text"
                value={branding.colors.background}
                onChange={(e) => updateBranding('colors.background', e.target.value)}
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          <div className="color-group">
            <label>Text Color</label>
            <div className="color-input">
              <input
                type="color"
                value={branding.colors.text}
                onChange={(e) => updateBranding('colors.text', e.target.value)}
              />
              <input
                type="text"
                value={branding.colors.text}
                onChange={(e) => updateBranding('colors.text', e.target.value)}
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="color-group">
            <label>Accent Color</label>
            <div className="color-input">
              <input
                type="color"
                value={branding.colors.accent}
                onChange={(e) => updateBranding('colors.accent', e.target.value)}
              />
              <input
                type="text"
                value={branding.colors.accent}
                onChange={(e) => updateBranding('colors.accent', e.target.value)}
                placeholder="#FF9500"
              />
            </div>
          </div>
        </div>

        {/* Text Overlay Section */}
        <div className="branding-card card">
          <h3>
            <Type size={20} />
            Text Overlay
          </h3>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={branding.text.enabled}
                onChange={(e) => updateBranding('text.enabled', e.target.checked)}
              />
              <span>Show text overlay</span>
            </label>
            <small>Add a branded text overlay to your displays</small>
          </div>

          {branding.text.enabled && (
            <>
              <div className="form-group">
                <label>Text Content</label>
                <input
                  type="text"
                  value={branding.text.content}
                  onChange={(e) => updateBranding('text.content', e.target.value)}
                  placeholder="e.g., Your Company Name"
                />
              </div>

              <div className="form-group">
                <label>Text Position</label>
                <select
                  value={branding.text.position}
                  onChange={(e) => updateBranding('text.position', e.target.value)}
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="center">Center</option>
                </select>
              </div>

              <div className="form-group">
                <label>Text Size</label>
                <select
                  value={branding.text.fontSize}
                  onChange={(e) => updateBranding('text.fontSize', e.target.value)}
                >
                  <option value="small">Small (14px)</option>
                  <option value="medium">Medium (18px)</option>
                  <option value="large">Large (24px)</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Preview Section */}
        <div className="branding-card card branding-preview">
          <h3>
            <Eye size={20} />
            Preview
          </h3>

          <div className="preview-container" style={{ background: branding.colors.background }}>
            {branding.logo.enabled && logoPreview && (
              <img
                src={logoPreview}
                alt="Logo"
                className={`preview-logo preview-logo-${branding.logo.position} preview-logo-${branding.logo.size}`}
              />
            )}

            {branding.text.enabled && branding.text.content && (
              <div
                className={`preview-text preview-text-${branding.text.position} preview-text-${branding.text.fontSize}`}
                style={{
                  color: branding.colors.text,
                  background: branding.colors.background
                }}
              >
                {branding.text.content}
              </div>
            )}

            <div className="preview-sample" style={{ color: branding.colors.text }}>
              <h4 style={{ color: branding.colors.primary }}>Sample Content</h4>
              <p>This is how your branding will appear on presentations.</p>
              <button
                className="preview-button"
                style={{
                  background: branding.colors.primary,
                  color: branding.colors.background
                }}
              >
                Sample Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Branding;
