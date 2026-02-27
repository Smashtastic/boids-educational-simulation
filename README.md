# README

![Boids Simulation](./docs/screenshot.png) *(Screenshot coming soon)*

---

## 🎯 What is This?

This project demonstrates **how to learn React effectively with AI assistance**. It's not just a flocking simulation—it's a **complete educational framework** showing:

- ✅ **200 boids** with emergent flocking behavior (separation, alignment, cohesion)
- ✅ **Intelligent AI predators** with state machines (patrol, stalk, strike, cooldown)
- ✅ **Spatial partitioning** (QuadTree) for O(n log n) performance
- ✅ **Particle effects** with physics simulation and fade curves
- ✅ **Advanced state management** using useReducer pattern
- ✅ **140 passing tests** with comprehensive coverage of critical systems
- ✅ **Accessibility features** (screen reader announcements)

But more importantly, it shows **how a student learned** all of this by implementing 100% of the code themselves with AI guidance.

---

## 📚 Project Purpose

This is a **learning project** designed to teach:
- React fundamentals (useState, useEffect, useRef, useCallback, useReducer)
- TypeScript type safety and interface design
- Canvas API and real-time animation
- Complex state management patterns
- Algorithm implementation (flocking, AI, spatial partitioning)
- Test-driven development with Vitest
- Working effectively with AI coding assistants

**Goal:** Master React through hands-on practice while building something genuinely impressive.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern browser (Chrome, Firefox, Safari, Edge)
- Basic JavaScript/TypeScript knowledge

### Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd Boid

# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Build for production
npm run build
```

### What You'll See

When you run the app:
- **200 orange boids** flocking naturally across the screen
- **3 predators** (teal → purple → bright purple based on state) hunting the flock
- **Particle explosions** when boids are caught
- **Smooth 60 FPS animation** with complex interactions

---

## 🎮 How It Works

### The Simulation

**Boids follow three simple rules:**
1. **Separation**: Avoid crowding (stay 30px apart)
2. **Alignment**: Match neighbors' direction (within 50px)
3. **Cohesion**: Move toward group center (within 50px)
4. **Flee**: Escape from predators (within 60px)

These simple rules create **emergent complexity** - flocks split, reform, swirl, and evade naturally!

### Predator AI

Each predator is an autonomous agent with a 4-state behavior system:

1. **PATROL** (Teal): Searching for boid clusters
2. **STALK** (Purple): Orbiting cluster, looking for isolated targets
3. **STRIKE** (Bright Purple): Rapid pursuit of chosen boid
4. **COOLDOWN** (Dim): Resting after successful catch

Predators use the QuadTree spatial index to efficiently scan for prey, making intelligent decisions based on cluster density and boid isolation.

### Performance

- **QuadTree optimization**: 40,000 → 3,500 distance checks per frame
- **Spatial partitioning**: O(n²) → O(n log n) complexity
- **Smooth 60 FPS** with 200+ entities and particle effects
- **Efficient rendering**: Canvas-based with minimal overdraw

---

## 📊 Project Statistics

- **Lines of Code**: ~2,000+ (src/)
- **Test Suites**: 5 files, 140 tests passing
- **Coverage**: 38% overall, 100% on utilities
- **Components**: 2 (App, Canvas)
- **Types**: 4 (Boid, Predator, Particle, SimulationState)
- **Documentation**: 25+ guides and learning resources
- **Development Time**: Progressive learning over multiple sessions

---

## 🏗️ Architecture

### Technology Stack
- **React 18**: Component framework
- **TypeScript 5**: Type safety
- **Vite**: Build tool and dev server
- **Vitest**: Testing framework
- **Canvas API**: Rendering

### Project Structure
```
src/
├── components/
│   └── Canvas.tsx              # Canvas wrapper component
├── simulation/
│   ├── flocking.ts             # Three flocking rules + flee
│   ├── physics.ts              # Movement and edge wrapping (100% coverage)
│   ├── particles.ts            # Particle system (100% coverage)
│   ├── predatorAI.ts           # 4-state predator behaviors
│   └── quadtree.ts             # Spatial partitioning (93% coverage)
├── types/
│   ├── Boid.ts                 # Boid interface and factory
│   ├── Predator.ts             # Predator interface with AI state
│   ├── Particle.ts             # Particle system types
│   └── SimulationState.ts      # useReducer state and actions
├── utils/
│   ├── vector.ts               # Vector math utilities (86% coverage)
│   └── colorUtils.ts           # HSL color manipulation
├── App.tsx                     # Main simulation loop
└── main.tsx                    # React entry point
```

### State Management

The project uses **useReducer** for complex state coordination:

```typescript
interface SimulationState {
    boids: Boid[];
    predators: Predator[];
    particles: Particle[];
    frameCount: number;
    parameters: FlockingParameters;
    dimensions: { width: number; height: number };
}
```

**12 action types** handle all state transitions:
- UPDATE_ALL, UPDATE_BOIDS, UPDATE_PREDATORS, UPDATE_PARTICLES
- ADD_BOID, ADD_PREDATOR, ADD_PARTICLE
- REMOVE_BOID, REMOVE_BOIDS
- UPDATE_PARAMETERS, UPDATE_DIMENSIONS
- RESET

---

## 🎓 Learning Journey

### What Was Learned

This project taught:

**React Hooks (Complete Mastery)**
- ✅ useState for simple state
- ✅ useEffect for lifecycle and animation loops
- ✅ useRef for DOM access and animation loop state
- ✅ useCallback for memoized render functions
- ✅ useReducer for complex state coordination

**State Management Evolution**
- ✅ Started with useState
- ✅ Discovered limitations with multiple related states
- ✅ Migrated to useReducer pattern
- ✅ Learned when each pattern is appropriate

**Canvas & Animation**
- ✅ requestAnimationFrame patterns
- ✅ Canvas 2D context and drawing APIs
- ✅ Transparency effects (globalAlpha)
- ✅ Performance optimization techniques

**Algorithms & AI**
- ✅ Vector mathematics
- ✅ Flocking algorithms (Reynolds)
- ✅ Spatial data structures (QuadTree)
- ✅ State machines for AI behavior
- ✅ Autonomous agent design

**Testing & Quality**
- ✅ Test-driven development with Vitest
- ✅ Unit testing pure functions
- ✅ Integration testing complex systems
- ✅ Coverage analysis and meaningful testing

**AI-Assisted Learning**
- ✅ How to ask effective questions
- ✅ When to ask for help vs. push through
- ✅ Using AI as reviewer, not solver
- ✅ Maintaining learning autonomy

### Teaching Framework

This project includes a **complete teaching framework** in CLAUDE_INSTRUCTIONS.md that ensures:
- AI never fixes code automatically
- Student implements all solutions
- Progressive hint system (gentle → specific → pseudocode)
- Code reviews without automatic changes
- Mistakes are learning opportunities

**Result**: Deep understanding, not just working code.

---

## 🎯 What You'll Build

A real-time simulation of flocking behavior where bird-like objects (boids) move naturally in groups, demonstrating:
- **Separation** - Avoid crowding neighbors
- **Alignment** - Steer toward average heading
- **Cohesion** - Move toward center of local group

Interactive controls let you tune parameters and see how they affect behavior in real-time.

---

## 📖 Documentation Structure

All documentation is organized in the `docs/` folder for easy navigation.

### Core Documentation (Root Level)

- **[README.md](./README.md)** (You are here!) - Project overview and getting started
- **[PLAN.md](./PLAN.md)** - Complete 12-step development roadmap (Steps 1-10 in progress)
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute
- **[LICENSE](./LICENSE)** - MIT License

### 📚 Learning Resources ([docs/learning/](./docs/learning/))

- **[LEARNING_GUIDE.md](./docs/learning/LEARNING_GUIDE.md)** - The 80/20 learning philosophy
- **[EDUCATIONAL_JOURNEY_REPORT.md](./docs/learning/EDUCATIONAL_JOURNEY_REPORT.md)** - Complete learning history with Step 10
- **[LEARNING_LOG.md](./docs/learning/LEARNING_LOG.md)** - Session-by-session progress tracking
- **[USEREDUCER_EXERCISE.md](./docs/learning/USEREDUCER_EXERCISE.md)** - useState → useReducer migration guide

### 📖 Technical Guides ([docs/guides/](./docs/guides/))

- **[QUICK_START.md](./docs/guides/QUICK_START.md)** - Get running in 5 minutes
- **[HOOKS_GUIDE.md](./docs/guides/HOOKS_GUIDE.md)** - React hooks reference with examples
- **[REACT_CONCEPTS.md](./docs/guides/REACT_CONCEPTS.md)** - Deep dive on React patterns
- **[TESTING_GUIDE.md](./docs/guides/TESTING_GUIDE.md)** - TDD approach and coverage strategy
- **[ARCHITECTURE_DECISIONS.md](./docs/guides/ARCHITECTURE_DECISIONS.md)** - Design rationale
- **[PREDATOR_AI_GUIDE.md](./docs/guides/PREDATOR_AI_GUIDE.md)** - AI system documentation

### 🤖 AI Collaboration ([docs/ai-collaboration/](./docs/ai-collaboration/))

- **[CLAUDE_INSTRUCTIONS.md](./docs/ai-collaboration/CLAUDE_INSTRUCTIONS.md)** - Teaching framework (AI rulebook)
- **[CLAUDE_PROMPTS.md](./docs/ai-collaboration/CLAUDE_PROMPTS.md)** - Ready-to-use prompt templates
- **[WORKING_WITH_CLAUDE.md](./docs/ai-collaboration/WORKING_WITH_CLAUDE.md)** - Effective AI collaboration

### 📋 Step-Specific Guides ([docs/step-guides/](./docs/step-guides/))

- **[STEP_10_GUIDE.md](./docs/step-guides/STEP_10_GUIDE.md)** - Particle system implementation tutorial
- **[STEP_10_PROGRESS.md](./docs/step-guides/STEP_10_PROGRESS.md)** - Current progress tracker
- **[STEP_1F_GUIDE.md](./docs/step-guides/STEP_1F_GUIDE.md)** - Animation loop integration guide

### 🐛 Debugging Resources ([docs/debugging/](./docs/debugging/))

- **[PARTICLE_DEBUG_GUIDE.md](./docs/debugging/PARTICLE_DEBUG_GUIDE.md)** - Understanding particle logs
- **[PARTICLE_DEBUGGING_WORKSHEET.md](./docs/debugging/PARTICLE_DEBUGGING_WORKSHEET.md)** - Guided discovery
- **[PARTICLE_STATE_FIX.md](./docs/debugging/PARTICLE_STATE_FIX.md)** - Async state issue explained
- **[PARTICLE_VISUAL_ENHANCEMENTS.md](./docs/debugging/PARTICLE_VISUAL_ENHANCEMENTS.md)** - Color & fade effects
- **[PHYSICS_TESTS_UPDATE.md](./docs/debugging/PHYSICS_TESTS_UPDATE.md)** - Test suite enhancements
- **[CODE_REVIEW_CANVAS.md](./docs/debugging/CODE_REVIEW_CANVAS.md)** - Review checklist

### 📦 Project Management ([docs/](./docs/))

- **[DOCUMENTATION_INDEX.md](./docs/DOCUMENTATION_INDEX.md)** - Complete navigation guide
- **[PROJECT_SUMMARY.md](./docs/PROJECT_SUMMARY.md)** - Achievement summary
- **[GITHUB_RELEASE_CHECKLIST.md](./docs/GITHUB_RELEASE_CHECKLIST.md)** - Pre-release tasks
- **[RELEASE_READY.md](./docs/RELEASE_READY.md)** - Git commands and deployment
- **[PRE_RELEASE_FIXES.md](./docs/PRE_RELEASE_FIXES.md)** - ESLint issues to address
- **[NEXT_STEPS.md](./docs/NEXT_STEPS.md)** - Future development plans
- **[INDEX.md](./docs/INDEX.md)** - Documentation navigation

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Basic JavaScript/TypeScript knowledge
- Text editor (VS Code recommended)

### Installation

```bash
# Clone or download this project
cd Boid

# Install dependencies
npm install

# Start development server
npm run dev

# In a separate terminal, run tests (after Step 1)
npm test
```

### Your First Steps

1. **Read LEARNING_GUIDE.md** (15 min)
   - Understand the learning philosophy
   - Learn how to work with Claude effectively

2. **Read PLAN.md Step 1** (10 min)
   - Understand what you're building first

3. **Ask Claude to explain concepts** (before coding!)
   ```
   I'm starting Step 1: Create the Boid Type and Initial Data Structures.
   
   Before I write code, explain:
   1. What is a Vector2D type and why do we use it?
   2. What vector operations will I need?
   3. Why separate types from implementation?
   ```

4. **Implement Step 1 yourself**
   - Use the explanation as a guide
   - Write the code yourself
   - Ask for review when done

5. **Repeat for each step**
   - Understand → Plan → Implement → Review → Test

---

## 🎓 Learning Approach

### The Golden Rule
> You write 80% of the code. Claude guides, explains, and reviews.

### When to Ask Claude

✅ **Do ask:**
- "Explain this concept before I implement it"
- "Review my code - what can be improved?"
- "I tried X and Y, why isn't this working?"
- "What should I test here?"

❌ **Don't ask:**
- "Write this feature for me"
- "Give me the complete solution"
- "Just fix it" (without trying yourself)

### Learning Checkpoints

After each phase, ask yourself:
- Can I explain the key concepts?
- Could I implement a similar feature?
- Do I understand WHY, not just HOW?

---

## 📊 Progress Tracking

Track your progress in your own notes:

```
Phase 1: Core Simulation
[ ] Step 1: Types & Vector Utils - ___% by me
[ ] Step 2: Canvas Component - ___% by me
[ ] Step 3: Initial State - ___% by me
[ ] Step 4: Rendering - ___% by me
[ ] Step 5: Physics Update - ___% by me

Phase 2: Flocking Behavior
[ ] Step 6: Flocking Rules - ___% by me
[ ] Step 7: Optimization - ___% by me
[ ] Step 8: Parameter Tuning - ___% by me

Phase 3: Polish
[ ] Step 9: Performance Stats - ___% by me
[ ] Step 10: Playback Controls - ___% by me
[ ] Step 11: Click Interaction - ___% by me
[ ] Step 12: Visual Enhancements - ___% by me
```

---

## 🧪 Testing Strategy

- **Critical (100%)**: Vector math, core algorithms
- **Important (80%)**: Flocking rules, physics
- **Nice (50%)**: UI components

Run tests:
```bash
npm test              # Watch mode
npm run test:coverage # Coverage report
npm run test:ui       # Visual UI
```

---

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Canvas API** - Rendering
- **Vitest** - Testing
- **No external state library** - Learn native React patterns first

---

## 📚 Recommended Reading Order

For each step in PLAN.md:

1. **Read the step** in PLAN.md
2. **Check REACT_CONCEPTS.md** for relevant concepts
3. **Use CLAUDE_PROMPTS.md** for question templates
4. **Implement yourself**
5. **Refer to TESTING_GUIDE.md** for test strategy
6. **Ask Claude for review**

---

## 🎯 Success Metrics

You're succeeding when:

✅ You can explain React concepts to someone else  
✅ You catch bugs before Claude points them out  
✅ You know which hook to use without asking  
✅ You're implementing features faster each step  
✅ Your questions get more sophisticated  
✅ The simulation looks beautiful and runs smoothly  

---

## 🐛 Common Issues

### TypeScript Errors
- Check REACT_CONCEPTS.md for type patterns
- Ask Claude: "Help me understand this TypeScript error"

### Boids Not Moving
- Check physics update in PLAN.md Step 5
- Verify acceleration → velocity → position chain
- Console.log values to debug

### Performance Issues
- Start optimization at Step 7
- Check REACT_CONCEPTS.md Performance section
- Measure before optimizing

### Tests Failing
- Check TESTING_GUIDE.md for patterns
- Use `toBeCloseTo` for floating point
- Test behavior, not implementation

---

## 💡 Tips for Success

1. **Struggle is learning** - Don't rush to ask for answers
2. **Commit after each step** - Track your progress
3. **Take notes** - Keep a LEARNING_LOG.md
4. **Explain concepts** - Teaching solidifies learning
5. **Have fun** - This is a creative project!

---

## 🎨 What You'll Learn

### React Skills
- Component design
- Hook patterns (useState, useReducer, useRef, useEffect)
- State management decisions
- Performance optimization
- Event handling

### TypeScript Skills
- Interface design
- Type safety
- Generics (if you explore advanced features)

### Computer Science
- Vector mathematics
- Flocking algorithms
- Spatial optimization
- Time complexity analysis

### Software Engineering
- Code organization
- Testing strategies
- Debugging techniques
- Refactoring
- Documentation

---

## 🚀 After Completion

Once you finish Phase 3, consider:

1. **Add your own features**
   - Predators that boids flee from
   - Mouse interaction (attract/repel)
   - Obstacles to navigate around
   - Different boid types

2. **Optimize further**
   - Implement spatial hashing
   - Use Web Workers for physics
   - Add more visual effects

3. **Explore state management**
   - Try Context API
   - Experiment with Zustand
   - Compare with Redux Toolkit

4. **Share your learning**
   - Write about what you learned
   - Help others with similar projects
   - Contribute to open source

---

## 📞 Getting Help

### From Claude
Use the templates in **CLAUDE_PROMPTS.md**

### From Documentation
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [Craig Reynolds' Boids](http://www.red3d.com/cwr/boids/)

---

## 📝 License

This is an educational project. Feel free to use, modify, and share as you learn!

---

## 🎉 Ready to Start?

1. Open **LEARNING_GUIDE.md**
2. Read the learning philosophy
3. Go to **PLAN.md Step 1**
4. Ask Claude: "I'm ready for Step 1. Explain the concepts before I code."

**Happy coding! You've got this! 🚀**

---

## Project Structure

```
Boid/
├── README.md                 # This file
├── PLAN.md                   # Detailed step-by-step plan
├── LEARNING_GUIDE.md         # How to learn effectively
├── CLAUDE_PROMPTS.md         # Prompt templates
├── TESTING_GUIDE.md          # Testing strategy
├── REACT_CONCEPTS.md         # React reference guide
│
├── src/
│   ├── types/
│   │   └── Boid.ts          # Type definitions
│   ├── utils/
│   │   └── vector.ts        # Vector mathematics
│   ├── simulation/
│   │   ├── physics.ts       # Physics engine
│   │   └── flocking.ts      # Flocking rules
│   ├── components/
│   │   ├── Canvas.tsx       # Canvas renderer
│   │   └── Controls.tsx     # UI controls
│   └── App.tsx              # Main component
│
└── tests/                    # Test files mirror src/
```

Remember: **You're not just building a project, you're building your skills!** 🌟

