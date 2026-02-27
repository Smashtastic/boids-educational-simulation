import type { Particle } from '../types/Particle';

/**
 * Updates a single particle's state for one frame
 * - Increments age
 * - Updates position based on velocity
 * - Applies friction to velocity (0.98 multiplier)
 * 
 * @param particle - The particle to update
 * @returns A new particle object with updated properties (immutable)
 */
export function updateParticle(particle: Particle): Particle {
    // Apply friction to velocity (slow down over time)
    const newVelocity = {
        x: particle.velocity.x * 0.98,
        y: particle.velocity.y * 0.98,
    };

    // Update position based on velocity
    const newPosition = {
        x: particle.position.x + newVelocity.x,
        y: particle.position.y + newVelocity.y,
    };

    // Return new particle with updated values (immutable)
    return {
        ...particle,
        position: newPosition,
        velocity: newVelocity,
        age: particle.age + 1,
    };
}

/**
 * Updates all particles and filters out dead ones
 * - Updates each particle's physics
 * - Removes particles where age >= maxAge
 * 
 * @param particles - Array of particles to update
 * @returns New array with updated, living particles only
 */
export function updateParticles(particles: Particle[]): Particle[] {
    return particles
        .map(updateParticle)
        .filter(particle => particle.age < particle.maxAge);
}
