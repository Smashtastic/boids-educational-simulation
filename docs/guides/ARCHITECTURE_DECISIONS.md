# Architecture Decisions & Trade-offs 🏗️

This document explores design decisions for your boid simulation and explains the reasoning behind different approaches.

---

## Question 1: What is useRef Doing?

### The Problem It Solves

Look at your animation loop in `App.tsx`:

```typescript
const animate = () => {
    // Update predators first
    setPredators(prevPredators => {
        const updatedPredators = /* ... */;
        return updatedPredators;
    });
    
    // Update boids - but needs current predator positions!
    setBoids(prevBoids => {
        const currentPredators = /* ??? How to get them? */
        // ...
    });
};
```

**The Issue:** React state updates are **asynchronous**. When you call `setPredators()`, the `predators` variable doesn't update immediately. So when you call `setBoids()` right after, you still have the OLD predator positions!

### The Solution: useRef

```typescript
const predatorsRef = useRef<Predator[]>(predators);

// Keep ref in sync with state
useEffect(() => {
    predatorsRef.current = predators;
}, [predators]);

// In animation loop
setBoids(prevBoids => {
    const currentPredators = predatorsRef.current; // ✅ Always current!
    // ...
});
```

### What is useRef?

Think of `useRef` as a **box** that can hold a value:

```typescript
const box = useRef(initialValue);

// Put something in the box
box.current = newValue;

// Take something out of the box
const value = box.current;
```

**Key Properties:**
1. ✅ **Persists** across re-renders (doesn't reset like a regular variable)
2. ✅ **Mutable** - you can change `.current` directly
3. ✅ **Doesn't trigger re-renders** when changed
4. ✅ **Synchronous** - always has the latest value

### useRef vs useState

```typescript
// useState
const [value, setValue] = useState(0);
setValue(1); // ❌ Async, triggers re-render, can't read new value immediately

// useRef
const valueRef = useRef(0);
valueRef.current = 1; // ✅ Sync, no re-render, can read immediately
```

### Common Uses of useRef

#### 1. **Accessing DOM Elements**
```typescript
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    // Draw on canvas
}, []);

return <canvas ref={canvasRef} />;
```

#### 2. **Storing Mutable Values** (your case!)
```typescript
const predatorsRef = useRef<Predator[]>([]);
predatorsRef.current = newPredators; // Update without re-render
```

#### 3. **Storing Previous Values**
```typescript
const prevCountRef = useRef<number>();

useEffect(() => {
    prevCountRef.current = count; // Store for next render
});

const countIncreased = count > (prevCountRef.current ?? 0);
```

#### 4. **Storing Timers/Intervals**
```typescript
const timerRef = useRef<number>();

const startTimer = () => {
    timerRef.current = setInterval(() => {
        console.log('tick');
    }, 1000);
};

const stopTimer = () => {
    clearInterval(timerRef.current);
};
```

### Why Not Just Use a Regular Variable?

```typescript
// ❌ This won't work!
function Component() {
    let value = 0;
    
    useEffect(() => {
        value = 1; // Sets to 1
    }, []);
    
    // On next render, value is 0 again! (re-initialized)
}

// ✅ This works!
function Component() {
    const valueRef = useRef(0);
    
    useEffect(() => {
        valueRef.current = 1; // Persists across renders
    }, []);
    
    // On next render, valueRef.current is still 1
}
```

**Every render creates a NEW function**, so local variables are re-initialized. `useRef` survives across renders.

---

## Question 2: Should Predators Extend Boid?

### Option A: Predators Extend Boid (Inheritance)

```typescript
// types/Boid.ts
interface Boid {
    id: string;
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    colour: string;
    maxSpeed: number;
}

// types/Predator.ts
interface Predator extends Boid {
    // Predators have all Boid properties, plus:
    hungerLevel?: number;
    attackRange?: number;
}
```

**Pros:**
- ✅ **Single array**: `entities: (Boid | Predator)[]` - simpler state
- ✅ **Single QuadTree**: Both types in same spatial structure
- ✅ **Code reuse**: Use same physics functions (`updateBoid`, `wrapBoidPosition`)
- ✅ **Simpler animation loop**: One loop instead of two
- ✅ **Type safety**: TypeScript knows predators have all Boid properties

**Cons:**
- ❌ **Type discrimination**: Need to check `if (entity.type === 'predator')` everywhere
- ❌ **Behavior mixing**: Predators flock differently - need special handling
- ❌ **Harder to optimize**: Can't optimize boid vs predator calculations separately
- ❌ **Unclear semantics**: Is a predator *really* a boid?

### Option B: Separate Types (Composition)

```typescript
// types/Entity.ts
interface Entity {
    id: string;
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    colour: string;
    maxSpeed: number;
}

// types/Boid.ts
type Boid = Entity; // Just an entity

// types/Predator.ts
type Predator = Entity; // Also just an entity
```

**Current approach**: Separate arrays

**Pros:**
- ✅ **Clear separation**: Boids and predators are conceptually different
- ✅ **Independent optimization**: Optimize each behavior separately
- ✅ **Simpler logic**: No type checking needed
- ✅ **Easier to understand**: Clear what affects what

**Cons:**
- ❌ **Duplicate state**: Two arrays to manage
- ❌ **Separate QuadTrees**: Could use one for both
- ❌ **Synchronization**: Need `useRef` trick for shared access
- ❌ **More code**: Two loops, two updates

### Option C: Union with Discriminated Types (Best of Both?)

```typescript
interface BoidEntity {
    type: 'boid';
    id: string;
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    colour: string;
    maxSpeed: number;
}

interface PredatorEntity {
    type: 'predator';
    id: string;
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    colour: string;
    maxSpeed: number;
    attackRange: number; // Predator-specific
}

type Entity = BoidEntity | PredatorEntity;

// Now you can have one array
const entities: Entity[] = [...boids, ...predators];

// TypeScript knows which is which
entities.forEach(entity => {
    if (entity.type === 'predator') {
        // entity.attackRange is available here
    } else {
        // entity is a boid
    }
});
```

**Pros:**
- ✅ **Single array**: Unified entity management
- ✅ **Type-safe discrimination**: TypeScript helps you
- ✅ **Single QuadTree**: All entities in one spatial structure
- ✅ **Flexible**: Easy to add new entity types (obstacles, food, etc.)

**Cons:**
- ❌ **Type guards everywhere**: Must check `entity.type` frequently
- ❌ **Behavior dispatch**: Need to route to correct behavior functions
- ❌ **More complex**: More abstraction layers

### Recommendation

**For learning React state management**: Stick with **Option B (Separate Arrays)**

**Why?**
1. **Clearer mental model**: Helps you understand React state independently
2. **Simpler to reason about**: Each state piece has clear purpose
3. **Teaches important patterns**: Like the `useRef` synchronization trick
4. **Less TypeScript complexity**: Focus on React, not type gymnastics

**Later** (Phase 2/3), you could refactor to **Option C** to learn:
- Union types and type narrowing
- More advanced TypeScript patterns
- Performance optimizations with single QuadTree

---

## Question 3: Including Predators in QuadTree

### Current: Predators NOT in QuadTree

```typescript
const tree = new QuadTree(...);
prevBoids.forEach(boid => tree.insert(boid)); // Only boids

return prevBoids.map(boid => {
    const flockingForce = flockYou(boid, params, tree, currentPredators);
    // Predators passed separately ^^^
});
```

### Option: Predators IN QuadTree

```typescript
const tree = new QuadTree(...);
prevBoids.forEach(boid => tree.insert(boid));
currentPredators.forEach(pred => tree.insert(pred)); // Add predators too

return prevBoids.map(boid => {
    const nearbyEntities = tree.query(boid.position, radius);
    const nearbyBoids = nearbyEntities.filter(e => e.type === 'boid');
    const nearbyPredators = nearbyEntities.filter(e => e.type === 'predator');
    
    const flockingForce = flockYou(boid, params, nearbyBoids);
    const fleeForce = flee(boid, nearbyPredators);
});
```

### Trade-offs

**Predators IN tree:**
- ✅ Efficient spatial queries (O(log n) instead of O(n))
- ✅ Useful when many predators (10+)
- ✅ One query finds both boids and predators nearby
- ❌ Need discriminated union types
- ❌ Need type guards/filtering

**Predators NOT in tree (current):**
- ✅ Simple - no type discrimination needed
- ✅ Fine for small number of predators (3-5)
- ✅ Clear separation of concerns
- ❌ Fleeing checks all predators (O(n))
- ❌ Doesn't scale if you add 50+ predators

### When to Switch?

**Use separate arrays when:**
- Few predators (< 10)
- Different update frequencies (predators update slower?)
- Very different behaviors
- Learning/prototyping phase

**Use unified QuadTree when:**
- Many predators (10+)
- Performance becomes an issue
- Need efficient "what's near me?" queries
- Production/optimized phase

---

## Real-World Analogy

### Separate Arrays (Current)
```
Kitchen:
- Fridge (boids)
- Pantry (predators)

To make a recipe:
1. Get ingredients from fridge
2. Get ingredients from pantry
3. Cook

Clear where everything is, but you walk to two places.
```

### Union Type in One Array
```
Kitchen:
- One big storage unit (all entities)
- Items labeled "fridge" or "pantry"

To make a recipe:
1. Go to storage
2. Check labels to find what you need
3. Cook

One location, but need to read labels.
```

### Which is Better?

**Depends on the recipe!**
- **Simple meals (current phase)**: Separate storage is clearer
- **Complex meals (later)**: Unified storage becomes more efficient

---

## Question 4: Predator Chase Behavior

Since you want to implement this yourself (great for learning!), here are **guiding questions** to think about:

### 1. What Should Predators Chase?

- Nearest boid?
- Weakest/slowest boid?
- Boid in front of them?
- Random boid within range?

### 2. How to Find Target?

**Option A: Find nearest boid**
```typescript
function findNearestBoid(predator: Predator, boids: Boid[]): Boid | null {
    // How would you implement this?
    // Hint: Calculate distance to each boid, find minimum
}
```

**Option B: Use QuadTree** (if predators in tree)
```typescript
function findNearestBoid(predator: Predator, tree: QuadTree): Boid | null {
    // Query nearby entities
    // Filter for boids
    // Find closest
}
```

### 3. How to Calculate Chase Force?

Think about steering behaviors:
```typescript
function chase(predator: Predator, target: Boid): Vector {
    // What direction should predator move?
    // How fast should they accelerate?
    // Should speed depend on distance?
}
```

**Hints:**
- Desired velocity = direction to target × max speed
- Steering force = desired velocity - current velocity
- Maybe limit steering force?

### 4. When to Give Up Chase?

- If target is too far away?
- After a certain time?
- If can't catch target?

### 5. How Does This Change State?

**With useState:**
```typescript
// Need to track target for each predator?
const [predatorTargets, setPredatorTargets] = useState<Map<string, string>>();
```

**With useReducer:**
```typescript
interface PredatorState {
    id: string;
    position: Vector;
    // ...
    targetBoidId: string | null; // Who am I chasing?
    chaseStartTime: number; // How long have I been chasing?
}

type SimulationAction = 
    | { type: 'SET_PREDATOR_TARGET'; payload: { predatorId: string; targetId: string } }
    | { type: 'CLEAR_PREDATOR_TARGET'; payload: { predatorId: string } };
```

### Learning Exercise

Try answering these questions **before** implementing:
1. What data do predators need to make chase decisions?
2. Where should that data live? (state? local variables?)
3. How does chase behavior interact with flocking behavior?
4. What happens if multiple predators chase same boid?

Write down your thoughts, then start implementing!

---

## Summary: Your Current Architecture

### What You Have
```
State Management: useState (two separate arrays)
├── boids: Boid[]
└── predators: Predator[]

Synchronization: useRef
└── predatorsRef: keeps predators accessible during boid updates

Spatial Optimization: QuadTree
└── Only contains boids (predators excluded)

Animation Loop: useEffect + requestAnimationFrame
├── Update predators
├── Update ref
└── Update boids (using ref to access predators)
```

### What You're Learning

1. ✅ **useState**: Managing arrays of entities
2. ✅ **useRef**: Synchronizing asynchronous state updates
3. ✅ **useEffect**: Animation loops and cleanup
4. 🎯 **useReducer**: Next step for complex state management
5. 🎯 **Custom hooks**: After useReducer, extract reusable logic
6. 🎯 **Type architecture**: Inheritance vs composition

---

## Advice for Educational Projects

### Do in This Order

**Phase 1: Current (useState)**
- ✅ Learn basic hooks
- ✅ Understand async state updates
- ✅ Practice with simple state

**Phase 2: useReducer**
- 🎯 Consolidate state
- 🎯 Add user controls (pause, speed, reset)
- 🎯 Learn action-based updates

**Phase 3: Refactor Types**
- Consider unified Entity type
- Add predators to QuadTree
- Implement chase behavior

**Phase 4: Optimize**
- Custom hooks
- Memoization
- Performance profiling

### Why This Order?

Each phase teaches **one new concept** at a time:
- Phase 1: React basics ✓
- Phase 2: Advanced state management (useReducer)
- Phase 3: Type architecture
- Phase 4: Performance optimization

**Don't try to learn everything at once!** You're doing great by taking it step by step.

---

## Next Steps

1. **Read USEREDUCER_EXERCISE.md** - Comprehensive guide to migrating
2. **Experiment with useReducer** - Start the migration
3. **After comfortable with useReducer** - Implement chase behavior
4. **After chase works** - Consider architecture refactor

You've asked excellent questions that show you're thinking deeply about trade-offs. That's the mark of a good engineer! 🎉
