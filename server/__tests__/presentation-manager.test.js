/**
 * Unit Tests for PresentationManager
 *
 * Run with: npm test
 */

const PresentationManager = require('../presentation-manager');
const SlideManager = require('../slide-manager');

describe('PresentationManager', () => {
  let presentationManager;
  let slideManager;
  let testSlide1, testSlide2;

  beforeEach(() => {
    slideManager = new SlideManager();
    presentationManager = new PresentationManager(slideManager);

    // Clear data
    presentationManager.presentations = new Map();
    slideManager.slides = new Map();

    // Create test slides
    testSlide1 = slideManager.createSlide({
      name: 'Test Slide 1',
      type: 'clock',
      duration: 30
    });

    testSlide2 = slideManager.createSlide({
      name: 'Test Slide 2',
      type: 'clock',
      duration: 60
    });
  });

  describe('createPresentation', () => {
    it('should create a valid presentation with slides', () => {
      const presentationData = {
        name: 'Test Presentation',
        slides: [
          { slideId: testSlide1.id, duration: 30 },
          { slideId: testSlide2.id, duration: 60 }
        ],
        loop: true
      };

      const presentation = presentationManager.createPresentation(presentationData);

      expect(presentation).toHaveProperty('id');
      expect(presentation.name).toBe('Test Presentation');
      expect(presentation.slides).toHaveLength(2);
      expect(presentation.loop).toBe(true);
      expect(presentation).toHaveProperty('createdAt');
    });

    it('should throw error for missing name', () => {
      const invalid = {
        slides: [{ slideId: testSlide1.id, duration: 30 }]
      };

      expect(() => {
        presentationManager.createPresentation(invalid);
      }).toThrow(/name is required/);
    });

    it('should throw error for empty slides array', () => {
      const invalid = {
        name: 'Empty Presentation',
        slides: []
      };

      expect(() => {
        presentationManager.createPresentation(invalid);
      }).toThrow(/must have at least one slide/);
    });

    it('should create presentation with default loop = false', () => {
      const presentationData = {
        name: 'No Loop',
        slides: [{ slideId: testSlide1.id, duration: 30 }]
      };

      const presentation = presentationManager.createPresentation(presentationData);
      expect(presentation.loop).toBe(false);
    });
  });

  describe('getPresentation', () => {
    it('should retrieve existing presentation', () => {
      const created = presentationManager.createPresentation({
        name: 'Test',
        slides: [{ slideId: testSlide1.id, duration: 30 }]
      });

      const retrieved = presentationManager.getPresentation(created.id);
      expect(retrieved).toEqual(created);
    });

    it('should return null for non-existent presentation', () => {
      const result = presentationManager.getPresentation('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('getAllPresentations', () => {
    it('should return empty array when no presentations exist', () => {
      const presentations = presentationManager.getAllPresentations();
      expect(presentations).toEqual([]);
    });

    it('should return all created presentations', () => {
      presentationManager.createPresentation({
        name: 'Presentation 1',
        slides: [{ slideId: testSlide1.id, duration: 30 }]
      });
      presentationManager.createPresentation({
        name: 'Presentation 2',
        slides: [{ slideId: testSlide2.id, duration: 60 }]
      });

      const presentations = presentationManager.getAllPresentations();
      expect(presentations).toHaveLength(2);
    });
  });

  describe('getPresentationWithSlides', () => {
    it('should include full slide details', () => {
      const presentation = presentationManager.createPresentation({
        name: 'With Slides',
        slides: [
          { slideId: testSlide1.id, duration: 30 },
          { slideId: testSlide2.id, duration: 60 }
        ]
      });

      const withSlides = presentationManager.getPresentationWithSlides(presentation.id);

      expect(withSlides.slides[0]).toHaveProperty('slideDetails');
      expect(withSlides.slides[0].slideDetails.name).toBe('Test Slide 1');
      expect(withSlides.slides[1].slideDetails.name).toBe('Test Slide 2');
    });

    it('should handle missing slide gracefully', () => {
      const presentation = presentationManager.createPresentation({
        name: 'Missing Slide',
        slides: [{ slideId: 'non-existent-id', duration: 30 }]
      });

      const withSlides = presentationManager.getPresentationWithSlides(presentation.id);
      expect(withSlides.slides[0].slideDetails).toBeNull();
    });
  });

  describe('updatePresentation', () => {
    it('should update existing presentation', () => {
      const original = presentationManager.createPresentation({
        name: 'Original',
        slides: [{ slideId: testSlide1.id, duration: 30 }]
      });

      const updated = presentationManager.updatePresentation(original.id, {
        name: 'Updated Name',
        loop: true
      });

      expect(updated.name).toBe('Updated Name');
      expect(updated.loop).toBe(true);
      expect(updated).toHaveProperty('updatedAt');
    });

    it('should throw error for non-existent presentation', () => {
      expect(() => {
        presentationManager.updatePresentation('non-existent-id', { name: 'Test' });
      }).toThrow();
    });
  });

  describe('deletePresentation', () => {
    it('should delete existing presentation', () => {
      const presentation = presentationManager.createPresentation({
        name: 'To Delete',
        slides: [{ slideId: testSlide1.id, duration: 30 }]
      });

      const result = presentationManager.deletePresentation(presentation.id);
      expect(result).toBe(true);

      const retrieved = presentationManager.getPresentation(presentation.id);
      expect(retrieved).toBeNull();
    });

    it('should return false for non-existent presentation', () => {
      const result = presentationManager.deletePresentation('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('getStatistics', () => {
    it('should return correct statistics', () => {
      presentationManager.createPresentation({
        name: 'P1',
        slides: [{ slideId: testSlide1.id, duration: 30 }]
      });
      presentationManager.createPresentation({
        name: 'P2',
        slides: [{ slideId: testSlide2.id, duration: 60 }]
      });

      const stats = presentationManager.getStatistics();

      expect(stats.totalPresentations).toBe(2);
      expect(stats).toHaveProperty('averageSlidesPerPresentation');
    });
  });
});
