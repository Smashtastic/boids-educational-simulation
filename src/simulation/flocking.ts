import type {Boid} from "../types/Boid.ts";
import {
    addVectors,
    distanceBetweenVectors, divideVector, limitVector, multiplyVector,
    normaliseVector,
    subtractVectors,
    type Vector2D
} from "../utils/vector.ts";
import type {QuadTree} from "./quadtree.ts";
import type {Predator} from "../types/Predator.ts";

export interface FlockingParameters {
    separationRadius: number;
    alignmentRadius: number;
    cohesionRadius: number;
    separationWeight: number;
    alignmentWeight: number;
    cohesionWeight: number;
    maxAcceleration: number;
    fleeRadius: number;
    fleeWeight: number;
}

export function separation(boid: Boid, desiredSeparation: number, tree: QuadTree): Vector2D {
    let force: Vector2D = { x: 0, y: 0 };
    let count = 0;
    const nearbyBoids = findNearbyBoids(boid, desiredSeparation, tree);
    nearbyBoids.forEach(nearbyBoid => {
        const distance = distanceBetweenVectors(boid.position, nearbyBoid.position);
        if (nearbyBoid.id !== boid.id && distance < desiredSeparation && distance > 0) {
            const difference = subtractVectors(boid.position, nearbyBoid.position);
            const weightedDifference = divideVector(difference, distance);
            force = addVectors(force, weightedDifference);
            count ++;
        }
    });
    if (count > 0) force = normaliseVector(divideVector(force, count));
    return force;
}

export function alignment(boid: Boid, neighborDist: number, tree: QuadTree): Vector2D {
    let averageVelocity: Vector2D = { x: 0, y: 0 };
    let count = 0;
    const nearbyBoids = findNearbyBoids(boid, neighborDist, tree);
    nearbyBoids.forEach(nearbyBoid => {
        const distance = distanceBetweenVectors(boid.position, nearbyBoid.position);
        if (nearbyBoid.id !== boid.id && distance < neighborDist && distance > 0) {
            averageVelocity = addVectors(averageVelocity, nearbyBoid.velocity);
            count++;
        }
    });
    if (count > 0) {
        averageVelocity = divideVector(averageVelocity, count);
        return normaliseVector(subtractVectors(averageVelocity, boid.velocity));
    } else return { x: 0, y: 0 };
}

export function cohesion(boid: Boid, neighborDist: number, tree: QuadTree): Vector2D {
    let centerOfMass: Vector2D = { x: 0, y: 0 };
    let count = 0;
    const nearbyBoids = findNearbyBoids(boid, neighborDist, tree);
    nearbyBoids.forEach(nearbyBoid => {
        const distance = distanceBetweenVectors(boid.position, nearbyBoid.position);
        if (nearbyBoid.id !== boid.id && distance < neighborDist && distance > 0) {
            centerOfMass = addVectors(centerOfMass, nearbyBoid.position);
            count++;
        }
    });

    if (count > 0) {
        centerOfMass = divideVector(centerOfMass, count);
        return normaliseVector(subtractVectors(centerOfMass, boid.position));
    } else return { x: 0, y: 0 };
}

export function wander(wanderlust: number): Vector2D {
    const angle = Math.random() * Math.PI * 2;
    return {
        x: Math.cos(angle) * wanderlust,
        y: Math.sin(angle) * wanderlust,
    };
}

export function flee(boid: Boid, fleeRadius: number, predators: Predator[]): Vector2D {
    const nearbyPredators = predators.filter(predator => {
        const d = distanceBetweenVectors(boid.position, predator.position);
        return d < fleeRadius && d > 0;
    });
    
    if (nearbyPredators.length === 0) return { x: 0, y: 0 };
    
    let count = 0;
    let force: Vector2D = { x: 0, y: 0 };
    nearbyPredators.forEach(predator => {
        const distance = distanceBetweenVectors(boid.position, predator.position);
        const difference = subtractVectors(boid.position, predator.position);
        const weightedDifference = divideVector(difference, distance);
        force = addVectors(force, weightedDifference);
        count ++;
    })
    
    if (count > 0) {
        force = divideVector(force, count);
    }
    return force;
}

export function flockYou(boid: Boid, params: FlockingParameters, tree: QuadTree, predators: Predator[]): Vector2D {
    
    const separationForce = separation(boid, params.separationRadius, tree);
    const alignmentForce = alignment(boid, params.alignmentRadius, tree);
    const cohesionForce = cohesion(boid, params.cohesionRadius, tree);
    const wanderForce = wander(0.08);
    const fleeForce = flee(boid, params.fleeRadius, predators)

    const weightedSeparation = multiplyVector(separationForce, params.separationWeight);
    const weightedAlignment = multiplyVector(alignmentForce, params.alignmentWeight);
    const weightedCohesion = multiplyVector(cohesionForce, params.cohesionWeight);
    const weightedFlee = multiplyVector(fleeForce, params.fleeWeight);

    const flockingForce = limitVector(addVectors(addVectors(addVectors(weightedAlignment, weightedCohesion), weightedSeparation), wanderForce), params.maxAcceleration);
    return addVectors(flockingForce, weightedFlee);
}

function findNearbyBoids(boid: Boid, radius: number, tree: QuadTree): Boid[] {
    const searchRectangle = tree.queryRadius(boid.position, radius);
    return tree.query(searchRectangle);
}