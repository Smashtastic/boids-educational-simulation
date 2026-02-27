import {createPredator, type Predator} from "./Predator.ts";
import {type Boid, createBoid} from "./Boid.ts";
import type {FlockingParameters} from "../simulation/flocking.ts";
import {createParticleExplosion, type Particle} from "./Particle.ts";

export interface SimulationState {
    boids: Boid[];
    predators: Predator[];
    particles: Particle[]; // For visual effects like trails or explosions
    frameCount: number; // Frame count for tracking simulation steps
    parameters: FlockingParameters;
    dimensions: {width: number, height: number};
}

export type SimulationAction = 
    | { type: 'UPDATE_BOIDS'; payload: { boids: Boid[] } }
    | { type: 'UPDATE_PREDATORS'; payload: { predators: Predator[] } }
    | { type: 'UPDATE_ALL'; payload: { boids: Boid[]; predators: Predator[] } }
    
    | { type: 'ADD_BOID'; payload: { x: number; y: number } }
    | { type: 'ADD_PREDATOR'; payload: { x: number; y: number } }
    | { type: 'REMOVE_BOID'; payload: { boidId: string } }
    | { type: 'REMOVE_BOIDS'; payload: { boidIds: string[] } }
    | { type: 'UPDATE_PARAMETERS'; payload: { name: keyof FlockingParameters; value: number } }
    | { type: 'UPDATE_DIMENSIONS'; payload: { width: number; height: number } }
    
    | { type: 'ADD_PARTICLE'; payload: { position: { x: number; y: number }; colour: string } }
    | { type: 'UPDATE_PARTICLES'; payload: { particles: Particle[] } }

    |   { type: 'RESET' };

export function simulationReducer(state: SimulationState, action: SimulationAction) {
    switch (action.type) {
        case 'UPDATE_BOIDS':
            return {
                ...state,
                boids: action.payload.boids,
                frameCount: state.frameCount + 1
            };
        case 'UPDATE_PREDATORS':
            return {
                ...state,
                predators: action.payload.predators,
            };
        case 'UPDATE_ALL':
            return {
                ...state,
                boids: action.payload.boids,
                predators: action.payload.predators,
                frameCount: state.frameCount + 1
            };
        case 'ADD_BOID':
            return {
                ...state,
                boids: [...state.boids, createBoid(`boid-${state.boids.length}`, action.payload.x, action.payload.y),]
            };
        case 'ADD_PREDATOR':
            return {
                ...state,
                predators: [
                    ...state.predators,
                    createPredator(`predator-${state.predators.length}`, action.payload.x, action.payload.y)
                ]
            };
        case 'REMOVE_BOID':
            return {
                ...state,
                boids: state.boids.filter(boid => boid.id !== action.payload.boidId)
            };
        case 'REMOVE_BOIDS':
            return {
                ...state,
                boids: state.boids.filter(boid => !action.payload.boidIds.includes(boid.id))
            };
        case 'UPDATE_PARAMETERS':
            return {
                ...state,
                parameters: {
                    ...state.parameters,
                    [action.payload.name]: action.payload.value,
                },
            };
        case 'UPDATE_DIMENSIONS':
            return {
                ...state,
                dimensions: {
                    width: action.payload.width,
                    height: action.payload.height,
                },
            };
        case 'ADD_PARTICLE':
            return {
                ...state,
                particles: [
                    ...state.particles,
                    createParticleExplosion(action.payload.position, action.payload.colour)
                ].flat()
            };
        case 'UPDATE_PARTICLES':
            return {
                ...state,
                particles: [
                    ...action.payload.particles
                    ]
            }
        case 'RESET':
            return getInitialSimulationState();
        default:
            return state;
    }
}

export function getInitialSimulationState(): SimulationState {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
        boids: Array.from({ length: 200 }, (_, i) =>
            createBoid(`boid-${i}`, width, height)
        ),
        predators: Array.from({ length: 3 }, (_, i) =>
            createPredator(`predator-${i}`, width, height)
        ),
        particles: [],
        parameters: {
            separationRadius: 30,
            alignmentRadius: 50,
            cohesionRadius: 50,
            separationWeight: 1.8,
            alignmentWeight: 1.2,
            cohesionWeight: 0.8,
            maxAcceleration: 0.15,
            fleeRadius: 60,
            fleeWeight: 5.0,
        },
        frameCount: 0,
        dimensions: {width: width, height: height},
    };
}
