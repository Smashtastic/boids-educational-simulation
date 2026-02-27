import { describe, it, expect } from 'vitest';
import { calculateCenterOfMass, findIsolatedBoid } from './predatorAI';
import type { Boid } from '../types/Boid';

describe('Predator AI Helper Functions', () => {
  describe('calculateCenterOfMass', () => {
    it('should calculate center of mass for a single boid', () => {
      const boids: Boid[] = [
        {
          id: '1',
          position: { x: 10, y: 20 },
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
      ];
      
      const result = calculateCenterOfMass(boids);
      
      expect(result).toEqual({ x: 10, y: 20 });
    });

    it('should calculate center of mass for multiple boids', () => {
      const boids: Boid[] = [
        {
          id: '1',
          position: { x: 0, y: 0 },
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
        {
          id: '2',
          position: { x: 10, y: 10 },
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
        {
          id: '3',
          position: { x: 20, y: 20 },
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
      ];
      
      const result = calculateCenterOfMass(boids);
      
      expect(result).toEqual({ x: 10, y: 10 });
    });

    it('should calculate center of mass for boids at different positions', () => {
      const boids: Boid[] = [
        {
          id: '1',
          position: { x: 5, y: 10 },
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
        {
          id: '2',
          position: { x: 15, y: 30 },
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
      ];
      
      const result = calculateCenterOfMass(boids);
      
      expect(result).toEqual({ x: 10, y: 20 });
    });

    it('should handle boids with decimal positions', () => {
      const boids: Boid[] = [
        {
          id: '1',
          position: { x: 1.5, y: 2.5 },
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
        {
          id: '2',
          position: { x: 2.5, y: 3.5 },
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
      ];
      
      const result = calculateCenterOfMass(boids);
      
      expect(result.x).toBeCloseTo(2.0);
      expect(result.y).toBeCloseTo(3.0);
    });
  });

  describe('findIsolatedBoid', () => {
    it('should find the boid furthest from cluster center', () => {
      const clusterCenter = { x: 10, y: 10 };
      const boids: Boid[] = [
        {
          id: '1',
          position: { x: 10, y: 10 },
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
        {
          id: '2',
          position: { x: 20, y: 20 },
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
        {
          id: '3',
          position: { x: 11, y: 11 },
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
      ];
      
      const result = findIsolatedBoid(boids, clusterCenter);
      
      expect(result).toBe(boids[1]); // The boid at (20, 20)
    });

    it('should return null for empty array', () => {
      const clusterCenter = { x: 10, y: 10 };
      const boids: Boid[] = [];
      
      const result = findIsolatedBoid(boids, clusterCenter);
      
      expect(result).toBeNull();
    });

    it('should return the only boid when array has one element', () => {
      const clusterCenter = { x: 10, y: 10 };
      const boids: Boid[] = [
        {
          id: '1',
          position: { x: 5, y: 5 },
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
      ];
      
      const result = findIsolatedBoid(boids, clusterCenter);
      
      expect(result).toBe(boids[0]);
    });

    it('should handle negative coordinates', () => {
      const clusterCenter = { x: 0, y: 0 };
      const boids: Boid[] = [
        {
          id: '1',
          position: { x: -5, y: -5 },
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
        {
          id: '2',
          position: { x: 2, y: 2 },
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
        {
          id: '3',
          position: { x: -10, y: -10 },
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
      ];
      
      const result = findIsolatedBoid(boids, clusterCenter);
      
      expect(result).toBe(boids[2]); // The boid at (-10, -10)
    });

    it('should correctly calculate distance using pythagorean theorem', () => {
      const clusterCenter = { x: 0, y: 0 };
      const boids: Boid[] = [
        {
          id: '1',
          position: { x: 3, y: 4 }, // distance = 5
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
        {
          id: '2',
          position: { x: 1, y: 1 }, // distance = sqrt(2) ≈ 1.41
          velocity: { x: 1, y: 1 },
          acceleration: { x: 0, y: 0 },
          maxSpeed: 10,
          colour: 'hsl(15, 100%, 50%)',
        },
      ];
      
      const result = findIsolatedBoid(boids, clusterCenter);
      
      expect(result).toBe(boids[0]); // The boid at distance 5
    });
  });
});
