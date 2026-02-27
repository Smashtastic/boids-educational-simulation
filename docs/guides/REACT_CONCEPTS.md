# React & State Management Concepts

This guide explains the React and state management concepts you'll encounter in the Boids project, with examples and when to use each pattern.

---

## Table of Contents

1. [React Hooks Basics](#react-hooks-basics)
2. [useState vs useReducer](#usestate-vs-usereducer)
3. [useRef and DOM Access](#useref-and-dom-access)
4. [useEffect and Side Effects](#useeffect-and-side-effects)
5. [Canvas and Animation](#canvas-and-animation)
6. [State Management Patterns](#state-management-patterns)
7. [Performance Optimization](#performance-optimization)

---

## React Hooks Basics

### What are Hooks?

Hooks are functions that let you "hook into" React features from function components.

**Rules:**
1. Only call at the top level (not in loops/conditions)
2. Only call from React function components or custom hooks

---

## useState vs useReducer

### useState: Simple State

**When to use:**
- Single values
- Independent state variables
- Simple updates

**Example:**
```typescript
const [count, setCount] = useState(0)
const [isPlaying, setIsPlaying] = useState(true)
const [boids, setBoids] = useState<Boid[]>([])

// Update
setCount(count + 1)
setIsPlaying(!isPlaying)
setBoids([...boids, newBoid])
```

**Pros:**
- Simple and intuitive
- Less boilerplate
- Good for learning

**Cons:**
- Multiple related states scattered
- Complex updates are verbose
- Hard to track state transitions

---

### useReducer: Complex State

**When to use:**
- Multiple related state values
- Complex state logic
- State depends on previous state
- Many different actions

**Example:**
```typescript
// State type
interface SimulationState {
  boids: Boid[]
  isPlaying: boolean
  speed: number
  parameters: FlockingParams
}

// Action types
type Action =
  | { type: 'ADD_BOID'; payload: Boid }
  | { type: 'UPDATE_BOIDS'; payload: Boid[] }
  | { type: 'TOGGLE_PLAYING' }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'UPDATE_PARAMETERS'; payload: Partial<FlockingParams> }
  | { type: 'RESET' }

// Reducer function
function simulationReducer(state: SimulationState, action: Action): SimulationState {
  switch (action.type) {
    case 'ADD_BOID':
      return { ...state, boids: [...state.boids, action.payload] }
    
    case 'UPDATE_BOIDS':
      return { ...state, boids: action.payload }
    
    case 'TOGGLE_PLAYING':
      return { ...state, isPlaying: !state.isPlaying }
    
    case 'SET_SPEED':
      return { ...state, speed: action.payload }
    
    case 'UPDATE_PARAMETERS':
      return { 
        ...state, 
        parameters: { ...state.parameters, ...action.payload }
      }
    
    case 'RESET':
      return initialState
    
    default:
      return state
  }
}

// Usage
const [state, dispatch] = useReducer(simulationReducer, initialState)

// Dispatch actions
dispatch({ type: 'ADD_BOID', payload: newBoid })
dispatch({ type: 'TOGGLE_PLAYING' })
dispatch({ type: 'SET_SPEED', payload: 2 })
```

**Pros:**
- All state in one place
- Actions document what can happen
- Easy to debug (log actions)
- Testable (reducer is pure function)

**Cons:**
- More boilerplate
- Steeper learning curve
- Overkill for simple cases

---

### Migration Path

**Start (Steps 1-5):**
```typescript
const [boids, setBoids] = useState<Boid[]>([])
const [isPlaying, setIsPlaying] = useState(true)
```

**When it gets complex (Step 8-11):**
```typescript
const [state, dispatch] = useReducer(simulationReducer, {
  boids: [],
  isPlaying: true,
  speed: 1,
  parameters: defaultParameters
})
```

**Trigger for migration:**
- You have 5+ related useState calls
- Updates affect multiple state variables
- You're passing many setters to components
- State updates are getting complex

---

## useRef and DOM Access

### What is useRef?

A way to persist a value across renders without causing re-renders.

**Two main uses:**
1. Access DOM elements
2. Store mutable values

### Use Case 1: Canvas Access

```typescript
function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    // Now you can draw
  }, [])
  
  return <canvas ref={canvasRef} width={800} height={600} />
}
```

**Why useRef?**
- Direct DOM access needed for Canvas API
- Doesn't cause re-render when changed
- Persists across renders

### Use Case 2: Animation Frame ID

```typescript
function Canvas() {
  const animationIdRef = useRef<number>()
  
  useEffect(() => {
    const animate = () => {
      // Draw frame
      animationIdRef.current = requestAnimationFrame(animate)
    }
    animate()
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [])
}
```

**Why useRef here?**
- Need to store ID to cancel later
- Don't want re-render when ID changes
- Cleanup function needs access to latest ID

---

## useEffect and Side Effects

### What is useEffect?

Runs side effects after render. Replaces lifecycle methods from class components.

### Basic Pattern

```typescript
useEffect(() => {
  // Effect code runs after render
  
  return () => {
    // Cleanup runs before next effect or unmount
  }
}, [dependencies]) // Re-run when these change
```

### Use Case 1: Canvas Setup

```typescript
useEffect(() => {
  const canvas = canvasRef.current
  if (!canvas) return
  
  // Setup
  canvas.width = width
  canvas.height = height
  
  // No cleanup needed for this
}, [width, height]) // Re-run if dimensions change
```

### Use Case 2: Animation Loop

```typescript
useEffect(() => {
  let animationId: number
  
  const animate = () => {
    // Update and draw
    animationId = requestAnimationFrame(animate)
  }
  
  animate()
  
  // Cleanup: cancel animation on unmount
  return () => {
    cancelAnimationFrame(animationId)
  }
}, []) // Empty array = run once on mount
```

### Use Case 3: Event Listeners

```typescript
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  }
  
  window.addEventListener('resize', handleResize)
  
  // Cleanup: remove listener
  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])
```

### Dependency Array Rules

```typescript
// ❌ Missing dependency (will use stale value)
useEffect(() => {
  console.log(boids.length) // boids is used but not in deps
}, [])

// ✅ Include all dependencies
useEffect(() => {
  console.log(boids.length)
}, [boids])

// ✅ Empty array if no dependencies
useEffect(() => {
  console.log('Component mounted')
}, [])

// ✅ No array = run after every render (rarely needed)
useEffect(() => {
  console.log('After every render')
})
```

---

## Canvas and Animation

### The Render Loop

Canvas rendering requires a continuous loop:

```typescript
function Canvas({ boids }: { boids: Boid[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Animation loop
    const animate = () => {
      // 1. Clear canvas
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // 2. Draw all boids
      boids.forEach(boid => {
        ctx.fillStyle = '#ff8c00'
        ctx.beginPath()
        ctx.arc(boid.position.x, boid.position.y, 5, 0, Math.PI * 2)
        ctx.fill()
      })
      
      // 3. Request next frame
      requestAnimationFrame(animate)
    }
    
    // Start the loop
    const animationId = requestAnimationFrame(animate)
    
    // Cleanup
    return () => cancelAnimationFrame(animationId)
  }, [boids]) // Re-run when boids change
  
  return <canvas ref={canvasRef} width={800} height={600} />
}
```

### Why requestAnimationFrame?

```typescript
// ❌ Don't use setInterval
setInterval(() => {
  draw()
}, 16) // Not synced with display refresh

// ✅ Use requestAnimationFrame
requestAnimationFrame(() => {
  draw()
}) // Synced with display (~60 FPS)
```

**Benefits:**
- Syncs with display refresh rate
- Pauses when tab is not visible (saves battery)
- Smooth animation

---

## State Management Patterns

### Pattern 1: Local State (Steps 1-7)

**Structure:**
```typescript
function App() {
  const [boids, setBoids] = useState<Boid[]>([])
  
  const updateBoids = () => {
    setBoids(prevBoids => 
      prevBoids.map(boid => updateBoid(boid))
    )
  }
  
  return <Canvas boids={boids} />
}
```

**When:** Single component, simple state

---

### Pattern 2: Prop Drilling (Steps 8-10)

**Structure:**
```typescript
function App() {
  const [parameters, setParameters] = useState(defaultParams)
  
  return (
    <>
      <Canvas boids={boids} parameters={parameters} />
      <Controls 
        parameters={parameters} 
        onParameterChange={setParameters} 
      />
    </>
  )
}
```

**When:** Few levels deep, clear parent-child relationship

---

### Pattern 3: useReducer (Steps 11+)

**Structure:**
```typescript
function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  return (
    <>
      <Canvas 
        boids={state.boids} 
        parameters={state.parameters} 
      />
      <Controls 
        parameters={state.parameters}
        onParameterChange={(params) => 
          dispatch({ type: 'UPDATE_PARAMETERS', payload: params })
        }
      />
    </>
  )
}
```

**When:** Complex state, many actions, need predictability

---

### Pattern 4: Context (Optional, Advanced)

**Structure:**
```typescript
const SimulationContext = createContext<{
  state: SimulationState
  dispatch: Dispatch<Action>
} | null>(null)

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  return (
    <SimulationContext.Provider value={{ state, dispatch }}>
      <Canvas />
      <Controls />
    </SimulationContext.Provider>
  )
}

function Controls() {
  const context = useContext(SimulationContext)
  // No prop drilling!
}
```

**When:** Deep prop drilling, many components need same state

---

## Performance Optimization

### When to Optimize

⚠️ **Premature optimization is the root of all evil**

**Optimize when:**
1. You measure a performance problem
2. FPS drops below 30
3. UI feels laggy

**Don't optimize:**
- Before you have a working feature
- Without measuring first
- Just because you can

---

### Optimization Techniques

#### 1. Memoization with useMemo

**Problem:** Expensive calculation runs every render

```typescript
function App() {
  const [boids, setBoids] = useState<Boid[]>([])
  
  // ❌ Recalculates every render
  const averageSpeed = boids.reduce((sum, b) => 
    sum + lengthVector(b.velocity), 0
  ) / boids.length
  
  // ✅ Only recalculates when boids change
  const averageSpeed = useMemo(() => {
    return boids.reduce((sum, b) => 
      sum + lengthVector(b.velocity), 0
    ) / boids.length
  }, [boids])
}
```

**When to use:**
- Expensive calculations
- Complex array operations
- Creating objects/arrays passed as props

---

#### 2. Callback Memoization with useCallback

**Problem:** Function recreated every render, causing child re-renders

```typescript
function App() {
  const [boids, setBoids] = useState<Boid[]>([])
  
  // ❌ New function every render
  const addBoid = (boid: Boid) => {
    setBoids([...boids, boid])
  }
  
  // ✅ Same function reference
  const addBoid = useCallback((boid: Boid) => {
    setBoids(prev => [...prev, boid])
  }, []) // No dependencies because we use functional update
  
  return <Canvas onAddBoid={addBoid} />
}
```

**When to use:**
- Passing callbacks to memoized child components
- Callbacks in dependency arrays

---

#### 3. Component Memoization with React.memo

**Problem:** Component re-renders even when props didn't change

```typescript
// ❌ Re-renders every time parent renders
function Controls({ parameters, onChange }) {
  return <div>...</div>
}

// ✅ Only re-renders when props change
const Controls = React.memo(({ parameters, onChange }) => {
  return <div>...</div>
})
```

**When to use:**
- Expensive rendering
- Component receives same props often
- Pure components (output only depends on props)

---

#### 4. Algorithmic Optimization

**Most important for Boids!**

```typescript
// ❌ O(n²) - Check every boid against every other
function updateBoids(boids: Boid[]) {
  return boids.map(boid => {
    const neighbors = boids.filter(other => 
      distanceBetweenVectors(boid.position, other.position) < 50
    )
    return applyFlocking(boid, neighbors)
  })
}

// ✅ O(n) - Spatial hashing
function updateBoids(boids: Boid[]) {
  const grid = createSpatialHashGrid(boids)
  return boids.map(boid => {
    const neighbors = getNearbyBoids(grid, boid)
    return applyFlocking(boid, neighbors)
  })
}
```

---

### Optimization Priority

1. **Algorithm** - Biggest impact (O(n²) → O(n))
2. **Avoid unnecessary work** - Skip calculations when possible
3. **Memoization** - Cache expensive computations
4. **React optimizations** - useMemo, useCallback, React.memo

---

## Common Patterns in Boids Project

### Pattern: State Update Based on Previous State

```typescript
// ❌ Using current state (can be stale in async updates)
setBoids(boids.map(boid => updateBoid(boid)))

// ✅ Using functional update (always gets latest state)
setBoids(prevBoids => prevBoids.map(boid => updateBoid(boid)))
```

---

### Pattern: Animation with State Updates

```typescript
function App() {
  const [boids, setBoids] = useState<Boid[]>([])
  
  useEffect(() => {
    const animate = () => {
      // Update boid positions
      setBoids(prevBoids => 
        prevBoids.map(boid => {
          const acceleration = calculateFlocking(boid, prevBoids)
          return updatePhysics(boid, acceleration)
        })
      )
      
      requestAnimationFrame(animate)
    }
    
    const animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, []) // Empty deps - animation runs independently
  
  return <Canvas boids={boids} />
}
```

---

### Pattern: Controlled Components

```typescript
function Controls({ 
  separationWeight, 
  onSeparationWeightChange 
}: {
  separationWeight: number
  onSeparationWeightChange: (value: number) => void
}) {
  return (
    <input
      type="range"
      value={separationWeight}
      onChange={(e) => onSeparationWeightChange(Number(e.target.value))}
      min={0}
      max={3}
      step={0.1}
    />
  )
}
```

**Key points:**
- Value comes from props (controlled by parent)
- Changes notify parent through callback
- Parent manages the state

---

## Learning Progression

### Phase 1: Master useState
- Understand when React re-renders
- Practice functional updates
- Get comfortable with array/object state

### Phase 2: Understand useEffect
- Setup and cleanup pattern
- Dependency array rules
- Avoid infinite loops

### Phase 3: Work with useRef
- Canvas DOM access
- Storing mutable values
- When NOT to use state

### Phase 4: Transition to useReducer
- Identify when state gets complex
- Design actions and reducer
- Test reducer as pure function

### Phase 5: Optimize Performance
- Measure first
- Fix algorithms before micro-optimizations
- Learn when memoization helps

---

## Quick Reference

### Hooks Cheat Sheet

```typescript
// State
const [value, setValue] = useState(initial)

// Reducer
const [state, dispatch] = useReducer(reducer, initial)

// Ref
const ref = useRef(initialValue)

// Effect
useEffect(() => {
  // effect
  return () => { /* cleanup */ }
}, [deps])

// Memo
const memoized = useMemo(() => compute(), [deps])

// Callback
const callback = useCallback(() => {}, [deps])
```

---

## Next Steps

1. Start with useState for first few steps
2. Learn useRef for Canvas access
3. Master useEffect for animation
4. Migrate to useReducer when state gets complex
5. Optimize only when needed

**Questions to ask yourself:**
- Does this need to cause a re-render? (state vs ref)
- Is this state local or shared? (useState vs Context)
- Is this state getting complex? (useState vs useReducer)
- Is this slow? (measure before optimizing)

---

## Resources

- [React Docs - Hooks](https://react.dev/reference/react)
- [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)
- [useEffect Complete Guide](https://overreacted.io/a-complete-guide-to-useeffect/)

**Ready to build?** Start with Step 1 and ask Claude for help when you're stuck!

