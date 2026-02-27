# Learning Guide: Boids Project with Claude

## How to Use This Project for Learning

This is an **educational project** designed to teach you React, TypeScript, and state management through hands-on coding. The goal is for **YOU** to write as much code as possible, with Claude as your guide, not your ghost-writer.

---

## Learning Philosophy

### 80/20 Rule for This Project
- **80% of the code**: You write it yourself
- **20% Claude helps with**: Boilerplate, complex algorithms, debugging

### Code Coverage Goal
- **80% test coverage** where useful
- Focus on: Logic functions (vector math, flocking rules, physics)
- Less focus on: UI components, simple rendering

---

## How to Work With Claude Effectively

### ✅ DO Ask Claude For:

1. **Explanations Before Code**
   - "Explain how vector normalization works before I implement it"
   - "What's the difference between useState and useReducer?"
   - "How does requestAnimationFrame work?"

2. **Code Structure Guidance**
   - "What should my Canvas component's props be?"
   - "How should I organize my flocking functions?"
   - "What's the best file structure for this feature?"

3. **Code Review**
   - "Review my implementation of the separation rule"
   - "Is this the React way to handle canvas updates?"
   - "How can I make this more performant?"

4. **Debugging Help**
   - "My boids aren't moving, here's my code..."
   - "Why is my canvas not rendering?"
   - "Help me understand this TypeScript error"

5. **Test Strategy**
   - "What should I test in this function?"
   - "Help me write tests for vector utilities"
   - "What edge cases should I consider?"

### ❌ DON'T Ask Claude To:

1. **Write entire features for you**
   - ❌ "Implement the flocking behavior"
   - ✅ "Explain the separation algorithm, then I'll implement it"

2. **Skip the learning**
   - ❌ "Just give me the complete Canvas component"
   - ✅ "What hooks do I need for Canvas, and why?"

3. **Do all the debugging**
   - ❌ "Fix my code" (without showing you tried)
   - ✅ "I tried X and Y, here's the error, what am I missing?"

---

## Step-by-Step Learning Process

### For Each Step in PLAN.md:

#### Phase 1: Understand
1. Read the step in PLAN.md
2. Ask Claude: "Explain [concept] before I implement Step X"
3. Take notes on key concepts

#### Phase 2: Plan
3. Ask Claude: "What's the structure for [component/function]?"
4. Sketch out your approach
5. Ask: "Does this approach make sense?"

#### Phase 3: Implement
6. **Write the code yourself** using the structure
7. Start with type signatures and comments
8. Fill in the implementation

#### Phase 4: Validate
9. Test your code
10. Ask Claude to review if stuck
11. Ask: "What edge cases am I missing?"

#### Phase 5: Refine
12. Make improvements based on feedback
13. Add tests for critical logic
14. Document what you learned

---

## Prompts to Use at Each Phase

### Starting a New Step

```
I'm ready for Step [N]: [Step Name]

Before I start coding:
1. Explain the key concepts I need to understand
2. What's the recommended structure/signature?
3. What are common pitfalls to avoid?

Then I'll implement it and come back for review.
```

### After You've Written Code

```
I've implemented [feature]. Here's my code:

[paste code]

Please review:
1. Is this the React way to do it?
2. Any bugs or issues you see?
3. What could be more efficient?
4. What should I test?
```

### When You're Stuck

```
I'm stuck on [specific issue].

What I tried:
- [attempt 1]
- [attempt 2]

The error/behavior I'm seeing:
[describe the problem]

What concept am I missing?
```

### Understanding Concepts

```
Before I implement [feature], explain:
1. How does [concept] work?
2. Why is this the recommended approach?
3. What's a simple example?

Then I'll try it myself.
```

---

## Learning Checkpoints

After each major phase, reflect on what you learned:

### ✅ Phase 1 Checkpoint (Basic Simulation)

**Concepts to understand:**
- [ ] How useRef gives access to DOM elements
- [ ] Why useEffect is used for setup/cleanup
- [ ] How requestAnimationFrame creates smooth animation
- [ ] When to use useState vs other hooks
- [ ] TypeScript interface design
- [ ] Basic vector mathematics

**Ask yourself:**
1. Can I explain why we use useRef for canvas?
2. Can I explain the render loop without looking at code?
3. Do I understand how state updates trigger re-renders?

### ✅ Phase 2 Checkpoint (Flocking Behavior)

**Concepts to understand:**
- [ ] The three flocking rules and why they work
- [ ] Neighbor detection algorithms
- [ ] Force accumulation patterns
- [ ] Performance optimization techniques
- [ ] When complexity demands useReducer

**Ask yourself:**
1. Can I explain each flocking rule to someone else?
2. Do I understand the O(n²) problem and solutions?
3. Can I tune parameters and predict the effect?

### ✅ Phase 3 Checkpoint (Interactivity)

**Concepts to understand:**
- [ ] Event handling in React
- [ ] Controlled components
- [ ] State management patterns
- [ ] Performance monitoring
- [ ] Canvas coordinate systems

**Ask yourself:**
1. When should I use useReducer over useState?
2. How do I properly handle canvas mouse events?
3. What makes a good user control interface?

---

## Testing Strategy

### What to Test (Priority Order)

#### 🔴 Critical - Must Test (Aim for 100%)
```
src/utils/vector.ts - All vector math functions
  ✓ Add vectors
  ✓ Subtract vectors  
  ✓ Magnitude calculation
  ✓ Normalize (including zero vector edge case)
  ✓ Limit magnitude
  ✓ Distance between points
```

#### 🟡 Important - Should Test (Aim for 80%)
```
src/simulation/flocking.ts - Flocking rules
  ✓ Separation returns correct force direction
  ✓ Alignment averages velocities correctly
  ✓ Cohesion points toward center of mass
  ✓ Neighbor detection works at boundaries

src/simulation/physics.ts - Physics updates
  ✓ Velocity updates from acceleration
  ✓ Position updates from velocity
  ✓ Speed limiting works
  ✓ Edge wrapping at boundaries
```

#### 🟢 Nice to Have - Optional Tests (Aim for 50%)
```
Components - Basic smoke tests
  ✓ Canvas renders without crashing
  ✓ Controls update parameters
  ✓ Stats display correct values
```

### How to Approach Testing

1. **Write tests AFTER you understand your code**
   - Don't let testing block learning
   - Once a function works, add tests to lock in behavior

2. **Use Tests to Explore Edge Cases**
   ```
   Ask Claude: "What edge cases should I test for vector normalization?"
   Then write the tests yourself
   ```

3. **TDD When You're Comfortable**
   - Later steps: Try writing tests first
   - Helps clarify requirements

---

## Code Quality Guidelines

### As You Code, Ask Yourself:

#### TypeScript
- [ ] Are my types specific (not just `any`)?
- [ ] Do my interfaces make sense?
- [ ] Am I leveraging type inference?

#### React
- [ ] Is this component doing too much? (Should it be split?)
- [ ] Are my effects cleaning up properly?
- [ ] Am I using the right hook for this job?

#### Performance
- [ ] Am I recalculating things unnecessarily?
- [ ] Could this be memoized?
- [ ] Is this the bottleneck? (Measure first!)

#### Readability
- [ ] Would I understand this in 3 months?
- [ ] Are my variable names clear?
- [ ] Do complex parts have comments?

---

## Progress Tracking

Copy this to your own notes and check off as you go:

### Step Completion Tracker

```
Phase 1: Core Simulation
[ ] Step 1: Boid types & vector utils - ___% written by me
[ ] Step 2: Canvas component - ___% written by me  
[ ] Step 3: Initial state - ___% written by me
[ ] Step 4: Rendering - ___% written by me
[ ] Step 5: Physics update - ___% written by me

Phase 2: Flocking
[ ] Step 6: Three flocking rules - ___% written by me
[ ] Step 7: Optimization - ___% written by me
[ ] Step 8: Parameter tuning UI - ___% written by me

Phase 3: Polish
[ ] Step 9: Performance stats - ___% written by me
[ ] Step 10: Playback controls - ___% written by me
[ ] Step 11: Click interaction - ___% written by me
[ ] Step 12: Visual enhancements - ___% written by me
```

### Learning Log Template

Keep a `LEARNING_LOG.md` file:

```markdown
## Step [N]: [Name]
Date: [date]

### What I learned:
- Concept 1
- Concept 2

### Challenges I faced:
- Challenge and how I solved it

### Code I wrote:
- [list of functions/components]

### Questions I still have:
- Question 1

### Time spent: ~[X] hours
```

---

## Getting Help the Right Way

### The Learning Loop 🔄

1. **Try it yourself first** (15-30 min)
2. **Get stuck** (that's good!)
3. **Form a specific question**
4. **Ask Claude with context**
5. **Understand the answer** (ask follow-ups!)
6. **Apply it yourself**
7. **Repeat**

### Example of Good Help Request

```
I'm implementing the normalize vector function. I understand it should:
1. Calculate the magnitude
2. Divide each component by magnitude
3. Return a unit vector

My code:
[paste code]

But when I test with vector {x: 0, y: 0}, I get NaN. 
I think it's because magnitude is 0, but how should I handle this edge case?
```

### Example of Less Helpful Request

```
"Make the normalize function"
```

**Why?** The first teaches you problem-solving. The second just gets code.

---

## Resources to Reference

### Before Asking Claude

1. **Check PLAN.md** - Detailed step guidance
2. **Check CLAUDE_PROMPTS.md** - Ready-made prompt templates
3. **Check your LEARNING_LOG.md** - Did you solve this before?
4. **Check official docs**:
   - React: https://react.dev
   - TypeScript: https://www.typescriptlang.org/docs/

### When to Search vs Ask Claude

**Search Google/Docs for:**
- API references (canvas methods, React hooks)
- Syntax questions
- Quick lookups

**Ask Claude for:**
- Conceptual understanding
- Code review
- Debugging help
- Architecture decisions
- Learning strategy

---

## Success Metrics

You're learning effectively when:

✅ You can explain concepts without looking at code  
✅ You catch bugs before Claude points them out  
✅ You know which hook to use before asking  
✅ You can implement similar features faster  
✅ Your questions get more sophisticated  
✅ You start helping others with these concepts  

---

## Remember

> "The goal isn't to finish fast. The goal is to understand deeply."

- **Struggle is learning** - If it's too easy, you're not growing
- **Mistakes are data** - Each bug teaches you something
- **Ask 'why' constantly** - Understanding > memorization
- **Build intuition** - You're training your developer brain

---

## Quick Start

Ready to begin? Try this:

```
Hey Claude,

I'm starting the Boids learning project. I've read LEARNING_GUIDE.md.

I'm ready for Step 1: Create the Boid Type and Initial Data Structures.

Before I write any code:
1. Explain what a Vector2D type is and why we use it
2. What's the difference between the Boid interface in PLAN.md and 
   the one we already created?
3. What vector operations will I need and why?

Then I'll implement the vector utilities myself and come back for review.
```

Let's learn React! 🚀

