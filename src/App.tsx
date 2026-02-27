import { Canvas } from './components/Canvas';
import './App.css'
import {useEffect, useCallback, useReducer, useRef, useState} from "react";
import {updateBoid, updatePredator, wrapBoidPosition} from "./simulation/physics.ts";
import {type FlockingParameters, flockYou} from "./simulation/flocking.ts";
import {QuadTree} from "./simulation/quadtree.ts";
import {getInitialSimulationState, simulationReducer} from "./types/SimulationState.ts";
import {
    cooldownBehaviour,
    patrolBehaviour,
    stalkBehaviour,
    stateBasedSpeedModifier, strikeBehaviour,
    updatePredatorState
} from "./simulation/predatorAI.ts";
import {colourPredator, type Predator} from "./types/Predator.ts";
import {distanceBetweenVectors} from "./utils/vector.ts";
import {updateParticles} from "./simulation/particles.ts";
import {createParticleExplosion, type Particle} from "./types/Particle.ts";
import {shiftColorToDarkerRed} from "./utils/colorUtils.ts";

function App() {
    const [state, dispatch] = useReducer(simulationReducer, getInitialSimulationState())
    const [announcement, setAnnouncement] = useState<string>("");
    
    const stateRef = useRef(state);
    useEffect(() => {stateRef.current = state}, [state]);
    
    // Store the setter in a ref so the animation loop always has the current version
    const setAnnouncementRef = useRef(setAnnouncement);
    useEffect(() => {setAnnouncementRef.current = setAnnouncement}, []);
    
    useEffect(() => {
        const resizeWindow = () => dispatch({ type: "UPDATE_DIMENSIONS", payload: { width: window.innerWidth, height: window.innerHeight } });
        window.addEventListener("resize", resizeWindow);
        return () => window.removeEventListener("resize", resizeWindow);
    }, []);
    
    useEffect(() => {
        let animationFrameId: number;
        
        const flockingParams: FlockingParameters = stateRef.current.parameters;
        
        const animate = () => {
            const tree = new QuadTree({xCoordinate: 0, yCoordinate: 0, width: stateRef.current.dimensions.width, height: stateRef.current.dimensions.height}, 6);
            stateRef.current.boids.forEach(boid => tree.insert(boid));
            
            const updatedPredators: Predator[] = stateRef.current.predators.map(predator => {
                updatePredatorState(predator, tree);
                let steering;
                switch (predator.aiState.currentState) {
                    case "PATROL":
                        steering = patrolBehaviour(predator, tree, stateRef.current.dimensions.width, stateRef.current.dimensions.height);
                        break;
                    case "STALK":
                        steering = stalkBehaviour(predator, tree);
                        break;
                    case "STRIKE": 
                        steering = strikeBehaviour(predator, tree);
                        break;
                    case "COOLDOWN":
                        steering = cooldownBehaviour(predator, stateRef.current.dimensions.width, stateRef.current.dimensions.height);
                        break;
                    default:
                        steering = { x: 0, y: 0 };
                }
                 
                return updatePredator({...predator, acceleration: steering, colour: colourPredator(predator.colourSeed, predator.aiState.currentState)}, predator.maxSpeed * stateBasedSpeedModifier(predator));
            });

            const updatedBoids = stateRef.current.boids.map(boid => {
                const flockingForce = flockYou(boid, flockingParams, tree, updatedPredators);
                const updated = updateBoid({...boid, acceleration: flockingForce}, boid.maxSpeed);
                return wrapBoidPosition(updated, stateRef.current.dimensions.width, stateRef.current.dimensions.height);
            });
            
            const deadBoids: string[] = [];
            const newParticles: Particle[] = [];
            
            const survivors = updatedBoids.filter(boid => {
                for (const predator of updatedPredators) {
                    if (predator.aiState.currentState === "STRIKE" && distanceBetweenVectors(boid.position, predator.position) < 15) { // boid size + predator size
                        deadBoids.push(boid.id);
                        predator.aiState.currentState = "COOLDOWN";
                        predator.timingParameters.stateTimer = 0;
                        
                        // Create particles with darker, red-shifted color
                        const particleColor = shiftColorToDarkerRed(boid.colour);
                        const particles = createParticleExplosion(boid.position, particleColor, 10);
                        newParticles.push(...particles);
                        
                        return false;
                    } 
                }
                return true;
            })
            
            if( deadBoids.length > 0 ) {
                setAnnouncementRef.current(`Arrrrrgh! ${deadBoids[0]} was eaten by a predator!`);
            }
            
            // Update existing particles and merge with new ones
            const updatedExistingParticles = updateParticles(stateRef.current.particles);
            const allParticles = [...updatedExistingParticles, ...newParticles];
            
            dispatch({ type: "UPDATE_ALL", payload:  { boids: survivors, predators: updatedPredators } });
            dispatch({ type: "REMOVE_BOIDS", payload: { boidIds: deadBoids } });
            dispatch({ type: "UPDATE_PARTICLES", payload: { particles: allParticles}})
            
            // Schedule next frame
            animationFrameId = requestAnimationFrame(animate);
        };
        
        //start the animation loop
        animationFrameId = requestAnimationFrame(animate);
        
        //cleanup function to stop the animation loop
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [state.dimensions.width, state.dimensions.height]); //trigger to re-run if width or height changes
    
    const render = useCallback((ctx: CanvasRenderingContext2D) => {
        // Draw boids
        state.boids.forEach((boid) => {
            ctx.beginPath();
            ctx.arc(boid.position.x, boid.position.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = boid.colour;
            ctx.fill();
            
            // draw direction line
            const lineLength = 10;
            const angle = Math.atan2(boid.velocity.y, boid.velocity.x);
            const lineEndX = boid.position.x + Math.cos(angle) * lineLength;
            const lineEndY = boid.position.y + Math.sin(angle) * lineLength;
            ctx.beginPath();
            ctx.moveTo(boid.position.x, boid.position.y);
            ctx.lineTo(lineEndX, lineEndY);
            ctx.strokeStyle = '#000000';
            ctx.stroke();
        });
        
        // Draw predators
        state.predators.forEach((predator) => {
            ctx.beginPath();
            ctx.arc(predator.position.x, predator.position.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = predator.colour;
            ctx.fill();

            // draw direction line
            const lineLength = 10;
            const angle = Math.atan2(predator.velocity.y, predator.velocity.x);
            const lineEndX = predator.position.x + Math.cos(angle) * lineLength;
            const lineEndY = predator.position.y + Math.sin(angle) * lineLength;
            ctx.beginPath();
            ctx.moveTo(predator.position.x, predator.position.y);
            ctx.lineTo(lineEndX, lineEndY);
            ctx.strokeStyle = '#000000';
            ctx.stroke();
        });
        
        // Draw particles
        state.particles.forEach((particle) => {
            // Calculate progress (0 to 1)
            const progress = particle.age / particle.maxAge;
            ctx.globalAlpha = 1 - (progress * progress); // Quadratic ease-out
            ctx.beginPath();
            ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.colour;
            ctx.fill();
        });
        ctx.globalAlpha = 1; // reset alpha
    }, [state.boids, state.predators, state.particles]);

    return (
        <>
            <div
                aria-live="assertive"
                aria-atomic={true}
                className={"sr-only"}
            >
                {announcement}
            </div>
            <Canvas width={state.dimensions.width} height={state.dimensions.height} render={render} />
        </>
        
    );
}

export default App
