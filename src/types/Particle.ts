import type {Vector2D} from "../utils/vector.ts";

export interface Particle {
    id: string;
    position: Vector2D;
    velocity: Vector2D;
    age: number;
    maxAge: number;
    colour: string;
    size: number;
}

export function createParticle(id: string, position: Vector2D, colour: string) {
    const angle = Math.random() * 2 * Math.PI; // Random angle in radians
    return {
        id,
        position,
        velocity: { x: Math.cos(angle) * (Math.random() * 2 + 2), y: Math.sin(angle) * (Math.random() * 2 + 2) },
        age: 0,
        maxAge: 60 + Math.random() * 30,
        colour,
        size: 2 + Math.random() * 2, // random size between 2 and 4
    };
}

export function createParticleExplosion(position: Vector2D, colour: string, count: number = 8): Particle[] {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
        particles.push(createParticle(Date.now().toString() + i.toString(), { ...position }, colour));
    }
    return particles;
}

