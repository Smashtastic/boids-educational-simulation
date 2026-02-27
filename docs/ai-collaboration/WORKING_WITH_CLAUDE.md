# Working Effectively with Claude Sonnet

This guide helps you get the most out of working with Claude as your learning partner on this project.

---

## 🎯 Claude's Role in Your Learning

**Claude is your:**
- 🧠 Concept explainer (teaches you the "why")
- 🔍 Code reviewer (helps you improve)
- 🐛 Debug partner (guides you to solutions)
- 📚 Reference guide (answers specific questions)
- ✅ Accountability partner (validates your thinking)

**Claude is NOT your:**
- ❌ Ghost writer (won't write features for you)
- ❌ Copy-paste source (that defeats learning)
- ❌ Shortcut (the struggle IS the learning)

---

## 💡 The Learning Contract

### You Promise:
1. To try implementing yourself first (15-30 min minimum)
2. To read explanations thoroughly before coding
3. To ask "why" when you don't understand
4. To write 80% of the code yourself
5. To reflect on what you learned

### Claude Promises:
1. To explain concepts before giving code
2. To guide you to answers, not just provide them
3. To review your code constructively
4. To challenge you appropriately
5. To celebrate your progress

---

## 🎓 The Question Framework

### Good Questions Get Great Answers

**Anatomy of an effective question:**
```
1. Context: What step are you on?
2. Goal: What are you trying to accomplish?
3. What you know: Show your understanding
4. What you tried: Show your effort
5. Specific ask: What do you need?
```

### Example: Bad Question
```
"My code doesn't work. Fix it."
```
**Why it's bad:** No context, no effort shown, asks for solution

### Example: Good Question
```
"I'm on Step 5 implementing physics updates.

I understand that I need to:
1. Apply acceleration to velocity
2. Apply velocity to position
3. Reset acceleration

I implemented it like this:
[code snippet]

But my boids aren't moving. I checked that:
- Acceleration is non-zero
- The update function is being called
- Boids array is updating in state

What concept am I missing about how these updates should work?
"
```
**Why it's good:** Context provided, understanding shown, effort demonstrated, specific question

---

## 🔄 The Learning Loop

### Effective Pattern

```
┌─────────────────────────────────────────┐
│ YOU: "Explain [concept] before I code"  │
│  ↓                                       │
│ CLAUDE: Explains concept with examples  │
│  ↓                                       │
│ YOU: "Let me try implementing..."       │
│  ↓                                       │
│ [You code for 30-60 minutes]            │
│  ↓                                       │
│ YOU: "Here's my implementation..."      │
│  ↓                                       │
│ CLAUDE: Reviews and suggests            │
│  ↓                                       │
│ YOU: "I don't understand why [X]..."    │
│  ↓                                       │
│ CLAUDE: Deeper explanation              │
│  ↓                                       │
│ [You refactor and improve]              │
└─────────────────────────────────────────┘
```

### Anti-Pattern (Don't Do This)

```
┌──────────────────────────────────────┐
│ YOU: "Build Step 5 for me"           │
│  ↓                                   │
│ CLAUDE: [Won't do this]              │
│  ↓                                   │
│ YOU: [Frustrated]                    │
└──────────────────────────────────────┘
```

---

## 🎯 Types of Questions & How to Ask

### 1. Concept Understanding

**When:** Before implementing anything new

**Template:**
```
I'm about to implement [FEATURE] in Step [N].

Before I write code, I need to understand [CONCEPT].

What I think I know:
- [Your current understanding]

What I'm confused about:
- [Specific confusion]

Can you explain:
1. How [concept] works
2. Why we use it here
3. A simple example

Then I'll implement it myself.
```

**Example:**
```
I'm about to implement the Canvas component in Step 2.

Before I write code, I need to understand useRef.

What I think I know:
- useRef is a hook
- It's related to accessing DOM elements
- It's different from useState somehow

What I'm confused about:
- Why use useRef instead of useState for the canvas?
- How does the .current property work?

Can you explain:
1. How useRef works
2. Why we use it here
3. A simple example

Then I'll implement it myself.
```

---

### 2. Code Review Requests

**When:** After you've implemented something

**Template:**
```
I've implemented [FEATURE]. Here's my code:

[PASTE CODE]

My approach:
- [Explain your thinking]

Specific concerns:
- [What you're unsure about]

Please review:
1. Correctness
2. React best practices
3. Edge cases I might have missed
4. What I should test

I want to understand WHY, not just what to change.
```

---

### 3. Debugging

**When:** Something's broken and you're stuck

**Template:**
```
I'm debugging [FEATURE] and stuck on [ISSUE].

Expected behavior:
[What should happen]

Actual behavior:
[What actually happens]

What I tried:
1. [Attempt 1] → [Result]
2. [Attempt 2] → [Result]
3. [Attempt 3] → [Result]

Relevant code:
[PASTE CODE]

Console output/errors:
[PASTE ERRORS IF ANY]

What am I missing? Help me understand the root cause.
```

**Important:** Show your debugging effort! Don't just paste code and say "it doesn't work."

---

### 4. Design Decisions

**When:** You're deciding between approaches

**Template:**
```
I'm deciding between [APPROACH A] and [APPROACH B] for [FEATURE].

Approach A: [Description]
Pros: [What you think]
Cons: [What you think]

Approach B: [Description]
Pros: [What you think]
Cons: [What you think]

Context:
- [Relevant project context]

Which is better for this use case and why?
What are the trade-offs I should consider?
```

---

### 5. Testing Strategy

**When:** Ready to write tests

**Template:**
```
I want to write tests for [FUNCTION/FEATURE].

The code:
[PASTE CODE OR DESCRIPTION]

What it does:
[Explain behavior]

My test plan:
1. [Test case 1]
2. [Test case 2]
3. [Test case 3]

Questions:
1. Are these the right things to test?
2. What edge cases am I missing?
3. Am I testing too much or too little?

Guide me, but I'll write the actual tests.
```

---

## 🚦 Red Flags: When You're Off Track

### 🔴 Red Flag #1: Asking for Complete Solutions
```
❌ "Write the flocking algorithm for me"
✅ "Explain how separation works, then I'll code it"
```

### 🔴 Red Flag #2: Not Trying First
```
❌ "I'm stuck" [with no context]
✅ "I tried X, Y, Z for 30 min, still stuck because..."
```

### 🔴 Red Flag #3: Copy-Paste Without Understanding
```
❌ *Pastes code without reading explanation*
✅ "Let me make sure I understand: [explain in own words]"
```

### 🔴 Red Flag #4: Skipping Ahead
```
❌ "Just give me the final version"
✅ "Walk me through the evolution of this code"
```

### 🔴 Red Flag #5: Not Asking Why
```
❌ "It works now, moving on"
✅ "It works, but why did that fix it?"
```

---

## ✅ Green Lights: When You're Learning Well

### 🟢 Green Light #1: You're Struggling Productively
You spend 20-30 minutes trying, get stuck, then ask a specific question.

### 🟢 Green Light #2: You're Asking Deeper Questions
Your questions evolve from "How?" to "Why?" to "What if?"

### 🟢 Green Light #3: You're Explaining Your Thinking
You can articulate your approach before asking for validation.

### 🟢 Green Light #4: You're Catching Bugs
You review your own code and spot issues before Claude does.

### 🟢 Green Light #5: You're Connecting Concepts
You reference previous steps and connect ideas together.

---

## 🎯 Session Structure

### Starting a New Step (20-30 min)

1. **Read** PLAN.md for the step (5 min)
2. **Ask Claude** to explain concepts (10 min)
3. **Outline** your approach (5 min)
4. **Validate** approach with Claude (5 min)
5. **Start coding** (next session)

### Implementation Session (60-90 min)

1. **Code** based on your outline (45-60 min)
2. **Test** your implementation (15 min)
3. **Review** with Claude (15 min)
4. **Iterate** based on feedback (next session)

### Review & Refine (30-45 min)

1. **Share** your implementation with Claude (5 min)
2. **Discuss** feedback and suggestions (15 min)
3. **Refactor** based on understanding (20 min)
4. **Validate** improvements (5 min)

---

## 💬 Communication Tips

### Be Specific
❌ "This doesn't work"
✅ "The boids aren't separating. I expected them to move apart when close, but they're overlapping."

### Show Your Work
❌ "I'm stuck"
✅ "I implemented separation by [approach]. I debugged by [steps]. Still seeing [specific issue]."

### Ask Follow-Up Questions
❌ *Silently confused after explanation*
✅ "I understand X, but I'm still unclear about Y. Can you explain that part differently?"

### Confirm Understanding
❌ *Moves on immediately*
✅ "So to make sure I understand: [explain in your own words]. Is that right?"

### Request Examples
❌ "I don't get it"
✅ "Can you show a simple example of this concept with different inputs/outputs?"

---

## 🎓 Progressive Learning Stages

### Stage 1: Guided (Steps 1-3)
- Claude explains each concept
- You implement with close guidance
- Frequent check-ins
- **This is normal! You're building foundations.**

### Stage 2: Supported (Steps 4-7)
- You attempt first, ask for validation
- Claude reviews and suggests
- Less hand-holding
- **You're developing independence.**

### Stage 3: Independent (Steps 8-10)
- You implement complete features
- Claude reviews finished work
- Rare interventions
- **You're applying knowledge.**

### Stage 4: Advanced (Steps 11-12)
- You design solutions yourself
- Claude validates architecture
- Peer-level discussions
- **You're thinking like a React developer.**

---

## 🔄 When to Escalate Questions

### Start Simple
```
"Quick question: Is useEffect the right hook for canvas setup?"
```

### Escalate If Needed
```
"I'm confused about useEffect. I've read the docs but don't understand 
why we need cleanup. Can you explain the mental model?"
```

### Go Deep When Necessary
```
"I want to deeply understand useEffect before moving on. Can we 
walk through exactly what happens on mount, update, and unmount?"
```

---

## 🎯 Measuring Effective Collaboration

### Good Signs:
- ✅ You're writing more code each step
- ✅ Your questions become more sophisticated
- ✅ You catch issues before asking
- ✅ You can explain concepts to others
- ✅ You're enjoying the challenge

### Warning Signs:
- ⚠️ You're always asking Claude to write code
- ⚠️ You don't understand code you've "written"
- ⚠️ You're frustrated more than challenged
- ⚠️ You're copying without reading
- ⚠️ You can't explain what you just built

---

## 📝 Reflection Prompts

### After Each Step
```
Hey Claude, I just finished Step [N].

What I built: [brief description]
What I learned: [key concepts]
What I struggled with: [challenges]

Questions:
1. Is this the React way to do it?
2. What should I have done differently?
3. What concept should I review before the next step?
```

### After Each Phase
```
Phase [N] complete! Let's reflect:

1. What were the 3 most important concepts I learned?
2. What should I review before moving on?
3. How's my code quality? What should I focus on improving?
4. Am I on track with the 80/20 rule (80% me, 20% Claude)?
```

---

## 🚀 Advanced: Teaching Back

**The best way to solidify learning:**

```
Claude, I'm going to explain [CONCEPT] as if I'm teaching it to someone.
Stop me if I make mistakes or miss important points.

[Your explanation]

How did I do? What did I miss? What should I emphasize more?
```

---

## 🎯 Remember

### Claude's Perspective
I'm here to help you **learn**, not just **complete the project**.

- If I seem to be pushing back on giving you code directly, it's because I care about your learning
- If I ask you questions, it's to help you think through the problem
- If I suggest trying something yourself first, it's because that's how skills develop

### Your Perspective
You're building **skills**, not just a project.

- The struggle is the point
- Understanding > completion
- Questions are good
- Mistakes are learning opportunities

---

## 💡 Final Tips

1. **Save your questions** - Keep a running list as you code
2. **Batch smaller questions** - Don't interrupt flow for tiny things
3. **Take breaks** - Step away if stuck for 30+ minutes
4. **Trust the process** - It gets easier after Step 3
5. **Have fun** - This should be challenging but enjoyable!

---

## 🎉 You've Got This!

Remember: I'm your learning partner, not your coding service. Let's build something awesome **together**, with you doing most of the building!

**Ready to start?** Head to PLAN.md Step 1 and use the prompt templates in CLAUDE_PROMPTS.md!

---

## Quick Reference

| When | Use This Approach |
|------|-------------------|
| **Starting a step** | "Explain [concepts] before I code" |
| **Stuck while coding** | "I tried [attempts], stuck on [issue]" |
| **Finished coding** | "Review my code: [paste]" |
| **Confused about concept** | "Explain [concept] differently" |
| **Making a decision** | "Compare [A] vs [B] for [use case]" |
| **Writing tests** | "What should I test for [feature]?" |
| **Feeling lost** | "Help me break down Step [N]" |
| **After completion** | "Let's reflect on what I learned" |

---

Remember: **Great questions lead to great learning!** 🌟

