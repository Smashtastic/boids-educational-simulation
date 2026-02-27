# Particle Debug Guide - What to Look For

## 🔍 Logs Added

I've added comprehensive logging to track particles through their entire lifecycle:

### **1. When Particle is Created (Boid Death)**
```
🎨 Creating particles for boid at: {x, y} colour: hsl(...)
```
**What this tells you:**
- A boid was caught by a predator
- ADD_PARTICLE action is being dispatched
- Position and color are being passed correctly

**If you DON'T see this:**
- Predators aren't catching boids
- Wait longer or add more predators

---

### **2. Particle Update Each Frame**
```
💫 Particles in state: X → After update: Y
Sample particle: { id, position, velocity, age, maxAge, colour, size }
```
**What this tells you:**
- How many particles exist in state before update
- How many survive after filtering (dead ones removed)
- Full details of one particle

**Key things to check:**
- Does particle count go UP when boid dies? (should add ~8-10)
- Does particle count go DOWN over time? (as particles age out)
- Is age incrementing? (should increase by 1 each frame)
- Is maxAge reasonable? (30-60 frames = 0.5-1 second)

**If particles never appear:**
- State might not be updating
- ADD_PARTICLE action might not be working
- Check reducer implementation

**If particles never disappear:**
- Filtering isn't working
- Check that `age >= maxAge` filter is correct

---

### **3. Rendering Particles**
```
🎨 RENDERING X particles
  Drawing particle at (123.4, 567.8) age:5/45 opacity:0.89
  Drawing particle at (234.5, 678.9) age:10/50 opacity:0.80
```
**What this tells you:**
- How many particles are being drawn
- Exact position of each particle
- Age progression (age/maxAge)
- Opacity calculation (should decrease as age increases)

**Key things to check:**
- Are positions reasonable? (within screen bounds)
- Is opacity decreasing over time? (1.0 → 0.0)
- Are particles lasting the right duration?

**If you see rendering logs but no particles on screen:**
- Position might be off-screen
- Size might be too small (check particle.size)
- Opacity might be 0 (check calculation)
- Color might match background

---

## 🧪 Testing Scenarios

### **Scenario 1: Normal Particle Lifecycle**
Expected log sequence when boid dies:
```
1. 🎨 Creating particles for boid at: ...
2. 💫 Particles in state: 0 → After update: 8
3. Sample particle: { age: 0, maxAge: 45, ... }
4. 🎨 RENDERING 8 particles
5.   Drawing particle at (...) age:0/45 opacity:1.00
   ...
6. [Next frame] 💫 Particles in state: 8 → After update: 8
7. [Next frame]   Drawing particle at (...) age:1/45 opacity:0.98
   ...
8. [After 45 frames] 💫 Particles in state: 8 → After update: 0
```

---

### **Scenario 2: Multiple Boids Die**
```
🎨 Creating particles for boid at: ...
💫 Particles in state: 0 → After update: 8
🎨 Creating particles for boid at: ...
💫 Particles in state: 8 → After update: 16
🎨 RENDERING 16 particles
```

---

## 🐛 Common Issues & Solutions

### **Issue 1: "Particles created but count immediately goes to 0"**
**Logs:**
```
🎨 Creating particles
💫 Particles in state: 0 → After update: 0
```
**Problem:** Particles are being filtered out immediately
**Check:** 
- Initial age should be 0
- maxAge should be > 0
- Filter condition: `age < maxAge` (not `<=`)

---

### **Issue 2: "No rendering logs at all"**
**Problem:** Render callback isn't seeing particles
**Check:**
- Is `state.particles` in dependency array?
- Is render callback being called?
- Add: `console.log('Render called, particles:', state.particles.length)`

---

### **Issue 3: "Particles render but all opacity is 0"**
**Logs:**
```
Drawing particle at (...) age:45/45 opacity:0.00
```
**Problem:** Particles are already at maxAge
**Check:**
- Are particles being created with age=0?
- Is ADD_PARTICLE working correctly?
- Are you dispatching after UPDATE_PARTICLES?

---

### **Issue 4: "Particles appear at wrong location"**
**Logs:**
```
Creating particles at: {x: 500, y: 300}
Drawing particle at (1200, -50) ...
```
**Problem:** Position is way off from creation point
**Check:**
- Velocity might be too high
- Check createParticleExplosion velocity range
- Should be 2-4 pixels/frame

---

## 📊 Performance Monitoring

Look for these patterns in the logs:

**Good:**
```
💫 Particles: 0 → 8 → 8 → 8 → 7 → 6 → 5 → 4 → 3 → 2 → 1 → 0
```
Particles gradually expire, clean lifecycle.

**Bad:**
```
💫 Particles: 0 → 8 → 8 → 8 → 8 → 8 → 8 → 8 → ...
```
Particles never expire, memory leak!

**Bad:**
```
💫 Particles: 0 → 8 → 0 → 8 → 0 → 8 → ...
```
Particles immediately die, check filter logic.

---

## 🎯 Quick Diagnostics Checklist

Run through this when debugging:

1. **Are boids being caught?**
   - [ ] See "Creating particles" log?
   - [ ] Predators in STRIKE state?
   - [ ] Distance check working?

2. **Are particles being added to state?**
   - [ ] Particle count increases?
   - [ ] Sample particle shows valid data?
   - [ ] ADD_PARTICLE action in reducer?

3. **Are particles being updated?**
   - [ ] Age incrementing each frame?
   - [ ] Particles moving (position changing)?
   - [ ] Old particles being filtered out?

4. **Are particles being rendered?**
   - [ ] Rendering logs appear?
   - [ ] Opacity calculated correctly?
   - [ ] Position within screen bounds?
   - [ ] Size > 0?

5. **Visual checks:**
   - [ ] Look near boid death locations
   - [ ] Particles visible for ~0.5-1 second?
   - [ ] Particles moving outward?
   - [ ] Particles fading out?

---

## 🔧 Additional Debug Steps

If you still can't see particles, try these:

### **Make Particles More Visible:**
1. Increase size: `size: 10` (in createParticle)
2. Remove fade: `ctx.globalAlpha = 1` (always opaque)
3. Bright color: Use 'red' or 'yellow' instead of boid color
4. Increase lifetime: `maxAge: 180` (3 seconds)

### **Simplify Test:**
1. Reduce boid count to 10
2. Add 5 predators
3. Wait for one catch
4. Watch logs carefully

### **Check State:**
Add to top of render callback:
```typescript
console.log('RENDER STATE:', {
    boids: state.boids.length,
    predators: state.predators.length,
    particles: state.particles.length
});
```

---

## 💡 What Success Looks Like

When everything is working, you should see:

**Console (every ~1 second when boid dies):**
```
🎨 Creating particles for boid at: {x: 456, y: 789} colour: hsl(25, 85%, 55%)
💫 Particles in state: 0 → After update: 10
Sample particle: {id: "1708963200001", age: 0, maxAge: 48, size: 3.2, ...}
🎨 RENDERING 10 particles
  Drawing particle at (456.0, 789.0) age:0/48 opacity:1.00
  Drawing particle at (458.4, 791.2) age:0/48 opacity:1.00
  ...
[1 frame later]
💫 Particles in state: 10 → After update: 10
🎨 RENDERING 10 particles
  Drawing particle at (458.4, 791.2) age:1/48 opacity:0.98
  ...
[48 frames later]
💫 Particles in state: 10 → After update: 0
```

**On Screen:**
- Small orange dots burst from boid when caught
- Particles fly outward in all directions
- Particles fade out smoothly
- Particles disappear after ~1 second

---

## 🚀 Next Steps

Once particles are working:

1. **Remove debug logs** (or reduce to errors only)
2. **Fine-tune parameters:**
   - Particle count (8-12 looks good)
   - Velocity range (2-4 is fast enough)
   - Lifetime (30-60 frames)
   - Size (2-4 pixels)
3. **Add variations:**
   - Random size range
   - Slightly varied colors
   - Different particle counts based on predator state

---

**Good luck debugging!** The logs will tell you exactly where the issue is. 🔍
