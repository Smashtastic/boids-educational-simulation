# 🦅 Predator AI Implementation Guide

## Quick Reference for Step 9

This guide provides a structured approach to implementing intelligent predator behavior. Follow the parts in order, testing as you go.

---

## 📋 Implementation Checklist

### Part A: Extend Predator Type
- [ ] Add `aiState` property to Predator interface
- [ ] Add target tracking fields (`targetBoidId`, `targetCluster`)
- [ ] Add timing fields (`stateTimer`, `cooldownDuration`)
- [ ] Add AI parameters (`perceptionRadius`, `stalkRadius`, `strikeSpeed`)
- [ ] Update `createPredator()` factory function
- [ ] Test: Predators still render and move

### Part B: Create predatorAI.ts
- [ ] Create new file `src/simulation/predatorAI.ts`
- [ ] Implement helper functions:
  - [ ] `calculateCenterOfMass(boids: Boid[]): Vector2D`
  - [ ] `findIsolatedBoid(boids: Boid[], clusterCenter: Vector2D): Boid | null`
  - [ ] `calculateInterceptPoint(...)` (optional, advanced)
- [ ] Implement behavior functions:
  - [ ] `patrolBehavior(predator, tree, width, height): Vector2D`
  - [ ] `stalkBehavior(predator, boids, tree): Vector2D`
  - [ ] `strikeBehavior(predator, boids): Vector2D`
  - [ ] `cooldownBehavior(predator, width, height): Vector2D`
- [ ] Test each behavior function independently

### Part C: Integration in App.tsx
- [ ] Import predatorAI functions
- [ ] Add switch statement for predator AI state
- [ ] Update predator animation loop
- [ ] Handle state transitions
- [ ] Test: Predators patrol (should see different behavior)

### Part D: Fix Flee Behavior
- [ ] Review current `flee()` function in flocking.ts
- [ ] Implement inverse square law for force strength
- [ ] Increase flee weight or normalize properly
- [ ] Add console.log debugging
- [ ] Test: Boids should scatter when predator approaches

### Part E: Add REMOVE_BOID Action
- [ ] Add action type to SimulationAction union
- [ ] Implement case in reducer
- [ ] Dispatch on successful strike
- [ ] Test: Boids removed when caught

---

## 🎯 Testing Strategy

### Test After Each Part

**Part A (Type Extension):**
```
✓ Simulation still runs
✓ Predators render
✓ No TypeScript errors
✓ New properties visible in console.log
```

**Part B (Behavior Functions):**
```
✓ Each function compiles
✓ Test with mock data in console
✓ Helper functions return expected values
✓ No crashes when called
```

**Part C (Integration):**
```
✓ Predators move differently than before
✓ Console logs show state transitions
✓ No performance degradation
✓ Predators avoid edges
```

**Part D (Flee Enhancement):**
```
✓ Console shows "fleeing from X predators"
✓ Boids move away from predators
✓ Flee overrides other behaviors when close
✓ Visual scatter effect when predator approaches
```

**Part E (Remove Boids):**
```
✓ Boid count decreases when caught
✓ No crashes when boid removed
✓ Predators transition to cooldown
✓ Remaining boids continue normally
```

---

## 🐛 Common Issues & Solutions

### Issue: "Predators not changing state"
**Check:**
- State transitions in behavior functions updating predator object
- Switch statement covering all states
- Console logging predator.aiState each frame

### Issue: "Boids not fleeing"
**Check:**
- Predators passed to flockYou function
- Flee force being added to total force
- fleeWeight high enough (try 10.0)
- Distance calculation correct

### Issue: "Performance drops"
**Check:**
- QuadTree queries using correct radius
- Not creating new QuadTree per predator
- Console.logs removed after debugging

### Issue: "Predators stuck in one state"
**Check:**
- stateTimer incrementing
- Transition conditions being checked
- State machine logic (if/else structure)

### Issue: "Can't find target boids"
**Check:**
- QuadTree has all boids inserted
- Query rectangle correct (x, y, width, height)
- nearbyBoids.length > 0 check

---

## 📐 Key Algorithms

### Center of Mass Calculation
```typescript
function calculateCenterOfMass(boids: Boid[]): Vector2D {
    if (boids.length === 0) return { x: 0, y: 0 };
    
    let sumX = 0, sumY = 0;
    for (const boid of boids) {
        sumX += boid.position.x;
        sumY += boid.position.y;
    }
    
    return {
        x: sumX / boids.length,
        y: sumY / boids.length
    };
}
```

### Finding Isolated Boid
```typescript
function findIsolatedBoid(boids: Boid[], clusterCenter: Vector2D): Boid | null {
    let mostIsolated: Boid | null = null;
    let maxDistance = 0;
    
    for (const boid of boids) {
        const dist = distance(boid.position, clusterCenter);
        if (dist > maxDistance) {
            maxDistance = dist;
            mostIsolated = boid;
        }
    }
    
    // Only return if actually isolated (not too close to center)
    return maxDistance > 40 ? mostIsolated : null;
}
```

### Circling Behavior (for STALK)
```typescript
// Get vector to target
const toCenter = subtract(targetPosition, predator.position);

// Perpendicular vector (90 degrees)
const perpendicular = { x: -toCenter.y, y: toCenter.x };

// Normalize and scale for circling
const tangent = normalize(perpendicular);
return multiply(tangent, speed);
```

---

## 🎚️ Parameter Tuning Guide

### Starting Values (Balanced)
```typescript
perceptionRadius: 150,    // How far predator "sees"
stalkRadius: 80,          // Orbit distance when stalking
strikeSpeed: 12,          // Acceleration during strike
cooldownDuration: 180,    // Frames (3 sec at 60 FPS)

fleeRadius: 100,          // Boid flee distance
fleeWeight: 5.0,          // Flee force strength
```

### Too Easy (Boids Always Escape)
- Increase perceptionRadius → 200
- Increase strikeSpeed → 15
- Decrease fleeRadius → 80
- Increase stalkRadius → 100

### Too Hard (All Boids Caught)
- Decrease perceptionRadius → 120
- Decrease strikeSpeed → 10
- Increase fleeRadius → 120
- Increase cooldownDuration → 240
- Decrease stalkRadius → 60

### Just Right 🎯
- Predators catch ~1 boid every 5-10 seconds
- Boids have time to regroup
- Exciting chases but not hopeless
- Visual drama and tension

---

## 🎬 Expected Behavior Timeline

**Frame 0-300: PATROL**
- Predator wanders
- Moves towards detected cluster
- Avoids screen edges

**Frame 300-500: STALK**
- Circles around boid cluster
- Boids form tighter group
- Identifies straggler

**Frame 500-600: STRIKE**
- Rapid acceleration
- Boids scatter
- Chase sequence

**Frame 600-780: COOLDOWN**
- Slow movement
- Boids regroup
- Tension releases

**Frame 780+: Back to PATROL**

---

## 💡 Learning Checkpoints

After implementing each part, ask yourself:

### After Part A:
- Do I understand why predators need state?
- What's the difference between state and behavior?
- How does TypeScript enforce the AI state types?

### After Part B:
- How do behavior functions transform input to output?
- Why are they pure functions?
- How does QuadTree make this efficient?

### After Part C:
- How does the switch statement work as a state machine?
- Why update predators before boids?
- How do state transitions happen?

### After Part D:
- Why wasn't flee working before?
- What's inverse square law and why use it?
- How do competing forces resolve?

### After Part E:
- How does dispatch trigger state updates?
- Why filter instead of splice?
- What happens to references to removed boids?

---

## 🚀 Ready to Begin?

Start with **Part A** - extending the Predator type. Reference PLAN.md Step 9 for detailed specs.

**Remember:**
1. Implement one part at a time
2. Test after each part
3. Ask questions when stuck
4. Debug with console.logs
5. Have fun creating menacing AI!

**You've got this!** 🎉

---

## 📞 When to Ask for Help

✅ **Good times to ask:**
- "I implemented Part A, could you review my type definition?"
- "The predators are stuck in PATROL, here's my code..."
- "I'm not sure how to calculate the intercept point"
- "My flee behavior isn't working, what should I check?"

❌ **Try to avoid:**
- "Can you write Part B for me?"
- "Just fix it" (we're learning!)

**Asking for review and guidance is great! That's what I'm here for.** 🎓
