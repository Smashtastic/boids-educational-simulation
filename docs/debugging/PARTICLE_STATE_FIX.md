# Particle State Issue - Root Cause & Solution

## 🐛 The Problem

Particles were always showing 0 in state, even though they were being created.

## 🔍 Root Cause Analysis

### **The Issue: Async State Updates with stateRef**

Your animation loop had this sequence:

```typescript
// 1. Dispatch ADD_PARTICLE
dispatch({ type: "ADD_PARTICLE", payload: { position, colour } });

// 2. Immediately read from stateRef (still has OLD state!)
const updatedParticles = updateParticles(stateRef.current.particles); // particles = []

// 3. Dispatch UPDATE_PARTICLES with empty array
dispatch({ type: "UPDATE_PARTICLES", payload: { particles: updatedParticles }});
```

**What happens:**
1. `ADD_PARTICLE` is dispatched but **state hasn't updated yet**
2. `stateRef.current.particles` **still has the old value** (empty array)
3. `updateParticles([])` returns `[]` (nothing to update)
4. `UPDATE_PARTICLES` is dispatched with `[]`, **overwriting the particles that were just added!**

### **Why This Happens**

React batches state updates. Dispatches don't take effect immediately - they're queued and applied after the current execution completes. So when you read from `stateRef.current` right after a dispatch, you're still seeing the **pre-dispatch state**.

**Timing:**
```
Frame N:
  animate() runs
    dispatch ADD_PARTICLE  ← queued, not applied yet
    read stateRef.current  ← still shows state from Frame N-1
    dispatch UPDATE_PARTICLES ← overwrites the ADD_PARTICLE!
  animate() ends
  React applies batched dispatches ← UPDATE_PARTICLES wins
  
Frame N+1:
  stateRef.current updates ← now has the state from UPDATE_PARTICLES
  animate() runs again...
```

---

## ✅ The Solution

**Track new particles locally and merge them with updated existing particles:**

```typescript
// 1. Create array to collect new particles
let newParticles: Particle[] = [];

// 2. When boid dies, add particles to local array
const particles = createParticleExplosion(boid.position, boid.colour, 10);
newParticles.push(...particles);

// 3. Update existing particles (from stateRef)
const updatedExistingParticles = updateParticles(stateRef.current.particles);

// 4. Merge updated existing + new particles
const allParticles = [...updatedExistingParticles, ...newParticles];

// 5. Dispatch once with merged array
dispatch({ type: "UPDATE_PARTICLES", payload: { particles: allParticles }});
```

**Why this works:**
- ✅ New particles are created and stored locally
- ✅ Existing particles are updated from current state
- ✅ Both are merged into one array
- ✅ Single UPDATE_PARTICLES dispatch sets the complete particle state
- ✅ No race condition between ADD and UPDATE

---

## 🎓 Key Learning Points

### **1. State Updates Are Async**
Dispatches don't take effect immediately. The next line of code still sees the old state.

### **2. stateRef Shows Current State, Not Queued Changes**
`stateRef.current` reflects the actual state object, not any pending updates from dispatches.

### **3. Multiple Dispatches Can Conflict**
If you dispatch ADD then immediately dispatch UPDATE, the UPDATE can overwrite the ADD.

### **4. Solution: Calculate Everything Locally First**
Instead of dispatching multiple times and trying to read back, calculate the final state locally and dispatch once.

---

## 📊 Before vs After

### **Before (Broken):**
```typescript
// Frame 1: Boid dies
dispatch(ADD_PARTICLE)           // Adds 10 particles
stateRef.current.particles       // = [] (old state)
updateParticles([])              // = [] (nothing to update)
dispatch(UPDATE_PARTICLES, [])   // Overwrites! particles = []

// Frame 2:
stateRef.current.particles       // = [] (was overwritten)
```

### **After (Fixed):**
```typescript
// Frame 1: Boid dies
newParticles = createExplosion()      // = [p1, p2, ... p10]
existingUpdated = update([])          // = []
allParticles = [...[], ...newParticles] // = [p1, p2, ... p10]
dispatch(UPDATE_PARTICLES, [p1...p10])  // Set all 10

// Frame 2:
stateRef.current.particles        // = [p1, p2, ... p10] ✅
existingUpdated = update([p1...p10]) // Ages them, returns [p1...p10]
allParticles = [...updatedP, ...newP] // Merge if more boids die
dispatch(UPDATE_PARTICLES, allParticles)
```

---

## 🔄 The Correct Data Flow

```
Boid Dies Event
    ↓
Create Particles Locally (not in state yet)
    ↓
Update Existing Particles (from stateRef)
    ↓
Merge New + Updated Existing
    ↓
Single Dispatch to Update State
    ↓
State Updates (after frame completes)
    ↓
stateRef.current Updates
    ↓
Next Frame Sees New State
    ↓
Render Sees New State
```

---

## 💡 Alternative Solutions Considered

### **Option 1: Use useReducer's returned state (not stateRef)**
**Problem:** Can't use in animation loop because it's from previous render

### **Option 2: Move particle logic to reducer**
**Problem:** Reducers should be pure, can't generate random particles deterministically

### **Option 3: Only use ADD_PARTICLE, no UPDATE_PARTICLES**
**Problem:** Particles would never age or expire

### **Option 4: Our Solution - Local Tracking**
**✅ Advantages:**
- Simple and clear
- No race conditions
- Works with stateRef pattern
- Single dispatch per frame
- Easy to understand and maintain

---

## 🎯 Verification

You should now see in console:
```
🎨 Creating 10 particles for boid at: {x, y} colour: hsl(...)
💫 Existing particles: 0 → After update: 0 + New: 10 = Total: 10
Sample particle: {id: "...", age: 0, maxAge: 45, ...}
🎨 RENDERING 10 particles
  Drawing particle at (...) age:0/45 opacity:1.00
  ...
```

Next frame:
```
💫 Existing particles: 10 → After update: 10 + New: 0 = Total: 10
🎨 RENDERING 10 particles
  Drawing particle at (...) age:1/45 opacity:0.98
  ...
```

After ~45 frames:
```
💫 Existing particles: 10 → After update: 0 + New: 0 = Total: 0
```

---

## 📚 General React Pattern: Working with Refs in Animation Loops

This pattern applies whenever you have:
- Animation loop using `requestAnimationFrame`
- State stored in `useReducer` or `useState`
- `useRef` to access state in animation loop

**Golden Rule:**
> If you dispatch an action, don't read from the ref immediately after. Calculate what the new state should be locally, then dispatch once.

**Pattern:**
```typescript
const animate = () => {
    // 1. Read current state from ref
    const current = stateRef.current;
    
    // 2. Calculate new state locally
    const updated = updateSomething(current);
    const newStuff = createNewStuff();
    const finalState = [...updated, ...newStuff];
    
    // 3. Dispatch once with final state
    dispatch({ type: 'SET_STATE', payload: finalState });
    
    // 4. Don't read stateRef again in this frame
};
```

---

**You've just learned a crucial pattern for React animation loops!** 🎉

This same issue comes up with any async state updates in performance-critical code. The solution is always the same: calculate locally, dispatch once.
