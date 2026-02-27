# Quick Start Guide

## 🚀 First Time Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser to localhost:5173
```

---

## 📖 Reading Order (30 minutes before coding)

1. ✅ **README.md** (5 min) - Project overview
2. ✅ **LEARNING_GUIDE.md** (10 min) - Learning philosophy & approach
3. ✅ **PLAN.md - Phase 1 intro** (5 min) - What you'll build
4. ✅ **REACT_CONCEPTS.md - Hooks section** (10 min) - Core concepts

---

## 🎯 Your First Hour

### Step 1: Understand Before Coding (20 min)

Ask Claude:
```
I'm starting Step 1: Create the Boid Type and Initial Data Structures.

Before I write code, explain:
1. What is a Vector2D type and why use it?
2. What vector operations do I need and why?
3. What's the relationship between Boid interface and vector math?

Then I'll implement it myself and return for review.
```

### Step 2: Implement (30 min)

You write:
- `src/types/Boid.ts` - Boid interface
- `src/utils/vector.ts` - Vector functions

### Step 3: Review (10 min)

Ask Claude:
```
I've implemented the vector utilities. Here's my code:

[paste code]

Please review:
1. Is this correct?
2. Any bugs or edge cases?
3. What should I test?
```

---

## 🎓 Learning Workflow (Use This Every Step)

```
┌─────────────────────────────────────┐
│ 1. Read Step in PLAN.md            │
│    ↓                                │
│ 2. Ask Claude to Explain Concepts  │
│    ↓                                │
│ 3. YOU Implement (80% of code)     │
│    ↓                                │
│ 4. Ask Claude for Code Review      │
│    ↓                                │
│ 5. Write Tests                      │
│    ↓                                │
│ 6. Move to Next Step               │
└─────────────────────────────────────┘
```

---

## 💡 Quick Tips

### ✅ DO
- Read explanations BEFORE coding
- Try yourself for 15-30 min before asking
- Ask "WHY" not just "HOW"
- Write your own code (80% rule)
- Take notes on what you learn

### ❌ DON'T
- Ask Claude to write features for you
- Copy code without understanding
- Skip the learning checkpoints
- Optimize before measuring
- Rush through steps

---

## 📋 Essential Files Reference

| Need to... | Check this file |
|-----------|----------------|
| **Understand the plan** | PLAN.md |
| **Learn how to use Claude** | LEARNING_GUIDE.md |
| **Get prompt templates** | CLAUDE_PROMPTS.md |
| **Set up tests** | TESTING_GUIDE.md |
| **Understand React concepts** | REACT_CONCEPTS.md |
| **See project structure** | README.md |

---

## 🧪 Testing Commands

```bash
# Watch mode (while developing)
npm test

# Coverage report
npm run test:coverage

# Visual test UI
npm run test:ui

# Run once (CI)
npm run test:run
```

---

## 🐛 Stuck? Debug Checklist

1. ✅ Did I read the relevant PLAN.md step?
2. ✅ Did I check REACT_CONCEPTS.md for this pattern?
3. ✅ Did I try for 15-30 minutes myself?
4. ✅ Can I describe what I tried?
5. ✅ Do I have a specific question?

If yes to all → Use a prompt from CLAUDE_PROMPTS.md

---

## 🎯 Phase Goals

### Phase 1: Core Simulation (Steps 1-5)
**Goal:** 50 boids moving smoothly at 60 FPS
**You'll learn:** TypeScript, useState, useRef, useEffect, Canvas

### Phase 2: Flocking (Steps 6-8)
**Goal:** Boids flock naturally with tunable parameters  
**You'll learn:** Algorithms, optimization, useReducer

### Phase 3: Polish (Steps 9-12)
**Goal:** Interactive, beautiful simulation  
**You'll learn:** Event handling, performance, UX

---

## 📊 Track Your Progress

```markdown
Day 1: [ ] Steps 1-2 - Types and Canvas
Day 2: [ ] Steps 3-4 - State and Rendering  
Day 3: [ ] Step 5 - Physics
Day 4: [ ] Step 6 - Flocking Rules
Day 5: [ ] Steps 7-8 - Optimization & Controls
Day 6: [ ] Steps 9-10 - Stats & Playback
Day 7: [ ] Steps 11-12 - Interaction & Polish
```

---

## 🎉 Success Indicators

After Phase 1, you should:
- [ ] Understand when to use useRef vs useState
- [ ] Be comfortable with useEffect
- [ ] Know how Canvas animation loops work
- [ ] Have written ~200 lines of code yourself

After Phase 2, you should:
- [ ] Understand the three flocking rules
- [ ] Know when to use useReducer
- [ ] Be thinking about Big O notation
- [ ] See beautiful flocking behavior

After Phase 3, you should:
- [ ] Have a portfolio-worthy project
- [ ] Understand React state management deeply
- [ ] Know how to optimize React apps
- [ ] Be ready for more complex React projects

---

## 🚀 Ready?

```bash
# Start here
npm run dev

# Open LEARNING_GUIDE.md
# Then go to PLAN.md Step 1
# Ask Claude for help getting started!
```

**Remember:** The goal is learning, not just finishing. Take your time! 🌟

---

## 🆘 Emergency Quick Start

If overwhelmed:
1. Just start with Step 1
2. Ask Claude: "Walk me through Step 1 slowly"
3. One small piece at a time
4. It gets easier after Step 2!

You've got this! 💪

