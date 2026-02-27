import { describe, it, expect } from 'vitest';
import { updateParticle, updateParticles } from './particles';
import type { Particle } from '../types/Particle';

describe('Particles - updateParticle', () => {
  describe('Basic Updates', () => {
    it('should increment particle age by 1', () => {
      const particle: Particle = {
        id: 'particle-1',
        position: { x: 100, y: 100 },
        velocity: { x: 2, y: 2 },
        age: 0,
        maxAge: 60,
        colour: '#ff8c00',
        size: 3,
      };

      const updated = updateParticle(particle);

      expect(updated.age).toBe(1);
    });

    it('should update position based on velocity', () => {
      const particle: Particle = {
        id: 'particle-1',
        position: { x: 100, y: 100 },
        velocity: { x: 3, y: -2 },
        age: 10,
        maxAge: 60,
        colour: '#ff8c00',
        size: 3,
      };

      const updated = updateParticle(particle);

      // Position updates with friction-adjusted velocity: 3 * 0.98 = 2.94
      expect(updated.position.x).toBeCloseTo(102.94);
      expect(updated.position.y).toBeCloseTo(98.04);
    });

    it('should apply friction to velocity', () => {
      const particle: Particle = {
        id: 'particle-1',
        position: { x: 100, y: 100 },
        velocity: { x: 10, y: 10 },
        age: 0,
        maxAge: 60,
        colour: '#ff8c00',
        size: 3,
      };

      const updated = updateParticle(particle);

      // Friction multiplier is 0.98
      expect(updated.velocity.x).toBeCloseTo(9.8);
      expect(updated.velocity.y).toBeCloseTo(9.8);
    });

    it('should not mutate the original particle', () => {
      const particle: Particle = {
        id: 'particle-1',
        position: { x: 100, y: 100 },
        velocity: { x: 5, y: 5 },
        age: 5,
        maxAge: 60,
        colour: '#ff8c00',
        size: 3,
      };

      const original = { 
        ...particle, 
        position: { ...particle.position },
        velocity: { ...particle.velocity }
      };
      
      updateParticle(particle);

      expect(particle.position.x).toBe(original.position.x);
      expect(particle.position.y).toBe(original.position.y);
      expect(particle.velocity.x).toBe(original.velocity.x);
      expect(particle.age).toBe(original.age);
    });
  });

  describe('Age Progression', () => {
    it('should age particle to maxAge', () => {
      let particle: Particle = {
        id: 'particle-1',
        position: { x: 100, y: 100 },
        velocity: { x: 1, y: 1 },
        age: 58,
        maxAge: 60,
        colour: '#ff8c00',
        size: 3,
      };

      particle = updateParticle(particle);
      expect(particle.age).toBe(59);

      particle = updateParticle(particle);
      expect(particle.age).toBe(60);

      particle = updateParticle(particle);
      expect(particle.age).toBe(61); // Can exceed maxAge
    });

    it('should continue aging beyond maxAge', () => {
      const particle: Particle = {
        id: 'particle-1',
        position: { x: 100, y: 100 },
        velocity: { x: 1, y: 1 },
        age: 65,
        maxAge: 60,
        colour: '#ff8c00',
        size: 3,
      };

      const updated = updateParticle(particle);

      expect(updated.age).toBe(66);
    });
  });

  describe('Velocity and Friction', () => {
    it('should slow down particle over time due to friction', () => {
      let particle: Particle = {
        id: 'particle-1',
        position: { x: 0, y: 0 },
        velocity: { x: 100, y: 100 },
        age: 0,
        maxAge: 60,
        colour: '#ff8c00',
        size: 3,
      };

      // After 10 frames with friction 0.98
      for (let i = 0; i < 10; i++) {
        particle = updateParticle(particle);
      }

      // 100 * (0.98^10) ≈ 81.7
      expect(particle.velocity.x).toBeCloseTo(81.7, 1);
      expect(particle.velocity.y).toBeCloseTo(81.7, 1);
    });

    it('should handle zero velocity', () => {
      const particle: Particle = {
        id: 'particle-1',
        position: { x: 100, y: 100 },
        velocity: { x: 0, y: 0 },
        age: 0,
        maxAge: 60,
        colour: '#ff8c00',
        size: 3,
      };

      const updated = updateParticle(particle);

      expect(updated.velocity.x).toBe(0);
      expect(updated.velocity.y).toBe(0);
      expect(updated.position.x).toBe(100);
      expect(updated.position.y).toBe(100);
    });

    it('should handle negative velocity', () => {
      const particle: Particle = {
        id: 'particle-1',
        position: { x: 100, y: 100 },
        velocity: { x: -5, y: -3 },
        age: 0,
        maxAge: 60,
        colour: '#ff8c00',
        size: 3,
      };

      const updated = updateParticle(particle);

      // -5 * 0.98 = -4.9, so position is 100 + (-4.9) = 95.1
      expect(updated.position.x).toBeCloseTo(95.1);
      expect(updated.position.y).toBeCloseTo(97.06);
      expect(updated.velocity.x).toBeCloseTo(-4.9);
      expect(updated.velocity.y).toBeCloseTo(-2.94);
    });
  });

  describe('Combined Updates', () => {
    it('should correctly combine age, position, and velocity updates', () => {
      const particle: Particle = {
        id: 'particle-1',
        position: { x: 50, y: 50 },
        velocity: { x: 10, y: -5 },
        age: 15,
        maxAge: 60,
        colour: '#ff8c00',
        size: 3,
      };

      const updated = updateParticle(particle);

      // Age increments
      expect(updated.age).toBe(16);
      
      // Position updates with friction-adjusted velocity: 10 * 0.98 = 9.8
      expect(updated.position.x).toBeCloseTo(59.8);
      expect(updated.position.y).toBeCloseTo(45.1);
      
      // Velocity has friction applied
      expect(updated.velocity.x).toBeCloseTo(9.8);
      expect(updated.velocity.y).toBeCloseTo(-4.9);
    });

    it('should maintain immutability through all updates', () => {
      const particle: Particle = {
        id: 'particle-1',
        position: { x: 100, y: 100 },
        velocity: { x: 5, y: 5 },
        age: 10,
        maxAge: 60,
        colour: '#ff8c00',
        size: 3,
      };

      const updated = updateParticle(particle);

      // Verify new objects created
      expect(updated).not.toBe(particle);
      expect(updated.position).not.toBe(particle.position);
      expect(updated.velocity).not.toBe(particle.velocity);
      
      // Verify original unchanged
      expect(particle.age).toBe(10);
      expect(particle.position.x).toBe(100);
      expect(particle.velocity.x).toBe(5);
    });
  });

  describe('Floating Point Precision', () => {
    it('should handle floating point positions correctly', () => {
      const particle: Particle = {
        id: 'particle-1',
        position: { x: 100.5, y: 200.7 },
        velocity: { x: 2.3, y: -1.8 },
        age: 0,
        maxAge: 60,
        colour: '#ff8c00',
        size: 3,
      };

      const updated = updateParticle(particle);

      // 2.3 * 0.98 = 2.254, so 100.5 + 2.254 = 102.754
      expect(updated.position.x).toBeCloseTo(102.754, 2);
      expect(updated.position.y).toBeCloseTo(198.936, 2);
    });

    it('should handle very small velocities', () => {
      const particle: Particle = {
        id: 'particle-1',
        position: { x: 100, y: 100 },
        velocity: { x: 0.001, y: 0.001 },
        age: 0,
        maxAge: 60,
        colour: '#ff8c00',
        size: 3,
      };

      const updated = updateParticle(particle);

      expect(updated.position.x).toBeCloseTo(100.001);
      expect(updated.velocity.x).toBeCloseTo(0.00098);
    });
  });
});

describe('Particles - updateParticles', () => {
  describe('Empty and Single Particle', () => {
    it('should return empty array when given empty array', () => {
      const particles: Particle[] = [];
      const updated = updateParticles(particles);

      expect(updated).toEqual([]);
      expect(updated.length).toBe(0);
    });

    it('should update single particle correctly', () => {
      const particles: Particle[] = [
        {
          id: 'particle-1',
          position: { x: 100, y: 100 },
          velocity: { x: 5, y: 5 },
          age: 10,
          maxAge: 60,
          colour: '#ff8c00',
          size: 3,
        },
      ];

      const updated = updateParticles(particles);

      expect(updated.length).toBe(1);
      expect(updated[0].age).toBe(11);
      // 5 * 0.98 = 4.9
      expect(updated[0].position.x).toBeCloseTo(104.9);
    });
  });

  describe('Multiple Particles', () => {
    it('should update all particles in array', () => {
      const particles: Particle[] = [
        {
          id: 'particle-1',
          position: { x: 100, y: 100 },
          velocity: { x: 2, y: 2 },
          age: 10,
          maxAge: 60,
          colour: '#ff8c00',
          size: 3,
        },
        {
          id: 'particle-2',
          position: { x: 200, y: 200 },
          velocity: { x: -3, y: -3 },
          age: 20,
          maxAge: 60,
          colour: '#ff8c00',
          size: 3,
        },
        {
          id: 'particle-3',
          position: { x: 300, y: 300 },
          velocity: { x: 1, y: -1 },
          age: 5,
          maxAge: 60,
          colour: '#ff8c00',
          size: 3,
        },
      ];

      const updated = updateParticles(particles);

      expect(updated.length).toBe(3);
      expect(updated[0].age).toBe(11);
      expect(updated[1].age).toBe(21);
      expect(updated[2].age).toBe(6);
    });
  });

  describe('Filtering Dead Particles', () => {
    it('should remove particle when age equals maxAge', () => {
      const particles: Particle[] = [
        {
          id: 'particle-1',
          position: { x: 100, y: 100 },
          velocity: { x: 2, y: 2 },
          age: 59,
          maxAge: 60,
          colour: '#ff8c00',
          size: 3,
        },
      ];

      const updated = updateParticles(particles);

      // After update: age = 60, maxAge = 60, should be filtered
      expect(updated.length).toBe(0);
    });

    it('should remove particle when age exceeds maxAge', () => {
      const particles: Particle[] = [
        {
          id: 'particle-1',
          position: { x: 100, y: 100 },
          velocity: { x: 2, y: 2 },
          age: 65,
          maxAge: 60,
          colour: '#ff8c00',
          size: 3,
        },
      ];

      const updated = updateParticles(particles);

      expect(updated.length).toBe(0);
    });

    it('should keep particle when age is below maxAge', () => {
      const particles: Particle[] = [
        {
          id: 'particle-1',
          position: { x: 100, y: 100 },
          velocity: { x: 2, y: 2 },
          age: 58,
          maxAge: 60,
          colour: '#ff8c00',
          size: 3,
        },
      ];

      const updated = updateParticles(particles);

      // After update: age = 59, maxAge = 60, should remain
      expect(updated.length).toBe(1);
      expect(updated[0].age).toBe(59);
    });

    it('should filter out some particles and keep others', () => {
      const particles: Particle[] = [
        {
          id: 'particle-1',
          position: { x: 100, y: 100 },
          velocity: { x: 2, y: 2 },
          age: 58, // Will become 59, stays
          maxAge: 60,
          colour: '#ff8c00',
          size: 3,
        },
        {
          id: 'particle-2',
          position: { x: 200, y: 200 },
          velocity: { x: 2, y: 2 },
          age: 59, // Will become 60, removed
          maxAge: 60,
          colour: '#ff8c00',
          size: 3,
        },
        {
          id: 'particle-3',
          position: { x: 300, y: 300 },
          velocity: { x: 2, y: 2 },
          age: 10, // Will become 11, stays
          maxAge: 60,
          colour: '#ff8c00',
          size: 3,
        },
        {
          id: 'particle-4',
          position: { x: 400, y: 400 },
          velocity: { x: 2, y: 2 },
          age: 60, // Will become 61, already dead, removed
          maxAge: 60,
          colour: '#ff8c00',
          size: 3,
        },
      ];

      const updated = updateParticles(particles);

      expect(updated.length).toBe(2);
      expect(updated[0].id).toBe('particle-1');
      expect(updated[1].id).toBe('particle-3');
    });

    it('should remove all particles when all are dead', () => {
      const particles: Particle[] = [
        {
          id: 'particle-1',
          position: { x: 100, y: 100 },
          velocity: { x: 2, y: 2 },
          age: 59,
          maxAge: 60,
          colour: '#ff8c00',
          size: 3,
        },
        {
          id: 'particle-2',
          position: { x: 200, y: 200 },
          velocity: { x: 2, y: 2 },
          age: 70,
          maxAge: 60,
          colour: '#ff8c00',
          size: 3,
        },
      ];

      const updated = updateParticles(particles);

      expect(updated.length).toBe(0);
    });
  });

  describe('Immutability', () => {
    it('should not mutate the original particles array', () => {
      const particles: Particle[] = [
        {
          id: 'particle-1',
          position: { x: 100, y: 100 },
          velocity: { x: 5, y: 5 },
          age: 10,
          maxAge: 60,
          colour: '#ff8c00',
          size: 3,
        },
      ];

      const original = particles[0];
      updateParticles(particles);

      expect(particles[0].age).toBe(10);
      expect(particles[0].position.x).toBe(100);
      expect(particles[0]).toBe(original); // Same reference
    });

    it('should return new array with new particle objects', () => {
      const particles: Particle[] = [
        {
          id: 'particle-1',
          position: { x: 100, y: 100 },
          velocity: { x: 5, y: 5 },
          age: 10,
          maxAge: 60,
          colour: '#ff8c00',
          size: 3,
        },
      ];

      const updated = updateParticles(particles);

      expect(updated).not.toBe(particles);
      expect(updated[0]).not.toBe(particles[0]);
      expect(updated[0].position).not.toBe(particles[0].position);
    });
  });

  describe('Particle Lifecycle', () => {
    it('should simulate full particle lifecycle from creation to death', () => {
      let particles: Particle[] = [
        {
          id: 'particle-1',
          position: { x: 100, y: 100 },
          velocity: { x: 5, y: 5 },
          age: 0,
          maxAge: 3, // Short-lived for testing
          colour: '#ff8c00',
          size: 3,
        },
      ];

      // Frame 0: age = 0
      expect(particles.length).toBe(1);
      expect(particles[0].age).toBe(0);

      // Frame 1: age = 1
      particles = updateParticles(particles);
      expect(particles.length).toBe(1);
      expect(particles[0].age).toBe(1);

      // Frame 2: age = 2
      particles = updateParticles(particles);
      expect(particles.length).toBe(1);
      expect(particles[0].age).toBe(2);

      // Frame 3: age = 3, dies (age >= maxAge)
      particles = updateParticles(particles);
      expect(particles.length).toBe(0);
    });

    it('should track particle movement over its lifetime', () => {
      let particles: Particle[] = [
        {
          id: 'particle-1',
          position: { x: 0, y: 0 },
          velocity: { x: 10, y: 0 },
          age: 0,
          maxAge: 5,
          colour: '#ff8c00',
          size: 3,
        },
      ];

      // Track position over 3 frames
      const positions: { x: number; y: number }[] = [{ ...particles[0].position }];

      for (let i = 0; i < 3; i++) {
        particles = updateParticles(particles);
        if (particles.length > 0) {
          positions.push({ ...particles[0].position });
        }
      }

      // Frame 1: vel = 10 * 0.98 = 9.8, pos = 0 + 9.8 = 9.8
      // Frame 2: vel = 9.8 * 0.98 = 9.604, pos = 9.8 + 9.604 = 19.404
      // Frame 3: vel = 9.604 * 0.98 = 9.41192, pos = 19.404 + 9.41192 = 28.81592
      expect(positions.length).toBe(4);
      expect(positions[0].x).toBe(0);
      expect(positions[1].x).toBeCloseTo(9.8, 1);
      expect(positions[2].x).toBeCloseTo(19.404, 1);
      expect(positions[3].x).toBeCloseTo(28.816, 1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle particle with maxAge of 0', () => {
      const particles: Particle[] = [
        {
          id: 'particle-1',
          position: { x: 100, y: 100 },
          velocity: { x: 5, y: 5 },
          age: 0,
          maxAge: 0, // Dies immediately
          colour: '#ff8c00',
          size: 3,
        },
      ];

      const updated = updateParticles(particles);

      expect(updated.length).toBe(0);
    });

    it('should handle particle at exactly maxAge', () => {
      const particles: Particle[] = [
        {
          id: 'particle-1',
          position: { x: 100, y: 100 },
          velocity: { x: 5, y: 5 },
          age: 60,
          maxAge: 60,
          colour: '#ff8c00',
          size: 3,
        },
      ];

      const updated = updateParticles(particles);

      expect(updated.length).toBe(0);
    });

    it('should handle large number of particles', () => {
      const particles: Particle[] = Array.from({ length: 100 }, (_, i) => ({
        id: `particle-${i}`,
        position: { x: i * 10, y: i * 10 },
        velocity: { x: 1, y: 1 },
        age: i % 30, // Varying ages: 0-29
        maxAge: 60,
        colour: '#ff8c00',
        size: 3,
      }));

      const updated = updateParticles(particles);

      expect(updated.length).toBe(100); // All survive this frame
      expect(updated[0].age).toBe(1); // Was 0, now 1
      expect(updated[99].age).toBe(10); // Was 9 (99 % 30 = 9), now 10
    });
  });
});

describe('Particles Integration Tests', () => {
  it('should handle typical explosion lifecycle', () => {
    // Create 10 particles with random lifetimes
    let particles: Particle[] = Array.from({ length: 10 }, (_, i) => ({
      id: `particle-${i}`,
      position: { x: 400, y: 300 },
      velocity: { 
        x: Math.cos(i * Math.PI / 5) * 3, 
        y: Math.sin(i * Math.PI / 5) * 3 
      },
      age: 0,
      maxAge: 30 + Math.floor(Math.random() * 30), // 30-60 frames
      colour: '#ff8c00',
      size: 3,
    }));

    expect(particles.length).toBe(10);

    // Simulate 35 frames
    for (let frame = 0; frame < 35; frame++) {
      particles = updateParticles(particles);
    }

    // Some particles should have died (maxAge 30-60)
    expect(particles.length).toBeLessThan(10);
    expect(particles.length).toBeGreaterThan(0);

    // All remaining should be alive
    particles.forEach(p => {
      expect(p.age).toBeLessThan(p.maxAge);
    });
  });

  it('should correctly update positions with decaying velocity', () => {
    const particle: Particle = {
      id: 'particle-1',
      position: { x: 0, y: 0 },
      velocity: { x: 10, y: 0 },
      age: 0,
      maxAge: 100,
      colour: '#ff8c00',
      size: 3,
    };

    let particles = [particle];
    let totalDistance = 0;

    // Run for 50 frames
    for (let i = 0; i < 50; i++) {
      const oldX = particles[0].position.x;
      particles = updateParticles(particles);
      totalDistance += particles[0].position.x - oldX;
    }

    // With friction, particle should have traveled less than 50 * 10 = 500
    expect(totalDistance).toBeLessThan(500);
    // But should have moved significantly
    expect(totalDistance).toBeGreaterThan(200);
  });

  it('should handle mixed particle states correctly', () => {
    let particles: Particle[] = [
      {
        id: 'young',
        position: { x: 0, y: 0 },
        velocity: { x: 5, y: 5 },
        age: 5,
        maxAge: 100,
        colour: '#ff8c00',
        size: 3,
      },
      {
        id: 'middle',
        position: { x: 100, y: 100 },
        velocity: { x: 3, y: 3 },
        age: 50,
        maxAge: 100,
        colour: '#ff8c00',
        size: 3,
      },
      {
        id: 'old',
        position: { x: 200, y: 200 },
        velocity: { x: 1, y: 1 },
        age: 99,
        maxAge: 100,
        colour: '#ff8c00',
        size: 3,
      },
    ];

    particles = updateParticles(particles);

    expect(particles.length).toBe(2); // 'old' should die
    expect(particles.find(p => p.id === 'young')).toBeDefined();
    expect(particles.find(p => p.id === 'middle')).toBeDefined();
    expect(particles.find(p => p.id === 'old')).toBeUndefined();
  });
});
