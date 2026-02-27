# Testing Strategy: Boids Project

## Goal: 80% Coverage Where It Matters

This project prioritizes **meaningful** test coverage over arbitrary metrics. We focus on testing logic, algorithms, and critical paths while keeping tests maintainable and educational.

---

## Testing Philosophy

### What We Test (and Why)

✅ **Pure functions** - Easy to test, high value
✅ **Business logic** - Flocking rules, physics calculations  
✅ **Edge cases** - Zero vectors, boundary conditions
✅ **Complex algorithms** - Neighbor detection, spatial hashing

❌ **Simple rendering** - Low value, high maintenance
❌ **Trivial getters/setters** - Not worth the time
❌ **Third-party libraries** - Already tested

---

## Test Priority Matrix

### 🔴 Critical (Target: 100% coverage)

**Files:**
- `src/utils/vector.ts` - All vector math operations

**Why:** 
- Pure functions (easy to test)
- Used everywhere (bugs cascade)
- Mathematical correctness is crucial

**Tests to write:**
```typescript
// Vector addition
✓ Adds positive vectors correctly
✓ Adds negative vectors correctly
✓ Handles zero vectors

// Vector subtraction  
✓ Subtracts vectors correctly
✓ Results in zero vector when subtracting self

// Magnitude
✓ Calculates magnitude of positive vectors
✓ Returns zero for zero vector
✓ Handles negative components

// Normalize
✓ Creates unit vector from normal vector
✓ Handles zero vector (returns zero, not NaN/Infinity)
✓ Preserves direction

// Limit magnitude
✓ Limits vector exceeding max
✓ Doesn't modify vector below max
✓ Handles zero vector

// Distance
✓ Calculates distance between two points
✓ Returns zero for same point
✓ Works with negative coordinates
```

---

### 🟡 Important (Target: 80% coverage)

**Files:**
- `src/simulation/flocking.ts` - Flocking behavior rules
- `src/simulation/physics.ts` - Physics updates

**Why:**
- Core game logic
- Complex enough to have bugs
- Edge cases affect simulation quality

**Flocking Tests:**
```typescript
// Separation
✓ Returns zero force when no neighbors
✓ Returns away-force when neighbor too close
✓ Stronger force for closer neighbors
✓ Handles multiple neighbors correctly

// Alignment
✓ Returns zero force when no neighbors
✓ Returns steering force toward average velocity
✓ Ignores self in calculation
✓ Handles neighbors moving in opposite directions

// Cohesion
✓ Returns zero force when no neighbors
✓ Returns steering force toward center of mass
✓ Ignores self in calculation
✓ Handles edge of canvas correctly

// Integration
✓ Combined forces sum correctly
✓ Weights are applied properly
✓ Forces are limited to max force
```

**Physics Tests:**
```typescript
// Velocity update
✓ Applies acceleration to velocity
✓ Limits velocity to max speed
✓ Handles zero acceleration

// Position update
✓ Applies velocity to position
✓ Handles negative velocities (backward motion)

// Edge wrapping
✓ Wraps left to right
✓ Wraps right to left
✓ Wraps top to bottom
✓ Wraps bottom to top
✓ Handles corners correctly
```

---

### 🟢 Nice to Have (Target: 50% coverage)

**Files:**
- `src/components/Canvas.tsx` - Basic rendering
- `src/components/Controls.tsx` - UI controls
- `src/App.tsx` - Integration

**Why:**
- React components are harder to test meaningfully
- Visual bugs are caught manually
- Integration is tested through E2E or manual testing

**Minimal Tests:**
```typescript
// Canvas
✓ Renders without crashing
✓ Creates canvas element with correct dimensions
✓ Calls render callback on animation frame

// Controls
✓ Renders all control elements
✓ Calls callbacks when values change
✓ Displays current values correctly

// App
✓ Renders without crashing
✓ Initializes with correct number of boids
```

---

## Test Setup

### Installing Testing Dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm install -D @testing-library/user-event @vitest/ui
```

### Vite Config for Tests

Add to `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/main.tsx',
      ],
    },
  },
})
```

### Test Setup File

Create `src/test/setup.ts`:

```typescript
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})
```

### Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

---

## Test File Structure

### Naming Convention
```
src/utils/vector.ts          → src/utils/vector.test.ts
src/simulation/flocking.ts   → src/simulation/flocking.test.ts
src/components/Canvas.tsx    → src/components/Canvas.test.tsx
```

### Basic Test Template

```typescript
import { describe, it, expect } from 'vitest'
import { functionToTest } from './module'

describe('functionToTest', () => {
  it('should do something in normal case', () => {
    const result = functionToTest(normalInput)
    expect(result).toEqual(expectedOutput)
  })

  it('should handle edge case', () => {
    const result = functionToTest(edgeCase)
    expect(result).toEqual(expectedEdgeOutput)
  })

  it('should throw/handle error case', () => {
    expect(() => functionToTest(badInput)).toThrow()
  })
})
```

---

## Example: Testing Vector Utils

### Complete Example: `src/utils/vector.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { 
  addVectors, 
  subtractVectors, 
  lengthVector,
  normalizeVector,
  limitVector,
  distanceBetweenVectors
} from './vector'
import type { Vector2D } from './vector'

describe('Vector Utilities', () => {
  describe('addVectors', () => {
    it('should add two positive vectors', () => {
      const v1: Vector2D = { x: 3, y: 4 }
      const v2: Vector2D = { x: 1, y: 2 }
      
      const result = addVectors(v1, v2)
      
      expect(result).toEqual({ x: 4, y: 6 })
    })

    it('should handle negative components', () => {
      const v1: Vector2D = { x: 5, y: -3 }
      const v2: Vector2D = { x: -2, y: 7 }
      
      const result = addVectors(v1, v2)
      
      expect(result).toEqual({ x: 3, y: 4 })
    })

    it('should handle zero vectors', () => {
      const v1: Vector2D = { x: 0, y: 0 }
      const v2: Vector2D = { x: 5, y: 5 }
      
      const result = addVectors(v1, v2)
      
      expect(result).toEqual({ x: 5, y: 5 })
    })
  })

  describe('lengthVector', () => {
    it('should calculate magnitude of 3-4-5 triangle', () => {
      const v: Vector2D = { x: 3, y: 4 }
      
      const result = lengthVector(v)
      
      expect(result).toBe(5)
    })

    it('should return zero for zero vector', () => {
      const v: Vector2D = { x: 0, y: 0 }
      
      const result = lengthVector(v)
      
      expect(result).toBe(0)
    })

    it('should handle negative components', () => {
      const v: Vector2D = { x: -3, y: -4 }
      
      const result = lengthVector(v)
      
      expect(result).toBe(5)
    })
  })

  describe('normalizeVector', () => {
    it('should create unit vector', () => {
      const v: Vector2D = { x: 3, y: 4 } // length 5
      
      const result = normalizeVector(v)
      
      expect(result.x).toBeCloseTo(0.6)
      expect(result.y).toBeCloseTo(0.8)
      expect(lengthVector(result)).toBeCloseTo(1)
    })

    it('should handle zero vector without NaN', () => {
      const v: Vector2D = { x: 0, y: 0 }
      
      const result = normalizeVector(v)
      
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
      expect(Number.isNaN(result.x)).toBe(false)
      expect(Number.isNaN(result.y)).toBe(false)
    })

    it('should preserve direction', () => {
      const v: Vector2D = { x: -5, y: 0 }
      
      const result = normalizeVector(v)
      
      expect(result.x).toBeCloseTo(-1)
      expect(result.y).toBe(0)
    })
  })

  // Add more describe blocks for other functions...
})
```

---

## Writing Good Tests

### ✅ Good Test Characteristics

1. **Clear naming** - Test name describes what it tests
2. **Single concern** - One assertion per test (generally)
3. **Arrange-Act-Assert** - Clear structure
4. **Independent** - Tests don't depend on each other
5. **Fast** - Run quickly (pure functions help)

### Example of Good Test

```typescript
it('should limit vector magnitude when exceeding max', () => {
  // Arrange
  const vector: Vector2D = { x: 3, y: 4 } // length 5
  const maxLength = 2
  
  // Act
  const result = limitVector(vector, maxLength)
  
  // Assert
  expect(lengthVector(result)).toBeCloseTo(2)
  // Direction preserved
  expect(result.x / result.y).toBeCloseTo(vector.x / vector.y)
})
```

### ❌ Bad Test Examples

```typescript
// TOO VAGUE
it('works correctly', () => { ... })

// TESTING TOO MUCH
it('should add, subtract, and multiply vectors', () => { ... })

// UNCLEAR ASSERTION
it('should process vector', () => {
  const result = doSomething(input)
  expect(result).toBeTruthy() // What does truthy mean here?
})

// BRITTLE (depends on implementation details)
it('should call helper function 3 times', () => {
  const spy = vi.spyOn(module, 'helper')
  doSomething()
  expect(spy).toHaveBeenCalledTimes(3) // Why 3? Why does it matter?
})
```

---

## Common Testing Patterns

### Testing Floating Point

```typescript
// DON'T
expect(result).toBe(0.3) // May fail due to floating point precision

// DO
expect(result).toBeCloseTo(0.3, 5) // 5 decimal places
```

### Testing Ranges

```typescript
it('should generate random velocity within range', () => {
  const velocity = generateRandomVelocity()
  
  expect(velocity.x).toBeGreaterThanOrEqual(-2)
  expect(velocity.x).toBeLessThanOrEqual(2)
  expect(velocity.y).toBeGreaterThanOrEqual(-2)
  expect(velocity.y).toBeLessThanOrEqual(2)
})
```

### Testing React Components

```typescript
import { render, screen } from '@testing-library/react'
import { Canvas } from './Canvas'

it('should render canvas with correct dimensions', () => {
  render(<Canvas width={800} height={600} />)
  
  const canvas = screen.getByRole('img') // canvas has img role
  expect(canvas).toHaveAttribute('width', '800')
  expect(canvas).toHaveAttribute('height', '600')
})
```

### Testing with User Events

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Controls } from './Controls'

it('should call onChange when slider moves', async () => {
  const handleChange = vi.fn()
  const user = userEvent.setup()
  
  render(<Controls separationWeight={1.5} onChange={handleChange} />)
  
  const slider = screen.getByLabelText('Separation Weight')
  await user.clear(slider)
  await user.type(slider, '2.0')
  
  expect(handleChange).toHaveBeenCalled()
})
```

---

## Test-Driven Development (TDD)

### When to Use TDD in This Project

**Good for TDD:**
- ✅ Vector utility functions (clear inputs/outputs)
- ✅ Physics calculations (known expected behavior)
- ✅ Flocking rules (specified algorithm)

**Skip TDD:**
- ❌ UI components (visual, iterate quickly)
- ❌ Canvas rendering (hard to test output)
- ❌ When learning new concepts (explore first)

### TDD Cycle for Vector Functions

```
1. Write failing test
   → it('should normalize vector to unit length')

2. Write minimal code to pass
   → function normalizeVector() { return {x: 0.6, y: 0.8} } // hardcoded

3. Refactor
   → Implement proper calculation
   
4. Add edge case test
   → it('should handle zero vector')

5. Fix code
   → Add zero check

6. Repeat
```

### Example TDD Session

```typescript
// Step 1: Write test first
describe('distanceBetweenVectors', () => {
  it('should calculate distance between two points', () => {
    const v1 = { x: 0, y: 0 }
    const v2 = { x: 3, y: 4 }
    
    expect(distanceBetweenVectors(v1, v2)).toBe(5)
  })
})

// Step 2: Run test (it fails - function doesn't exist)

// Step 3: Write minimal code
export function distanceBetweenVectors(v1: Vector2D, v2: Vector2D): number {
  return 5 // Hardcoded to pass test
}

// Step 4: Test passes, but we're not done

// Step 5: Add more tests
it('should return zero for same point', () => {
  const v = { x: 5, y: 5 }
  expect(distanceBetweenVectors(v, v)).toBe(0)
})

// Step 6: Previous implementation fails, implement properly
export function distanceBetweenVectors(v1: Vector2D, v2: Vector2D): number {
  const dx = v2.x - v1.x
  const dy = v2.y - v1.y
  return Math.sqrt(dx * dx + dy * dy)
}

// Step 7: All tests pass, refactor if needed
```

---

## Coverage Reports

### Running Coverage

```bash
npm run test:coverage
```

### Reading the Report

```
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
src/utils/vector.ts |  100.00 |   100.00 |  100.00 |  100.00 |
src/sim/flocking.ts |   85.71 |    75.00 |   80.00 |   85.71 |
src/components/     |   45.00 |    30.00 |   40.00 |   45.00 |
```

**What to aim for:**
- ✅ Utils: 100% (achievable and valuable)
- ✅ Simulation: 80-90% (some branches are edge cases)
- ✅ Components: 40-60% (diminishing returns above this)

### Coverage is Not Quality

```
❌ 100% coverage with bad tests is worthless
✅ 70% coverage with good tests is valuable

Good test = Tests behavior, not implementation
Bad test = Tests that function was called, not what it does
```

---

## Learning Exercises

### Exercise 1: Write Tests for Vector Utils

1. Read the vector.ts file
2. List all edge cases you can think of
3. Write tests for those edge cases
4. Run tests and fix any bugs you find

### Exercise 2: TDD a New Function

1. You need: `setMagnitude(v: Vector2D, length: number): Vector2D`
2. Write the test first
3. Make it pass
4. Add edge cases
5. Refactor

### Exercise 3: Test Flocking Rules

1. Pick one flocking rule (separation, alignment, cohesion)
2. Write tests for:
   - No neighbors
   - One neighbor
   - Multiple neighbors
   - Boundary conditions
3. Run tests against your implementation
4. Fix any bugs discovered

---

## Debugging Test Failures

### When a Test Fails

1. **Read the error message carefully**
   ```
   Expected: 5
   Received: 5.000000000000001
   ```
   → Use `toBeCloseTo` for floats

2. **console.log intermediate values**
   ```typescript
   it('should normalize vector', () => {
     const result = normalizeVector({ x: 3, y: 4 })
     console.log('Result:', result)
     console.log('Length:', lengthVector(result))
     expect(lengthVector(result)).toBeCloseTo(1)
   })
   ```

3. **Isolate the problem**
   - Run just that test: `npm test -- -t "should normalize"`
   - Simplify the input
   - Check assumptions

4. **Check your understanding**
   - Is the test wrong or the code?
   - What should the expected behavior be?
   - Ask Claude to review both test and implementation

---

## Quick Reference

### Common Vitest Matchers

```typescript
expect(value).toBe(expected)              // Exact equality (===)
expect(value).toEqual(expected)           // Deep equality
expect(value).toBeCloseTo(number, digits) // Float comparison
expect(value).toBeTruthy()                // Boolean true
expect(value).toBeNull()                  // null
expect(value).toBeUndefined()             // undefined
expect(array).toContain(item)             // Array includes
expect(array).toHaveLength(n)             // Array length
expect(() => fn()).toThrow()              // Throws error
expect(value).toBeGreaterThan(n)          // >
expect(value).toBeLessThan(n)             // <
```

### React Testing Library Queries

```typescript
screen.getByRole('button')                // Get by ARIA role
screen.getByText('Click me')              // Get by text content
screen.getByLabelText('Username')         // Get by label
screen.getByPlaceholderText('Email')      // Get by placeholder
screen.getByTestId('custom-element')      // Get by data-testid

// Query variants
screen.queryBy...()                       // Returns null if not found
screen.findBy...()                        // Async, waits for element
```

---

## Remember

- **Tests should help you learn** - If a test is confusing, it's a bad test
- **Focus on behavior** - Test what the function does, not how
- **Edge cases matter** - Zero, negative, boundary values
- **Keep tests simple** - Complex tests are hard to maintain
- **Tests are documentation** - They show how to use your code

---

## Next Steps

1. Set up testing infrastructure (dependencies, config)
2. Start with vector.test.ts (easiest, highest value)
3. Write tests as you implement features
4. Use TDD for pure functions
5. Review coverage after each phase

**Ready to write your first test?**

Use the Claude prompt: "Help me set up my first test for vector.ts"

