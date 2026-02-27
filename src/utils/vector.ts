// Utility file for processing vectors

/**
 * Represents a 2D vector with x and y coordinates
 */
export type Vector2D = { x: number; y: number };

/**
 * Adds two vectors together
 */
export function addVectors(v1: Vector2D, v2: Vector2D): Vector2D {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
}

/**
 * Subtracts v2 from v1
 */
export function subtractVectors(v1: Vector2D, v2: Vector2D): Vector2D {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
}

/**
 * Calculates the distance between two vectors
 */
export function distanceBetweenVectors(v1: Vector2D, v2: Vector2D): number {
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the magnitude (length) of a vector
 */
export function lengthVector(v: Vector2D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function normaliseVector(v: Vector2D): Vector2D {
    const length = lengthVector(v);
    if (length === 0) {
        return { x: 0, y: 0 };
    }
    return { x: v.x / length, y: v.y / length };
}

export function limitVector(v: Vector2D, max: number): Vector2D {
    const length = lengthVector(v);
    if (length > max) {
        const normalised = normaliseVector(v);
        return { x: normalised.x * max, y: normalised.y * max };
    }
    return v;
}

export function multiplyVector(v: Vector2D, weight: number): Vector2D {
    return { x: v.x * weight, y: v.y * weight };
} 

export function divideVector(v: Vector2D, divisor: number): Vector2D {
    if (divisor === 0) return { x: 0, y: 0 };
    return { x: v.x / divisor, y: v.y / divisor };
}