import type {Vector2D} from "../utils/vector.ts";

export interface Predator {
    
    id: string;
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    maxSpeed: number;
    colour: string;
    colourSeed: number; // for consistent colour generation across states
    aiState: {
        perceptionRadius: number;
        stalkRadius: number;
        strikeRadius: number;
        strikeSpeed: number;
        currentState: 'PATROL' | 'STALK' | 'STRIKE' | 'COOLDOWN';
    };
    timingParameters: {
        stateTimer: number; // frames
        cooldownDuration: number; // frames
    }
    targetBoidId: string | null;
    targetCluster: Vector2D | null;
}

export function colourPredator(seed: number, state: 'PATROL' | 'STALK' | 'STRIKE' | 'COOLDOWN'): string {
    let hue;
    let saturation;
    let lightness;
    
    // Menacing colors that contrast with orange boids - dark to bright as intensity increases
    switch (state) {
        case 'PATROL':
            // Dark teal/cyan - calm but ominous
            hue = 180 + seed * 20; // Cyan-teal range: 180-200°
            saturation = 50 + seed * 20; // (50-70%)
            lightness = 25 + seed * 10; // (25-35%) - dark
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        case 'STALK':
            // Deep purple - building menace
            hue = 270 + seed * 30; // Purple range: 270-300°
            saturation = 50 + seed * 20; // (50-70%)
            lightness = 35 + seed * 10; // (35-45%) - medium dark
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        case 'STRIKE':
            // - maximum threat
            hue = 270 + seed * 30; 
            saturation = 85 + seed * 15; // (85-100%) - vivid
            lightness = 45 + seed * 15; // (45-60%) - bright and menacing
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        case 'COOLDOWN':
            // Desaturated gray-blue - exhausted
            hue = 200 + seed * 20; // Blue-gray range: 200-220°
            saturation = 20 + seed * 15; // (20-35%) - low saturation
            lightness = 30 + seed * 15; // (30-45%) - dark and subdued
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
}

export function createPredator(id: string, canvasWidth: number, canvasHeight: number): Predator {
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
        maxSpeed: 6,
        colour: colourPredator(Math.random(), 'PATROL'),
        colourSeed: Math.random(),
        aiState: {
            perceptionRadius: 200 + Math.random() * 50, // 200-250
            stalkRadius: 150 + Math.random() * 30, // 50-80
            strikeRadius: 50,
            strikeSpeed: 3 + Math.random() * 9, // 3-12 - some strikes will miss but most won't.
            currentState: 'PATROL',
        },
        timingParameters: {
            stateTimer: 0,
            cooldownDuration: 480 + Math.random() * 180, // 480-660 frames (8-11 seconds at 60fps)
        },
        targetBoidId: null,
        targetCluster: null,
    };
}
    
