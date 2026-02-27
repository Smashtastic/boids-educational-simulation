import type {Boid} from "../types/Boid.ts";
import {
    addVectors,
    limitVector,
} from "../utils/vector.ts";
import type {Predator} from "../types/Predator.ts";

export function updateBoid(boid: Boid, maxSpeed: number): Boid {
    const newVelocity = limitVector(addVectors(boid.velocity, boid.acceleration), maxSpeed);
    const newPosition = addVectors(boid.position, newVelocity);
    
    return {
        ...boid,
        position: newPosition,
        velocity: newVelocity,
        acceleration: { x: 0, y: 0 }, // Reset acceleration after each update
    };

}

export function updatePredator(predator: Predator, maxSpeed: number): Predator {
    const newVelocity = limitVector(addVectors(predator.velocity, predator.acceleration), maxSpeed);
    const newPosition = addVectors(predator.position, newVelocity);

    return {
        ...predator,
        position: newPosition,
        velocity: newVelocity,
        acceleration: { x: 0, y: 0 }, // Reset acceleration after each update
    };

}

export function wrapBoidPosition(boid: Boid, canvasWidth: number, canvasHeight: number): Boid {
    let x = boid.position.x;
    let y = boid.position.y;

    // Wrap X coordinate
    if (x >= canvasWidth) x = 0;
    if (x < 0) x = canvasWidth;

    // Wrap Y coordinate
    if (y >= canvasHeight) y = 0;
    if (y < 0) y = canvasHeight;

    return {
        ...boid,
        position: { x, y },  // Return NEW position object
    };
}