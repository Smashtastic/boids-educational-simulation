// filepath: /Users/admin/Documents/ReactProjects/Boid/src/types/Boid.ts
import type { Vector2D } from '../utils/vector';

/**
 * Represents a Boid entity with position, velocity, and acceleration
 */
export interface Boid {
    id: string;
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    maxSpeed: number;
    colour: string;
}

/**
 * Props for rendering a Boid component
 */
export interface BoidProps {
    boid: Boid;
    color?: string;
    size?: number;
}

export function createBoid(id: string, canvasWidth: number, canvasHeight: number): Boid {
    //colour variation
    const hue = 20 + Math.random() * 20; // orange hues
    const saturation = 80 + Math.random() * 20; // high saturation
    const lightness = 50 + Math.random() * 15; // medium lightness
    const colour = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    return {
        id,
        position: {
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
        },
        velocity: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
        },
        acceleration: {
            x: 0,
            y: 0,
        },
        maxSpeed: 5,
        colour: colour
    };
}

