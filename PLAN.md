# Boids Flocking Simulation - Development Plan

## Project Overview
An educational React + TypeScript project that visualizes boids (bird-oid objects) demonstrating flocking behavior. This project uses Canvas for rendering and native React state management tools to help you develop React skills and understand state management patterns.

**Current Status:** Phase 3 Step 10 In Progress - Particle Effects System 🎨💥  
**Technology Stack:** React 18, TypeScript, Vite, Canvas API  
**State Management:** useReducer (migrated from useState)  
**Test Coverage:** 140 tests passing, 38% overall (100% on critical utilities)

**Completed Steps:**
- ✅ Step 1: Boid types and vector math (100% test coverage)
- ✅ Step 2: Canvas component with animation loop
- ✅ Step 3: Initialize boid state with useState
- ✅ Step 4: Boid rendering with direction indicators
- ✅ Step 5: Physics and edge wrapping (100% test coverage)
- ✅ Step 6: Three flocking rules (separation, alignment, cohesion)
- ✅ Step 7: QuadTree spatial partitioning (93% test coverage)
- ✅ Step 8: useReducer migration (complex state management)
- ✅ Step 9: Advanced Predator AI with 4-state behavior system
- 🔄 Step 10: Particle effects and visual polish (IN PROGRESS)
  - ✅ Particle type and factory functions
  - ✅ Particle physics with friction and aging
  - ✅ State management integration
  - ✅ Comprehensive tests (31 tests, 100% coverage)
  - ✅ Animation loop integration
  - ✅ Visual enhancements (color shift, fade curves)
  - ⏳ Final polish and predator visual states

**Current Phase:** Advanced Features & Visual Polish

---

## Phase 1: Core Simulation Setup

### Step 1: Create the Boid Type and Initial Data Structures

**Goal:** Define TypeScript types for boids and create helper functions for vector math.

**What you'll learn:** TypeScript interfaces, type safety, basic vector operations

**Files to create/modify:**
- `src/types/Boid.ts` - Define the Boid interface
- `src/utils/vector.ts` - Vector math utilities (add, subtract, magnitude, normalize, limit)

**Boid Properties:**
```typescript
interface Boid {
  id: number;
  x: number;        // position x
  y: number;        // position y
  vx: number;       // velocity x
  vy: number;       // velocity y
  ax: number;       // acceleration x
  ay: number;       // acceleration y
}
```

**Vector Operations Needed:**
- Add two vectors
- Subtract two vectors
- Calculate magnitude (length)
- Normalize (make unit vector)
- Limit magnitude to max value
- Calculate distance between two points

---

### Step 2: Set Up Canvas Component

**Goal:** Create a Canvas component that renders to screen and sets up the animation loop.

**What you'll learn:** useRef for DOM access, useEffect for lifecycle management, Canvas API basics, requestAnimationFrame

**Files to create:**
- `src/components/Canvas.tsx`

**Key Concepts:**
1. Use `useRef<HTMLCanvasElement>(null)` to access the canvas element
2. Use `useEffect` to set up canvas size and get 2D context
3. Create an animation loop with `requestAnimationFrame`
4. Clear canvas each frame before drawing
5. Accept props for width, height, and a render callback

**Canvas Setup:**
- Default size: 800x600 (make configurable via props)
- Background color: Dark (e.g., #1a1a1a)
- Handle window resize (optional for now)

---

### Step 3: Initialize Boid State with useState

**Goal:** Create initial boid population and manage state in App component.

**What you'll learn:** useState with complex objects, initializing state with functions

**Files to modify:**
- `src/App.tsx`

**Implementation Details:**
1. Start with 50 boids
2. Use `useState<Boid[]>` to store boid array
3. Create initialization function that generates boids with:
   - Random positions within canvas bounds
   - Random velocities (small values, e.g., -2 to 2)
   - Zero initial acceleration
   - Unique IDs

**State Management Decision Point:**
- ✅ **Use useState** for now - simple array of boids
- Later you'll migrate to useReducer when adding controls and more complex state

---

### Step 4: Implement Boid Rendering

**Goal:** Draw boids as orange circles on the canvas.

**What you'll learn:** Canvas drawing API, rendering from state

**Files to modify:**
- `src/App.tsx` or create `src/utils/rendering.ts`

**Drawing Details:**
- Boid radius: 4-6 pixels
- Color: `#ff8c00` (orange)
- Optional: Draw direction indicator (small line showing velocity direction)

**Rendering Function:**
```typescript
function drawBoid(ctx: CanvasRenderingContext2D, boid: Boid) {
  // Draw circle
  // Optional: Draw direction line
}
```

---

### Step 5: Implement Basic Physics Update

**Goal:** Make boids move across the screen with basic physics.

**What you'll learn:** State updates, animation loops, basic physics simulation

**Files to create:**
- `src/simulation/physics.ts`

**Physics Update Steps (per frame):**
1. Apply acceleration to velocity: `velocity += acceleration`
2. Limit velocity to max speed (e.g., 4 pixels/frame)
3. Apply velocity to position: `position += velocity`
4. Reset acceleration to zero (will be recalculated each frame)
5. Handle edge wrapping (boid exits right, appears on left, etc.)

**Edge Behavior Options:**
- **Wrapping** (recommended for Phase 1): Boid appears on opposite side
- Bouncing: Reverse velocity component
- Containment: Keep within bounds

---

## Phase 2: Flocking Behavior

### Step 6: Implement the Three Flocking Rules

**Goal:** Add separation, alignment, and cohesion behaviors.

**What you'll learn:** Algorithm implementation, neighbor detection, force accumulation

**Files to create:**
- `src/simulation/flocking.ts`

**The Three Rules:**

**1. Separation** (avoid crowding)
- Check boids within a small radius (e.g., 25 pixels)
- For each too-close neighbor, create a force away from it
- Stronger force when closer
- Weight: 1.5x (most important)

**2. Alignment** (steer towards average heading)
- Check boids within medium radius (e.g., 50 pixels)
- Calculate average velocity of neighbors
- Steer towards that average
- Weight: 1.0x

**3. Cohesion** (move towards center of group)
- Check boids within medium radius (e.g., 50 pixels)
- Calculate average position of neighbors
- Create force towards that position
- Weight: 1.0x

**Implementation Tips:**
- Create separate function for each rule
- Each function returns a force vector (ax, ay)
- Accumulate all forces before applying to boid
- Tune weights and radii to get pleasing behavior

---

### Step 7: Implement Spatial Partitioning (Quadtree)

**Goal:** Optimize neighbor detection for better performance and prepare for predator interaction.

**What you'll learn:** Spatial data structures, performance optimization, O(n²) → O(n log n)

**Why now:** Essential for:
- Supporting 150+ boids without lag
- Efficient predator-boid interaction (Step 13)
- Real-time performance with complex interactions

**Files to create:**
- `src/simulation/quadtree.ts`

**Current Problem: O(n²) Neighbor Detection**
```
50 boids × 50 boids = 2,500 distance checks per frame
200 boids × 200 boids = 40,000 distance checks per frame (LAG!)
```

**Quadtree Solution: O(n log n)**
- Divide canvas into quadrants recursively
- Only check boids in nearby quadrants
- Reduces checks by 75-90% typically

**Implementation Steps:**

**1. Quadtree Data Structure:**
```typescript
interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

class Quadtree {
  boundary: Rectangle;
  capacity: number;  // Max boids per node (e.g., 4)
  boids: Boid[];
  divided: boolean;
  
  // Subdivisions (when capacity exceeded)
  northeast?: Quadtree;
  northwest?: Quadtree;
  southeast?: Quadtree;
  southwest?: Quadtree;
  
  insert(boid: Boid): boolean;
  subdivide(): void;
  query(range: Rectangle, found: Boid[]): Boid[];
}
```

**2. Query Neighbors in Radius:**
```typescript
export function queryRadius(
  tree: Quadtree, 
  position: Vector2D, 
  radius: number
): Boid[] {
  const range = {
    x: position.x - radius,
    y: position.y - radius,
    width: radius * 2,
    height: radius * 2,
  };
  return tree.query(range, []);
}
```

**3. Integrate into Flocking:**
```typescript
// In App.tsx animation loop:
const animate = () => {
  setBoids(prevBoids => {
    // Build quadtree each frame
    const tree = new Quadtree(canvasBounds, 4);
    prevBoids.forEach(b => tree.insert(b));
    
    return prevBoids.map(boid => {
      // Query neighbors efficiently
      const neighbors = queryRadius(tree, boid.position, 50);
      const flockingForce = applyFlocking(boid, neighbors, params);
      // ... rest of physics
    });
  });
};
```

**Performance Comparison:**
| Boids | Without Quadtree | With Quadtree | Speedup |
|-------|------------------|---------------|---------|
| 50    | 2,500 checks     | ~500 checks   | 5x      |
| 100   | 10,000 checks    | ~1,500 checks | 6.7x    |
| 200   | 40,000 checks    | ~3,500 checks | 11x     |
| 500   | 250,000 checks   | ~12,000 checks| 20x+    |

**When to Implement:**
- ⭐ **Now** - Before adding predator (Step 13)
- ✅ Sets up foundation for complex interactions
- ✅ Lets you increase boid count to 200+ for impressive demos

**Testing Spatial Partitioning:**
1. Increase boid count to 100, then 200
2. Monitor FPS (should stay near 60)
3. Optional: Visualize quadtree boundaries (debug mode)

---

### Step 11: Add Performance Monitoring

**Goal:** Give each boid a unique color within an orange palette for visual variety.

**What you'll learn:** Color manipulation, HSL color space, visual design

**Files to modify:**
- `src/types/Boid.ts` - Add color property
- `src/App.tsx` - Generate colors on creation
- `src/App.tsx` - Use boid color in rendering

**Implementation:**

**1. Add Color to Boid Interface:**
```typescript
export interface Boid {
    id: string;
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    color: string;  // ← New property
}
```

**2. Generate Orange Variations:**
```typescript
// In createBoid function:
export function createBoid(id: string, canvasWidth: number, canvasHeight: number): Boid {
    // Orange hue range: 20-40 degrees
    // Saturation: 80-100%
    // Lightness: 50-65%
    const hue = 20 + Math.random() * 20;  // 20-40 (orange range)
    const saturation = 80 + Math.random() * 20;  // 80-100%
    const lightness = 50 + Math.random() * 15;   // 50-65%
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    return {
        id,
        position: { /* ... */ },
        velocity: { /* ... */ },
        acceleration: { x: 0, y: 0 },
        color,  // ← Assign unique color
    };
}
```

**3. Use Color in Rendering:**
```typescript
const renderBoids = useCallback((ctx: CanvasRenderingContext2D) => {
    boids.forEach(boid => {
        ctx.beginPath();
        ctx.arc(boid.position.x, boid.position.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = boid.color;  // ← Use boid's color
        ctx.fill();
        // ... direction line
    });
}, [boids]);
```

**Color Variations to Try:**
- **Soft Orange:** Hue 20-40, Saturation 70-90%, Lightness 55-70%
- **Vibrant Orange:** Hue 15-35, Saturation 85-100%, Lightness 50-60%
- **Warm Spectrum:** Hue 10-50 (orange to yellow-orange)

**Visual Result:**
- Each boid has a slightly different shade of orange
- Easier to track individual boids
- More organic, natural appearance
- Flocks look like autumn leaves or fireflies

---

### Step 9: Add Movement Randomness & Boundary Behavior

**Goal:** Prevent rigid, uniform behavior and choose edge handling strategy.

**What you'll learn:** Randomness in simulations, boundary conditions, behavior tuning

**Files to modify:**
- `src/simulation/physics.ts`
- `src/simulation/flocking.ts` (optional)

**Part A: Add Random Wandering Force**

**Why:** Without randomness, boids eventually align perfectly and move as a rigid block. Natural flocks have individual variation.

**Implementation - Random Wander:**
```typescript
// In flocking.ts - add new force
export function wander(boid: Boid, wanderStrength: number): Vector2D {
    // Add small random force each frame
    const randomAngle = Math.random() * Math.PI * 2;
    return {
        x: Math.cos(randomAngle) * wanderStrength,
        y: Math.sin(randomAngle) * wanderStrength,
    };
}

// In flockYou function:
export function flockYou(boid: Boid, boids: Boid[], params: FlockingParameters): Vector2D {
    const separationForce = separation(boid, boids, params.separationRadius);
    const alignmentForce = alignment(boid, boids, params.alignmentRadius);
    const cohesionForce = cohesion(boid, boids, params.cohesionRadius);
    const wanderForce = wander(boid, 0.05);  // ← Small random force
    
    // Weight and combine...
    const totalForce = addVectors(
        addVectors(weightedSeparation, weightedAlignment),
        addVectors(weightedCohesion, wanderForce)
    );
    
    return limitVector(totalForce, params.maxAcceleration);
}
```

**Tuning wanderStrength:**
- 0.01-0.03: Subtle variation (natural)
- 0.05-0.1: Noticeable wandering
- 0.2+: Chaotic, drunk boids

**Part B: Boundary Behavior - Choose Your Style**

**Current:** Edge wrapping (boids teleport to opposite side)

**Alternative 1: Boundary Avoidance (Recommended)**
```typescript
export function avoidEdges(
    boid: Boid, 
    width: number, 
    height: number, 
    margin: number
): Vector2D {
    let force: Vector2D = { x: 0, y: 0 };
    
    // Left edge
    if (boid.position.x < margin) {
        force.x = (margin - boid.position.x) / margin;  // Stronger when closer
    }
    // Right edge
    if (boid.position.x > width - margin) {
        force.x = -(boid.position.x - (width - margin)) / margin;
    }
    // Top edge
    if (boid.position.y < margin) {
        force.y = (margin - boid.position.y) / margin;
    }
    // Bottom edge
    if (boid.position.y > height - margin) {
        force.y = -(boid.position.y - (height - margin)) / margin;
    }
    
    return force;
}

// In App.tsx animation loop:
const edgeAvoidance = avoidEdges(boid, width, height, 50);
const totalForce = addVectors(flockingForce, multiplyVector(edgeAvoidance, 1.5));
```

**Alternative 2: Bounce (Hard Boundary)**
```typescript
export function bounceOffEdges(boid: Boid, width: number, height: number): Boid {
    let newVelocity = { ...boid.velocity };
    let newPosition = { ...boid.position };
    
    // Bounce off left/right
    if (newPosition.x < 0 || newPosition.x > width) {
        newVelocity.x *= -1;
        newPosition.x = Math.max(0, Math.min(width, newPosition.x));
    }
    
    // Bounce off top/bottom
    if (newPosition.y < 0 || newPosition.y > height) {
        newVelocity.y *= -1;
        newPosition.y = Math.max(0, Math.min(height, newPosition.y));
    }
    
    return { ...boid, velocity: newVelocity, position: newPosition };
}
```

**Comparison:**

| Method | Pros | Cons | Use Case |
|--------|------|------|----------|
| **Wrapping** | Infinite space feel | Can be disorienting | Space theme, abstract |
| **Avoidance** | Natural, no jarring changes | Requires tuning margin | Most realistic |
| **Bounce** | Clear boundaries | Can feel rigid | Aquarium, contained space |

**Recommendation:** 
- Start with **Avoidance** (natural flocking within bounds)
- Keep wrapping as fallback safety (if boid escapes)
- Make it switchable via parameter

**Add to FlockingParameters:**
```typescript
export interface FlockingParameters {
    // ... existing properties
    wanderStrength: number;      // 0.05
    boundaryMargin: number;      // 50
    boundaryWeight: number;      // 1.5
    useBoundaryAvoidance: boolean;  // true
}
```

**Visual Result:**
- Boids explore naturally but stay on screen
- Groups split and reform more organically
- No jarring teleportation mid-flock
- More interesting to watch!

---

### Step 10: Add Behavior Parameter Tuning

**Goal:** Make flocking parameters adjustable to experiment with behavior.

**What you'll learn:** Controlled components, real-time parameter updates

**Note:** You can now tune: flocking weights, radii, wander strength, and boundary behavior!

**Files to modify:**
- `src/App.tsx`
- Create `src/components/Controls.tsx`

**Parameters to Expose:**
1. Separation weight (0-3)
2. Alignment weight (0-3)
3. Cohesion weight (0-3)
4. Perception radius (20-100)
5. Max speed (2-8)
6. Max force (0.05-0.5)
7. Separation radius (15-50)

**UI Controls:**
- Range sliders with labels
- Display current values
- Reset to defaults button

**State Management Decision Point:**
- ⚠️ **Consider useReducer** - You now have multiple related state values
- Or keep useState if you're comfortable managing multiple pieces of state

---

## Phase 3: Interactivity & Polish

### Step 9: Add Performance Monitoring

**Goal:** Display FPS and boid count on screen.

**What you'll learn:** Performance measurement, overlay UI

**Files to create:**
- `src/components/Stats.tsx`

**Display:**
- FPS (frames per second)
- Boid count
- Optional: Update time in ms

**Implementation:**
- Calculate FPS from requestAnimationFrame timestamps
- Display in top-left corner with semi-transparent background
- Update every 10-30 frames for smooth display

---

### Step 12: Add Play/Pause and Step Controls

**Goal:** Control simulation playback for observation and debugging.

**What you'll learn:** Animation control, state management for UI

**Files to modify:**
- `src/App.tsx`
- `src/components/Controls.tsx`

**Controls to Add:**
1. Play/Pause button
2. Step forward (single frame)
3. Reset simulation
4. Adjust simulation speed (0.25x to 2x)

**State Additions:**
- `isPlaying: boolean`
- `simulationSpeed: number`

---

### Step 13: Click to Add Boids

**Goal:** Dynamically add boids at mouse click position.

**What you'll learn:** Mouse events, dynamic state updates, Canvas coordinate mapping

**Files to modify:**
- `src/components/Canvas.tsx`
- `src/App.tsx`

**Implementation:**
1. Add `onClick` handler to canvas
2. Get mouse coordinates relative to canvas
3. Create new boid at that position with random velocity
4. Add to boids array
5. Optional: Add visual feedback (ripple effect)

**State Management Decision Point:**
- ✅ **useReducer recommended** - Complex state updates (adding boids with specific properties)
- Actions: ADD_BOID, REMOVE_BOID, UPDATE_BOIDS, RESET

---

### Step 14: Visual Enhancements

**Goal:** Make the simulation more visually appealing.

**What you'll learn:** Canvas drawing techniques, visual design

**Note:** Color variation already implemented in Step 8!

**Additional Enhancement Ideas:**

**1. Trail Effect**
- Don't clear canvas completely each frame
- Draw semi-transparent background rectangle for fade effect

**2. Boid Shapes**
- Draw triangles pointing in direction of movement
- Vary size slightly per boid

**3. Speed-Based Coloring**
- Modify boid brightness/saturation based on speed
- Faster = brighter/more saturated

**4. Neighbor Lines**
- Draw faint lines between nearby boids
- Makes flocking behavior more visible

**5. Boundary Visual**
- Draw frame around canvas area

---

## Phase 3: Advanced AI & Interactivity

### Step 9: Intelligent Predator AI System 🎯 CURRENT

**Goal:** Create menacing, intelligent predators that hunt boids using sophisticated multi-stage AI behaviors.

**What you'll learn:** 
- Autonomous agent design
- Behavior state machines
- AI decision-making
- Spatial queries with QuadTree
- Dynamic entity management with reducer actions

**Current State:**
- ✅ 3 basic predators exist with simple movement
- ✅ Boids have flee behavior (but not working optimally)
- ✅ useReducer state management in place
- ⏳ Need: Intelligent predator behaviors
---

#### **Predator AI Architecture**

**Design Philosophy:** Each predator is an independent agent with its own decision-making process. They should feel menacing but fair - giving boids a chance to escape while creating dramatic tension.

**State Machine: Four Behavioral States**

```
┌──────────┐
│  PATROL  │ ← Default state, searching for prey
└─────┬────┘
      │ (cluster detected within perception radius)
      ↓
┌──────────┐
│  STALK   │ ← Circling cluster, looking for weak target
└─────┬────┘
      │ (isolated boid found)
      ↓
┌──────────┐
│  STRIKE  │ ← Rapid acceleration towards target
└─────┬────┘
      │ (strike succeeds/fails)
      ↓
┌──────────┐
│ COOLDOWN │ ← Rest period, boids regroup
└─────┬────┘
      │ (timer expires)
      └─────→ back to PATROL
```

---

#### **Part A: Predator Type Extension**

**Files to modify:**
- `src/types/Predator.ts`

**Add AI State Properties:**
```typescript
export interface Predator extends Boid {
    // Behavioral state
    aiState: 'PATROL' | 'STALK' | 'STRIKE' | 'COOLDOWN';
    
    // Target tracking
    targetBoidId: string | null;
    targetCluster: Vector2D | null;  // Center of mass to move towards
    
    // Timing
    stateTimer: number;  // Frames in current state
    cooldownDuration: number;  // How long to rest after strike
    
    // Parameters
    perceptionRadius: number;  // How far predator can "see"
    stalkRadius: number;  // Distance to maintain while stalking
    strikeSpeed: number;  // Acceleration during strike
}
```

**Factory Function Updates:**
```typescript
export function createPredator(id: string, width: number, height: number): Predator {
    return {
        id,
        position: { /* random */ },
        velocity: { /* slower than boids */ },
        acceleration: { x: 0, y: 0 },
        colour: generateRedHue(),  // Red predators
        
        // AI State
        aiState: 'PATROL',
        targetBoidId: null,
        targetCluster: null,
        
        // Timing
        stateTimer: 0,
        cooldownDuration: 180,  // 3 seconds at 60 FPS
        
        // Parameters
        perceptionRadius: 150,
        stalkRadius: 80,
        strikeSpeed: 12,
    };
}
```

---

#### **Part B: Behavior Implementation**

**Files to create:**
- `src/simulation/predatorAI.ts`

**1. PATROL Behavior**

**Goal:** Search for boid clusters, avoid screen edges

```typescript
export function patrolBehavior(
    predator: Predator,
    tree: QuadTree,
    width: number,
    height: number
): Vector2D {
    // Query QuadTree for nearby boids
    const nearbyBoids = tree.query({
        xCoordinate: predator.position.x - predator.perceptionRadius,
        yCoordinate: predator.position.y - predator.perceptionRadius,
        width: predator.perceptionRadius * 2,
        height: predator.perceptionRadius * 2
    });
    
    // If cluster found, calculate center of mass
    if (nearbyBoids.length >= 3) {
        const centerOfMass = calculateCenterOfMass(nearbyBoids);
        
        // Transition to STALK if close enough
        const distanceToCluster = distance(predator.position, centerOfMass);
        if (distanceToCluster < predator.stalkRadius + 30) {
            // State transition handled in main update
            predator.aiState = 'STALK';
            predator.targetCluster = centerOfMass;
        }
        
        // Move towards cluster center
        const direction = normalize(subtract(centerOfMass, predator.position));
        return multiply(direction, 0.3);  // Moderate speed
    }
    
    // No cluster found - avoid edges and wander
    const edgeAvoidance = avoidEdges(predator, width, height, 100);
    const wanderForce = wander(0.1);
    
    return add(multiply(edgeAvoidance, 2.0), wanderForce);
}
```

**2. STALK Behavior**

**Goal:** Circle cluster periphery, identify isolated targets

```typescript
export function stalkBehavior(
    predator: Predator,
    boids: Boid[],
    tree: QuadTree
): Vector2D {
    // Update cluster center (boids are moving)
    const nearbyBoids = tree.query(/* perception range */);
    
    if (nearbyBoids.length === 0) {
        // Cluster escaped, return to patrol
        predator.aiState = 'PATROL';
        predator.targetCluster = null;
        return { x: 0, y: 0 };
    }
    
    const clusterCenter = calculateCenterOfMass(nearbyBoids);
    predator.targetCluster = clusterCenter;
    
    // Find isolated boid (far from cluster center)
    const isolatedBoid = findIsolatedBoid(nearbyBoids, clusterCenter);
    
    if (isolatedBoid) {
        // Found target! Prepare to strike
        const distanceToTarget = distance(predator.position, isolatedBoid.position);
        
        if (distanceToTarget < predator.stalkRadius) {
            predator.aiState = 'STRIKE';
            predator.targetBoidId = isolatedBoid.id;
            predator.stateTimer = 0;
        }
    }
    
    // Circle around cluster at stalkRadius distance
    const toCenter = subtract(clusterCenter, predator.position);
    const distanceToCenter = magnitude(toCenter);
    
    // Perpendicular vector for circling
    const tangent = { x: -toCenter.y, y: toCenter.x };
    const tangentNormalized = normalize(tangent);
    
    // Combine: move towards ideal orbit distance + circle motion
    const orbitCorrection = distanceToCenter > predator.stalkRadius ? 
        normalize(toCenter) : multiply(normalize(toCenter), -1);
    
    return add(
        multiply(tangentNormalized, 0.5),      // Circle motion
        multiply(orbitCorrection, 0.3)         // Distance correction
    );
}
```

**3. STRIKE Behavior**

**Goal:** Rapid pursuit of target boid

```typescript
export function strikeBehavior(
    predator: Predator,
    boids: Boid[]
): Vector2D {
    // Find target boid
    const targetBoid = boids.find(b => b.id === predator.targetBoidId);
    
    if (!targetBoid) {
        // Target escaped or removed
        predator.aiState = 'COOLDOWN';
        predator.targetBoidId = null;
        predator.stateTimer = 0;
        return { x: 0, y: 0 };
    }
    
    // Calculate intercept point (lead target)
    const interceptPoint = calculateInterceptPoint(
        predator.position,
        targetBoid.position,
        targetBoid.velocity,
        predator.strikeSpeed
    );
    
    // Full speed ahead!
    const direction = normalize(subtract(interceptPoint, predator.position));
    const strikeForce = multiply(direction, 1.5);  // Max acceleration
    
    // Check if caught (within strike distance)
    const distanceToTarget = distance(predator.position, targetBoid.position);
    if (distanceToTarget < 10) {  // Caught!
        // Dispatch action to remove boid (handled in App.tsx)
        predator.aiState = 'COOLDOWN';
        predator.targetBoidId = null;
        predator.stateTimer = 0;
        
        // Return a special marker or dispatch event
        // For now, return zero force
    }
    
    // Strike duration limit (give up after 3 seconds)
    predator.stateTimer++;
    if (predator.stateTimer > 180) {
        predator.aiState = 'COOLDOWN';
        predator.targetBoidId = null;
        predator.stateTimer = 0;
    }
    
    return strikeForce;
}
```

**4. COOLDOWN Behavior**

**Goal:** Rest period, slow movement

```typescript
export function cooldownBehavior(
    predator: Predator,
    width: number,
    height: number
): Vector2D {
    predator.stateTimer++;
    
    // Return to patrol after cooldown
    if (predator.stateTimer >= predator.cooldownDuration) {
        predator.aiState = 'PATROL';
        predator.stateTimer = 0;
    }
    
    // Slow, wandering movement
    const edgeAvoidance = avoidEdges(predator, width, height, 100);
    const slowWander = wander(0.05);
    
    return add(
        multiply(edgeAvoidance, 1.5),
        multiply(slowWander, 0.5)
    );
}
```

---

#### **Part C: Integration**

**Files to modify:**
- `src/App.tsx`

**Main Predator Update Logic:**
```typescript
const animate = () => {
    const tree = new QuadTree(/* ... */);
    stateRef.current.boids.forEach(boid => tree.insert(boid));
    
    // Update each predator based on AI state
    const updatedPredators = stateRef.current.predators.map(predator => {
        let aiForce: Vector2D;
        
        switch (predator.aiState) {
            case 'PATROL':
                aiForce = patrolBehavior(predator, tree, width, height);
                break;
            case 'STALK':
                aiForce = stalkBehavior(predator, stateRef.current.boids, tree);
                break;
            case 'STRIKE':
                aiForce = strikeBehavior(predator, stateRef.current.boids);
                // Check for successful strike
                if (predator.aiState === 'COOLDOWN') {
                    // Dispatch REMOVE_BOID action
                    const targetId = predator.targetBoidId;
                    if (targetId) {
                        dispatch({ type: 'REMOVE_BOID', payload: { id: targetId } });
                    }
                }
                break;
            case 'COOLDOWN':
                aiForce = cooldownBehavior(predator, width, height);
                break;
        }
        
        // Apply force and update physics
        const updated = updateBoid({
            ...predator,
            acceleration: aiForce
        }, predator.aiState === 'STRIKE' ? 12 : 7);
        
        return wrapBoidPosition(updated, width, height);
    });
    
    // Continue with boid updates...
};
```

---

#### **Part D: Boid Flee Enhancement**

**Files to modify:**
- `src/simulation/flocking.ts`

**Fix Current Flee Behavior:**

**Issue:** Boids likely using stale predator positions or flee force too weak

**Solution:**
```typescript
export function flee(
    boid: Boid,
    predators: Predator[],
    fleeRadius: number,
    fleeWeight: number
): Vector2D {
    let fleeForce: Vector2D = { x: 0, y: 0 };
    let predatorCount = 0;
    
    for (const predator of predators) {
        const distance = distance(boid.position, predator.position);
        
        if (distance < fleeRadius && distance > 0) {
            // Vector away from predator
            const away = subtract(boid.position, predator.position);
            const normalized = normalize(away);
            
            // Stronger when closer (inverse square law)
            const strength = (fleeRadius - distance) / fleeRadius;
            const scaledForce = multiply(normalized, strength * strength);
            
            fleeForce = add(fleeForce, scaledForce);
            predatorCount++;
        }
    }
    
    if (predatorCount > 0) {
        // Normalize total flee force
        fleeForce = normalize(fleeForce);
        // Apply strong weight - this should override other behaviors
        return multiply(fleeForce, fleeWeight);
    }
    
    return { x: 0, y: 0 };
}
```

**Debugging Aid:**
```typescript
// Add logging to see if flee is triggering
if (predatorCount > 0) {
    console.log(`Boid ${boid.id} fleeing from ${predatorCount} predators`);
}
```

---

#### **Part E: Reducer Actions**

**Files to modify:**
- `src/types/SimulationState.ts`

**Add REMOVE_BOID Action:**
```typescript
export type SimulationAction = 
    // ...existing actions...
    | { type: 'REMOVE_BOID'; payload: { id: string } };
```

**Handle in Reducer:**
```typescript
case 'REMOVE_BOID':
    return {
        ...state,
        boids: state.boids.filter(b => b.id !== action.payload.id)
    };
```

---

#### **Success Criteria**

✅ **Predators patrol independently**  
✅ **Predators detect and stalk boid clusters**  
✅ **Predators identify isolated targets**  
✅ **Predators strike with increased speed**  
✅ **Boids flee dramatically when predator nearby**  
✅ **Caught boids removed from simulation**  
✅ **Predators rest after strike (cooldown)**  
✅ **System maintains 60 FPS with 200 boids + 3 predators**

---

#### **Educational Outcomes**

- ✅ Understanding AI state machines
- ✅ Implementing autonomous agents
- ✅ Using QuadTree for spatial queries
- ✅ Balancing game mechanics (challenge vs fairness)
- ✅ Utilizing reducer actions for dynamic entity management
- ✅ Debugging emergent AI behaviors
- ✅ Parameter tuning for desired gameplay feel

---

#### **Extension Ideas (After Core Working)**

- **Pack Hunting:** Predators coordinate attacks
- **Learning:** Predators adapt to boid flee patterns
- **Territory:** Predators claim regions
- **Energy:** Predators must eat to survive
- **Reproduction:** New boids spawn over time

---

### Step 10: Visual Polish & Feedback

**Prerequisites:** 
- ⚠️ **Complete Step 7 (Spatial Partitioning) first!**
- Quadtree makes predator-boid detection efficient
- Without it, checking 200 boids vs predator = slow

**What you'll need:**
1. Predator type (larger, different color - red)
2. Predator behavior (chase nearest boid or center of mass)
3. Flee behavior for boids (high-priority avoidance force)
4. Click/key to spawn predator

**Flocking Rule Addition:**
- **Flee from predators**: Strong force away from predators (weight: 3-5x)

---

### Step 16: Mouse Interaction

**Goal:** Influence boids with mouse position.

**Options:**
1. **Attract mode**: Boids move towards mouse
2. **Repel mode**: Boids flee from mouse
3. **Toggle**: Click to switch modes

**Implementation:**
- Track mouse position with mousemove event
- Add mouse as an influence point in flocking calculations

---

### Step 17: State Management Refactor

**Goal:** If needed, explore more advanced state management.

**When to do this:**
- You feel useState/useReducer is becoming unwieldy
- You want to learn external state management

**Options:**
1. **Context API** - Share state without prop drilling
2. **Zustand** - Lightweight external state (recommended for learning)
3. **Redux Toolkit** - Industry standard, more boilerplate

---

## Learning Path: State Management

### When to Use What

**useState** ✅ Start here
- Single values or simple arrays
- Local component state
- Few state variables (1-5)

**useReducer** → Migrate when you have:
- Multiple related state values
- Complex state updates
- State transitions that depend on previous state
- Need for predictable state updates

**Example Migration Point (Step 11):**
```typescript
// Before: Multiple useState
const [boids, setBoids] = useState<Boid[]>([])
const [isPlaying, setIsPlaying] = useState(true)
const [speed, setSpeed] = useState(1)
const [params, setParams] = useState(defaultParams)

// After: Single useReducer
const [state, dispatch] = useReducer(simulationReducer, initialState)
// dispatch({ type: 'ADD_BOID', payload: newBoid })
// dispatch({ type: 'UPDATE_PARAMETERS', payload: newParams })
```

---

## Debugging Tips

### Common Issues

**1. Boids cluster in corner or don't move**
- Check: Edge wrapping logic
- Check: Acceleration is being applied to velocity
- Check: Velocity is being applied to position

**2. Boids move too fast or erratically**
- Reduce max speed (try 2-4 instead of 10)
- Reduce max force (try 0.1-0.2)
- Check: Are you limiting velocity magnitude?

**3. Poor performance/low FPS**
- Reduce boid count
- Check: Are you recalculating distances efficiently?
- Add spatial hashing (Step 7)
- Use squared distances (avoid Math.sqrt)

**4. No flocking behavior**
- Check: Are forces being accumulated correctly?
- Check: Perception radius (too small = no neighbors)
- Verify: Each rule is returning non-zero forces
- Debug: Console.log neighbor counts

---

## Resources

### Flocking Algorithm
- [Craig Reynolds' Boids](http://www.red3d.com/cwr/boids/) - Original paper
- [Boids Pseudocode](https://vergenet.net/~conrad/boids/pseudocode.html)

### React + Canvas
- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [React useEffect Hook](https://react.dev/reference/react/useEffect)
- [React useReducer Hook](https://react.dev/reference/react/useReducer)

### Vector Math
- [Vector Math for Game Programmers](https://www.mathsisfun.com/algebra/vectors.html)

---

## Success Criteria

### Phase 1 Complete When:
- ✅ 50 boids moving on screen
- ✅ Orange circles rendering smoothly
- ✅ Edge wrapping works
- ✅ Steady 60 FPS

### Phase 2 Complete When:
- ✅ Boids exhibit clear flocking behavior
- ✅ Groups form and move together
- ✅ No collision/overlap issues
- ✅ Parameters are tunable with immediate feedback

### Phase 3 Complete When:
- ✅ Play/pause works
- ✅ Can add boids by clicking
- ✅ Performance stats visible
- ✅ Visually polished

---

## Next Steps

1. **Start with Step 1** - Create type definitions
2. **Ask for help anytime** - Each step is independent
3. **Experiment freely** - This is a learning playground
4. **Commit after each step** - Track your progress

**Ready to begin? Start with Step 1: "Create the Boid Type and Initial Data Structures"**

Ask me for help with any step by saying: "Help me with Step [number]" or "I'm stuck on [specific issue]"

