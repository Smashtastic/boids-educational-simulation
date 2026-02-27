
import {
    addVectors,
    distanceBetweenVectors,
    multiplyVector,
    normaliseVector,
    subtractVectors,
    type Vector2D
} from "../utils/vector.ts";
import type {Boid} from "../types/Boid.ts";
import type {QuadTree} from "./quadtree.ts";
import {type Predator} from "../types/Predator.ts";

// helper functions
export function calculateCenterOfMass(boids: Boid[]): Vector2D {
    const sumX = boids.reduce((sum, boid) => sum + boid.position.x, 0);
    const sumY = boids.reduce((sum, boid) => sum + boid.position.y, 0);
    return {
        x: sumX / boids.length,
        y: sumY / boids.length,
    };
}

export function findIsolatedBoid(boids: Boid[], clusterCenter: Vector2D): Boid | null {
    if (boids.length < 1) return null;
    
    let isolatedBoid: Boid | null = null;
    let maxDistance = 0;

    boids.forEach(boid => {
        const distance = Math.hypot(boid.position.x - clusterCenter.x, boid.position.y - clusterCenter.y);
        if (distance > maxDistance) {
            maxDistance = distance;
            isolatedBoid = boid;
        }
    });

    return isolatedBoid;
}

export function avoidBoundaries(predator: Predator, width: number, height: number): Vector2D {
    const marginX = predator.velocity.x > 0 ? width - predator.position.x : predator.position.x;
    const marginY = predator.velocity.y > 0 ? height - predator.position.y : predator.position.y;
    
    const steer: Vector2D = { x: 0, y: 0 };
    if (marginX < predator.aiState.perceptionRadius) {
        const force = (predator.aiState.perceptionRadius - marginX)/predator.aiState.perceptionRadius;
        steer.x = predator.velocity.x > 0 ? -1*force : force;
    }
    if (marginY < predator.aiState.perceptionRadius) {
        const force = (predator.aiState.perceptionRadius - marginY)/predator.aiState.perceptionRadius;
        steer.y = predator.velocity.y > 0 ? -1*force : force;
    }
    if (steer.x === 0 && steer.y === 0) {
        return steer;
    }
    return normaliseVector(steer);
}

// behaviour functions
export function patrolBehaviour( predator: Predator, tree: QuadTree, width: number, height: number): Vector2D {
    // Move towards the center of mass in the quad tree
    const searchRectangle = tree.queryRadius(predator.position, predator.aiState.perceptionRadius);
    const localBoids = tree.query(searchRectangle, []);
    
    if (localBoids.length === 0) {
        return avoidBoundaries(predator, width, height);
    }
    const moveTowardsBoids = subtractVectors(calculateCenterOfMass(localBoids), predator.position);
    return addVectors(avoidBoundaries(predator, width, height), moveTowardsBoids);
}

// Circle a cluster of boids, if there is an isolated boid switch to strike, if the cluster scatters switch to patrol
export function stalkBehaviour(predator: Predator, tree: QuadTree): Vector2D {
    const stalkRectangle = tree.queryRadius(predator.position, predator.aiState.stalkRadius);
    const targetCluster = tree.query(stalkRectangle, []); 
    if (targetCluster.length === 0) return { x: 0, y: 0 }// target cluster cannot be empty because we only enter stalk behaviour if there are boids in the stalk radius
    
    const center = calculateCenterOfMass(targetCluster);
    const currentAngle = Math.atan2(predator.position.y - center.y, predator.position.x - center.x);
    const orbitAngle = currentAngle + 0.05;
    const decreasingRadius = Math.max(15, distanceBetweenVectors(predator.position, center) * 0.9)
    const orbitX = center.x + decreasingRadius * Math.cos(orbitAngle);
    const orbitY = center.y + decreasingRadius * Math.sin(orbitAngle);
    return normaliseVector(subtractVectors({ x: orbitX, y: orbitY }, predator.position));
    
}

export function strikeBehaviour(predator: Predator, tree: QuadTree): Vector2D {
    const strikeRectangle = tree.queryRadius(predator.position, predator.aiState.strikeRadius);
    const strikekableBoids = tree.query(strikeRectangle, []);
    if (strikekableBoids.length === 0) return { x: 0, y: 0 }; // should never happen because we only enter strike behaviour if there are boids in the strike radius
    
    const targetBoid = strikekableBoids[0]; // target the first boid in the strike radius - this is a simple heuristic that works well when there are few boids in the strike radius, but may need to be improved if there are many boids in the strike radius.
    return subtractVectors(targetBoid.position, predator.position);
}

export function cooldownBehaviour(predator: Predator, width: number, height: number): Vector2D {
    ++predator.timingParameters.stateTimer;
    if (predator.timingParameters.stateTimer >= predator.timingParameters.cooldownDuration) { predator.aiState.currentState = "PATROL"; }
    return multiplyVector(avoidBoundaries(predator, width, height), 0.2)
}

export function updatePredatorState(predator: Predator, tree: QuadTree): void {
    const strikeRectangle = tree.queryRadius(predator.position, predator.aiState.strikeRadius);
    const strikekableBoids = tree.query(strikeRectangle, []);
    
    if (strikekableBoids.length > 0 && (predator.aiState.currentState === "STALK" || predator.aiState.currentState === "STRIKE")) {
        predator.aiState.currentState = "STRIKE";
        return;
    }

    if (predator.aiState.currentState === "STRIKE") {
        predator.aiState.currentState = "COOLDOWN";
        predator.timingParameters.stateTimer = 0;
        return;
    }
    
    const stalkRectangle = tree.queryRadius(predator.position, predator.aiState.stalkRadius);
    const stalkableBoids = tree.query(stalkRectangle, []);
    
    if (stalkableBoids.length > 0) {
        predator.aiState.currentState = "STALK";
        return;
    }
    
    predator.aiState.currentState = "PATROL";
}

export function stateBasedSpeedModifier(predator: Predator): number {
    switch (predator.aiState.currentState) {
        case "PATROL":
            return 0.3;
        case "STALK":
            return 0.5;
        case "STRIKE":
            return 1;
        case "COOLDOWN":
            return 0.2;
        default:
            return 0.3;
    }
}

