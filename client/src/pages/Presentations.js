import React, { useState } from 'react';
import { presentationAPI } from '../services/api';
import {
  Presentation as PresentationIcon,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  Globe,
  Video,
  Cloud,
  Rss,
  Clock,
  Image as ImageIcon,
  Share2,
  Newspaper,
  Code,
  Palette,
  Layers
} from 'lucide-react';
import './Presentations.css';

// Slide type icon mapping
const SLIDE_TYPE_ICONS = {
  webpage: Globe,
  youtube: Video,
  weather: Cloud,
  rss: Rss,
  clock: Clock,
  image: ImageIcon,
  social: Share2,
  news: Newspaper,
  html: Code
};

// Slide type color mapping
const SLIDE_TYPE_COLORS = {
  webpage: '#0071E3',
  youtube: '#FF0000',
  weather: '#34C759',
  rss: '#FF9500',
  clock: '#5856D6',
  image: '#FF2D55',
  social: '#00C7BE',
  news: '#8E8E93',
  html: '#AF52DE'
};

function Presentations({ presentations, slides, devices }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPresentation, setEditingPresentation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slides: [],
    branding: { enabled: false, text: '', position: 'bottom-right' }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectedSlideId, setSelectedSlideId] = useState('');

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      slides: [],
      branding: { enabled: false, text: '', position: 'bottom-right' }
    });
    setSelectedSlideId('');
    setEditingPresentation(null);
  };

  // Open create modal
  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEdit = (presentation) => {
    setEditingPresentation(presentation);
    setFormData({
      name: presentation.name,
      description: presentation.description || '',
      slides: presentation.slides || [],
      branding: presentation.branding || { enabled: false, text: '', position: 'bottom-right' }
    });
    setIsModalOpen(true);
  };

  // Delete presentation
  const handleDelete = async (presentationId, presentationName) => {
    if (!window.confirm(`Are you sure you want to delete "${presentationName}"?`)) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await presentationAPI.delete(presentationId);
      setMessage({ type: 'success', text: `Successfully deleted "${presentationName}"` });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to delete: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Save presentation
  const handleSave = async (e) => {
    e.preventDefault();

    if (formData.slides.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one slide to the presentation' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const presentationData = {
        name: formData.name,
        description: formData.description,
        slides: formData.slides,
        branding: formData.branding.enabled ? formData.branding : { enabled: false }
      };

      if (editingPresentation) {
        await presentationAPI.update(editingPresentation.id, presentationData);
        setMessage({ type: 'success', text: 'Presentation updated successfully!' });
      } else {
        await presentationAPI.create(presentationData);
        setMessage({ type: 'success', text: 'Presentation created successfully!' });
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

  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Update branding
  const updateBranding = (field, value) => {
    setFormData(prev => ({
      ...prev,
      branding: { ...prev.branding, [field]: value }
    }));
  };

  // Add slide to presentation
  const handleAddSlide = () => {
    if (!selectedSlideId) return;

    const slide = slides.find(s => s.id === selectedSlideId);
    if (!slide) return;

    const newSlide = {
      slideId: slide.id,
      duration: slide.duration
    };

    setFormData(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide]
    }));
    setSelectedSlideId('');
  };

  // Remove slide from presentation
  const handleRemoveSlide = (index) => {
    setFormData(prev => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index)
    }));
  };

  // Move slide up
  const handleMoveSlideUp = (index) => {
    if (index === 0) return;

    setFormData(prev => {
      const newSlides = [...prev.slides];
      [newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]];
      return { ...prev, slides: newSlides };
    });
  };

  // Move slide down
  const handleMoveSlideDown = (index) => {
    if (index === formData.slides.length - 1) return;

    setFormData(prev => {
      const newSlides = [...prev.slides];
      [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
      return { ...prev, slides: newSlides };
    });
  };

  // Update slide duration
  const handleUpdateSlideDuration = (index, duration) => {
    setFormData(prev => ({
      ...prev,
      slides: prev.slides.map((s, i) => i === index ? { ...s, duration: parseInt(duration) } : s)
    }));
  };

  // Get slide details by ID
  const getSlideDetails = (slideId) => {
    return slides.find(s => s.id === slideId);
  };

  // Calculate total duration
  const getTotalDuration = () => {
    return formData.slides.reduce((total, slide) => total + (slide.duration || 0), 0);
  };

  // Get available slides (not already in presentation)
  const getAvailableSlides = () => {
    const usedSlideIds = formData.slides.map(s => s.slideId);
    return slides.filter(s => !usedSlideIds.includes(s.id));
  };

  return (
    <div className="page presentations-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Presentations</h1>
          <p className="page-description">
            Create and manage multi-slide presentations for your displays
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate} disabled={slides.length === 0}>
          <Plus size={18} />
          Create Presentation
        </button>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`message message-${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* No Slides Warning */}
      {slides.length === 0 && (
        <div className="warning-banner card">
          <AlertCircle size={20} />
          <div>
            <strong>No slides available</strong>
            <p>You need to create some slides before you can build presentations. Visit the Slides page to get started.</p>
          </div>
        </div>
      )}

      {/* Presentations Grid */}
      {presentations.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">
            <PresentationIcon size={48} />
          </div>
          <h4 className="empty-state-title">No Presentations Yet</h4>
          <p className="empty-state-description">
            Create your first presentation by combining multiple slides
          </p>
          {slides.length > 0 && (
            <button className="btn btn-primary" onClick={handleCreate}>
              <Plus size={18} />
              Create Your First Presentation
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-2">
          {presentations.map((presentation) => {
            const totalDuration = presentation.slides?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0;
            const slideCount = presentation.slides?.length || 0;

            return (
              <div key={presentation.id} className="presentation-card card">
                <div className="presentation-header">
                  <div className="presentation-icon">
                    <PresentationIcon size={24} strokeWidth={1.5} />
                  </div>
                  <div className="presentation-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(presentation)}
                      title="Edit presentation"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-icon btn-icon-danger"
                      onClick={() => handleDelete(presentation.id, presentation.name)}
                      title="Delete presentation"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="presentation-body">
                  <h4 className="presentation-name">{presentation.name}</h4>
                  {presentation.description && (
                    <p className="presentation-description">{presentation.description}</p>
                  )}

                  <div className="presentation-meta">
                    <span className="meta-item">
                      <Layers size={14} />
                      {slideCount} {slideCount === 1 ? 'slide' : 'slides'}
                    </span>
                    <span className="meta-item">
                      <Clock size={14} />
                      {Math.floor(totalDuration / 60)}:{String(totalDuration % 60).padStart(2, '0')}
                    </span>
                  </div>

                  {presentation.branding?.enabled && (
                    <div className="presentation-branding">
                      <Palette size={14} />
                      <span>Branded: {presentation.branding.text}</span>
                    </div>
                  )}
                </div>

                <div className="presentation-preview">
                  {presentation.slides?.slice(0, 4).map((slide, index) => {
                    const slideDetails = getSlideDetails(slide.slideId);
                    if (!slideDetails) return null;

                    const Icon = SLIDE_TYPE_ICONS[slideDetails.type] || Code;
                    const color = SLIDE_TYPE_COLORS[slideDetails.type] || '#8E8E93';

                    return (
                      <div
                        key={index}
                        className="preview-slide"
                        style={{ borderLeftColor: color }}
                        title={slideDetails.name}
                      >
                        <Icon size={12} color={color} />
                        <span className="preview-slide-duration">{slide.duration}s</span>
                      </div>
                    );
                  })}
                  {presentation.slides?.length > 4 && (
                    <div className="preview-more">
                      +{presentation.slides.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPresentation ? 'Edit Presentation' : 'Create New Presentation'}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                {/* Basic Info */}
                <div className="form-section">
                  <h4>Basic Information</h4>

                  <div className="form-group">
                    <label htmlFor="name">
                      Presentation Name <span className="required">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="e.g., Reception Display Loop"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description (Optional)</label>
                    <textarea
                      id="description"
                      rows="2"
                      placeholder="Brief description of this presentation"
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                    />
                  </div>
                </div>

                {/* Slide Builder */}
                <div className="form-section">
                  <h4>Slides</h4>

                  <div className="slide-builder">
                    <div className="add-slide-control">
                      <select
                        value={selectedSlideId}
                        onChange={(e) => setSelectedSlideId(e.target.value)}
                        disabled={getAvailableSlides().length === 0}
                      >
                        <option value="">
                          {getAvailableSlides().length === 0 ? 'No more slides available' : 'Select a slide to add'}
                        </option>
                        {getAvailableSlides().map((slide) => (
                          <option key={slide.id} value={slide.id}>
                            {slide.name} ({slide.type}) - {slide.duration}s
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleAddSlide}
                        disabled={!selectedSlideId}
                      >
                        <Plus size={16} />
                        Add Slide
                      </button>
                    </div>

                    {formData.slides.length === 0 ? (
                      <div className="slides-empty">
                        <Layers size={32} />
                        <p>No slides added yet. Select a slide above to get started.</p>
                      </div>
                    ) : (
                      <>
                        <div className="slides-list">
                          {formData.slides.map((slide, index) => {
                            const slideDetails = getSlideDetails(slide.slideId);
                            if (!slideDetails) return null;

                            const Icon = SLIDE_TYPE_ICONS[slideDetails.type] || Code;
                            const color = SLIDE_TYPE_COLORS[slideDetails.type] || '#8E8E93';

                            return (
                              <div key={index} className="slide-item">
                                <div className="slide-item-number">{index + 1}</div>
                                <div
                                  className="slide-item-icon"
                                  style={{ backgroundColor: `${color}15`, color }}
                                >
                                  <Icon size={16} />
                                </div>
                                <div className="slide-item-content">
                                  <div className="slide-item-name">{slideDetails.name}</div>
                                  <div className="slide-item-type">{slideDetails.type}</div>
                                </div>
                                <div className="slide-item-duration">
                                  <input
                                    type="number"
                                    min="1"
                                    max="3600"
                                    value={slide.duration}
                                    onChange={(e) => handleUpdateSlideDuration(index, e.target.value)}
                                  />
                                  <span>s</span>
                                </div>
                                <div className="slide-item-actions">
                                  <button
                                    type="button"
                                    className="btn-icon-sm"
                                    onClick={() => handleMoveSlideUp(index)}
                                    disabled={index === 0}
                                    title="Move up"
                                  >
                                    <ChevronUp size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-icon-sm"
                                    onClick={() => handleMoveSlideDown(index)}
                                    disabled={index === formData.slides.length - 1}
                                    title="Move down"
                                  >
                                    <ChevronDown size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-icon-sm btn-icon-danger"
                                    onClick={() => handleRemoveSlide(index)}
                                    title="Remove slide"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="slides-summary">
                          <strong>Total Duration:</strong> {Math.floor(getTotalDuration() / 60)}m {getTotalDuration() % 60}s
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Branding */}
                <div className="form-section">
                  <h4>
                    <Palette size={18} />
                    Branding
                  </h4>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.branding.enabled}
                        onChange={(e) => updateBranding('enabled', e.target.checked)}
                      />
                      <span>Enable branding overlay</span>
                    </label>
                    <small>Add a custom branded overlay to all slides in this presentation</small>
                  </div>

                  {formData.branding.enabled && (
                    <>
                      <div className="form-group">
                        <label htmlFor="brandingText">Branding Text</label>
                        <input
                          id="brandingText"
                          type="text"
                          placeholder="e.g., Your Company Name"
                          value={formData.branding.text}
                          onChange={(e) => updateBranding('text', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="brandingPosition">Position</label>
                        <select
                          id="brandingPosition"
                          value={formData.branding.position}
                          onChange={(e) => updateBranding('position', e.target.value)}
                        >
                          <option value="top-left">Top Left</option>
                          <option value="top-right">Top Right</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="bottom-right">Bottom Right</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
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
                  disabled={loading || formData.slides.length === 0}
                >
                  {loading ? 'Saving...' : editingPresentation ? 'Save Changes' : 'Create Presentation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Presentations;
