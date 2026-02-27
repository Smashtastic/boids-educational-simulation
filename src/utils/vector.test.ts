import { describe, it, expect } from 'vitest';
import {
  type Vector2D,
  addVectors,
  subtractVectors,
  distanceBetweenVectors,
  lengthVector,
  normaliseVector,
  limitVector,
} from './vector';

describe('Vector2D Utility Functions', () => {
  describe('addVectors', () => {
    it('should add two positive vectors correctly', () => {
      const v1: Vector2D = { x: 3, y: 4 };
      const v2: Vector2D = { x: 1, y: 2 };
      const result = addVectors(v1, v2);
      
      expect(result).toEqual({ x: 4, y: 6 });
    });

    it('should add vectors with negative values', () => {
      const v1: Vector2D = { x: -3, y: 4 };
      const v2: Vector2D = { x: 1, y: -2 };
      const result = addVectors(v1, v2);
      
      expect(result).toEqual({ x: -2, y: 2 });
    });

    it('should handle zero vectors', () => {
      const v1: Vector2D = { x: 0, y: 0 };
      const v2: Vector2D = { x: 5, y: 3 };
      const result = addVectors(v1, v2);
      
      expect(result).toEqual({ x: 5, y: 3 });
    });

    it('should handle decimal values', () => {
      const v1: Vector2D = { x: 1.5, y: 2.7 };
      const v2: Vector2D = { x: 0.5, y: 0.3 };
      const result = addVectors(v1, v2);
      
      expect(result.x).toBeCloseTo(2.0);
      expect(result.y).toBeCloseTo(3.0);
    });
  });

  describe('subtractVectors', () => {
    it('should subtract v2 from v1 correctly', () => {
      const v1: Vector2D = { x: 5, y: 8 };
      const v2: Vector2D = { x: 2, y: 3 };
      const result = subtractVectors(v1, v2);
      
      expect(result).toEqual({ x: 3, y: 5 });
    });

    it('should handle negative results', () => {
      const v1: Vector2D = { x: 2, y: 3 };
      const v2: Vector2D = { x: 5, y: 8 };
      const result = subtractVectors(v1, v2);
      
      expect(result).toEqual({ x: -3, y: -5 });
    });

    it('should return zero vector when subtracting identical vectors', () => {
      const v1: Vector2D = { x: 4, y: 7 };
      const v2: Vector2D = { x: 4, y: 7 };
      const result = subtractVectors(v1, v2);
      
      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should handle decimal values', () => {
      const v1: Vector2D = { x: 5.5, y: 7.8 };
      const v2: Vector2D = { x: 2.3, y: 3.2 };
      const result = subtractVectors(v1, v2);
      
      expect(result.x).toBeCloseTo(3.2);
      expect(result.y).toBeCloseTo(4.6);
    });
  });

  describe('distanceBetweenVectors', () => {
    it('should calculate distance between two points correctly', () => {
      const v1: Vector2D = { x: 0, y: 0 };
      const v2: Vector2D = { x: 3, y: 4 };
      const result = distanceBetweenVectors(v1, v2);
      
      expect(result).toBe(5); // 3-4-5 triangle
    });

    it('should return 0 for identical vectors', () => {
      const v1: Vector2D = { x: 5, y: 7 };
      const v2: Vector2D = { x: 5, y: 7 };
      const result = distanceBetweenVectors(v1, v2);
      
      expect(result).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const v1: Vector2D = { x: -3, y: -4 };
      const v2: Vector2D = { x: 0, y: 0 };
      const result = distanceBetweenVectors(v1, v2);
      
      expect(result).toBe(5);
    });

    it('should be symmetric (distance from v1 to v2 equals v2 to v1)', () => {
      const v1: Vector2D = { x: 1, y: 2 };
      const v2: Vector2D = { x: 4, y: 6 };
      
      const distance1 = distanceBetweenVectors(v1, v2);
      const distance2 = distanceBetweenVectors(v2, v1);
      
      expect(distance1).toBe(distance2);
    });

    it('should handle decimal coordinates', () => {
      const v1: Vector2D = { x: 0.5, y: 1.5 };
      const v2: Vector2D = { x: 3.5, y: 5.5 };
      const result = distanceBetweenVectors(v1, v2);
      
      expect(result).toBeCloseTo(5);
    });
  });

  describe('lengthVector', () => {
    it('should calculate length of a unit vector correctly', () => {
      const v: Vector2D = { x: 1, y: 0 };
      const result = lengthVector(v);
      
      expect(result).toBe(1);
    });

    it('should calculate length using Pythagorean theorem', () => {
      const v: Vector2D = { x: 3, y: 4 };
      const result = lengthVector(v);
      
      expect(result).toBe(5);
    });

    it('should return 0 for zero vector', () => {
      const v: Vector2D = { x: 0, y: 0 };
      const result = lengthVector(v);
      
      expect(result).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const v: Vector2D = { x: -3, y: -4 };
      const result = lengthVector(v);
      
      expect(result).toBe(5);
    });

    it('should handle decimal values', () => {
      const v: Vector2D = { x: 1.5, y: 2.0 };
      const result = lengthVector(v);
      
      expect(result).toBeCloseTo(2.5);
    });
  });

  describe('normaliseVector', () => {
    it('should normalize a vector to unit length', () => {
      const v: Vector2D = { x: 3, y: 4 };
      const result = normaliseVector(v);
      
      expect(result.x).toBeCloseTo(0.6);
      expect(result.y).toBeCloseTo(0.8);
      expect(lengthVector(result)).toBeCloseTo(1);
    });

    it('should return zero vector when normalizing zero vector', () => {
      const v: Vector2D = { x: 0, y: 0 };
      const result = normaliseVector(v);
      
      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should handle already normalized vectors', () => {
      const v: Vector2D = { x: 1, y: 0 };
      const result = normaliseVector(v);
      
      expect(result.x).toBeCloseTo(1);
      expect(result.y).toBeCloseTo(0);
      expect(lengthVector(result)).toBeCloseTo(1);
    });

    it('should preserve direction while changing magnitude', () => {
      const v: Vector2D = { x: 10, y: 0 };
      const result = normaliseVector(v);
      
      // Should point in same direction (positive x)
      expect(result.x).toBeGreaterThan(0);
      expect(result.y).toBeCloseTo(0);
      expect(lengthVector(result)).toBeCloseTo(1);
    });

    it('should handle negative vectors', () => {
      const v: Vector2D = { x: -3, y: -4 };
      const result = normaliseVector(v);
      
      expect(result.x).toBeCloseTo(-0.6);
      expect(result.y).toBeCloseTo(-0.8);
      expect(lengthVector(result)).toBeCloseTo(1);
    });

    it('should create a unit vector from any non-zero vector', () => {
      const vectors: Vector2D[] = [
        { x: 100, y: 200 },
        { x: 0.001, y: 0.002 },
        { x: -50, y: 75 },
      ];

      vectors.forEach((v) => {
        const normalized = normaliseVector(v);
        expect(lengthVector(normalized)).toBeCloseTo(1);
      });
    });
  });

  describe('limitVector', () => {
    it('should limit vector magnitude to max value', () => {
      const v: Vector2D = { x: 6, y: 8 }; // length = 10
      const result = limitVector(v, 5);
      
      expect(lengthVector(result)).toBeCloseTo(5);
      expect(result.x).toBeCloseTo(3);
      expect(result.y).toBeCloseTo(4);
    });

    it('should not change vector if already below max', () => {
      const v: Vector2D = { x: 3, y: 4 }; // length = 5
      const result = limitVector(v, 10);
      
      expect(result).toEqual(v);
    });

    it('should handle zero vector', () => {
      const v: Vector2D = { x: 0, y: 0 };
      const result = limitVector(v, 5);
      
      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should preserve direction when limiting', () => {
      const v: Vector2D = { x: 10, y: 0 };
      const result = limitVector(v, 5);
      
      // Should still point in positive x direction
      expect(result.x).toBeCloseTo(5);
      expect(result.y).toBeCloseTo(0);
    });

    it('should handle negative vectors', () => {
      const v: Vector2D = { x: -6, y: -8 }; // length = 10
      const result = limitVector(v, 5);
      
      expect(lengthVector(result)).toBeCloseTo(5);
      expect(result.x).toBeCloseTo(-3);
      expect(result.y).toBeCloseTo(-4);
    });

    it('should handle vector exactly at max length', () => {
      const v: Vector2D = { x: 3, y: 4 }; // length = 5
      const result = limitVector(v, 5);
      
      expect(result).toEqual(v);
    });

    it('should work with decimal max values', () => {
      const v: Vector2D = { x: 6, y: 8 }; // length = 10
      const result = limitVector(v, 2.5);
      
      expect(lengthVector(result)).toBeCloseTo(2.5);
    });
  });

  describe('Integration Tests', () => {
    it('should combine operations correctly for typical boid physics', () => {
      // Simulate a boid updating its velocity
      const currentVelocity: Vector2D = { x: 2, y: 3 };
      const steering: Vector2D = { x: 1, y: -1 };
      const maxSpeed = 5;

      // Add steering to velocity and limit
      const newVelocity = addVectors(currentVelocity, steering);
      const limitedVelocity = limitVector(newVelocity, maxSpeed);

      expect(lengthVector(limitedVelocity)).toBeLessThanOrEqual(maxSpeed);
    });

    it('should correctly calculate direction vector between two points', () => {
      const boid1: Vector2D = { x: 0, y: 0 };
      const boid2: Vector2D = { x: 3, y: 4 };

      // Direction from boid1 to boid2
      const direction = subtractVectors(boid2, boid1);
      const normalizedDirection = normaliseVector(direction);

      expect(lengthVector(normalizedDirection)).toBeCloseTo(1);
      expect(normalizedDirection.x).toBeCloseTo(0.6);
      expect(normalizedDirection.y).toBeCloseTo(0.8);
    });

    it('should handle chain of vector operations', () => {
      const v1: Vector2D = { x: 10, y: 20 };
      const v2: Vector2D = { x: 5, y: 10 };

      const sum = addVectors(v1, v2);
      const normalized = normaliseVector(sum);
      const limited = limitVector(normalized, 0.5);

      expect(lengthVector(limited)).toBeCloseTo(0.5);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small numbers', () => {
      const v: Vector2D = { x: 0.0001, y: 0.0002 };
      const normalized = normaliseVector(v);
      
      expect(lengthVector(normalized)).toBeCloseTo(1);
    });

    it('should handle very large numbers', () => {
      const v: Vector2D = { x: 10000, y: 20000 };
      const normalized = normaliseVector(v);
      
      expect(lengthVector(normalized)).toBeCloseTo(1);
    });

    it('should maintain precision with floating point operations', () => {
      const v1: Vector2D = { x: 0.1, y: 0.2 };
      const v2: Vector2D = { x: 0.3, y: 0.4 };
      
      // Add and subtract should return to original
      const result = subtractVectors(addVectors(v1, v2), v2);
      
      expect(result.x).toBeCloseTo(v1.x);
      expect(result.y).toBeCloseTo(v1.y);
    });
  });
});
