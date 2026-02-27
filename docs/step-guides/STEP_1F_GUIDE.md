# Step 1F: Integrate Particles into Animation Loop - Implementation Guide

## ✅ You're Ready!

You've completed Steps 1A-1E:
- ✅ Particle type defined
- ✅ State structure updated  
- ✅ Factory functions created
- ✅ Reducer actions added
- ✅ Physics functions implemented
- ✅ Tests passing (31/31)

Now it's time to see particles in action! 💥

---

## 🎯 Goal

When a predator catches a boid, create a particle explosion at that location that:
1. Uses the boid's color
2. Explodes outward in all directions
3. Fades out over time
4. Automatically cleans up

---

## 📝 What You Need to Do

### **Part 1: Import the Particle Functions**

At the top of `App.tsx`, add the import for particle functions:

**Location:** Around line 4, with other simulation imports

**What to import:**
- `updateParticles` function from `./simulation/particles.ts`
- `createParticleExplosion` function from `./types/Particle.ts`

**Hint:** Look at how you're importing other simulation functions like `updateBoid`, `updatePredator`, etc.

---

### **Part 2: Create Particles When Boid Dies**

**Location:** In the `animate` function, around line 72-80 where you detect dead boids

Currently you have:
```typescript
let deadBoids: string[] = [];
const survivors = updatedBoids.filter(boid => {
    for (const predator of updatedPredators) {
        if (predator.aiState.currentState === "STRIKE" && distanceBetweenVectors(boid.position, predator.position) < 15) {
            deadBoids.push(boid.id);
            predator.aiState.currentState = "COOLDOWN";
            predator.timingParameters.stateTimer = 0;
            return false; // Boid dies
        } 
    }
    return true; // Boid survives
})
```

**What to add:**
1. Before `return false` (when boid dies), create particles
2. Use `createParticleExplosion(position, colour, count)`
3. Dispatch the `ADD_PARTICLE` action with the boid's position and color

**Questions to think about:**
- What is the boid's position at this point?
- What color should the particles be?
- How many particles? (Try 8-12)
- What action type dispatches particles?

**Pseudocode:**
```typescript
// Inside the filter, when boid is about to die:
if (/* boid caught */) {
    // Dispatch particle creation
    dispatch({ 
        type: 'ADD_PARTICLE', 
        payload: { position: ???, colour: ??? } 
    });
    
    deadBoids.push(boid.id);
    // ... rest of code
}
```

---

### **Part 3: Update Particles Each Frame**

**Location:** In the `animate` function, after updating boids and predators

Currently you have:
```typescript
dispatch({ type: "UPDATE_ALL", payload:  { boids: survivors, predators: updatedPredators } });
dispatch({ type: "REMOVE_BOIDS", payload: { boidIds: deadBoids } });
```

**What to add:**
1. Call `updateParticles(stateRef.current.particles)`
2. Dispatch `UPDATE_PARTICLES` action with the updated particles

**Questions to think about:**
- Where do you get the current particles from? (stateRef.current.particles)
- What function updates all particles? (updateParticles)
- What action sets the new particles? (UPDATE_PARTICLES)

**Pseudocode:**
```typescript
// After UPDATE_ALL dispatch:
const updatedParticles = updateParticles(???);
dispatch({ type: 'UPDATE_PARTICLES', payload: { particles: ??? } });
```

---

### **Part 4: Render Particles**

**Location:** In the `render` callback function, after drawing predators (around line 140)

Currently you render boids, then predators. Now add particles at the end.

**What to render:**
For each particle:
1. Calculate opacity based on age: `1 - (particle.age / particle.maxAge)`
2. Set `ctx.globalAlpha` to that opacity (0 = transparent, 1 = opaque)
3. Draw a circle at particle position with particle size
4. Use particle color
5. Reset `ctx.globalAlpha` to 1 after particles

**Questions to think about:**
- Why does opacity decrease as age increases?
- Why do we reset globalAlpha after drawing particles?
- Should particles have a fill or stroke?

**Pseudocode:**
```typescript
// In render callback, after drawing predators:

// Draw particles
state.particles.forEach(particle => {
    // Calculate fade-out opacity
    const opacity = ???;
    
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(???, ???, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = particle.colour;
    ctx.fill();
});

// IMPORTANT: Reset opacity for next frame
ctx.globalAlpha = 1;
```

---

### **Part 5: Update Render Callback Dependencies**

**Location:** The render callback's dependency array

Currently:
```typescript
}, [state.boids, state.predators]);
```

**What to add:**
Add `state.particles` to the dependency array so the render function re-runs when particles change.

---

## 🧪 Testing Your Implementation

### **How to test:**

1. **Run the app:**
   ```bash
   npm run dev
   ```

2. **Watch for boid deaths:**
   - Wait for a predator to catch a boid
   - You should see particles burst out from the boid's position
   - Particles should fade out over ~0.5-1 second

3. **Things to check:**
   - ✅ Particles appear when boid dies
   - ✅ Particles move outward in all directions
   - ✅ Particles fade out (get more transparent)
   - ✅ Particles disappear completely
   - ✅ No console errors
   - ✅ Performance is still good

### **Debugging tips:**

**If particles don't appear:**
- Check console for errors
- Add `console.log('Particle created!')` in the ADD_PARTICLE dispatch
- Check if particles are in state: `console.log(state.particles.length)`

**If particles don't move:**
- Check that UPDATE_PARTICLES is dispatched each frame
- Add `console.log('Updating particles:', particles.length)`

**If particles don't fade:**
- Check opacity calculation: `console.log('Opacity:', opacity)`
- Make sure globalAlpha is being set

**If particles never disappear:**
- Check that age is incrementing
- Check that filter is removing old particles

---

## 💡 Key Concepts You'll Practice

### **1. Event-Driven Visual Effects**
You're creating particles in response to an event (boid death), not every frame.

### **2. State Lifecycle Management**
Particles are:
- **Created** → when event happens
- **Updated** → every frame
- **Removed** → when expired

### **3. Immutable State Updates**
You're never mutating particles, always creating new arrays/objects.

### **4. Visual Polish**
Fade-out effects make things feel smoother and more polished.

### **5. Performance Awareness**
Particles are lightweight but you're managing their lifecycle to avoid memory leaks.

---

## 🎓 Questions to Answer (for your learning)

As you implement, think about:

1. **Where do particles live in the data flow?**
   - Event → Create → State → Update → Render → Remove

2. **Why dispatch ADD_PARTICLE vs creating and setting particles directly?**
   - Follows reducer pattern
   - Centralized state updates
   - Easier to debug and maintain

3. **Why update particles in animation loop vs in render?**
   - Separation of concerns: logic vs display
   - State updates happen before rendering
   - Consistent with boid/predator pattern

4. **Why use globalAlpha instead of changing color?**
   - Simple fade effect
   - Preserves original color
   - One property to animate

5. **What happens if you forget to reset globalAlpha?**
   - All subsequent drawing will be transparent!
   - Boids and predators would fade too

---

## ✅ Success Checklist

Before you consider Step 1F complete:

- [ ] Imported particle functions at top of App.tsx
- [ ] Particles created when boid dies (ADD_PARTICLE dispatch)
- [ ] Particles updated each frame (UPDATE_PARTICLES dispatch)
- [ ] Particles rendered with fade-out effect
- [ ] globalAlpha reset after particle rendering
- [ ] state.particles added to render dependencies
- [ ] No TypeScript errors
- [ ] App runs without console errors
- [ ] Particles appear on boid death
- [ ] Particles fade out over time
- [ ] Particles disappear completely
- [ ] Performance is still smooth

---

## 🚀 After You Complete This

Once particles are working, you'll move to:
- **Step 1G:** (Optional) Fine-tuning - particle count, speed, lifetime, colors
- **Step 2:** Predator visual states - color changes based on AI state

---

## 💬 Need Help?

If you get stuck:

1. **Check each piece individually:**
   - Are particles being created? (console.log in dispatch)
   - Are particles in state? (console.log state.particles)
   - Are particles updating? (log in UPDATE_PARTICLES)
   - Are particles rendering? (log in render callback)

2. **Common mistakes:**
   - Forgetting to import functions
   - Wrong action type name
   - Not accessing boid properties correctly
   - Forgetting to reset globalAlpha
   - Not adding particles to render dependencies

3. **Ask yourself:**
   - What is the value at this point?
   - Is this function being called?
   - What does the state look like?

---

**Ready? Go implement Step 1F! Remember: small steps, test as you go, and think through each piece.** 🎨

You've got this! 💪
