# useReducer Migration Exercise 🎓

## What is useReducer?

`useReducer` is a React Hook for managing **complex state** in a more organized way. Think of it as an upgrade from `useState` when your state management gets more sophisticated.

### The Analogy

- **useState**: Like having individual variables scattered around
- **useReducer**: Like having a central control panel with labeled buttons

## Why useReducer for Your Boid Simulation?

Looking at your current `App.tsx`, you have:
- `boids` state (array of 200 boids)
- `predators` state (array of 3 predators)
- `predatorsRef` (synchronization mechanism)

Right now this seems manageable, but as you add features you'll likely want:
- Pause/play controls
- Speed controls
- Parameter sliders (separation, alignment, cohesion weights)
- Reset button
- Click to add boids/predators

With `useState`, you'd need 8-10+ separate state variables. With `useReducer`, you have **one state object** and **clear actions**.

---

## Understanding useReducer

### The Three Parts

```typescript
const [state, dispatch] = useReducer(reducer, initialState);
```

1. **state**: Your current state (like `useState`'s value)
2. **dispatch**: Function to trigger state changes (replaces `setState`)
3. **reducer**: Pure function that calculates new state based on actions

### The Reducer Function Pattern

```typescript
function reducer(currentState, action) {
  switch (action.type) {
    case 'ACTION_NAME':
      return newState; // Must return new state object
    default:
      return currentState; // Always handle default case
  }
}
```

**Key Rules:**
- ✅ Must be a **pure function** (same inputs → same outputs)
- ✅ Must **return** a new state object
- ✅ Don't mutate the current state
- ✅ Don't call side effects (no API calls, no timers)

---

## Your Migration Plan

### Step 1: Define Your State Shape

First, think about ALL the state your simulation needs (now and future):

```typescript
interface SimulationState {
  // Current state
  boids: Boid[];
  predators: Predator[];
  
  // Future controls (you'll add these later)
  isPlaying: boolean;
  speed: number; // 0.5 = half speed, 2 = double speed
  parameters: FlockingParameters;
  
  // Metadata
  frameCount: number; // for debugging/stats
}
```

### Step 2: Define Your Actions

What are all the ways state can change?

```typescript
type SimulationAction =
  // Core simulation updates
  | { type: 'UPDATE_BOIDS'; payload: Boid[] }
  | { type: 'UPDATE_PREDATORS'; payload: Predator[] }
  | { type: 'UPDATE_ALL'; payload: { boids: Boid[]; predators: Predator[] } }
  
  // User interactions (future)
  | { type: 'TOGGLE_PLAYING' }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'ADD_BOID'; payload: { x: number; y: number } }
  | { type: 'ADD_PREDATOR'; payload: { x: number; y: number } }
  | { type: 'RESET' }
  | { type: 'UPDATE_PARAMETER'; payload: { name: keyof FlockingParameters; value: number } };
```

### Step 3: Write Your Reducer

```typescript
function simulationReducer(
  state: SimulationState,
  action: SimulationAction
): SimulationState {
  switch (action.type) {
    case 'UPDATE_BOIDS':
      return {
        ...state,
        boids: action.payload,
        frameCount: state.frameCount + 1
      };
      
    case 'UPDATE_PREDATORS':
      return {
        ...state,
        predators: action.payload
      };
      
    case 'UPDATE_ALL':
      return {
        ...state,
        boids: action.payload.boids,
        predators: action.payload.predators,
        frameCount: state.frameCount + 1
      };
      
    case 'TOGGLE_PLAYING':
      return {
        ...state,
        isPlaying: !state.isPlaying
      };
      
    case 'SET_SPEED':
      return {
        ...state,
        speed: action.payload
      };
      
    case 'ADD_BOID':
      return {
        ...state,
        boids: [
          ...state.boids,
          createBoid(`boid-${state.boids.length}`, action.payload.x, action.payload.y)
        ]
      };
      
    case 'RESET':
      return getInitialState();
      
    default:
      return state;
  }
}
```

### Step 4: Create Initial State Factory

```typescript
function getInitialState(): SimulationState {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  return {
    boids: Array.from({ length: 200 }, (_, i) => 
      createBoid(`boid-${i}`, width, height)
    ),
    predators: Array.from({ length: 3 }, (_, i) => 
      createPredator(`predator-${i}`, width, height)
    ),
    isPlaying: true,
    speed: 1,
    parameters: {
      separationRadius: 30,
      alignmentRadius: 50,
      cohesionRadius: 50,
      separationWeight: 1.8,
      alignmentWeight: 1.2,
      cohesionWeight: 0.8,
      maxAcceleration: 0.15,
      fleeRadius: 100,
      fleeWeight: 5.0,
    },
    frameCount: 0
  };
}
```

### Step 5: Update Your Component

**Before (useState):**
```typescript
const [boids, setBoids] = useState<Boid[]>(() => ...);
const [predators, setPredators] = useState<Predator[]>(() => ...);

// In animation loop
setBoids(prevBoids => ...);
setPredators(prevPredators => ...);
```

**After (useReducer):**
```typescript
const [state, dispatch] = useReducer(simulationReducer, getInitialState());

// In animation loop
dispatch({ 
  type: 'UPDATE_ALL', 
  payload: { 
    boids: updatedBoids, 
    predators: updatedPredators 
  } 
});

// In render callback
const render = useCallback((ctx: CanvasRenderingContext2D) => {
  state.boids.forEach(boid => { /* draw */ });
  state.predators.forEach(predator => { /* draw */ });
}, [state.boids, state.predators]);
```

---

## Key Concepts to Understand

### 1. Why "Dispatch"?

`dispatch` sends an **action** to the reducer, like pressing a button on a control panel. Each action has:
- `type`: What happened (string constant, ALL_CAPS by convention)
- `payload`: Any data needed for the update (optional)

```typescript
// Simple action (no data needed)
dispatch({ type: 'TOGGLE_PLAYING' });

// Action with data
dispatch({ type: 'SET_SPEED', payload: 2.0 });

// Action with complex data
dispatch({ 
  type: 'UPDATE_ALL', 
  payload: { boids: newBoids, predators: newPredators } 
});
```

### 2. Why Use Action Types?

```typescript
// ❌ Hard to track what's happening
setBoids(newBoids);

// ✅ Self-documenting
dispatch({ type: 'UPDATE_BOIDS', payload: newBoids });
```

When debugging, you can log actions and see exactly what happened:
```
Action: UPDATE_BOIDS
Action: UPDATE_PREDATORS
Action: TOGGLE_PLAYING
Action: SET_SPEED (payload: 2)
```

### 3. The Reducer Must Be Pure

**Pure function**: Given the same inputs, always returns the same output. No side effects.

```typescript
// ✅ PURE - Good!
function reducer(state, action) {
  return { ...state, count: state.count + 1 };
}

// ❌ IMPURE - Bad! (mutates state)
function reducer(state, action) {
  state.count = state.count + 1; // Mutation!
  return state;
}

// ❌ IMPURE - Bad! (side effect)
function reducer(state, action) {
  console.log('Updating'); // Side effect!
  fetch('/api/log'); // Side effect!
  return { ...state, count: state.count + 1 };
}
```

**Why?** React may call your reducer multiple times to compute what changed. Side effects would run multiple times unpredictably.

### 4. No More predatorsRef?

Currently you use `predatorsRef` to share predator positions between two separate `setState` calls. With `useReducer`:

**Option A**: Single `UPDATE_ALL` action (recommended)
```typescript
dispatch({ 
  type: 'UPDATE_ALL', 
  payload: { boids: newBoids, predators: newPredators } 
});
```

**Option B**: Keep using ref if you need to update separately
```typescript
const predatorsRef = useRef<Predator[]>(state.predators);

useEffect(() => {
  predatorsRef.current = state.predators;
}, [state.predators]);
```

---

## Benefits You'll See

### 1. **Centralized State Logic**
All state transitions in one place → easier to understand

### 2. **Testable**
You can test the reducer without React:
```typescript
test('UPDATE_BOIDS increments frame count', () => {
  const state = { boids: [], predators: [], frameCount: 0, ... };
  const action = { type: 'UPDATE_BOIDS', payload: [newBoid] };
  const newState = simulationReducer(state, action);
  
  expect(newState.frameCount).toBe(1);
  expect(newState.boids).toHaveLength(1);
});
```

### 3. **Self-Documenting**
Action types describe what's happening:
```typescript
dispatch({ type: 'ADD_BOID', payload: { x: 100, y: 100 } });
// vs
setBoids([...boids, createBoid(...)]); // What is this doing?
```

### 4. **Easier to Add Features**
Want to add pause/play? Just add the action:
```typescript
case 'TOGGLE_PLAYING':
  return { ...state, isPlaying: !state.isPlaying };
```

Then use it:
```typescript
<button onClick={() => dispatch({ type: 'TOGGLE_PLAYING' })}>
  {state.isPlaying ? 'Pause' : 'Play'}
</button>
```

### 5. **Better for Debugging**
You can add middleware to log every action:
```typescript
function loggingReducer(state: SimulationState, action: SimulationAction) {
  console.log('Action:', action.type, action.payload);
  const newState = simulationReducer(state, action);
  console.log('New State:', newState);
  return newState;
}
```

---

## Common Patterns

### Pattern 1: Computed State

Don't store derived values in state:

```typescript
// ❌ Don't do this
interface State {
  boids: Boid[];
  boidCount: number; // Derived from boids.length!
}

// ✅ Do this
interface State {
  boids: Boid[];
}

// Compute when needed
const boidCount = state.boids.length;
```

### Pattern 2: Nested Updates

Use spread operator for nested state:

```typescript
// Updating nested object
case 'UPDATE_PARAMETER':
  return {
    ...state,
    parameters: {
      ...state.parameters,
      [action.payload.name]: action.payload.value
    }
  };
```

### Pattern 3: Array Updates

```typescript
// Add item
case 'ADD_BOID':
  return {
    ...state,
    boids: [...state.boids, newBoid]
  };

// Remove item
case 'REMOVE_BOID':
  return {
    ...state,
    boids: state.boids.filter(b => b.id !== action.payload.id)
  };

// Update item
case 'UPDATE_BOID':
  return {
    ...state,
    boids: state.boids.map(b => 
      b.id === action.payload.id ? action.payload.boid : b
    )
  };
```

---

## Your Exercise Tasks

### Task 1: Read and Understand ✅
- [ ] Read this entire document
- [ ] Understand the three parts of useReducer
- [ ] Understand why reducers must be pure functions

### Task 2: Design Your State 📝
- [ ] Copy the `SimulationState` interface into a new file `src/types/SimulationState.ts`
- [ ] Copy the `SimulationAction` type into the same file
- [ ] Think: Are there any other state pieces you want? Add them!

### Task 3: Write Your Reducer 🔨
- [ ] Create `src/reducers/simulationReducer.ts`
- [ ] Implement the reducer function
- [ ] Implement `getInitialState()`
- [ ] Start with just `UPDATE_ALL` action

### Task 4: Migrate App.tsx 🚀
- [ ] Replace `useState` calls with `useReducer`
- [ ] Update animation loop to use `dispatch`
- [ ] Update render callback to use `state.boids` and `state.predators`
- [ ] Test that simulation still works!

### Task 5: Experiment 🧪
- [ ] Add `isPlaying` and `TOGGLE_PLAYING` action
- [ ] Add a button to pause/play the simulation
- [ ] Verify pausing works correctly

### Task 6: Reflect 📔
Answer these questions:
- How does using actions change how you think about state updates?
- What's the benefit of having all state logic in the reducer?
- When would you still use useState instead?

---

## When to Use useState vs useReducer

### Use useState when:
- ✅ Single, independent values (`const [count, setCount] = useState(0)`)
- ✅ Simple toggles (`const [isOpen, setIsOpen] = useState(false)`)
- ✅ Unrelated state pieces
- ✅ No complex update logic

### Use useReducer when:
- ✅ Multiple related state variables (5+ state pieces)
- ✅ Complex state transitions
- ✅ Next state depends on previous state
- ✅ Want to test state logic separately
- ✅ Want to track/log state changes
- ✅ State updates involve multiple pieces of state

---

## The Big Picture

```
Component (UI Layer)
    ↓ dispatches actions
Reducer (State Logic Layer)
    ↓ returns new state
React re-renders with new state
    ↓ 
Component receives new state
```

**Separation of Concerns:**
- **Component**: Handles UI and user interactions
- **Reducer**: Handles state logic and transitions
- **Actions**: Describe what happened

This is similar to the **Model-View-Controller** pattern you might have seen in other frameworks!

---

## Next Steps After useReducer

Once you're comfortable with `useReducer`, you can explore:

1. **Custom Hooks**: Extract reducer logic into `useSimulation()` hook
2. **Context API**: Share state across multiple components without prop drilling
3. **useReducer + Context**: Global state management (like mini-Redux)
4. **Immer**: Library for easier immutable updates
5. **Redux**: If you need app-wide state with dev tools

---

## Questions to Consider

As you work through this migration, think about:

1. **State Organization**: What belongs in state vs derived values?
2. **Action Granularity**: Should you have many small actions or fewer large ones?
3. **Performance**: Does dispatching actions cause unnecessary re-renders?
4. **Debugging**: How can you log actions to debug issues?
5. **Testing**: How would you test the reducer in isolation?

---

## Resources

- [React Docs: useReducer](https://react.dev/reference/react/useReducer)
- [When to use useReducer vs useState](https://react.dev/learn/extracting-state-logic-into-a-reducer)
- Your `HOOKS_GUIDE.md` (already has great examples!)

---

## Summary

**useReducer** is about:
- 📦 **Organizing** complex state in one place
- 🎯 **Naming** state changes with action types
- 🧪 **Testing** state logic separately from UI
- 📝 **Documenting** what can happen to your state

It's not "better" than useState - it's a different tool for different situations. As your simulation grows, useReducer will make state management much more manageable!

Ready to try it? Start with Task 2! 🚀
