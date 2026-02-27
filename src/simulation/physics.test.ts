import { describe, it, expect } from 'vitest';
import { updateBoid, updatePredator, wrapBoidPosition } from './physics';
import type { Boid } from '../types/Boid';
import type { Predator } from '../types/Predator';

describe('Physics - updateBoid', () => {
  describe('Basic Movement', () => {
    it('should update position based on velocity', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 100, y: 100 },
        velocity: { x: 5, y: 3 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const updated = updateBoid(boid, 10);

      expect(updated.position.x).toBe(105);
      expect(updated.position.y).toBe(103);
    });

    it('should apply acceleration to velocity', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 100, y: 100 },
        velocity: { x: 2, y: 2 },
        acceleration: { x: 1, y: -1 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const updated = updateBoid(boid, 10);

      expect(updated.velocity.x).toBe(3); // 2 + 1
      expect(updated.velocity.y).toBe(1); // 2 + (-1)
    });

    it('should reset acceleration to zero after update', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 100, y: 100 },
        velocity: { x: 2, y: 2 },
        acceleration: { x: 5, y: 5 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const updated = updateBoid(boid, 10);

      expect(updated.acceleration.x).toBe(0);
      expect(updated.acceleration.y).toBe(0);
    });

    it('should not mutate the original boid', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 100, y: 100 },
        velocity: { x: 5, y: 3 },
        acceleration: { x: 1, y: 1 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const original = { ...boid, position: { ...boid.position } };
      updateBoid(boid, 10);

      expect(boid.position.x).toBe(original.position.x);
      expect(boid.position.y).toBe(original.position.y);
      expect(boid.velocity.x).toBe(original.velocity.x);
      expect(boid.acceleration.x).toBe(original.acceleration.x);
    });
  });

  describe('Velocity Limiting', () => {
    it('should limit velocity to maxSpeed when exceeded', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 100, y: 100 },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 10, y: 10 }, // Will create velocity of (10, 10) = length ~14.14
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const updated = updateBoid(boid, 5); // Max speed = 5

      const speed = Math.sqrt(updated.velocity.x ** 2 + updated.velocity.y ** 2);
      expect(speed).toBeCloseTo(5);
    });

    it('should not change velocity when already below maxSpeed', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 100, y: 100 },
        velocity: { x: 2, y: 2 }, // Length ~2.83
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const updated = updateBoid(boid, 10);

      expect(updated.velocity.x).toBe(2);
      expect(updated.velocity.y).toBe(2);
    });

    it('should preserve velocity direction when limiting', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 0, y: 0 },
        velocity: { x: 6, y: 8 }, // Length = 10, direction = (0.6, 0.8)
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const updated = updateBoid(boid, 5); // Limit to 5

      // Should be scaled to (3, 4) - same direction, length 5
      expect(updated.velocity.x).toBeCloseTo(3);
      expect(updated.velocity.y).toBeCloseTo(4);
    });
  });

  describe('Combined Physics', () => {
    it('should correctly combine acceleration, velocity limit, and position update', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 100, y: 100 },
        velocity: { x: 3, y: 4 }, // Length = 5
        acceleration: { x: 3, y: 4 }, // Will add to make velocity (6, 8) = length 10
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const updated = updateBoid(boid, 5); // Max speed = 5

      // Velocity should be limited to length 5, keeping direction (6,8) -> (3,4)
      expect(updated.velocity.x).toBeCloseTo(3);
      expect(updated.velocity.y).toBeCloseTo(4);

      // Position should update with the LIMITED velocity
      expect(updated.position.x).toBeCloseTo(103);
      expect(updated.position.y).toBeCloseTo(104);

      // Acceleration reset
      expect(updated.acceleration.x).toBe(0);
      expect(updated.acceleration.y).toBe(0);
    });

    it('should handle zero velocity', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 100, y: 100 },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const updated = updateBoid(boid, 5);

      expect(updated.position.x).toBe(100);
      expect(updated.position.y).toBe(100);
      expect(updated.velocity.x).toBe(0);
      expect(updated.velocity.y).toBe(0);
    });

    it('should handle negative velocity', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 100, y: 100 },
        velocity: { x: -3, y: -4 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const updated = updateBoid(boid, 10);

      expect(updated.position.x).toBe(97);
      expect(updated.position.y).toBe(96);
      expect(updated.velocity.x).toBe(-3);
      expect(updated.velocity.y).toBe(-4);
    });

    it('should handle large acceleration values', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 100, y: 100 },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 100, y: 100 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const updated = updateBoid(boid, 5);

      const speed = Math.sqrt(updated.velocity.x ** 2 + updated.velocity.y ** 2);
      expect(speed).toBeCloseTo(5);
      expect(updated.acceleration.x).toBe(0);
      expect(updated.acceleration.y).toBe(0);
    });

    it('should handle floating point velocities', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 100.5, y: 200.7 },
        velocity: { x: 2.3, y: -1.8 },
        acceleration: { x: 0.5, y: 0.2 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const updated = updateBoid(boid, 10);

      // New velocity: (2.3 + 0.5, -1.8 + 0.2) = (2.8, -1.6)
      // Position: (100.5 + 2.8, 200.7 + -1.6) = (103.3, 199.1)
      expect(updated.position.x).toBeCloseTo(103.3);
      expect(updated.position.y).toBeCloseTo(199.1);
      expect(updated.velocity.x).toBeCloseTo(2.8);
      expect(updated.velocity.y).toBeCloseTo(-1.6);
    });
  });
});

describe('Physics - updatePredator', () => {
  describe('Basic Movement', () => {
    it('should update position based on velocity', () => {
      const predator: Predator = {
        id: 'predator-1',
        position: { x: 100, y: 100 },
        velocity: { x: 5, y: 3 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 8,
        colour: 'hsl(0, 90%, 50%)',
        colourSeed: 0.5,
        aiState: {
          perceptionRadius: 150,
          stalkRadius: 80,
          strikeRadius: 20,
          strikeSpeed: 12,
          currentState: 'PATROL',
        },
        timingParameters: {
          stateTimer: 0,
          cooldownDuration: 180,
        },
        targetBoidId: null,
        targetCluster: null,
      };

      const updated = updatePredator(predator, 10);

      expect(updated.position.x).toBe(105);
      expect(updated.position.y).toBe(103);
    });

    it('should apply acceleration to velocity', () => {
      const predator: Predator = {
        id: 'predator-1',
        position: { x: 100, y: 100 },
        velocity: { x: 2, y: 2 },
        acceleration: { x: 1, y: -1 },
        maxSpeed: 8,
        colour: 'hsl(0, 90%, 50%)',
        colourSeed: 0.5,
        aiState: {
          perceptionRadius: 150,
          stalkRadius: 80,
          strikeRadius: 20,
          strikeSpeed: 12,
          currentState: 'PATROL',
        },
        timingParameters: {
          stateTimer: 0,
          cooldownDuration: 180,
        },
        targetBoidId: null,
        targetCluster: null,
      };

      const updated = updatePredator(predator, 10);

      expect(updated.velocity.x).toBe(3);
      expect(updated.velocity.y).toBe(1);
    });

    it('should reset acceleration to zero after update', () => {
      const predator: Predator = {
        id: 'predator-1',
        position: { x: 100, y: 100 },
        velocity: { x: 2, y: 2 },
        acceleration: { x: 5, y: 5 },
        maxSpeed: 8,
        colour: 'hsl(0, 90%, 50%)',
        colourSeed: 0.5,
        aiState: {
          perceptionRadius: 150,
          stalkRadius: 80,
          strikeRadius: 20,
          strikeSpeed: 12,
          currentState: 'STRIKE',
        },
        timingParameters: {
          stateTimer: 10,
          cooldownDuration: 180,
        },
        targetBoidId: 'boid-1',
        targetCluster: null,
      };

      const updated = updatePredator(predator, 10);

      expect(updated.acceleration.x).toBe(0);
      expect(updated.acceleration.y).toBe(0);
    });

    it('should not mutate the original predator', () => {
      const predator: Predator = {
        id: 'predator-1',
        position: { x: 100, y: 100 },
        velocity: { x: 5, y: 3 },
        acceleration: { x: 1, y: 1 },
        maxSpeed: 8,
        colour: 'hsl(0, 90%, 50%)',
        colourSeed: 0.5,
        aiState: {
          perceptionRadius: 150,
          stalkRadius: 80,
          strikeRadius: 20,
          strikeSpeed: 12,
          currentState: 'PATROL',
        },
        timingParameters: {
          stateTimer: 0,
          cooldownDuration: 180,
        },
        targetBoidId: null,
        targetCluster: null,
      };

      const original = { ...predator, position: { ...predator.position } };
      updatePredator(predator, 10);

      expect(predator.position.x).toBe(original.position.x);
      expect(predator.position.y).toBe(original.position.y);
      expect(predator.velocity.x).toBe(original.velocity.x);
      expect(predator.acceleration.x).toBe(original.acceleration.x);
    });
  });

  describe('Velocity Limiting', () => {
    it('should limit velocity to maxSpeed when exceeded', () => {
      const predator: Predator = {
        id: 'predator-1',
        position: { x: 100, y: 100 },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 10, y: 10 },
        maxSpeed: 8,
        colour: 'hsl(0, 90%, 50%)',
        colourSeed: 0.5,
        aiState: {
          perceptionRadius: 150,
          stalkRadius: 80,
          strikeRadius: 20,
          strikeSpeed: 12,
          currentState: 'STRIKE',
        },
        timingParameters: {
          stateTimer: 5,
          cooldownDuration: 180,
        },
        targetBoidId: 'boid-1',
        targetCluster: null,
      };

      const updated = updatePredator(predator, 5);

      const speed = Math.sqrt(updated.velocity.x ** 2 + updated.velocity.y ** 2);
      expect(speed).toBeCloseTo(5);
    });

    it('should preserve velocity direction when limiting', () => {
      const predator: Predator = {
        id: 'predator-1',
        position: { x: 0, y: 0 },
        velocity: { x: 6, y: 8 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 8,
        colour: 'hsl(0, 90%, 50%)',
        colourSeed: 0.5,
        aiState: {
          perceptionRadius: 150,
          stalkRadius: 80,
          strikeRadius: 20,
          strikeSpeed: 12,
          currentState: 'STALK',
        },
        timingParameters: {
          stateTimer: 20,
          cooldownDuration: 180,
        },
        targetBoidId: null,
        targetCluster: { x: 200, y: 200 },
      };

      const updated = updatePredator(predator, 5);

      expect(updated.velocity.x).toBeCloseTo(3);
      expect(updated.velocity.y).toBeCloseTo(4);
    });

    it('should handle strike speed (faster than normal)', () => {
      const predator: Predator = {
        id: 'predator-1',
        position: { x: 100, y: 100 },
        velocity: { x: 6, y: 8 },
        acceleration: { x: 3, y: 4 },
        maxSpeed: 8,
        colour: 'hsl(0, 90%, 50%)',
        colourSeed: 0.5,
        aiState: {
          perceptionRadius: 150,
          stalkRadius: 80,
          strikeRadius: 20,
          strikeSpeed: 12,
          currentState: 'STRIKE',
        },
        timingParameters: {
          stateTimer: 0,
          cooldownDuration: 180,
        },
        targetBoidId: 'boid-1',
        targetCluster: null,
      };

      const updated = updatePredator(predator, 12);

      const speed = Math.sqrt(updated.velocity.x ** 2 + updated.velocity.y ** 2);
      expect(speed).toBeLessThanOrEqual(12);
    });
  });

  describe('AI State Preservation', () => {
    it('should preserve AI state during physics update', () => {
      const predator: Predator = {
        id: 'predator-1',
        position: { x: 100, y: 100 },
        velocity: { x: 3, y: 3 },
        acceleration: { x: 1, y: 1 },
        maxSpeed: 8,
        colour: 'hsl(0, 90%, 50%)',
        colourSeed: 0.5,
        aiState: {
          perceptionRadius: 150,
          stalkRadius: 80,
          strikeRadius: 20,
          strikeSpeed: 12,
          currentState: 'STALK',
        },
        timingParameters: {
          stateTimer: 45,
          cooldownDuration: 180,
        },
        targetBoidId: null,
        targetCluster: { x: 200, y: 200 },
      };

      const updated = updatePredator(predator, 10);

      expect(updated.aiState.currentState).toBe('STALK');
      expect(updated.targetCluster).toEqual({ x: 200, y: 200 });
      expect(updated.timingParameters.stateTimer).toBe(45);
    });

    it('should preserve all predator-specific properties', () => {
      const predator: Predator = {
        id: 'predator-1',
        position: { x: 100, y: 100 },
        velocity: { x: 2, y: 2 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 8,
        colour: 'hsl(0, 90%, 50%)',
        colourSeed: 0.5,
        aiState: {
          perceptionRadius: 150,
          stalkRadius: 80,
          strikeRadius: 20,
          strikeSpeed: 12,
          currentState: 'COOLDOWN',
        },
        timingParameters: {
          stateTimer: 100,
          cooldownDuration: 180,
        },
        targetBoidId: null,
        targetCluster: null,
      };

      const updated = updatePredator(predator, 10);

      expect(updated.aiState.perceptionRadius).toBe(150);
      expect(updated.aiState.stalkRadius).toBe(80);
      expect(updated.aiState.strikeSpeed).toBe(12);
      expect(updated.timingParameters.cooldownDuration).toBe(180);
    });
  });

  describe('Combined Physics', () => {
    it('should correctly combine all physics updates for predator', () => {
      const predator: Predator = {
        id: 'predator-1',
        position: { x: 100, y: 100 },
        velocity: { x: 3, y: 4 },
        acceleration: { x: 3, y: 4 },
        maxSpeed: 8,
        colour: 'hsl(0, 90%, 50%)',
        colourSeed: 0.5,
        aiState: {
          perceptionRadius: 150,
          stalkRadius: 80,
          strikeRadius: 20,
          strikeSpeed: 12,
          currentState: 'STRIKE',
        },
        timingParameters: {
          stateTimer: 15,
          cooldownDuration: 180,
        },
        targetBoidId: 'boid-42',
        targetCluster: null,
      };

      const updated = updatePredator(predator, 5);

      expect(updated.velocity.x).toBeCloseTo(3);
      expect(updated.velocity.y).toBeCloseTo(4);
      expect(updated.position.x).toBeCloseTo(103);
      expect(updated.position.y).toBeCloseTo(104);
      expect(updated.acceleration.x).toBe(0);
      expect(updated.acceleration.y).toBe(0);
      expect(updated.aiState.currentState).toBe('STRIKE');
    });
  });
});

describe('Physics - wrapBoidPosition', () => {
  describe('Inside Canvas', () => {
    it('should not change position when boid is inside canvas', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 400, y: 300 },
        velocity: { x: 2, y: 2 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const wrapped = wrapBoidPosition(boid, 800, 600);

      expect(wrapped.position.x).toBe(400);
      expect(wrapped.position.y).toBe(300);
    });

    it('should not change position at origin (0, 0)', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 0, y: 0 },
        velocity: { x: 2, y: 2 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const wrapped = wrapBoidPosition(boid, 800, 600);

      expect(wrapped.position.x).toBe(0);
      expect(wrapped.position.y).toBe(0);
    });
  });

  describe('Right Edge', () => {
    it('should wrap to left when boid exceeds right edge', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 805, y: 300 },
        velocity: { x: 5, y: 0 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const wrapped = wrapBoidPosition(boid, 800, 600);

      expect(wrapped.position.x).toBe(0);
      expect(wrapped.position.y).toBe(300);
    });

    it('should wrap when exactly at canvas width', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 800, y: 300 },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const wrapped = wrapBoidPosition(boid, 800, 600);

      expect(wrapped.position.x).toBe(0);
      expect(wrapped.position.y).toBe(300);
    });

    it('should wrap far beyond right edge', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 1500, y: 300 },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const wrapped = wrapBoidPosition(boid, 800, 600);

      expect(wrapped.position.x).toBe(0);
      expect(wrapped.position.y).toBe(300);
    });
  });

  describe('Left Edge', () => {
    it('should wrap to right when boid goes below 0 on x-axis', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: -5, y: 300 },
        velocity: { x: -2, y: 0 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const wrapped = wrapBoidPosition(boid, 800, 600);

      expect(wrapped.position.x).toBe(800);
      expect(wrapped.position.y).toBe(300);
    });

    it('should wrap far beyond left edge', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: -100, y: 300 },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const wrapped = wrapBoidPosition(boid, 800, 600);

      expect(wrapped.position.x).toBe(800);
      expect(wrapped.position.y).toBe(300);
    });
  });

  describe('Bottom Edge', () => {
    it('should wrap to top when boid exceeds bottom edge', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 400, y: 605 },
        velocity: { x: 0, y: 5 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const wrapped = wrapBoidPosition(boid, 800, 600);

      expect(wrapped.position.x).toBe(400);
      expect(wrapped.position.y).toBe(0);
    });

    it('should wrap when exactly at canvas height', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 400, y: 600 },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const wrapped = wrapBoidPosition(boid, 800, 600);

      expect(wrapped.position.x).toBe(400);
      expect(wrapped.position.y).toBe(0);
    });
  });

  describe('Top Edge', () => {
    it('should wrap to bottom when boid goes below 0 on y-axis', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 400, y: -10 },
        velocity: { x: 0, y: -2 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const wrapped = wrapBoidPosition(boid, 800, 600);

      expect(wrapped.position.x).toBe(400);
      expect(wrapped.position.y).toBe(600);
    });
  });

  describe('Corner Cases', () => {
    it('should wrap both x and y when boid is beyond bottom-right corner', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 850, y: 650 },
        velocity: { x: 5, y: 5 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const wrapped = wrapBoidPosition(boid, 800, 600);

      expect(wrapped.position.x).toBe(0);
      expect(wrapped.position.y).toBe(0);
    });

    it('should wrap both x and y when boid is beyond top-left corner', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: -10, y: -20 },
        velocity: { x: -2, y: -2 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const wrapped = wrapBoidPosition(boid, 800, 600);

      expect(wrapped.position.x).toBe(800);
      expect(wrapped.position.y).toBe(600);
    });

    it('should wrap mixed edges (left and bottom)', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: -5, y: 610 },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 1,
        colour: `hsl(20, 80%, 50%)`,
      };

      const wrapped = wrapBoidPosition(boid, 800, 600);

      expect(wrapped.position.x).toBe(800);
      expect(wrapped.position.y).toBe(0);
    });
  });

  describe('Immutability', () => {
    it('should not mutate the original boid', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 850, y: 650 },
        velocity: { x: 5, y: 5 },
        acceleration: { x: 1, y: 1 },
        maxSpeed: 10,
        colour: 'hsl(20, 80%, 50%)',
      };

      const original = { ...boid, position: { ...boid.position } };
      wrapBoidPosition(boid, 800, 600);

      expect(boid.position.x).toBe(original.position.x);
      expect(boid.position.y).toBe(original.position.y);
      expect(boid).not.toBe(original); // Different references
    });

    it('should return a new boid object with new position object', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 400, y: 300 },
        velocity: { x: 2, y: 2 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 10,
        colour: 'hsl(20, 80%, 50%)',
      };

      const wrapped = wrapBoidPosition(boid, 800, 600);

      expect(wrapped).not.toBe(boid);
      expect(wrapped.position).not.toBe(boid.position);
    });
  });

  describe('Edge Precision', () => {
    it('should handle floating point positions correctly', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 799.9, y: 300.5 },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 10,
        colour: 'hsl(20, 80%, 50%)',
      };

      const wrapped = wrapBoidPosition(boid, 800, 600);

      expect(wrapped.position.x).toBeCloseTo(799.9);
      expect(wrapped.position.y).toBeCloseTo(300.5);
    });

    it('should wrap when position is just over the edge', () => {
      const boid: Boid = {
        id: 'test-1',
        position: { x: 800.1, y: 600.1 },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: 10,
        colour: 'hsl(20, 80%, 50%)',
      };

      const wrapped = wrapBoidPosition(boid, 800, 600);

      expect(wrapped.position.x).toBe(0);
      expect(wrapped.position.y).toBe(0);
    });
  });
});

describe('Physics Integration Tests', () => {
  it('should handle full update and wrap cycle', () => {
    const boid: Boid = {
      id: 'test-1',
      position: { x: 795, y: 300 },
      velocity: { x: 10, y: 0 },
      acceleration: { x: 0, y: 0 },
      maxSpeed: 15,
      colour: 'hsl(20, 80%, 50%)',
    };

    // Update physics (moves to 805, 300)
    let updated = updateBoid(boid, 15);
    expect(updated.position.x).toBe(805);

    // Wrap position (wraps to 0, 300)
    updated = wrapBoidPosition(updated, 800, 600);
    expect(updated.position.x).toBe(0);
    expect(updated.position.y).toBe(300);
  });

  it('should handle boid bouncing around edges over multiple frames', () => {
    let boid: Boid = {
      id: 'test-1',
      position: { x: 795, y: 595 },
      velocity: { x: 3, y: 3 },
      acceleration: { x: 0, y: 0 },
      maxSpeed: 10,
      colour: 'hsl(20, 80%, 50%)',
    };

    // Frame 1: (798, 598)
    boid = updateBoid(boid, 10);
    boid = wrapBoidPosition(boid, 800, 600);
    expect(boid.position.x).toBeCloseTo(798);
    expect(boid.position.y).toBeCloseTo(598);

    // Frame 2: (801, 601) -> wraps to (0, 0)
    boid = updateBoid(boid, 10);
    boid = wrapBoidPosition(boid, 800, 600);
    expect(boid.position.x).toBe(0);
    expect(boid.position.y).toBe(0);

    // Frame 3: (3, 3)
    boid = updateBoid(boid, 10);
    boid = wrapBoidPosition(boid, 800, 600);
    expect(boid.position.x).toBeCloseTo(3);
    expect(boid.position.y).toBeCloseTo(3);
  });

  it('should maintain velocity through wrapping', () => {
    const boid: Boid = {
      id: 'test-1',
      position: { x: 805, y: 300 },
      velocity: { x: 5, y: 3 },
      acceleration: { x: 0, y: 0 },
      maxSpeed: 10,
      colour: 'hsl(20, 80%, 50%)',
    };

    const wrapped = wrapBoidPosition(boid, 800, 600);

    // Wrapping should not affect velocity
    expect(wrapped.velocity.x).toBe(5);
    expect(wrapped.velocity.y).toBe(3);
  });
});
