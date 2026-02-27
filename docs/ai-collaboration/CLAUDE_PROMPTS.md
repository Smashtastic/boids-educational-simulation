# Claude Prompt Templates for Boids Project

This file contains ready-to-use prompts for working with Claude Sonnet effectively throughout your learning journey. Copy and paste these, filling in the bracketed sections.

---

## 🎯 Starting a New Step

### Template: Begin New Step
```
I'm starting Step [NUMBER]: [STEP NAME]

Context:
- Current phase: [Phase 1/2/3]
- What I've completed so far: [brief summary]

Before I write code, help me understand:
1. What are the key concepts I need to know?
2. What's the recommended structure/interface?
3. What are common mistakes to avoid?
4. What will I learn from this step?

After your explanation, I'll implement it myself and return for code review.
```

### Template: Quick Concept Check
```
Quick question about [CONCEPT] before I implement Step [N]:

[Your specific question]

I want to understand the 'why' before I code it.
```

---

## 🔍 Code Review Requests

### Template: Full Implementation Review
```
I've implemented [FEATURE/FUNCTION]. Here's my code:

[PASTE YOUR CODE]

Please review:
1. Correctness: Does it work as intended?
2. React patterns: Is this idiomatic React/TypeScript?
3. Performance: Any obvious inefficiencies?
4. Edge cases: What scenarios might break this?
5. Testing: What should I test here?

I want to understand not just WHAT to change, but WHY.
```

### Template: Specific Concern Review
```
I wrote [FUNCTION/COMPONENT] but I'm unsure about [SPECIFIC ASPECT]:

[PASTE RELEVANT CODE SECTION]

Specifically:
- [Your concern/question]

Is my approach correct, or is there a better pattern?
```

### Template: Performance Review
```
This [FUNCTION/COMPONENT] works but feels slow with [N] boids:

[PASTE CODE]

Performance questions:
1. What's the time complexity?
2. Where's the bottleneck likely to be?
3. What optimization would have the biggest impact?
4. Should I optimize now or later?
```

---

## 🐛 Debugging Help

### Template: Stuck on Bug
```
I'm debugging [FEATURE] and stuck on [SPECIFIC ISSUE].

Expected behavior:
[What should happen]

Actual behavior:
[What actually happens]

What I've tried:
1. [Attempt 1] - Result: [what happened]
2. [Attempt 2] - Result: [what happened]

Relevant code:
[PASTE CODE]

What am I missing? Help me understand the root cause.
```

### Template: TypeScript Error
```
I'm getting this TypeScript error:

```
[PASTE EXACT ERROR MESSAGE]
```

In this code:
[PASTE CODE WITH LINE NUMBERS]

I think it means [your interpretation], but I'm not sure how to fix it properly.
What's the correct approach?
```

### Template: Logic Bug
```
My [FEATURE] isn't working as expected.

The problem:
[Describe the issue]

My understanding of how it should work:
[Explain your logic]

The code:
[PASTE CODE]

Can you help me identify the logical error?
```

---

## 📚 Learning & Concepts

### Template: Explain Before Implementing
```
Before I implement [FEATURE], I need to understand [CONCEPT].

What I already know:
[Your current understanding]

What I'm confused about:
[Specific questions]

Can you explain:
1. How [CONCEPT] works
2. Why it's used in this context
3. A simple example

Then I'll try implementing it myself.
```

### Template: Compare Approaches
```
I'm deciding between [APPROACH A] and [APPROACH B] for [FEATURE].

Approach A: [Brief description]
Pros: [what you think]
Cons: [what you think]

Approach B: [Brief description]
Pros: [what you think]
Cons: [what you think]

Which is better for this use case and why?
```

### Template: React Pattern Question
```
I see [PATTERN] used in examples, but I don't understand when to use it.

Example I'm looking at:
[PASTE EXAMPLE OR DESCRIBE]

Questions:
1. When should I use this pattern?
2. When should I NOT use it?
3. How does it apply to my current step?
```

---

## 🏗️ Architecture & Structure

### Template: File Organization
```
I'm organizing code for [FEATURE] and wondering about structure.

Option 1:
[Describe structure]

Option 2:
[Describe structure]

Considerations:
- [What matters to you]

What's the most maintainable approach?
```

### Template: Component Design
```
I'm designing [COMPONENT] and need guidance on the interface.

Purpose: [What the component does]

My proposed props:
```typescript
interface [Name]Props {
  // [your props]
}
```

Questions:
1. Is this the right level of abstraction?
2. What props am I missing?
3. Should anything be state instead of props?
```

### Template: State Management Decision
```
I'm at Step [N] and deciding on state management.

Current state:
- [List current state variables]

New state needed:
- [What you need to add]

Questions:
1. Should I stick with useState or switch to useReducer?
2. If useReducer, what actions do I need?
3. How should I structure the state object?

Help me make an informed decision.
```

---

## 🧪 Testing Guidance

### Template: What to Test
```
I've implemented [FUNCTION/FEATURE]:

[PASTE CODE OR DESCRIBE]

Testing questions:
1. What are the critical paths to test?
2. What edge cases should I cover?
3. What's NOT worth testing here?
4. Should I write tests now or after more features?

Guide me toward 80% coverage on what matters.
```

### Template: Test Review
```
I wrote tests for [FUNCTION]. Here they are:

[PASTE TEST CODE]

Questions:
1. Am I testing the right things?
2. Are there important cases I'm missing?
3. Am I testing too much?
4. Any better assertion patterns?
```

### Template: Test Design Help
```
I want to test [FUNCTION] but unsure how to structure it.

The function:
[PASTE FUNCTION SIGNATURE AND DESCRIPTION]

What it does:
[Explain behavior]

Questions:
1. What test cases should I have?
2. How do I test [TRICKY ASPECT]?
3. Do I need mocks or can I test directly?

Help me design the test suite, but I'll write the tests.
```

---

## 🎨 Refactoring & Improvement

### Template: Refactoring Consideration
```
This code works but feels messy:

[PASTE CODE]

My concerns:
- [Specific issue 1]
- [Specific issue 2]

Questions:
1. Should I refactor now or wait?
2. What refactoring would have the most impact?
3. How would you structure this better?

I want to learn good refactoring judgment.
```

### Template: Performance Optimization
```
I'm at [N] boids and seeing performance issues.

Current FPS: [number]
Bottleneck (I think): [your analysis]

Relevant code:
[PASTE CODE]

Questions:
1. Is my analysis correct?
2. What's the best optimization strategy?
3. What's the expected complexity?
4. Should I implement spatial hashing now?
```

### Template: Code Cleanup
```
Before moving to the next step, I want to clean up my code.

Current state:
[Describe your code's issues]

Questions:
1. What's the minimum viable cleanup?
2. What should wait until later?
3. Any React anti-patterns I should fix now?
```

---

## 🎯 Feature Planning

### Template: Breaking Down a Step
```
Step [N] seems large. Help me break it down.

The step goal: [From PLAN.md]

My breakdown:
1. [Sub-task 1]
2. [Sub-task 2]
3. [Sub-task 3]

Questions:
1. Is this the right order?
2. What am I missing?
3. Which part should I tackle first?
```

### Template: Implementation Strategy
```
I'm planning how to implement [FEATURE].

Requirements:
- [Requirement 1]
- [Requirement 2]

My strategy:
[Describe your approach]

Questions:
1. Is this approach sound?
2. What challenges might I face?
3. Any better alternatives?

Validate my thinking before I code.
```

---

## 🔄 Progress Check-Ins

### Template: Phase Completion Review
```
I've completed Phase [N]! Time to reflect.

What I built:
- [Feature 1]
- [Feature 2]

What I learned:
- [Concept 1]
- [Concept 2]

Questions I still have:
- [Question 1]
- [Question 2]

Before moving to Phase [N+1]:
1. Any gaps in my understanding?
2. Should I refactor anything?
3. Any best practices I'm missing?
```

### Template: Stuck - Need Direction
```
I'm feeling stuck on Step [N].

Progress so far:
[What you've done]

Where I'm stuck:
[Specific blocker]

I've spent [TIME] on this.

Questions:
1. Am I overthinking this?
2. What's the simplest path forward?
3. Should I move on and come back?

Help me get unstuck without just giving me the code.
```

---

## 🚀 Advanced Features

### Template: Exploring Beyond the Plan
```
I want to add [FEATURE] that's not in PLAN.md.

The idea:
[Describe feature]

Why I want to build it:
[Learning goal]

Questions:
1. Is this feasible with current architecture?
2. What new concepts will I learn?
3. What's the complexity?
4. Should I do this now or finish the plan first?
```

### Template: Optimization Exploration
```
I want to understand [OPTIMIZATION TECHNIQUE] for the boids.

Current performance: [metrics]
Target performance: [goal]

Questions:
1. How does [TECHNIQUE] work conceptually?
2. How would I implement it in React?
3. What's the trade-off?
4. Is it worth it at my current scale?

Teach me the concept, then I'll try implementing.
```

---

## 💡 Quick Wins

### Template: Quick Question
```
Quick clarification on [TOPIC]:

[One specific question]

Just need a brief explanation to keep moving forward.
```

### Template: Sanity Check
```
Sanity check: Is this approach correct?

[Brief code snippet or description]

Just need a yes/no and brief reason.
```

### Template: Best Practice Check
```
Is this following React best practices?

[Paste specific pattern]

If not, what's the correct pattern?
```

---

## 🎓 Teaching Requests

### Template: Teach Me By Example
```
I'm struggling to understand [CONCEPT] from documentation.

Can you:
1. Explain it simply
2. Show a minimal example
3. Explain why it works
4. Give me a similar exercise to try

Then I'll implement my own version.
```

### Template: Concept Deep Dive
```
I want to deeply understand [CONCEPT] before moving on.

What I know: [Current understanding]
What I don't know: [Gaps]

Please explain:
1. The underlying mechanism
2. When to use vs not use
3. Common pitfalls
4. How it applies to React/this project

This is a learning priority for me.
```

---

## 📋 Project Management

### Template: Time Check
```
I have [TIME AVAILABLE] to work on this project today.

Current step: [Step N]
Progress: [Where you are]

Questions:
1. What can I realistically accomplish?
2. Should I start a new step or polish current work?
3. What's the smallest complete task I can finish?

Help me plan this session effectively.
```

### Template: Priority Check
```
I have several things I could work on:

Option A: [Description]
Option B: [Description]
Option C: [Description]

Given my learning goals:
- [Goal 1]
- [Goal 2]

What should I prioritize and why?
```

---

## 🎯 Meta: Using Claude Better

### Template: Am I Using Claude Right?
```
I want to make sure I'm using our sessions effectively.

What I've been asking: [Summary of questions]
How I've been working: [Your process]

Am I:
1. Asking the right types of questions?
2. Doing enough myself before asking?
3. Learning effectively or just getting answers?

Give me feedback on how to learn better with your help.
```

---

## 📝 Notes

### Tips for Using These Templates:

1. **Customize them** - Add project-specific context
2. **Be specific** - The more detail, the better help you'll get
3. **Show your work** - Always include what you've tried
4. **Ask why** - Understanding > just getting answers
5. **Iterate** - Follow up with deeper questions

### Remember:
- These are starting points, not rigid scripts
- The best prompts show your thinking process
- It's okay to combine templates
- Add context about your learning style

---

## Example Good Session Flow:

```
1. "I'm starting Step 5" (using Starting New Step template)
   ↓
2. [You implement]
   ↓
3. "Here's my implementation for review" (using Code Review template)
   ↓
4. [Claude gives feedback]
   ↓
5. "I don't understand why [X]" (using Learning template)
   ↓
6. [Claude explains]
   ↓
7. "Now I'll refactor and test" (you work)
   ↓
8. "Here are my tests" (using Test Review template)
```

---

Happy learning! 🚀

Remember: The goal is understanding, not just completing the project.

