# 🪝 React Hooks Guide for Boids Project

A practical guide to React hooks specifically for this Boids simulation project.

---

## 📚 Table of Contents

1. [useState - Managing Simulation State](#usestate)
2. [useEffect - Animation Loop & Lifecycle](#useeffect)
3. [useRef - Canvas Access & Values](#useref)
4. [useReducer - Complex State (Later)](#usereducer)
5. [Custom Hooks - Reusable Logic](#custom-hooks)
6. [Common Patterns & Gotchas](#common-patterns)

---

## 🔵 useState - Managing Simulation State

### When to Use
- Storing the array of boids
- Play/pause state
- Simulation parameters (speed, weights, etc.)
- Any value that should trigger re-render when changed

### Phase 1 Usage: Boids Array

**Example: Initializing Boids**
```typescript
const [boids, setBoids] = useState<Boid[]>(() => {
  // Function initializer - runs only once!
  return Array.from({ length: 50 }, (_, i) => ({
    id: `boid-${i}`,
    position: { x: Math.random() * 800, y: Math.random() * 600 },
    velocity: { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2 },
    acceleration: { x: 0, y: 0 }
  }));
});
```

**Why function initializer?**
- Heavy computation (creating 50 boids)
- Only needs to run once, not on every render
- Performance optimization

### Updating Boids Array

**❌ WRONG - Mutates State**
```typescript
const updateBoids = () => {
  boids.forEach(boid => {
    boid.position.x += boid.velocity.x; // MUTATING!
  });
  setBoids(boids); // Same reference, React won't re-render!
};
```

**✅ CORRECT - Immutable Update**
```typescript
const updateBoids = () => {
  setBoids(prevBoids => 
    prevBoids.map(boid => ({
      ...boid,
      position: {
        x: boid.position.x + boid.velocity.x,
        y: boid.position.y + boid.velocity.y
      }
    }))
  );
};
```

**Why this works:**
- Creates new array with map()
- Creates new objects with spread operator
- React detects new reference and re-renders
- Maintains immutability

### Adding a Boid (Click to Add)

**Example: Adding Boid at Mouse Position**
```typescript
const addBoid = (x: number, y: number) => {
  setBoids(prevBoids => [
    ...prevBoids,
    {
      id: `boid-${Date.now()}`, // Simple unique ID
      position: { x, y },
      velocity: { 
        x: Math.random() * 4 - 2, 
        y: Math.random() * 4 - 2 
      },
      acceleration: { x: 0, y: 0 }
    }
  ]);
};
```

**Key Points:**
- Use function form `prevBoids =>` to access current state
- Spread previous array, add new boid
- Returns new array

### Multiple Related State Variables

**Phase 1 Approach:**
```typescript
const [boids, setBoids] = useState<Boid[]>([]);
const [isPlaying, setIsPlaying] = useState(true);
const [speed, setSpeed] = useState(1);
```

**When this gets unwieldy (5+ variables), migrate to useReducer!**

---

## 🟢 useEffect - Animation Loop & Lifecycle

### When to Use
- Setting up canvas after component mounts
- Starting/stopping animation loop
- Subscribing to events
- Any side effect that needs to sync with component lifecycle

### Phase 1 Usage: Animation Loop

**Example: Simple Animation Loop**
```typescript
useEffect(() => {
  if (!isPlaying) return; // Early exit if paused

  let animationId: number;
  
  const animate = () => {
    // Update boid positions
    updateBoids();
    
    // Continue loop
    animationId = requestAnimationFrame(animate);
  };
  
  // Start the loop
  animationId = requestAnimationFrame(animate);
  
  // Cleanup function - runs when effect re-runs or component unmounts
  return () => {
    cancelAnimationFrame(animationId);
  };
}, [isPlaying]); // Re-run effect when isPlaying changes
```

**What's Happening:**
1. Effect runs when component mounts (and when dependencies change)
2. Checks if simulation is playing
3. Defines recursive animate function
4. Starts animation loop
5. Returns cleanup function to stop animation
6. Cleanup runs before effect re-runs or when component unmounts

### Dependency Array Rules

**No Dependencies - Runs Every Render (Usually Wrong!)**
```typescript
useEffect(() => {
  console.log('Every render!');
}); // Missing dependency array - probably a bug
```

**Empty Dependencies - Runs Once on Mount**
```typescript
useEffect(() => {
  console.log('Component mounted');
  return () => console.log('Component unmounting');
}, []); // Empty array = runs once
```

**With Dependencies - Runs When Dependencies Change**
```typescript
useEffect(() => {
  console.log('Playing state changed:', isPlaying);
}, [isPlaying]); // Runs when isPlaying changes
```

### Common useEffect Gotcha: Stale Closures

**❌ PROBLEM - Stale State**
```typescript
const [count, setCount] = useState(0);

useEffect(() => {
  const animate = () => {
    console.log(count); // Always logs 0! Stale closure!
    requestAnimationFrame(animate);
  };
  animate();
}, []); // Empty dependencies - count is "captured" at initial value
```

**✅ SOLUTION 1 - Use Function Form**
```typescript
const [count, setCount] = useState(0);

useEffect(() => {
  const animate = () => {
    setCount(prev => prev + 1); // Use previous value
    requestAnimationFrame(animate);
  };
  animate();
}, []);
```

**✅ SOLUTION 2 - Use Ref (Covered Below)**

### Setting Up Canvas

**Example: Canvas Initialization**
```typescript
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Setup
  canvas.width = 800;
  canvas.height = 600;
  
  console.log('Canvas ready!');
  
  // No cleanup needed for this particular effect
}, []); // Run once on mount
```

---

## 🟡 useRef - Canvas Access & Values

### Two Use Cases

**1. Accessing DOM Elements (Most Common in This Project)**
**2. Storing Mutable Values That Don't Trigger Re-renders**

### Use Case 1: Canvas Reference

**Example: Getting Canvas Element**
```typescript
function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Not yet mounted
    
    const ctx = canvas.getContext('2d');
    // Now you can draw!
  }, []);
  
  return <canvas ref={canvasRef} />;
}
```

**Why useRef?**
- Gives you direct access to DOM element
- Persists across renders
- Changing ref.current doesn't cause re-render

### Use Case 2: Avoiding Stale Closures

**Problem: Animation loop needs latest state without re-creating effect**

**Example: Using Ref for Current Value**
```typescript
const [speed, setSpeed] = useState(1);
const speedRef = useRef(speed);

// Keep ref in sync with state
useEffect(() => {
  speedRef.current = speed;
}, [speed]);

useEffect(() => {
  const animate = () => {
    // Always has latest speed value!
    const currentSpeed = speedRef.current;
    updateBoids(currentSpeed);
    requestAnimationFrame(animate);
  };
  animate();
}, []); // No dependency on speed, but we have latest value via ref
```

**When to use this pattern:**
- Animation loops that need current values
- Event handlers set up once but need latest state
- Performance optimization (avoid recreating expensive functions)

### Ref vs State Decision Tree

```
Does changing this value need to trigger a re-render?
├─ YES → useState
│   └─ Examples: boids array, isPlaying, UI controls
└─ NO → useRef
    └─ Examples: canvas element, animation frame ID, previous value
```

---

## 🟣 useReducer - Complex State (Phase 2+)

### When to Migrate from useState

**Signals to migrate:**
- 5+ related state variables
- Complex state updates
- State transitions with logic
- Actions that update multiple pieces of state
- Testing state logic separately from components

### Example: Simulation State with useReducer

**State Shape:**
```typescript
interface SimulationState {
  boids: Boid[];
  isPlaying: boolean;
  speed: number;
  parameters: {
    separationWeight: number;
    alignmentWeight: number;
    cohesionWeight: number;
    perceptionRadius: number;
    maxSpeed: number;
  };
}
```

**Action Types:**
```typescript
type SimulationAction =
  | { type: 'ADD_BOID'; payload: { x: number; y: number } }
  | { type: 'UPDATE_BOIDS'; payload: Boid[] }
  | { type: 'TOGGLE_PLAYING' }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'UPDATE_PARAMETER'; payload: { key: string; value: number } }
  | { type: 'RESET' };
```

**Reducer Function:**
```typescript
function simulationReducer(
  state: SimulationState, 
  action: SimulationAction
): SimulationState {
  switch (action.type) {
    case 'ADD_BOID':
      return {
        ...state,
        boids: [
          ...state.boids,
          createBoid(action.payload.x, action.payload.y)
        ]
      };
      
    case 'UPDATE_BOIDS':
      return { ...state, boids: action.payload };
      
    case 'TOGGLE_PLAYING':
      return { ...state, isPlaying: !state.isPlaying };
      
    case 'SET_SPEED':
      return { ...state, speed: action.payload };
      
    case 'UPDATE_PARAMETER':
      return {
        ...state,
        parameters: {
          ...state.parameters,
          [action.payload.key]: action.payload.value
        }
      };
      
    case 'RESET':
      return getInitialState();
      
    default:
      return state;
  }
}
```

**Using the Reducer:**
```typescript
function App() {
  const [state, dispatch] = useReducer(simulationReducer, null, getInitialState);
  
  const handleClick = (x: number, y: number) => {
    dispatch({ type: 'ADD_BOID', payload: { x, y } });
  };
  
  const handleTogglePlay = () => {
    dispatch({ type: 'TOGGLE_PLAYING' });
  };
  
  // ...
}
```

**Benefits:**
- All state logic in one place (easier to test!)
- Clear action names (self-documenting)
- Predictable state updates
- Easy to log/debug actions

---

## 🔶 Custom Hooks - Reusable Logic

### When to Create Custom Hooks

**Signals:**
- Same hook logic used in multiple components
- Complex logic you want to name and reuse
- Want to test hook logic separately

### Example: useAnimationLoop

**Create the Hook:**
```typescript
// src/hooks/useAnimationLoop.ts

function useAnimationLoop(
  callback: (deltaTime: number) => void,
  isRunning: boolean
) {
  const callbackRef = useRef(callback);
  const previousTimeRef = useRef<number>();
  
  // Keep callback ref current
  useEffect(() => {
    callbackRef.current = callback;
  });
  
  useEffect(() => {
    if (!isRunning) return;
    
    let animationFrameId: number;
    
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callbackRef.current(deltaTime);
      }
      previousTimeRef.current = time;
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      previousTimeRef.current = undefined;
    };
  }, [isRunning]);
}
```

**Use the Hook:**
```typescript
function App() {
  const [boids, setBoids] = useState<Boid[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  
  useAnimationLoop((deltaTime) => {
    // Update boids based on deltaTime
    updateSimulation(deltaTime);
  }, isPlaying);
  
  // ...
}
```

**Benefits:**
- Animation logic reusable across components
- Handles cleanup automatically
- Delta time for frame-independent physics
- Can test hook in isolation

---

## ⚠️ Common Patterns & Gotchas

### Pattern 1: Controlled Components

**Input controls for simulation parameters:**
```typescript
function Controls({ params, onParamChange }) {
  return (
    <div>
      <label>
        Separation Weight: {params.separationWeight}
        <input 
          type="range" 
          min={0} 
          max={3} 
          step={0.1}
          value={params.separationWeight}
          onChange={(e) => onParamChange('separationWeight', Number(e.target.value))}
        />
      </label>
    </div>
  );
}
```

**Key Points:**
- Input value controlled by state
- onChange updates state
- State flows down, events flow up

### Pattern 2: Lazy Initial State

**Use when initial state is expensive to compute:**
```typescript
// ❌ Computes every render (inefficient)
const [boids, setBoids] = useState(createInitialBoids(1000));

// ✅ Computes only once
const [boids, setBoids] = useState(() => createInitialBoids(1000));
```

### Pattern 3: Previous Value Pattern

**Comparing to previous prop/state:**
```typescript
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

// Usage
const previousCount = usePrevious(count);
if (previousCount !== count) {
  console.log('Count changed from', previousCount, 'to', count);
}
```

### Gotcha 1: Infinite Loop

**Problem:**
```typescript
useEffect(() => {
  setBoids([...boids, newBoid]); // Updates boids
}, [boids]); // Depends on boids - infinite loop!
```

**Solution:**
```typescript
// Remove dependency or use different approach
useEffect(() => {
  // Run only when specific trigger changes
}, [trigger]);
```

### Gotcha 2: Missing Cleanup

**Problem:**
```typescript
useEffect(() => {
  const interval = setInterval(() => console.log('tick'), 1000);
  // Missing cleanup - timer keeps running after unmount!
}, []);
```

**Solution:**
```typescript
useEffect(() => {
  const interval = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(interval); // Cleanup!
}, []);
```

### Gotcha 3: Object/Array Dependency Comparison

**Problem:**
```typescript
const params = { speed: 1, weight: 1.5 }; // New object every render!

useEffect(() => {
  console.log('Params changed');
}, [params]); // Runs every render because object reference changes
```

**Solution 1: Destructure**
```typescript
useEffect(() => {
  console.log('Params changed');
}, [params.speed, params.weight]); // Compare primitive values
```

**Solution 2: useMemo**
```typescript
const params = useMemo(
  () => ({ speed, weight }),
  [speed, weight]
); // Same object reference if speed/weight unchanged
```

---

## 🎯 Hook Usage by Phase

### Phase 1: Core Simulation
- ✅ useState (boids array, simple controls)
- ✅ useEffect (canvas setup, animation loop)
- ✅ useRef (canvas element)

### Phase 2: Flocking & Controls
- ✅ useState or useReducer (complex state)
- ✅ useEffect (parameter changes, event listeners)
- ✅ useRef (latest values in animation loop)
- ⭐ Consider custom hook (useAnimationLoop)

### Phase 3: Interactivity
- ✅ useReducer (recommended at this point)
- ✅ Custom hooks (useMousePosition, usePrevious)
- ⭐ Context (if prop drilling becomes painful)

---

## 📖 Additional Resources

**Official React Docs:**
- [Hooks Overview](https://react.dev/reference/react)
- [useState](https://react.dev/reference/react/useState)
- [useEffect](https://react.dev/reference/react/useEffect)
- [useRef](https://react.dev/reference/react/useRef)
- [useReducer](https://react.dev/reference/react/useReducer)

**Deep Dives:**
- [Separating Events from Effects](https://react.dev/learn/separating-events-from-effects)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

---

## ✅ Quick Reference

**Need to store value that triggers re-render?** → useState  
**Need to run side effect?** → useEffect  
**Need DOM element reference?** → useRef  
**Need mutable value that doesn't re-render?** → useRef  
**Complex state with many updates?** → useReducer  
**Reusable logic across components?** → Custom Hook  

---

*Use this guide as you build your Boids simulation. Each hook will make more sense as you implement it in practice!*
