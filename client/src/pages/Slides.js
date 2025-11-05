import React, { useState } from 'react';
import { slideAPI } from '../services/api';
import {
  Layers,
  Plus,
  Globe,
  Video,
  Cloud,
  Rss,
  Clock,
  Image as ImageIcon,
  Share2,
  Newspaper,
  Code,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import './Slides.css';

// Slide type configurations with user-friendly descriptions
const SLIDE_TYPES = {
  webpage: {
    icon: Globe,
    label: 'Web Page',
    description: 'Display any website or web page',
    color: '#0071E3',
    fields: ['name', 'url', 'duration', 'acceptCookies']
  },
  youtube: {
    icon: Video,
    label: 'YouTube Video',
    description: 'Show YouTube videos or live streams',
    color: '#FF0000',
    fields: ['name', 'url', 'duration', 'loop', 'autoplay']
  },
  weather: {
    icon: Cloud,
    label: 'Weather',
    description: 'Display weather information',
    color: '#34C759',
    fields: ['name', 'duration', 'location', 'units']
  },
  rss: {
    icon: Rss,
    label: 'RSS Feed',
    description: 'Show news or RSS feed content',
    color: '#FF9500',
    fields: ['name', 'url', 'duration', 'maxItems']
  },
  clock: {
    icon: Clock,
    label: 'Clock',
    description: 'Display current time and date',
    color: '#5856D6',
    fields: ['name', 'duration', 'format', 'showDate']
  },
  image: {
    icon: ImageIcon,
    label: 'Image',
    description: 'Show images or photo slideshows',
    color: '#FF2D55',
    fields: ['name', 'duration', 'urls', 'fit']
  },
  social: {
    icon: Share2,
    label: 'Social Media',
    description: 'Display social media feeds',
    color: '#00C7BE',
    fields: ['name', 'url', 'duration', 'platform']
  },
  news: {
    icon: Newspaper,
    label: 'News Headlines',
    description: 'Show latest news headlines',
    color: '#8E8E93',
    fields: ['name', 'duration', 'sources']
  },
  html: {
    icon: Code,
    label: 'Custom HTML',
    description: 'Create custom HTML content',
    color: '#AF52DE',
    fields: ['name', 'duration', 'content']
  }
};

function Slides({ slides }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      duration: 10,
      config: {}
    });
    setSelectedType('');
    setEditingSlide(null);
  };

  // Open create modal
  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setSelectedType(slide.type);
    setFormData({
      name: slide.name,
      type: slide.type,
      duration: slide.duration,
      config: slide.config || {}
    });
    setIsModalOpen(true);
  };

  // Delete slide
  const handleDelete = async (slideId, slideName) => {
    if (!window.confirm(`Are you sure you want to delete "${slideName}"?`)) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await slideAPI.delete(slideId);
      setMessage({ type: 'success', text: `Successfully deleted "${slideName}"` });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to delete: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Save slide (create or update)
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const slideData = {
        name: formData.name,
        type: selectedType,
        duration: parseInt(formData.duration) || 10,
        config: buildConfig()
      };

      if (editingSlide) {
        await slideAPI.update(editingSlide.id, slideData);
        setMessage({ type: 'success', text: 'Slide updated successfully!' });
      } else {
        await slideAPI.create(slideData);
        setMessage({ type: 'success', text: 'Slide created successfully!' });
      }

      setIsModalOpen(false);
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to save: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Build config object based on slide type
  const buildConfig = () => {
    const config = {};

    switch (selectedType) {
      case 'webpage':
        config.url = formData.url;
        if (formData.acceptCookies) config.acceptCookies = true;
        break;

      case 'youtube':
        config.url = formData.youtubeUrl;
        if (formData.loop) config.loop = true;
        if (formData.autoplay !== false) config.autoplay = true;
        break;

      case 'weather':
        config.location = formData.location;
        config.units = formData.units || 'metric';
        break;

      case 'rss':
        config.url = formData.rssUrl;
        config.maxItems = parseInt(formData.maxItems) || 5;
        break;

      case 'clock':
        config.format = formData.format || '24h';
        if (formData.showDate !== false) config.showDate = true;
        break;

      case 'image':
        const urls = formData.imageUrls?.split('\n').filter(u => u.trim());
        config.urls = urls && urls.length > 0 ? urls : [formData.imageUrl];
        config.fit = formData.fit || 'cover';
        break;

      case 'social':
        config.url = formData.socialUrl;
        config.platform = formData.platform || 'twitter';
        break;

      case 'news':
        config.sources = formData.sources?.split(',').map(s => s.trim()) || ['bbc'];
        break;

      case 'html':
        config.content = formData.htmlContent;
        break;

      default:
        break;
    }

    return config;
  };

  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Render type-specific form fields
  const renderTypeFields = () => {
    if (!selectedType) return null;

    const typeConfig = SLIDE_TYPES[selectedType];

    return (
      <div className="form-fields">
        {/* Webpage fields */}
        {selectedType === 'webpage' && (
          <>
            <div className="form-group">
              <label htmlFor="url">
                Website URL <span className="required">*</span>
              </label>
              <input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={formData.url || ''}
                onChange={(e) => updateFormData('url', e.target.value)}
                required
              />
              <small>Enter the full URL of the website you want to display</small>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.acceptCookies || false}
                  onChange={(e) => updateFormData('acceptCookies', e.target.checked)}
                />
                <span>Automatically accept cookie consent dialogs</span>
              </label>
              <small>We'll try to automatically click "Accept" on cookie banners</small>
            </div>
          </>
        )}

        {/* YouTube fields */}
        {selectedType === 'youtube' && (
          <>
            <div className="form-group">
              <label htmlFor="youtubeUrl">
                YouTube URL <span className="required">*</span>
              </label>
              <input
                id="youtubeUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.youtubeUrl || ''}
                onChange={(e) => updateFormData('youtubeUrl', e.target.value)}
                required
              />
              <small>Enter the full YouTube video or live stream URL</small>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.loop !== false}
                  onChange={(e) => updateFormData('loop', e.target.checked)}
                />
                <span>Loop video continuously</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.autoplay !== false}
                  onChange={(e) => updateFormData('autoplay', e.target.checked)}
                />
                <span>Auto-play when displayed</span>
              </label>
            </div>
          </>
        )}

        {/* Weather fields */}
        {selectedType === 'weather' && (
          <>
            <div className="form-group">
              <label htmlFor="location">
                Location <span className="required">*</span>
              </label>
              <input
                id="location"
                type="text"
                placeholder="Amsterdam, Netherlands"
                value={formData.location || ''}
                onChange={(e) => updateFormData('location', e.target.value)}
                required
              />
              <small>Enter city name or "latitude,longitude"</small>
            </div>
            <div className="form-group">
              <label htmlFor="units">Temperature Units</label>
              <select
                id="units"
                value={formData.units || 'metric'}
                onChange={(e) => updateFormData('units', e.target.value)}
              >
                <option value="metric">Celsius (°C)</option>
                <option value="imperial">Fahrenheit (°F)</option>
              </select>
            </div>
          </>
        )}

        {/* RSS fields */}
        {selectedType === 'rss' && (
          <>
            <div className="form-group">
              <label htmlFor="rssUrl">
                RSS Feed URL <span className="required">*</span>
              </label>
              <input
                id="rssUrl"
                type="url"
                placeholder="https://example.com/feed.xml"
                value={formData.rssUrl || ''}
                onChange={(e) => updateFormData('rssUrl', e.target.value)}
                required
              />
              <small>Enter the URL of the RSS or Atom feed</small>
            </div>
            <div className="form-group">
              <label htmlFor="maxItems">Maximum Items to Show</label>
              <input
                id="maxItems"
                type="number"
                min="1"
                max="20"
                placeholder="5"
                value={formData.maxItems || 5}
                onChange={(e) => updateFormData('maxItems', e.target.value)}
              />
              <small>How many feed items to display (1-20)</small>
            </div>
          </>
        )}

        {/* Clock fields */}
        {selectedType === 'clock' && (
          <>
            <div className="form-group">
              <label htmlFor="format">Time Format</label>
              <select
                id="format"
                value={formData.format || '24h'}
                onChange={(e) => updateFormData('format', e.target.value)}
              >
                <option value="24h">24-hour (14:30)</option>
                <option value="12h">12-hour (2:30 PM)</option>
              </select>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.showDate !== false}
                  onChange={(e) => updateFormData('showDate', e.target.checked)}
                />
                <span>Show date below time</span>
              </label>
            </div>
          </>
        )}

        {/* Image fields */}
        {selectedType === 'image' && (
          <>
            <div className="form-group">
              <label htmlFor="imageUrls">
                Image URL(s) <span className="required">*</span>
              </label>
              <textarea
                id="imageUrls"
                rows="4"
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                value={formData.imageUrls || formData.imageUrl || ''}
                onChange={(e) => updateFormData('imageUrls', e.target.value)}
                required
              />
              <small>Enter one or more image URLs (one per line for slideshow)</small>
            </div>
            <div className="form-group">
              <label htmlFor="fit">Image Fit</label>
              <select
                id="fit"
                value={formData.fit || 'cover'}
                onChange={(e) => updateFormData('fit', e.target.value)}
              >
                <option value="cover">Cover (fill screen)</option>
                <option value="contain">Contain (fit within screen)</option>
                <option value="fill">Fill (stretch to fit)</option>
              </select>
            </div>
          </>
        )}

        {/* Social fields */}
        {selectedType === 'social' && (
          <>
            <div className="form-group">
              <label htmlFor="platform">Platform</label>
              <select
                id="platform"
                value={formData.platform || 'twitter'}
                onChange={(e) => updateFormData('platform', e.target.value)}
              >
                <option value="twitter">Twitter / X</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="socialUrl">
                Profile or Post URL <span className="required">*</span>
              </label>
              <input
                id="socialUrl"
                type="url"
                placeholder="https://twitter.com/username"
                value={formData.socialUrl || ''}
                onChange={(e) => updateFormData('socialUrl', e.target.value)}
                required
              />
              <small>Enter the URL of the profile or specific post</small>
            </div>
          </>
        )}

        {/* News fields */}
        {selectedType === 'news' && (
          <div className="form-group">
            <label htmlFor="sources">
              News Sources <span className="required">*</span>
            </label>
            <input
              id="sources"
              type="text"
              placeholder="bbc, cnn, reuters"
              value={formData.sources || 'bbc'}
              onChange={(e) => updateFormData('sources', e.target.value)}
              required
            />
            <small>Enter comma-separated news source codes (e.g., bbc, cnn, reuters)</small>
          </div>
        )}

        {/* HTML fields */}
        {selectedType === 'html' && (
          <div className="form-group">
            <label htmlFor="htmlContent">
              HTML Content <span className="required">*</span>
            </label>
            <textarea
              id="htmlContent"
              rows="8"
              placeholder="<div><h1>Hello World</h1></div>"
              value={formData.htmlContent || ''}
              onChange={(e) => updateFormData('htmlContent', e.target.value)}
              required
            />
            <small>Enter custom HTML code to display</small>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page slides-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Slides</h1>
          <p className="page-description">
            Create and manage content slides for your presentations
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Plus size={18} />
          Create Slide
        </button>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`message message-${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* Slides Grid */}
      {slides.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">
            <Layers size={48} />
          </div>
          <h4 className="empty-state-title">No Slides Yet</h4>
          <p className="empty-state-description">
            Create your first slide to get started with narrowcasting
          </p>
          <button className="btn btn-primary" onClick={handleCreate}>
            <Plus size={18} />
            Create Your First Slide
          </button>
        </div>
      ) : (
        <div className="grid grid-3">
          {slides.map((slide) => {
            const typeConfig = SLIDE_TYPES[slide.type] || SLIDE_TYPES.html;
            const Icon = typeConfig.icon;

            return (
              <div key={slide.id} className="slide-card card">
                <div className="slide-header">
                  <div
                    className="slide-icon"
                    style={{ backgroundColor: `${typeConfig.color}15`, color: typeConfig.color }}
                  >
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div className="slide-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(slide)}
                      title="Edit slide"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-icon btn-icon-danger"
                      onClick={() => handleDelete(slide.id, slide.name)}
                      title="Delete slide"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="slide-body">
                  <h4 className="slide-name">{slide.name}</h4>
                  <div className="slide-meta">
                    <span className="badge" style={{ backgroundColor: typeConfig.color }}>
                      {typeConfig.label}
                    </span>
                    <span className="slide-duration">{slide.duration}s</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingSlide ? 'Edit Slide' : 'Create New Slide'}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                {/* Basic Fields */}
                <div className="form-group">
                  <label htmlFor="name">
                    Slide Name <span className="required">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g., Office Welcome Screen"
                    value={formData.name || ''}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    required
                  />
                  <small>Give your slide a descriptive name</small>
                </div>

                <div className="form-group">
                  <label htmlFor="duration">
                    Duration (seconds) <span className="required">*</span>
                  </label>
                  <input
                    id="duration"
                    type="number"
                    min="1"
                    max="3600"
                    placeholder="10"
                    value={formData.duration || 10}
                    onChange={(e) => updateFormData('duration', e.target.value)}
                    required
                  />
                  <small>How long to display this slide (1-3600 seconds)</small>
                </div>

                {/* Slide Type Selection */}
                {!editingSlide && (
                  <div className="form-group">
                    <label htmlFor="type">
                      Slide Type <span className="required">*</span>
                    </label>
                    <div className="type-grid">
                      {Object.entries(SLIDE_TYPES).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <button
                            key={key}
                            type="button"
                            className={`type-option ${selectedType === key ? 'selected' : ''}`}
                            onClick={() => setSelectedType(key)}
                          >
                            <Icon size={20} color={config.color} />
                            <span>{config.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    {selectedType && (
                      <small style={{ display: 'block', marginTop: '8px' }}>
                        {SLIDE_TYPES[selectedType].description}
                      </small>
                    )}
                  </div>
                )}

                {/* Type-specific fields */}
                {renderTypeFields()}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !selectedType}
                >
                  {loading ? 'Saving...' : editingSlide ? 'Save Changes' : 'Create Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Slides;
