/**
 * Unit Tests for SlideManager
 *
 * Run with: npm test
 */

const SlideManager = require('../slide-manager');

describe('SlideManager', () => {
  let slideManager;

  beforeEach(() => {
    slideManager = new SlideManager();
    // Clear any existing slides
    slideManager.slides = new Map();
  });

  describe('createSlide', () => {
    it('should create a valid webpage slide', () => {
      const slideData = {
        name: 'Test Website',
        type: 'webpage',
        url: 'https://example.com',
        duration: 30
      };

      const slide = slideManager.createSlide(slideData);

      expect(slide).toHaveProperty('id');
      expect(slide.name).toBe('Test Website');
      expect(slide.type).toBe('webpage');
      expect(slide.url).toBe('https://example.com');
      expect(slide.duration).toBe(30);
      expect(slide).toHaveProperty('createdAt');
    });

    it('should throw error for missing required fields', () => {
      const invalidSlide = {
        name: 'Invalid Slide'
        // Missing type
      };

      expect(() => {
        slideManager.createSlide(invalidSlide);
      }).toThrow();
    });

    it('should throw error for invalid slide type', () => {
      const invalidSlide = {
        name: 'Invalid Type',
        type: 'invalid-type',
        duration: 30
      };

      expect(() => {
        slideManager.createSlide(invalidSlide);
      }).toThrow(/Invalid slide type/);
    });

    it('should create a clock slide with default duration', () => {
      const slideData = {
        name: 'Clock',
        type: 'clock'
      };

      const slide = slideManager.createSlide(slideData);

      expect(slide.duration).toBe(60); // Default duration
    });
  });

  describe('getSlide', () => {
    it('should retrieve an existing slide by ID', () => {
      const slideData = {
        name: 'Test Slide',
        type: 'clock',
        duration: 30
      };

      const created = slideManager.createSlide(slideData);
      const retrieved = slideManager.getSlide(created.id);

      expect(retrieved).toEqual(created);
    });

    it('should return null for non-existent slide', () => {
      const result = slideManager.getSlide('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('getAllSlides', () => {
    it('should return empty array when no slides exist', () => {
      const slides = slideManager.getAllSlides();
      expect(slides).toEqual([]);
    });

    it('should return all created slides', () => {
      slideManager.createSlide({ name: 'Slide 1', type: 'clock', duration: 30 });
      slideManager.createSlide({ name: 'Slide 2', type: 'clock', duration: 60 });

      const slides = slideManager.getAllSlides();
      expect(slides).toHaveLength(2);
    });
  });

  describe('getSlidesByType', () => {
    beforeEach(() => {
      slideManager.createSlide({ name: 'Web 1', type: 'webpage', url: 'https://example.com', duration: 30 });
      slideManager.createSlide({ name: 'Clock 1', type: 'clock', duration: 60 });
      slideManager.createSlide({ name: 'Web 2', type: 'webpage', url: 'https://test.com', duration: 30 });
    });

    it('should return slides filtered by type', () => {
      const webSlides = slideManager.getSlidesByType('webpage');
      expect(webSlides).toHaveLength(2);
      expect(webSlides.every(s => s.type === 'webpage')).toBe(true);
    });

    it('should return empty array for unused type', () => {
      const youtubeSlides = slideManager.getSlidesByType('youtube');
      expect(youtubeSlides).toEqual([]);
    });
  });

  describe('updateSlide', () => {
    it('should update existing slide', () => {
      const original = slideManager.createSlide({
        name: 'Original Name',
        type: 'clock',
        duration: 30
      });

      const updated = slideManager.updateSlide(original.id, {
        name: 'Updated Name',
        duration: 60
      });

      expect(updated.name).toBe('Updated Name');
      expect(updated.duration).toBe(60);
      expect(updated.id).toBe(original.id);
      expect(updated).toHaveProperty('updatedAt');
    });

    it('should throw error when updating non-existent slide', () => {
      expect(() => {
        slideManager.updateSlide('non-existent-id', { name: 'Test' });
      }).toThrow();
    });
  });

  describe('deleteSlide', () => {
    it('should delete existing slide', () => {
      const slide = slideManager.createSlide({
        name: 'To Delete',
        type: 'clock',
        duration: 30
      });

      const result = slideManager.deleteSlide(slide.id);
      expect(result).toBe(true);

      const retrieved = slideManager.getSlide(slide.id);
      expect(retrieved).toBeNull();
    });

    it('should return false when deleting non-existent slide', () => {
      const result = slideManager.deleteSlide('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('validateSlideData', () => {
    it('should accept valid webpage slide data', () => {
      const valid = {
        name: 'Test',
        type: 'webpage',
        url: 'https://example.com',
        duration: 30
      };

      expect(() => slideManager.validateSlideData(valid)).not.toThrow();
    });

    it('should accept valid YouTube slide data', () => {
      const valid = {
        name: 'YouTube Video',
        type: 'youtube',
        videoId: 'dQw4w9WgXcQ',
        duration: 180
      };

      expect(() => slideManager.validateSlideData(valid)).not.toThrow();
    });

    it('should reject slides with missing name', () => {
      const invalid = {
        type: 'clock',
        duration: 30
      };

      expect(() => slideManager.validateSlideData(invalid)).toThrow(/name is required/);
    });
  });
});
